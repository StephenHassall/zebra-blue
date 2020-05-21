/**
 * Zebra Blue: zbAnalogueClock (zb-analogue-clock)
 * @classdesc
 * Analogue clock web component.
 */
class zbAnalogueClock extends HTMLElement {
    /**
     * Create a new zbAnalogueClock object.
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
            .face {
                position: relative;  
                display: inline-block;
                width: 100%;
                height: 100%;
                min-width: 100px;
                min-height: 100px;
                background-color: rgb(253, 252, 237);
                border-radius: 50%;
                border: 2px solid black;
            }

            .face-hour-mark {
                position: absolute;
                width: 6%;
                height: 1%;
                transform:
                    translate(783.33%,4950%)
                    rotate(calc(var(--angle) * -1))
                    translateX(-770%);
                background-color: black;
            }

            .face-minute-mark {
                position: absolute;
                width: 4%;
                height: 0.5%;
                transform:
                    translate(1200%,9950%)
                    rotate(calc(var(--angle) * -1))
                    translateX(-1165%);
                background-color: black;
            }

            .number-parent {
                position: absolute;
                width: 20%;
                height: 20%;
                text-align: center;
                display: table;
                background-color: transparent;
                transform:
                    translate(200%, 200%)
                    rotate(var(--angle))
                    translateY(-180%)
                rotate(calc(var(--angle) * -1));
            }

            .number-child {
                display: table-cell;
                vertical-align: middle;
            }

            .clock-hand {
                position: absolute;
                width: 100%;
                height: 10%;
                display: inline-block;
            }

            .clock-hour {
                background-color: transparent;
                transform: translate(0%, 450%) rotate(var(--angle))
            }

            .clock-hour-hand {
                width: 40%;
                height: 40%;
                transform: translate(100%, 80%);
                background-color: black;
                clip-path: polygon(0% 50%, 25% 0%, 100% 50%, 25% 100%);
            }

            .clock-minute {
                background-color: transparent;
                transform: translate(0%, 450%) rotate(var(--angle))
            }

            .clock-minute-hand {
                width: 60%;
                height: 30%;
                transform: translate(65%, 120%);
                background-color: black;
                clip-path: polygon(0% 50%, 18% 0%, 100% 50%, 18% 100%);
            }

            .clock-second {
                background-color: transparent;
                transform: translate(0%, 450%) rotate(var(--angle));
            }

            .clock-second-hand {
                width: 60%;
                height: 10%;
                transform: translate(55%, 450%);
                background-color: red;
                clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
            }

            .clock-center {
                position: absolute;
                width: 5%;
                height: 5%;
                border-radius: 50%;
                background-color: red;
                transform: translate(950%, 950%);
            }`;

        // Attach shadow DOM root
        this._shadowRoot = this.attachShadow({mode: 'open'});

        // Add styles
        this._shadowRoot.appendChild(style);

        // Bind update event to this
        this._update = this._update.bind(this);
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
        this._timerId = setInterval(this._update, 500);
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
        // If roman attribute changed
        if (name === 'roman') {
            // Set roman numerals
            this._updateRoman();
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
        return ['roman'];
    }

    /**
     * Create the DOM elements.
     * @private
     */
    _create() {
        // Create root DIV
        const rootDiv = document.createElement('div');

        // Set class
        rootDiv.setAttribute('class', 'face');

        // Get the time now
        const time = new Date();

        // Set current time
        this._currentTime = time;

        // Add different DIV elements
        this._addHourMarks(rootDiv);
        this._addMinuteMarks(rootDiv);
        this._addNumbers(rootDiv);
        this._addHourHand(time, rootDiv);
        this._addMinuteHand(time, rootDiv);
        this._addSecondHand(time, rootDiv);
        this._addCenterDot(rootDiv);

        // Add root DIV to shadow DOM
        this._shadowRoot.appendChild(rootDiv);
    }

    /**
     * Add the hour marks to the face.
     * @param {object} rootDiv The root DIV element to add the hour marks to.
     * @private
     */
    _addHourMarks(rootDiv) {
        // For each hour mark
        for (let hour = 0; hour < 12; hour++) {
            // Create hour mark DIV element
            const hourMarkElement = document.createElement('div');

            // Set class
            hourMarkElement.setAttribute('class', 'face-hour-mark');

            // Workout the angle
            const angle = hour * 30;

            // Set angle
            hourMarkElement.style.setProperty('--angle', angle.toString() + 'deg');

            // Add to root DIV
            rootDiv.appendChild(hourMarkElement);
        }
    }

