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
