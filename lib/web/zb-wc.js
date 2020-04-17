/**
 * Zebra Blue: zbCalendar (zb-calendar)
 * @classdesc
 * Gregorian calendar web component. Allows the user to select a day in the given month shown.
 */
class zbCalendar extends HTMLElement {
    /**
    * Create a new zbDayCalendar object.
    * @constructor
    */
    constructor() {
        // Must call super first
        super();

        // Create the CSS parts for the shadow DOM
        const style = document.createElement('style');

        // Set style
        style.textContent = `
            :host {
                display: inline-block;
            }
            .root {
                min-width: 200px;
                min-height: 200px;
                height: 100%;
                background-color: darkgray;
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
                grid-template-rows: 1fr 2fr 2fr 2fr 2fr 2fr 2fr; 
                grid-column-gap: 1px;
                grid-row-gap: 1px;
            }

            .parent-cell {
                position: relative;
                cursor: pointer;
            }
            .child-cell {
                position: absolute;
                color: rgb(248, 248, 248);
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                user-select: none;
            }

            .parent-dayOfWeek {
                background-color: royalblue;
                cursor: default;
            }
            .parent-normal-odd {
                background-color: rgb(248, 248, 248);
            }
            .parent-normal-even {
                background-color: rgb(230, 230, 230);
            }
            .parent-highlightColumn-odd {
                background-color: lightgoldenrodyellow;
            }
            .parent-highlightColumn-even {
                background-color: #dadab9;
            }
            .parent-selected {
                background-color: #8dc8f7;
                border: 2px solid #3f51b5;
            }

            .parent-normal-odd:hover {
                background-color: lightsteelblue;
            }
            .parent-normal-even:hover {
                background-color: lightsteelblue;
            }
            .parent-highlightColumn-odd:hover {
                background-color: lightsteelblue;
            }
            .parent-highlightColumn-even:hover {
                background-color: lightsteelblue;
            }
            .parent-selected:hover {
                background-color: #6f9ec3;
                border: 2px solid #3f51b5;
            }

            .child-dayOfWeek {
                color: rgb(248, 248, 248);
                font-size: 1em;
            }
            .child-normal {
                color: rgb(48, 48, 48);
                font-size: 2em;
            }
            .child-nonMonth {
                color: #9e9e9e;
                font-size: 2em;
            }`;

        // Create root DIV
        const rootDiv = document.createElement('div');
        rootDiv.setAttribute('class', 'root');

        // Create day of week list
        this._dayOfWeekList = [];

        // Create day of month list
        this._dayOfMonthList = [];

        // Create the days of week and month parts
        this._createDaysOfWeek(rootDiv);
        this._createDaysOfMonth(rootDiv);

        // Attach shadow DOM root.
        const shadowRoot = this.attachShadow({mode: 'open'});

        // Add styles
        shadowRoot.appendChild(style);

        // Add root DIV
        shadowRoot.appendChild(rootDiv);

        // Bind click event to this
        this._clickEvent = this._clickEvent.bind(this);

        // Create selected event
        this.selectedEvent = new Event('selected');
    }

    /**
     * Gets the culture used when showning the date.
     * @type {string}
     */
    get culture() {
        // Return the current attribute culture
        return this.getAttribute('culture');
    }

    /**
     * Sets the culture to use when showing the date.
     * @param {string} value The culture code, "en-US" for example.
     * @type {string}
     */
    set culture(value) {
        // Validate parameter
        zbValidate.isString(value);

        // Set the attribute
        this.setAttribute('culture', value);
    }

    /**
     * Gets the value of the date currently set.
     * @type {string}
     */
    get value() {
        // Return the current attribute value
        return this.getAttribute('value');
    }

    /**
     * The date to show. The value must be in YYYY-MM-DD format.
     * @param {string} value The date value to show.
     * @type {string}
     */
    set value(value) {
        // Validate parameter
        zbValidate.isString(value);

        // Set the attribute
        this.setAttribute('value', value);
    }

    /**
     * Gets which day is the first day of the week. This can be either monday, tuesday, wednesday,
     * thursday, friday, saturday or sunday.
     * @type {string}
     */
    get firstDay() {
        // Return the current first day of the week value
        return this.getAttribute('first-day');
    }

    /**
     * Sets which day is the first day of the week.
     * @param {string} value This can be either monday, tuesday, wednesday, thursday, friday, saturday or sunday.
     * @type {string}
     */
    set firstDay(value) {
        // Validate parameter
        zbValidate.isString(value);

        // Set the first day of the week attribute
        this.setAttribute('first-day', value);
    }

    /**
     * Gets which days to highlight. This is a list of days seperated by a coma. The days can be either monday, tuesday, wednesday,
     * thursday, friday, saturday or sunday. For example highlightDays="saturday,sunday".
     * @type {string}
     */
    get highlightDays() {
        // Return the current highlighted days value
        return this.getAttribute('highlight-days');
    }

    /**
     * Sets which days to highlight. This is a list of days seperated by a coma. For example highlightDays="saturday,sunday".
     * @param {string} value The days can be either monday, tuesday, wednesday, thursday, friday, saturday or sunday.
     * @type {string}
     */
    set highlightDays(value) {
        // Validate parameter
        zbValidate.isString(value);

        // Set the current highlighted days attribute
        this.setAttribute('highlight-days', value);
    }

    /**
     * Gets if the current date is highlighted or not.
     * @type {boolean}
     */
    get highlight() {
        // If there is no highlight attribute
        if (this.hasAttribute('highlight') === true) return true;

        // Otherwise it is not highlighted
        return false;
    }