    /**
     * Add the minute marks to the face.
     * @param {object} rootDiv The root DIV element to add the minutes marks to.
     * @private
     */
    _addMinuteMarks(rootDiv) {
        // For each minute mark
        for (let minute = 0; minute < 60; minute++) {
            // Skip hour points
            if (minute === 0) continue;
            if (minute % 5 === 0) continue;

            // Create minute mark DIV element
            const minuteMarkElement = document.createElement('div');

            // Set class
            minuteMarkElement.setAttribute('class', 'face-minute-mark');

            // Workout the angle
            const angle = minute * 6;

            // Set angle
            minuteMarkElement.style.setProperty('--angle', angle.toString() + 'deg');

            // Add to root DIV
            rootDiv.appendChild(minuteMarkElement);
        }
    }

    /**
     * Add the numbers to the face.
     * @param {object} rootDiv The root DIV element to add the numbers to.
     * @private
     */
    _addNumbers(rootDiv) {
        // Create number child element list
        this._numberChildElementList = [];

        // For each number
        for (let number = 1; number <= 12; number++) {
            // Create number parent DIV element
            const numberParentElement = document.createElement('div');

            // Set class
            numberParentElement.setAttribute('class', 'number-parent');

            // Workout the angle
            const angle = number * 30;

            // Set angle
            numberParentElement.style.setProperty('--angle', angle.toString() + 'deg');

            // Create number child DIV element
            const numberChildElement = document.createElement('div');

            // Set class
            numberChildElement.setAttribute('class', 'number-child');

            // Set number
            numberChildElement.innerText = this._getNumberText(number);

            // Add to list of number child elements
            this._numberChildElementList.push(numberChildElement);

            // Add child to parent
            numberParentElement.appendChild(numberChildElement);

            // Add parent to root DIV
            rootDiv.appendChild(numberParentElement);
        }
    }

    /**
     * Add the hour hand to the face.
     * @param {Date} time The current time to.
     * @param {object} rootDiv The root DIV element to add the hour hand to.
     * @private
     */
    _addHourHand(time, rootDiv) {       
        // Create hour parent DIV element
        this._hourParentElement = document.createElement('div');
  
        // Set class
        this._hourParentElement.setAttribute('class', 'clock-hand clock-hour');

        // Workout the hour angle
        const hourAngle = (time.getHours() * 30) + (time.getMinutes() / 2) - 90;

        // Set angle
        this._hourParentElement.style.setProperty('--angle', hourAngle.toString() + 'deg');

        // Create hour child DIV element
        const hourChildElement = document.createElement('div');

        // Set class
        hourChildElement.setAttribute('class', 'clock-hour-hand');

        // Add child to parent
        this._hourParentElement.appendChild(hourChildElement);

        // Add parent to root DIV
        rootDiv.appendChild(this._hourParentElement);
    }

    /**
     * Add the minute hand to the face.
     * @param {Date} time The current time to.
     * @param {object} rootDiv The root DIV element to add the minute hand to.
     * @private
     */
    _addMinuteHand(time, rootDiv) {
        // Create minute parent DIV element
        this._minuteParentElement = document.createElement('div');
  
        // Set class
        this._minuteParentElement.setAttribute('class', 'clock-hand clock-minute');

        // Workout the minute angle
        const minuteAngle = (time.getMinutes() * 6) + (time.getSeconds() / 10)  - 90;

        // Set angle
        this._minuteParentElement.style.setProperty('--angle', minuteAngle.toString() + 'deg');

        // Create minute child DIV element
        const minuteChildElement = document.createElement('div');

        // Set class
        minuteChildElement.setAttribute('class', 'clock-minute-hand');

        // Add child to parent
        this._minuteParentElement.appendChild(minuteChildElement);

        // Add parent to root DIV
        rootDiv.appendChild(this._minuteParentElement);
    }

