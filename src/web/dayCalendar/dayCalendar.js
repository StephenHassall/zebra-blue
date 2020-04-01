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
