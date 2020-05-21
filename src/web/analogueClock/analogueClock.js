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