    /**
     * Sets if the current date is highlighted or not.
     * @param {boolean} value True to highlight, False to not highlight.
     * @type {boolean}
     */
    set highlight(value) {
        // Validate parameter
        zbValidate.isBoolean(value);

        // If we want to highlight
        if (value === true) {
            // Add the attribute
            this.setAttribute('highlight', value);
        } else {
            // Remove the attribute
            this.removeAttribute('highlight');
        }
    }

    /**
    * Create the days of week DIV parts.
    * @param {HTMLElement} rootDiv The root DIV to add the elements for the days of week to.
    * @private
    */
    _createDaysOfWeek(rootDiv) {
        // For each day of the week
        for (let count = 1; count <= 7; count++) {
            // Create day of week object
            const dayOfWeek = {};

            // Create parent cell DIV
            dayOfWeek.parentCell = document.createElement('div');

            // Set grid styles
            dayOfWeek.parentCell.style.gridRow = 1;
            dayOfWeek.parentCell.style.gridColumn = count;

            // Set class
            dayOfWeek.parentCell.className = 'parent-cell parent-dayOfWeek';

            // Create child cell DIV
            dayOfWeek.childCell = document.createElement('div');

            // Set class
            dayOfWeek.childCell.className = 'child-cell dayOfWeek-child';

            // Add to parent
            dayOfWeek.parentCell.appendChild(dayOfWeek.childCell);

            // Add day of week object to the list
            this._dayOfWeekList.push(dayOfWeek);

            // Add to root DIV
            rootDiv.appendChild(dayOfWeek.parentCell);
        }
    }

    /**
    * Create the days of month DIV parts.
    * @param {HTMLElement} rootDiv The root DIV to add the elements for the days of month to.
    * @private
    */
    _createDaysOfMonth(rootDiv) {
        // For each row
        for (let row = 2; row <= 7; row++) {
            // Create day of month row object
            const dayOfMonthRow = {};

            // Create day list
            dayOfMonthRow.dayList = [];

            // For each day in the row
            for (let count = 1; count <= 7; count++) {
                // Create day of month object
                const dayOfMonth = {};

                // Set the day and month parts
                dayOfMonth.day = 0;
                dayOfMonth.month = 0;

                // Set not highlighted
                dayOfMonth.highlighted = false;

                // Create parent cell DIV
                dayOfMonth.parentCell = document.createElement('div');

                // Set grid styles
                dayOfMonth.parentCell.style.gridRow = row;
                dayOfMonth.parentCell.style.gridColumn = count;

                // Set default class
                dayOfMonth.defaultClass = 'parent-cell';
                if (count % 2) dayOfMonth.defaultClass += ' parent-normal-even'; else dayOfMonth.defaultClass += ' parent-normal-odd';

                // Set class
                dayOfMonth.parentCell.className = dayOfMonth.defaultClass;

                // Create child cell DIV
                dayOfMonth.childCell = document.createElement('div');

                // Set class
                dayOfMonth.childCell.className = 'child-cell child-normal';

                // Add to parent
                dayOfMonth.parentCell.appendChild(dayOfMonth.childCell);

                // Add day of month object to the list of days
                dayOfMonthRow.dayList.push(dayOfMonth);

                // Add to root DIV
                rootDiv.appendChild(dayOfMonth.parentCell);
            }

            // Add the day of month row to the list
            this._dayOfMonthList.push(dayOfMonthRow);
        }
    }

    /**
    * Override connectedCallback function to handle when component is attached into the DOM.
    * @override
    */
    connectedCallback() {
        // Update grid layout
        this._updateGrid();

        // Update the current month
        this._updateMonth();

        // Add the click event listeners
        this._addClickEventListener();
    }

    /**
     * Override disconnectedCallback function to handle when component is detached from the DOM.
     * @override
     */
    disconnectedCallback() {
        // Remove the click event listeners
        this._removeClickEventListener();
    }

    /**
     * Override attributeChangedCallback function to handle attribute changes
     * @override
     */
    attributeChangedCallback(name, oldValue, newValue) {
        // If updating date shown or if to highlight the current date
        if (name === 'value' || name === 'highlight') this._updateMonth();

        // If updating grid layout
        if (name === 'highlight-days') this._updateGrid();

        // If updating both
        if (name === 'culture' || name === 'first-day') {
            // Update both the grid and the month
            this._updateGrid();
            this._updateMonth();
        }
    }

    /**
    * Override the observedAttributes function to return the list
    * of attributes to monitor.
    * @return {Array} List of attribute names.
    * @static
    */
    static get observedAttributes() {
        // Return attribute names
        return ['value', 'culture', 'first-day', 'highlight-days', 'highlight'];
    }