    /**
     * Add the second hand to the face.
     * @param {Date} time The current time to.
     * @param {object} rootDiv The root DIV element to add the second hand to.
     * @private
     */
    _addSecondHand(time, rootDiv) {
        // Create second parent DIV element
        this._secondParentElement = document.createElement('div');

        // Set class
        this._secondParentElement.setAttribute('class', 'clock-hand clock-second');

        // Workout the second angle
        const secondAngle = (time.getSeconds() * 6) - 90;

        // Set angle
        this._secondParentElement.style.setProperty('--angle', secondAngle.toString() + 'deg');

        // Create second child DIV element
        const secondChildElement = document.createElement('div');

        // Set class
        secondChildElement.setAttribute('class', 'clock-second-hand');

        // Add child to parent
        this._secondParentElement.appendChild(secondChildElement);

        // Add parent to root DIV
        rootDiv.appendChild(this._secondParentElement);
    }

    /**
     * Add the center dot to the face.
     * @param {object} rootDiv The root DIV element to add the second hand to.
     * @private
     */
    _addCenterDot(rootDiv) {
        // Create center dot DIV element
        const centerDotElement = document.createElement('div');

        // Set class
        centerDotElement.setAttribute('class', 'clock-center');

        // Add center dot to root DIV
        rootDiv.appendChild(centerDotElement);
    }

    /**
     * Update the time shown.
     * @private
     */
    _update() {
        // Get time now
        const time = new Date();

        // If nothing has changed then stop here
        if (this._currentTime.getHours() === time.getHours() &&
            this._currentTime.getMinutes() === time.getMinutes() &&
            this._currentTime.getSeconds() === time.getSeconds()) return;

        // Update current time
        this._currentTime = time;

        // Workout the hour angle
        const hourAngle = (time.getHours() * 30) + (time.getMinutes() / 2) - 90;

        // Set angle
        this._hourParentElement.style.setProperty('--angle', hourAngle.toString() + 'deg');

        // Workout the minute angle
        const minuteAngle = (time.getMinutes() * 6) + (time.getSeconds() / 10) - 90;

        // Set angle
        this._minuteParentElement.style.setProperty('--angle', minuteAngle.toString() + 'deg');

        // Workout the second angle
        const secondAngle = (time.getSeconds() * 6) - 90;

        // Set angle
        this._secondParentElement.style.setProperty('--angle', secondAngle.toString() + 'deg');
    }

    /**
     * Updates the number to be normal or roman numerals.
     * @private
     */
    _updateRoman() {
        // If numbers not made yet
        if (!this._numberChildElementList) return;

        // For each number
        for (let number = 1; number <= 12; number++) {
            // Get number child elememt
            const numberChildElement = this._numberChildElementList[number - 1];

            // Set number
            numberChildElement.innerText = this._getNumberText(number);
        }
    }

    /**
     * Gets the number text. This can be a normal number or a roman numeral.
     * @param {number} number The number to get the text for.
     * @return {string} The number as text.
     * @private
     */
    _getNumberText(number) {
        // Set roman
        let roman = false;

        // If there is a roman attribute
        if (this.hasAttribute('roman') === true) {
            // Set to use roman numerals
            roman = true;
        }

        // If not roman then just return the number as text
        if (roman === false) return number.toString();

        // Check and return the number
        if (number === 1) return 'I';
        if (number === 2) return 'II';
        if (number === 3) return 'III';
        if (number === 4) return 'IV';
        if (number === 5) return 'V';
        if (number === 6) return 'VI';
        if (number === 7) return 'VII';
        if (number === 8) return 'VIII';
        if (number === 9) return 'IX';
        if (number === 10) return 'X';
        if (number === 11) return 'XI';
        if (number === 12) return 'XII';

        // Return error
        return 'ERROR';
    }
}