    /**
    * Update the grid parts. This includes days of week text and highlighted days.
    * @private
    */
    _updateGrid() {
        // Set culture
        let culture = null;

        // If culture attribute exists
        if (this.hasAttribute('culture') === true) {
            // Try to get culture
            try {
                // Find the culture
                culture = zbCulture.find(this.getAttribute('culture'));

                // If not found
                if (culture === null) {
                    // Log error
                    console.error('Culture not found');
                }
            } catch (error) {
                // Log error
                console.error('Culture not found');
            }
        }

        // If no culture then use the default
        if (culture === null) culture = zbCulture.default;

        // Set first day of week
        let firstDayOfWeek = zbDayOfWeek.MONDAY;

        // If there is a first day of week attribute
        if (this.hasAttribute('first-day') === true) {
            // Get attribute
            const firstDayOfWeekValue = this.getAttribute('first-day').toLowerCase();

            // Check the value
            if (firstDayOfWeekValue === 'monday') firstDayOfWeek = zbDayOfWeek.MONDAY;
            if (firstDayOfWeekValue === 'tuesday') firstDayOfWeek = zbDayOfWeek.TUESDAY;
            if (firstDayOfWeekValue === 'wednesday') firstDayOfWeek = zbDayOfWeek.WEDNESDAY;
            if (firstDayOfWeekValue === 'thursday') firstDayOfWeek = zbDayOfWeek.THURSDAY;
            if (firstDayOfWeekValue === 'friday') firstDayOfWeek = zbDayOfWeek.FRIDAY;
            if (firstDayOfWeekValue === 'saturday') firstDayOfWeek = zbDayOfWeek.SATURDAY;
            if (firstDayOfWeekValue === 'sunday') firstDayOfWeek = zbDayOfWeek.SUNDAY;
        }

        // Set highlight days
        let highlightDaysList = [zbDayOfWeek.SATURDAY, zbDayOfWeek.SUNDAY];

        // If there is a highlight days attribute
        if (this.hasAttribute('highlight-days') === true) {
            // Get attribute
            const highlightDaysValue = this.getAttribute('highlight-days').toLowerCase();

            // Clear list
            highlightDaysList = [];

            // Split into days
            const highlightDaysValueList = highlightDaysValue.split(',');

            // For each highlight day
            highlightDaysValueList.forEach(function(dayOfWeekName) {
                // Check the value
                if (dayOfWeekName === 'sunday') highlightDaysList.push(zbDayOfWeek.SUNDAY);
                if (dayOfWeekName === 'monday') highlightDaysList.push(zbDayOfWeek.MONDAY);
                if (dayOfWeekName === 'tuesday') highlightDaysList.push(zbDayOfWeek.TUESDAY);
                if (dayOfWeekName === 'wednesday') highlightDaysList.push(zbDayOfWeek.WEDNESDAY);
                if (dayOfWeekName === 'thursday') highlightDaysList.push(zbDayOfWeek.THURSDAY);
                if (dayOfWeekName === 'friday') highlightDaysList.push(zbDayOfWeek.FRIDAY);
                if (dayOfWeekName === 'saturday') highlightDaysList.push(zbDayOfWeek.SATURDAY);
            });
        }

        // Set the days of week
        for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
            // Get the column day of week
            const columnDayOfWeek = this._getColumnDayOfWeek(columnIndex, firstDayOfWeek);

            // Get day text
            const dayText = culture.shortDayOfWeekList[columnDayOfWeek].toUpperCase();

            // Get the day of week object
            const dayOfWeek = this._dayOfWeekList[columnIndex];

            // Set child cell
            dayOfWeek.childCell.innerText = dayText;
        }

        // For each day of week column
        for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
            // Get the column day of week
            const columnDayOfWeek = this._getColumnDayOfWeek(columnIndex, firstDayOfWeek);

            // Set to not show as highlighted
            let showAsHighlighted = false;

            // For each highlight day
            for (let index = 0; index < highlightDaysList.length; index++) {
                // Get highlight day
                const highlightDay = highlightDaysList[index];

                // If not the same day
                if (highlightDay !== columnDayOfWeek) continue;

                // Set to show as highlighted
                showAsHighlighted = true;
                break;
            }