// Define analogue web component
customElements.define('zb-analogue-clock', zbAnalogueClock);
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
            if (this._currentTime.hour < 12) {
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

// Define digital clock web component
customElements.define('zb-digital-clock', zbDigitalClock);
/**
 * Zebra Blue: zbFractal (zb-fractal)
 * @classdesc
 * Fractal web component.
 */
class zbFractal extends HTMLElement {
    /**
     * Create a new zbFractal object.
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
                width: 100%;
                height: 100%;
                background-color: darkgray;
                margin: 0px;
                padding: 0px;
            }`;

        // Create root DIV
        const rootDiv = document.createElement('div');
        rootDiv.setAttribute('class', 'root');

        // Create canvas
        this._canvas = document.createElement('canvas');

        // Set styles
        this._canvas.style.padding = '0px';
        this._canvas.style.margin = '0px';
        this._canvas.style.display = 'block';

        // Add canvas to the root
        rootDiv.appendChild(this._canvas);

        // Attach shadow DOM root.
        const shadowRoot = this.attachShadow({mode: 'open'});

        // Add styles
        shadowRoot.appendChild(style);

        // Add root DIV
        shadowRoot.appendChild(rootDiv);

        // Bind fractal worker message event to this
        this._fractalWorkerMessage = this._fractalWorkerMessage.bind(this);

        // Set render members
        this._render = {};
        this._render.scaleX = 0.0;
        this._render.scaleY = 0.0;
        this._render.scaleWidth = 0.0;
        this._render.pixelWidth = 0;
        this._render.pixelHeight = 0;
        this._render.lineFrom = 0;
        this._render.lineTo = 0;
        this._render.colorRange = 32;
        this._render.colorMap = '0,0,0,255,0,0';
        this._render.antiAliasing = 1;
        this._render.interval = 1000;

        // Set control pressed flag
        this._controlPressed = false;

        // Bind other events to this
        this._clickEvent = this._clickEvent.bind(this);
        this._keydownEvent = this._keydownEvent.bind(this);
        this._keyupEvent = this._keyupEvent.bind(this);
    }

    /**
    * Override connectedCallback function to handle when component is attached into the DOM.
    * @override
    */
    connectedCallback() {
        // Update the canvas width and height
        this._canvas.style.width = this.getAttribute('pixel-width') + 'px';
        this._canvas.style.height = this.getAttribute('pixel-height') + 'px';
        this._canvas.width = this.getAttribute('pixel-width');
        this._canvas.height = this.getAttribute('pixel-height');

        // Get canvas context
        this._canvasContext = this._canvas.getContext('2d');

        // Add click event listener
        this._canvas.addEventListener('click', this._clickEvent);

        // Add keypress event listeners
        window.addEventListener('keydown', this._keydownEvent);
        window.addEventListener('keyup', this._keyupEvent);
    }

    /**
     * Override disconnectedCallback function to handle when component is detached from the DOM.
     * @override
     */
    disconnectedCallback() {
        // Stop rendering
        this.renderStop();

        // Remove click event listener
        this._canvas.removeEventListener('click', this._clickEvent);

        // Remove keypress event listeners
        window.removeEventListener('keydown', this._keydownEvent, true);
        window.removeEventListener('keyup', this._keyupEvent, true);
    }

    /**
     * Override attributeChangedCallback function to handle attribute changes
     * @override
     */
    attributeChangedCallback(name, oldValue, newValue) {
        // If not pixel-width or pixel-height
        if (name !== 'pixel-width' && name !== 'pixel-height') return;

        // Adjust the canvas dimensions
        this._canvas.style.width = this.getAttribute('pixel-width') + 'px';
        this._canvas.style.height = this.getAttribute('pixel-height') + 'px';
        this._canvas.width = this.getAttribute('pixel-width');
        this._canvas.height = this.getAttribute('pixel-height');
    }

    /**
    * Override the observedAttributes function to return the list
    * of attributes to monitor.
    * @return {Array} List of attribute names.
    * @static
    */
    static get observedAttributes() {
        // Return attribute names
        return ['pixel-width', 'pixel-height'];
    }

    /**
     * Click event.
     * @param {object} event The click event object.
     */
    _clickEvent(event) {
        // If there is a thread list
        if (this._threadItemList) {
            // If some exist (render is working still)
            if (this._threadItemList.length !== 0) return;
        }

        // Set scale height
        const scaleHeight = (this._render.pixelHeight / this._render.pixelWidth) * this._render.scaleWidth;

        // Workout the new scale center point
        const scaleCenterX = this._render.scaleX + ((event.clientX / this._render.pixelWidth) * this._render.scaleWidth);
        const scaleCenterY = this._render.scaleY + ((event.clientY / this._render.pixelHeight) * scaleHeight);

        // Workout the new scale X, Y and width
        let newScaleWidth = this._render.scaleWidth / 2.0;
        let newScaleHeight = scaleHeight / 2.0;
        let newScaleX = scaleCenterX - (newScaleWidth / 2.0);
        let newScaleY = scaleCenterY - (newScaleHeight / 2.0);

        // If control pressed (zoom out)
        if (this._controlPressed === true) {
            // Reset values
            newScaleWidth = this._render.scaleWidth / 0.5;
            newScaleHeight = scaleHeight / 0.5;
            newScaleX = scaleCenterX - (newScaleWidth / 2.0);
            newScaleY = scaleCenterY - (newScaleHeight / 2.0);
        }

        // Create event details
        const detail = {};
        detail.pixelX = event.clientX;
        detail.pixelY = event.clientY;
        detail.scaleX = newScaleX;
        detail.scaleY = newScaleY;
        detail.scaleWidth = newScaleWidth;
        detail.scaleHeight = newScaleHeight;

        // Create zoom event
        const zoomEvent = new CustomEvent('zoom', { 'detail': detail });

        // Dispatch the zoom event
        this.dispatchEvent(zoomEvent);
    }

    /**
     * Document keydown event.
     * @param {object} event The keydown event.
     */
    _keydownEvent(event) {
        // If control button pressed then set control pressed flag
        if (event.which == '17') this._controlPressed = true;
    }

    /**
     * Document keyup event.
     * @param {object} event The keyup event.
     */
    _keyupEvent(event) {
        // If control button pressed then reset control pressed flag
        if (event.which == '17') this._controlPressed = false;
    }

    /**
     * Start the rendering of the fractal.
     * @public
     */
    renderStart() {
        // Stop any currently running workers
        this.renderStop();

        // Set threads
        let threads = 1;

        // If the threads attribute exists
        if (this.hasAttribute('threads') === true) {
            // Get threads value
            threads = parseInt(this.getAttribute('threads'));

            // If out of range
            if (threads < 1 || threads > 12) threads = 1;
        }

        // Get fractal worker URL path
        const fractalWorkerUrl = this.getAttribute('fractal-worker-url');

        // Create thread item list
        this._threadItemList = [];

        // For each thread
        for (let threadCount = 0; threadCount < threads; threadCount++) {
            // Create thread item
            const threadItem = {};

            // Set thread number
            threadItem.number = threadCount;

            // Set not working
            threadItem.working = false;

            // Create and set fractal worker
            threadItem.fractalWorker = new Worker(fractalWorkerUrl);

            // Set fractal worker message event
            threadItem.fractalWorker.addEventListener('message', this._fractalWorkerMessage);

            // Add thread item to list
            this._threadItemList.push(threadItem);
        }

        // Create render job list
        this._renderJobList = [];

        // Set job number
        let jobNumber = 1;

        // For each block of 10 lines
        for (let line = 1; line <= this._canvas.height; line += 10) {
            // Create render job
            const renderJob = {};
            renderJob.number = jobNumber;
            renderJob.lineFrom = line;
            renderJob.lineTo = line + 10;
            if (renderJob.lineTo > this._canvas.height) renderJob.lineTo = this._canvas.height;
            renderJob.working = false;
            renderJob.done = false;

            // Add to list
            this._renderJobList.push(renderJob);

            // Increase job number
            jobNumber++;
        }

        // Set render parts from attributes (these are constants)
        this._render.scaleX = parseFloat(this.getAttribute('scale-x'));
        this._render.scaleY = parseFloat(this.getAttribute('scale-y'));
        this._render.scaleWidth = parseFloat(this.getAttribute('scale-width'));
        this._render.pixelWidth = this._canvas.width;
        this._render.pixelHeight = this._canvas.height;
        this._render.colorRange = parseInt(this.getAttribute('color-range'));
        if (this._render.colorRange < 8) this._render.colorRange = 8;
        if (this._render.colorRange > 128) this._render.colorRange = 128;
        this._render.colorMap = this.getAttribute('color-map');
        if (this._render.colorMap.length === 0) this._render.colorMap = '0,0,0,255,0,0';
        this._render.antiAliasing = 1;
        if (this.getAttribute('anti-aliasing') === '1x1') this._render.antiAliasing = 1;
        if (this.getAttribute('anti-aliasing') === '2x2') this._render.antiAliasing = 2;
        if (this.getAttribute('anti-aliasing') === '4x4') this._render.antiAliasing = 4;
        if (this.getAttribute('anti-aliasing') === '8x8') this._render.antiAliasing = 8;
        if (this.getAttribute('anti-aliasing') === '16x16') this._render.antiAliasing = 16;
        this._render.interval = parseInt(this.getAttribute('interval'));
        if (this._render.interval < 250) this._render.interval = 250;
        if (this._render.interval > 1000000) this._render.interval = 1000000;

        // Start the render engine
        this._renderEngine();
    }

    /**
     * Stop the rendering of the fractal.
     * @public
     */
    renderStop() {
        // If no threads yet
        if (!this._threadItemList) return;

        // For each thread item
        for (let threadItemIndex = 0; threadItemIndex < this._threadItemList.length; threadItemIndex++) {
            // Get thread item
            const threadItem = this._threadItemList[threadItemIndex];

            // Stop the fractal worker
            threadItem.fractalWorker.terminate();
        }

        // Clear thread item list
        this._threadItemList = [];
    }

    /**
     * Render engine. Called when something has happened. It moves the rendering on, processing
     * one job after the other, using the available threads.
     * @private
     */
    _renderEngine() {
        // Set progress to do and done
        const progressToDo = this._renderJobList.length;
        let progressDone = 0;

        // For each render job
        for (let renderJobIndex = 0; renderJobIndex < this._renderJobList.length; renderJobIndex++) {
            // Get render job
            const renderJob = this._renderJobList[renderJobIndex];

            // If not done then skip
            if (renderJob.done === false) continue;

            // Increase progress done count
            progressDone++;
        }

        // Create event details
        const detail = {};
        detail.toDo = progressToDo;
        detail.done = progressDone;

        // Create progress event
        const progressEvent = new CustomEvent('progress', { 'detail': detail });

        // Dispatch the progress event
        this.dispatchEvent(progressEvent);

        // For each thread item
        for (let threadItemIndex = 0; threadItemIndex < this._threadItemList.length; threadItemIndex++) {
            // Get thread item
            const threadItem = this._threadItemList[threadItemIndex];

            // If working then skip
            if (threadItem.working === true) continue;

            // Set found render job
            let foundRenderJob = null;

            // For each render job
            for (let renderJobIndex = 0; renderJobIndex < this._renderJobList.length; renderJobIndex++) {
                // Get render job
                const renderJob = this._renderJobList[renderJobIndex];

                // If working then skip
                if (renderJob.working === true) continue;

                // If done then skip
                if (renderJob.done === true) continue;

                // Set found render job and stop looking
                foundRenderJob = renderJob;
                break;
            }

            // If no more render jobs to process
            if (foundRenderJob === null) {
                // We can remove this thread now it is no longer needed
                this._threadItemList.splice(threadItemIndex, 1);

                // Stop here
                return;
            }

            // Set extra render parts
            this._render.threadNumber = threadItem.number;
            this._render.jobNumber = foundRenderJob.number;
            this._render.lineFrom = foundRenderJob.lineFrom;
            this._render.lineTo = foundRenderJob.lineTo;

            // Set render job as working
            foundRenderJob.working = true;

            // Post the render data to the worker
            threadItem.fractalWorker.postMessage(this._render);

            // Set thread as working
            threadItem.working = true;
        }
    }

    /**
     * Fractal working message event.
     * @param {object} event The fractal worker event.
     * @private
     */
    _fractalWorkerMessage(event) {
        // If not done then this is a line update
        if (event.data.done === false) {
            // Get line pixel data
            const linePixelData = event.data.linePixelData;

            // Put the line pixel data on the canvas
            this._canvasContext.putImageData(linePixelData, 0, event.data.lineNumber - 1);

            // Stop here
            return;
        }

        // Thread has finished the job

        // For each thread item
        for (let threadItemIndex = 0; threadItemIndex < this._threadItemList.length; threadItemIndex++) {
            // Get thread item
            const threadItem = this._threadItemList[threadItemIndex];

            // If not the same thread
            if (threadItem.number !== event.data.threadNumber) continue;

            // Set worker as not working
            threadItem.working = false;
            break;
        }

        // For each render job
        for (let renderJobIndex = 0; renderJobIndex < this._renderJobList.length; renderJobIndex++) {
            // Get render job
            const renderJob = this._renderJobList[renderJobIndex];

            // If not the same render job
            if (renderJob.number !== event.data.jobNumber) continue;

            // Set job as not working and is done
            renderJob.working = false;
            renderJob.done = true;
            break;
        }

        // Update the render engine
        this._renderEngine();
    }
}

// Define fractal web component
window.customElements.define('zb-fractal', zbFractal);