            // For each day of month row
            for (let index = 0; index < 6; index++) {
                // Get day of month row
                const dayOfMonthRow = this._dayOfMonthList[index];

                // Get the day of month for the current column index
                const dayOfMonth = dayOfMonthRow.dayList[columnIndex];

                // Reset default class
                dayOfMonth.defaultClass = 'parent-cell';

                // If shown as highlighted
                if (showAsHighlighted === true) {
                    if ((index + 1) % 2) {
                        dayOfMonth.defaultClass += ' parent-highlightColumn-even';
                    } else {
                        dayOfMonth.defaultClass += ' parent-highlightColumn-odd';
                    }
                } else {
                    if ((index + 1) % 2) {
                        dayOfMonth.defaultClass += ' parent-normal-even';
                    } else {
                        dayOfMonth.defaultClass += ' parent-normal-odd';
                    }
                }

                // Update class
                dayOfMonth.parentCell.className = dayOfMonth.defaultClass;
            }
        }
    }

    /**
    * Update the month parts. This includes the day numbers, which ones are in the previous/next month and the
    * selected date (if highlighted).
    * @private
    */
    _updateMonth() {
        // Set date to today
        let date = zbDate.getToday();

        // If value attribute exists
        if (this.hasAttribute('value') === true) {
            // Try, because the date maybe invalid
            try {
                // Create date
                date = zbDate.fromString(this.getAttribute('value'));
            } catch (error) {
                // Log error
                console.error('Invalid date value. Format must be in YYYY-MM-DD.');

                // Stop here
                return;
            }
        }

        // Set highlight
        let highlight = false;

        // If there is a highlight attribute
        if (this.hasAttribute('highlight') === true) {
            // Set to highlight
            highlight = true;
        }

        // Set first day of week
        let firstDayOfWeek = zbDayOfWeek.MONDAY;

        // If there is a first day of week attribute
        if (this.hasAttribute('first-day') === true) {
            // Get attribute
            const firstDayOfWeekValue = this.getAttribute('first-day').toLowerCase();

            // Check the value
            if (firstDayOfWeekValue === 'monday') firstDayOfWeek = zbDayOfWeek.MONDAY;
            if (firstDayOfWeekValue === 'tuesday') firstDayOfWeek = zbDayOfWeek.TUESDAY;
            if (firstDayOfWeekValue === 'wednesday') firstDayOfWeek = zbDayOfWeek.WEDNESDAY;
            if (firstDayOfWeekValue === 'thursday') firstDayOfWeek = zbDayOfWeek.THURSDAY;
            if (firstDayOfWeekValue === 'friday') firstDayOfWeek = zbDayOfWeek.FRIDAY;
            if (firstDayOfWeekValue === 'saturday') firstDayOfWeek = zbDayOfWeek.SATURDAY;
            if (firstDayOfWeekValue === 'sunday') firstDayOfWeek = zbDayOfWeek.SUNDAY;
        }

        // Set days in month
        const daysInMonth = zbDate.getDaysInMonth(date.year, date.month);

        // Set first day of month
        const firstDayOfMonth = new zbDate(date.year, date.month, 1);

        // Get the first day of the month's day of the week
        const firstDayOfMonthDayOfWeek = firstDayOfMonth.getDayOfWeek();

        // Set first day of last month
        const firstDayOfLastMonth = firstDayOfMonth.addMonths(-1);

        // Get days in last month
        const daysInLastMonth = zbDate.getDaysInMonth(firstDayOfLastMonth.year, firstDayOfLastMonth.month);

        // Set day and month
        let day = -1;
        let month = -1;

        // Workout when to start from (day and month) which could be from last month

        // For each day of month column
        for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
            // Get the column day of week
            const columnDayOfWeek = this._getColumnDayOfWeek(columnIndex, firstDayOfWeek);

            // If this is no the first day of the month's day of the week
            if (columnDayOfWeek !== firstDayOfMonthDayOfWeek) continue;

            // If the first day of the week is on the first column, then we are not going to show last month
            if (columnIndex === 0) {
                // We are not going to show last month
                day = 1;
                month = date.month;
                break;
            }

            // Workout the starting day
            day = daysInLastMonth - columnIndex + 1;
            month = firstDayOfLastMonth.month;
            break;
        }

        // For each day of month row
        for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
            // Get day of month row
            const dayOfMonthRow = this._dayOfMonthList[rowIndex];

            // For each day of month column
            for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
                // Get the day of month
                const dayOfMonth = dayOfMonthRow.dayList[columnIndex];

                // Set non month
                let nonMonth = false;

                // If not in the current month
                if (month !== date.month) {
                    // If over last month's days in month
                    if (day > daysInLastMonth) {
                        // Reset to day 1
                        day = 1;

                        // Move to the next month
                        month++;
                        if (month > 12) month = 1;
                    } else {
                        // Set in non month
                        nonMonth = true;
                    }
                } else {
                    // If oveer this month's days in month
                    if (day > daysInMonth) {
                        // Set in non month
                        nonMonth = true;

                        // Reset to day 1
                        day = 1;

                        // Move to the next month
                        month++;
                        if (month > 12) month = 1;
                    }
                }

                // If highlighted but not the current day
                if (dayOfMonth.highlighted === true && (day !== date.day || month !== date.month)) {
                    // Reset parent class to default one (unhighlight it)
                    dayOfMonth.parentCell.className = dayOfMonth.defaultClass;

                    // Set not highlighted
                    dayOfMonth.highlighted = false;
                }

                // If this is the current day
                if (day === date.day && month === date.month) {
                    // If we are highlighting the current day
                    if (highlight === true) {
                        // Set the parent class to highlight
                        dayOfMonth.parentCell.className = 'parent-cell parent-selected';

                        // Set as highlighted
                        dayOfMonth.highlighted = true;
                    } else {
                        // Reset parent class to default one (unhighlight it)
                        dayOfMonth.parentCell.className = dayOfMonth.defaultClass;

                        // Set not highlighted
                        dayOfMonth.highlighted = false;
                    }
                }

                // If not non month
                if (nonMonth === false) {
                    // Set normal
                    dayOfMonth.childCell.className = 'child-cell child-normal';
                } else {
                    // Set non-month
                    dayOfMonth.childCell.className = 'child-cell child-nonMonth';
                }

                // Set child inner text to the day number
                dayOfMonth.childCell.innerText = day.toString();

                // Set event information
                dayOfMonth.parentCell.nonMonth = nonMonth;
                dayOfMonth.parentCell.year = date.year;
                dayOfMonth.parentCell.day = day;
                dayOfMonth.parentCell.month = month;
                dayOfMonth.childCell.nonMonth = nonMonth;
                dayOfMonth.childCell.year = date.year;
                dayOfMonth.childCell.day = day;
                dayOfMonth.childCell.month = month;

                // Increase day
                day++;
            }
        }
    }

    /**
     * Add click event listeners to every day of month.
     * @private
     */
    _addClickEventListener() {
        // For each day of month row
        for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
            // Get day of month row
            const dayOfMonthRow = this._dayOfMonthList[rowIndex];

            // For each day of month column
            for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
                // Get the day of month
                const dayOfMonth = dayOfMonthRow.dayList[columnIndex];

                // Add click event listener
                dayOfMonth.parentCell.addEventListener('click', this._clickEvent);
            }
        }
    }

    /**
     * Remove click event listeners from every day of month.
     * @private
     */
    _removeClickEventListener() {
        // For each day of month row
        for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
            // Get day of month row
            const dayOfMonthRow = this._dayOfMonthList[rowIndex];

            // For each day of month column
            for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
                // Get the day of month
                const dayOfMonth = dayOfMonthRow.dayList[columnIndex];

                // Remove click event listener
                dayOfMonth.parentCell.removeEventListener('click', this._clickEvent);
            }
        }
    }

    /**
     * Click event.
     * @param {object} event The click event object.
     */
    _clickEvent(event) {
        // If non month then do not process click
        if (event.target.nonMonth === true) return;

        // Get year parts
        const year = event.target.year;
        const month = event.target.month;
        const day = event.target.day;

        // Create date
        const date = new zbDate(year, month, day);

        // Set the value attribute to the date
        this.setAttribute('value', date.toString());

        // Dispatch the selected event
        this.dispatchEvent(this.selectedEvent);
    }

    /**
     * Get the day of the week for the given column index (depending on what the first
     * day of the week was set to).
     * @param {number} columnIndex The column index (0 to 6).
     * @param {zbDayOfWeek} firstDayOfWeek What is the first of the week is set to.
     * @return {zbDayOfWeek} The day of the week the column index points to.
     * @private
     */
    _getColumnDayOfWeek(columnIndex, firstDayOfWeek) {
        // The day of week is 0 to 6, so we can process it as a number instead of a constant
        let dayOfWeek = firstDayOfWeek + columnIndex;
        if (dayOfWeek >= 7) dayOfWeek -= 7;

        // Process and return the day of week
        if (dayOfWeek === 0) return zbDayOfWeek.SUNDAY;
        if (dayOfWeek === 1) return zbDayOfWeek.MONDAY;
        if (dayOfWeek === 2) return zbDayOfWeek.TUESDAY;
        if (dayOfWeek === 3) return zbDayOfWeek.WEDNESDAY;
        if (dayOfWeek === 4) return zbDayOfWeek.THURSDAY;
        if (dayOfWeek === 5) return zbDayOfWeek.FRIDAY;
        if (dayOfWeek === 6) return zbDayOfWeek.SATURDAY;

        // Return monday if error
        return zbDayOfWeek.MONDAY;
    }
}

// Define calendar web component
customElements.define('zb-calendar', zbCalendar);
/**
 * Zebra Blue: zbDayCalendar (zb-day-calendar)
 * @classdesc
 * Day calendar web component.
 */
class zbDayCalendar extends HTMLElement {
    /**
     * Create a new zbDayCalendar object.
     * @constructor
     */
    constructor() {
        // Must call super first
        super();

        // Create the CSS parts for the shadow DOM
        const style = document.createElement('style');

        // Set style
        style.textContent = `
            :host {
                display: inline-block;
            }
            .root {
                min-width: 200px;
                min-height: 200px;
                user-select: none;
            }
            .header {
                background-image: linear-gradient(rgb(248, 0, 0), rgb(200, 0, 0));
                color: rgb(248, 248, 248);
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
                border-top: 3px solid rgb(48, 48, 48);
                border-left: 3px solid rgb(48, 48, 48);
                border-right: 3px solid rgb(48, 48, 48);
                font-size: 2em;
                text-align: center;
                padding: 0.5em;
            }
            .body {
                background-color: white;
                font-size: 6em;
                color: rgb(48, 48, 48);
                border-left: 3px solid rgb(48, 48, 48);
                border-right: 3px solid rgb(48, 48, 48);
                text-align: center;
                padding: 0.1em;
            }
            .footer {
                background-color: white;
                color: rgb(48, 48, 48);
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;
                border-left: 3px solid rgb(48, 48, 48);
                border-right: 3px solid rgb(48, 48, 48);
                border-bottom: 3px solid rgb(48, 48, 48);
                font-size: 1.5em;
                text-align: center;
                padding-left: 0.2em;
                padding-right: 0.2em;
                padding-bottom: 0.4em;
            }`;

        // Create root DIV
        const rootDiv = document.createElement('div');
        rootDiv.setAttribute('class', 'root');

        // Create header DIV
        this._headerDiv = document.createElement('div');
        this._headerDiv.setAttribute('class', 'header');

        // Create body DIV
        this._bodyDiv = document.createElement('div');
        this._bodyDiv.setAttribute('class', 'body');

        // Create footer DIV
        this._footerDiv = document.createElement('div');
        this._footerDiv.setAttribute('class', 'footer');

        // Add header, body and footer to the root
        rootDiv.appendChild(this._headerDiv);
        rootDiv.appendChild(this._bodyDiv);
        rootDiv.appendChild(this._footerDiv);

        // Attach shadow DOM root.
        const shadowRoot = this.attachShadow({mode: 'open'});

        // Add styles
        shadowRoot.appendChild(style);

        // Add root DIV
        shadowRoot.appendChild(rootDiv);
    }

    /**
     * Gets the culture used when showning the date.
     * @type {string}
     */
    get culture() {
        // Return the current attribute culture
        return this.getAttribute('culture');
    }

    /**
     * Sets the culture to use when showing the date.
     * @param {string} value The culture code, "en-US" for example.
     * @type {string}
     */
    set culture(value) {
        // Validate parameter
        zbValidate.isString(value);

        // Set the attribute
        this.setAttribute('culture', value);
    }

    /**
     * Gets the value of the date currently set.
     * @type {string}
     */
    get value() {
        // Return the current attribute value
        return this.getAttribute('value');
    }

    /**
     * The date to show. The value must be in YYYY-MM-DD format.
     * @param {string} value The date value to show.
     * @type {string}
     */
    set value(value) {
        // Validate parameter
        zbValidate.isString(value);

        // Set the attribute
        this.setAttribute('value', value);
    }

    /**
     * Override connectedCallback function to handle when component is attached into the DOM.
     * @override
     */
    connectedCallback() {
        // Update the date shown
        this._update();
    }

    /**
     * Override attributeChangedCallback function to handle attribute changes
     * @param {string} name Then name of the attribute that has changed.
     * @param {string} oldValue The old value of the attribute before it was changed.
     * @param {string} newValue The new value the attribute is being changed to.
     * @override
     */
    attributeChangedCallback(name, oldValue, newValue) {
        // If value or culture
        if (name === 'value' || name === 'culture') this._update();
    }

    /**
     * Override the observedAttributes function to return the list
     * of attributes to monitor.
     * @return {Array} List of attribute names.
     * @static
     * @override
     */
    static get observedAttributes() {
        // Return the list of attributes
        return ['value', 'culture'];
    }

    /**
     * Update the date shown.
     * @private
     */
    _update() {
        // Set date to today
        let date = zbDate.getToday();

        // If value attribute exists
        if (this.hasAttribute('value') === true) {
            // Try, because the date maybe invalid
            try {
                // Create date
                date = zbDate.fromString(this.getAttribute('value'));
            } catch (error) {
                // Log error
                console.error('Invalid date value. Format must be in YYYY-MM-DD.');

                // Stop here
                return;
            }
        }

        // Set culture
        let culture = null;

        // If culture attribute exists
        if (this.hasAttribute('culture') === true) {
            // Try to get culture
            try {
                // Find the culture
                culture = zbCulture.find(this.getAttribute('culture'));

                // If not found
                if (culture === null) {
                    // Log error
                    console.error('Culture not found');
                }
            } catch (error) {
                // Log error
                console.error('Culture not found');
            }
        }

        // If no culture then use the default
        if (culture === null) culture = zbCulture.default;

        // Set month text
        const monthText = culture.monthList[date.month - 1].toUpperCase();

        // Set day of week text
        const dayOfWeek = date.getDayOfWeek();
        const dayOfWeekText = culture.dayOfWeekList[dayOfWeek].toUpperCase();

        // Set DIV inner text parts
        this._headerDiv.innerText = monthText;
        this._bodyDiv.innerText = date.day.toString();
        this._footerDiv.innerText = dayOfWeekText;
    }
}

// Define day calendar web component
customElements.define('zb-day-calendar', zbDayCalendar);
/**
 * Zebra Blue: zbDigitalClock (zb-digital-clock)
 * @classdesc
 * Digital clock web component.
 */
class zbDigitalClock extends HTMLElement {
    /**
     * Create a new zbDigitalClock object.
     * @constructor
     */
    constructor() {
        // Must call super first
        super();

        // Create the CSS parts for the shadow DOM
        const style = document.createElement('style');

        // Set style
        style.textContent = `
            :host {
                display: inline-block;
            }
            .root12 {
                min-width: 280px;
                min-height: 100px;
                height: 100%;
                width: 100%;
                background-color: rgb(48, 48, 48);
                display: grid;
                grid-template-columns: 4fr 4fr 1fr 4fr 4fr 2fr;
                grid-template-rows: 1fr;
                grid-column-gap: 0.5em;
                padding: 0.4em;
            }
            .root24 {
                min-width: 280px;
                min-height: 100px;
                height: 100%;
                width: 100%;
                background-color: rgb(48, 48, 48);
                display: grid;
                grid-template-columns: 4fr 4fr 1fr 4fr 4fr;
                grid-template-rows: 1fr;
                grid-column-gap: 0.5em;
                padding: 0.4em;
            }
            .digit {
                height: 100%;
                display: grid;
                grid-template-columns: 1fr 2fr 1fr;
                grid-template-rows: 1fr 2fr 1fr 2fr 1fr;
                grid-column-gap: 1px;
                grid-row-gap: 1px;
            }
            .digit-line-on {
                background-color: rgb(248, 248, 248);
            }
            .digit-line-off {
                background-color: rgb(55, 55, 55);
            }
            .digit-gap {
                background-color: rgb(48, 48, 48);
            }
            .dots {      
                height: 100%;
                display: grid;
                grid-template-columns: 1fr;
                grid-template-rows: 2fr 1fr 3fr 1fr 2fr;
                grid-column-gap: 1px;
                grid-row-gap: 1px;
            }
            .dot {
                background-color: rgb(248, 248, 248);
                border-radius: 50%;
            }
            .ampm {
                height: 100%;
                display: grid;
                grid-template-columns: 1fr;
                grid-template-rows: 1fr 1fr;
                grid-column-gap: 1px;
                grid-row-gap: 1px;
                font-family: "Lucida Console", Courier, monospace;
                font-size: 1em;
            }
            .ampm-parent {
                position: relative;
                width: 100%;
                height: 100%;
            }
            .ampm-child {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            .ampm-on {
                color: rgb(248, 248, 248);
            }
            .ampm-off {
                color: rgb(55, 55, 55);
            }
            @keyframes blink {
                50% {
                    opacity: 0.0;
                }
            }
            .blink {
                animation: blink 1s step-start 0s infinite;
            }`;

        // Attach shadow DOM root
        this._shadowRoot = this.attachShadow({mode: 'open'});

        // Add styles
        this._shadowRoot.appendChild(style);

        // Bind update event to this
        this._update = this._update.bind(this);
    }

    /**
     * Gets if we are showing the 24 hour clock (or the 12 hour clock).
     * @type {boolean}
     */
    get show24HourClock() {
        // If there is no show24HourClock attribute
        if (this.hasAttribute('show24HourClock') === true) return true;

        // Otherwise it is showing the 12 hour clock
        return false;
    }

    /**
     * Sets if we are showing the 24 hour clock.
     * @param {boolean} value True to show 24 hour clock, False to show 12 hour clock.
     * @type {boolean}
     */
    set show24HourClock(value) {
        // Validate parameter
        zbValidate.isBoolean(value);

        // If we want to show 24 hour clock
        if (value === true) {
            // Add the attribute
            this.setAttribute('show24hour', value);
        } else {
            // Remove the attribute
            this.removeAttribute('show24hour');
        }
    }

    /**
    * Override connectedCallback function to handle when component is attached into the DOM.
    * @override
    */
    connectedCallback() {
        // Create parts
        this._create();

        // Update to the current time
        this._update();

        // Start clock
        this._timerId = setInterval(this._update, 1000);
    }

    /**
     * Override disconnectedCallback function to handle when component is detached from the DOM.
     * @override
     */
    disconnectedCallback() {
        // If timer exists
        if (this.timerId) {
            // Clear timer
            clearInterval(this._timerId);

            // Remove timer id
            delete this._timerId;
        }
    }

    /**
     * Override attributeChangedCallback function to handle attribute changes
     * @param {string} name Then name of the attribute that has changed.
     * @param {string} oldValue The old value of the attribute before it was changed.
     * @param {string} newValue The new value the attribute is being changed to.
     * @override
     */
    attributeChangedCallback(name, oldValue, newValue) {
        // If show24hour attribute changed
        if (name === 'show24hour') {
            // Recreate and update clock
            this._create();
            this._update();
        }
    }

    /**
     * Override the observedAttributes function to return the list
     * of attributes to monitor.
     * @return {Array} List of attribute names.
     * @static
     * @override
     */
    static get observedAttributes() {
        // Return the list of attributes
        return ['show24hour'];
    }

    /**
     * Create the DOM elements.
     * @private
     */
    _create() {
        // Set show 24 hour clock
        let show24HourClock = false;

        // If there is a show 24 hour clock attribute
        if (this.hasAttribute('show24hour') === true) {
            // Set to show 24 hour clock
            show24HourClock = true;
        }

        // Create root DIV
        const rootDiv = document.createElement('div');

        // Set root class
        if (show24HourClock === true) {
            // Set to use the root24 class
            rootDiv.setAttribute('class', 'root24');
        } else {
            // Set to use the root12 class
            rootDiv.setAttribute('class', 'root12');
        }

        // Create digit line element list
        this._digit = [4];
        this._digit[0] = {};
        this._digit[1] = {};
        this._digit[2] = {};
        this._digit[3] = {};

        // Create digit DOM elements
        const digit1DomElement = this._createDigit(0);
        const digit2DomElement = this._createDigit(1);
        const dotsDomElement = this._createDots();
        const digit3DomElement = this._createDigit(2);
        const digit4DomElement = this._createDigit(3);

        // Append DOM elements to the root DIV
        rootDiv.appendChild(digit1DomElement);
        rootDiv.appendChild(digit2DomElement);
        rootDiv.appendChild(dotsDomElement);
        rootDiv.appendChild(digit3DomElement);
        rootDiv.appendChild(digit4DomElement);

        // If showing 12 hour clock
        if (show24HourClock === false) {
            // Create AM PM DOM elements
            const ampmDomElement = this._createAmpm();

            // Append to the root DIV
            rootDiv.appendChild(ampmDomElement);
        }

        // If there is a current root DIV
        if (this._rootDiv) {
            // Remove current root DIV from shadow DOM
            this._shadowRoot.removeChild(this._rootDiv);
        }

        // Set the new current root DIV
        this._rootDiv = rootDiv;

        // Add root DIV to shadow DOM
        this._shadowRoot.appendChild(this._rootDiv);

        // If there is a current time then remove it
        if (this._currentTime) delete this._currentTime;
    }

    /**
     * Create the digit DOM elements.
     * @param {number} digitIndex The digit index to create (0 to 3).
     * @return {HTMLElement} Digit DOM element.
     */
    _createDigit(digitIndex) {
        // Set digit object
        const digit = this._digit[digitIndex];

        // Create line list
        digit.lineList = [];

        // Create digit DOM element
        const digitDomElement = document.createElement('div');

        // Set grid styles
        digitDomElement.style.gridRow = 1;
        digitDomElement.style.gridColumn = digit;

        // Set class
        digitDomElement.className = 'digit';

        // For each row
        for (let row = 1; row <= 5; row++) {
            // For each column
            for (let column = 1; column <= 3; column++) {
                // Create digit grid cell
                const digitGridCellDomElement = document.createElement('div');

                // Set styles
                digitGridCellDomElement.style.gridRow = row;
                digitGridCellDomElement.style.gridColumn = column;

                // If corner
                if (column === 1 && row === 1) digitGridCellDomElement.style.borderTopLeftRadius = '50%';
                if (column === 3 && row === 1) digitGridCellDomElement.style.borderTopRightRadius = '50%';
                if (column === 1 && row === 5) digitGridCellDomElement.style.borderBottomLeftRadius = '50%';
                if (column === 3 && row === 5) digitGridCellDomElement.style.borderBottomRightRadius = '50%';

                // Set class
                digitGridCellDomElement.className = 'digit-line-off';

                // If gaps
                if (column === 2 && (row === 2 || row === 4)) digitGridCellDomElement.className = 'digit-gap';

                // Append grid cell DOM element to digit DOM element
                digitDomElement.appendChild(digitGridCellDomElement);

                // Add to digit's line list
                digit.lineList.push(digitGridCellDomElement);
            }
        }

        // Return the digit DOM element
        return digitDomElement;
    }

    /**
     * Create the dot DOM elements.
     * @return {HTMLElement} Dots DOM element.
     */
    _createDots() {
        // Create dots DOM element
        const dotsDomElement = document.createElement('div');

        // Set grid styles
        dotsDomElement.style.gridRow = 1;
        dotsDomElement.style.gridColumn = 3;

        // Set class
        dotsDomElement.className = 'dots';

        // Create first dot DOM element
        const dot1DomElement = document.createElement('div');

        // Set grid styles
        dot1DomElement.style.gridRow = 2;
        dot1DomElement.style.gridColumn = 1;

        // Set class
        dot1DomElement.className = 'dot blink';

        // Create second dot DOM element
        const dot2DomElement = document.createElement('div');

        // Set grid styles
        dot2DomElement.style.gridRow = 4;
        dot2DomElement.style.gridColumn = 1;

        // Set class
        dot2DomElement.className = 'dot blink';

        // Append the first and second dot to the dots DOM element
        dotsDomElement.appendChild(dot1DomElement);
        dotsDomElement.appendChild(dot2DomElement);

        // Return the dots DOM element
        return dotsDomElement;
    }

    /**
     * Create the ampm DOM elements.
     * @return {HTMLElement} AMPM DOM element.
     */
    _createAmpm() {
        // Create ampm DOM element
        const ampmDomElement = document.createElement('div');

        // Set grid styles
        ampmDomElement.style.gridRow = 1;
        ampmDomElement.style.gridColumn = 6;

        // Set class
        ampmDomElement.className = 'ampm';

        // Create am DOM element
        const amDomElement = document.createElement('div');

        // Set grid styles
        amDomElement.style.gridRow = 1;
        amDomElement.style.gridColumn = 1;

        // Create am parent
        const amParentDomElement = document.createElement('div');

        // Set class
        amParentDomElement.className = 'ampm-parent';

        // Create am child
        this._amChildDomElement = document.createElement('div');

        // Set class
        this._amChildDomElement.className = 'ampm-child ampm-off';

        // Set AM inner text
        this._amChildDomElement.innerText = 'AM';

        // Add am parts together
        amParentDomElement.appendChild(this._amChildDomElement);
        amDomElement.appendChild(amParentDomElement);

        // Create pm DOM element
        const pmDomElement = document.createElement('div');

        // Set grid styles
        pmDomElement.style.gridRow = 2;
        pmDomElement.style.gridColumn = 1;

        // Create pm parent
        const pmParentDomElement = document.createElement('div');

        // Set class
        pmParentDomElement.className = 'ampm-parent';

        // Create pm child
        this._pmChildDomElement = document.createElement('div');

        // Set class
        this._pmChildDomElement.className = 'ampm-child ampm-off';

        // Set PM inner text
        this._pmChildDomElement.innerText = 'PM';

        // Add pm parts together
        pmParentDomElement.appendChild(this._pmChildDomElement);
        pmDomElement.appendChild(pmParentDomElement);

        // Append the am and pm elements to the ampm DOM element
        ampmDomElement.appendChild(amDomElement);
        ampmDomElement.appendChild(pmDomElement);

        // Return the am pm DOM element
        return ampmDomElement;
    }

    /**
     * Update the time shown.
     * @private
     */
    _update() {
        // Get time now
        const time = zbTime.getNow();

        // If there is a current time
        if (this._currentTime) {
            // If nothing has changed then stop here
            if (this._currentTime.hour === time.hour && this._currentTime.minute === time.minute) return;
        }

        // Update current time
        this._currentTime = time;

        // Set show 24 hour clock
        let show24HourClock = false;

        // If there is a show 24 hour clock attribute
        if (this.hasAttribute('show24hour') === true) {
            // Set to show 24 hour clock
            show24HourClock = true;
        }

        // Set hour
        let hour = time.hour;

        // If showing 12 hour clock and over 12 hours
        if (show24HourClock === false && hour > 12) {
            // Minus 12 hours
            hour -= 12;
        }

        // Set digit numbers
        let digit1Number = Math.floor(hour / 10);
        const digit2Number = hour % 10;
        const digit3Number = Math.floor(time.minute / 10);
        const digit4Number = time.minute % 10;

        // If showing 12 hour clock and digit 1 number is zero
        if (show24HourClock === false && digit1Number === 0) {
            // Set the digit 1 number so that it hides the number
            digit1Number = -1;
        }

        // Set the digit lines
        this._setDigitLines(this._digit[0], digit1Number);
        this._setDigitLines(this._digit[1], digit2Number);
        this._setDigitLines(this._digit[2], digit3Number);
        this._setDigitLines(this._digit[3], digit4Number);

        // If 12 hour clock shown
        if (show24HourClock === false) {
            // If AM
            if (this._currentTime.hour <= 12) {
                // Show AM
                this._amChildDomElement.className = 'ampm-child ampm-on';
                this._pmChildDomElement.className = 'ampm-child ampm-off';
            } else {
                // Show PM
                this._amChildDomElement.className = 'ampm-child ampm-off';
                this._pmChildDomElement.className = 'ampm-child ampm-on';
            }
        }
    }

    /**
     * Set the digit lines for the given number.
     * @param {object} digit The digit we want to set the number to.
     * @param {number} digitNumber The number to set the digit to.
     * @private
     */
    _setDigitLines(digit, digitNumber) {
        // Get digit number switch list
        const numberSwitchList = zbDigitalClock._getNumberSwitchList(digitNumber);

        // For each digit line
        for (let index = 0; index < 15; index++) {
            // Get digit grid cell DOM element
            const digitGridCellDomElement = digit.lineList[index];

            // If line is on
            if (numberSwitchList[index] === true) {
                // Set class to turn the line on
                digitGridCellDomElement.className = 'digit-line-on';
            } else {
                // Set class to turn the line off
                digitGridCellDomElement.className = 'digit-line-off';
            }
        }
    }

    /**
     * Get the parts of a digit that should be on or off depending on the number.
     * @param {number} number The number 0-9 to get the digit switch list for. The value -1 means blank all lines.
     * @return {boolean[]} The list of digit switch parts to be on or off.
     * @private
     * @static
     */
    static _getNumberSwitchList(number) {
        // Check numbers
        if (number === -1) return [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
        if (number === 0) return [true, true, true, true, false, true, true, false, true, true, false, true, true, true, true];
        if (number === 1) return [false, false, true, false, false, true, false, false, true, false, false, true, false, false, true];
        if (number === 2) return [true, true, true, false, false, true, true, true, true, true, false, false, true, true, true];
        if (number === 3) return [true, true, true, false, false, true, false, true, true, false, false, true, true, true, true];
        if (number === 4) return [true, false, true, true, false, true, true, true, true, false, false, true, false, false, true];
        if (number === 5) return [true, true, true, true, false, false, true, true, true, false, false, true, true, true, true];
        if (number === 6) return [true, true, true, true, false, false, true, true, true, true, false, true, true, true, true];
        if (number === 7) return [true, true, true, false, false, true, false, false, true, false, false, true, false, false, true];
        if (number === 8) return [true, true, true, true, false, true, true, true, true, true, false, true, true, true, true];
        if (number === 9) return [true, true, true, true, false, true, true, true, true, false, false, true, true, true, true];
    }
}

// Define digital click web component
customElements.define('zb-digital-clock', zbDigitalClock);
