/**
 * Zebra Blue: zbTable (zb-table)
 * @classdesc
 * Table web component.
 */
class zbTable extends HTMLElement {
    /**
     * Create a new zbTable object.
     * @constructor
     */
    constructor() {
        // Must call super first
        super();

        // Create TABLE
        this._tableElement = document.createElement('table');

        // Set to not show table to start with
        this._tableElement.style.display = 'none';

        // Attach shadow DOM root.
        const shadowRoot = this.attachShadow({mode: 'open'});

        // Add root DIV
        shadowRoot.appendChild(tableElement);
    }

    /**
     * Sets the data array of records to show in the table.
     * @param {Object[]} data The array of data records.
     * @type {Object[]}
     */
    set data(value) {
        // If there is no value
        if (value === undefined) throw new Error('Parameter is missing');

        // If value is null
        if (value === null) throw new Error('Parameter is missing');

        // If the parameter is not an array
        if (Array.isArray(value) === false) throw new Error('Parameter is not an array');

        // Set data
        this._data = data;

        // Update the whole table

        // Bind click event to this
        this._clickEvent = this._clickEvent.bind(this);

        // Create selected event
        //this.selectedEvent = new Event('selected');
    }

    /**
     * The header text to show. Example: "ID,Name,Address,Date"
     * @param {string} value The header names, coma seperated.
     * @type {string}
     */
    set headers(value) {
        // Set the attribute
        this.setAttribute('headers', value);
    }

    /**
     * Override connectedCallback function to handle when component is attached into the DOM.
     * @override
     */
    connectedCallback() {
        // Create the table
        this._createTable();

        // Add the click event listeners
        //this._addClickEventListener();
    }

    /**
     * Override disconnectedCallback function to handle when component is detached from the DOM.
     * @override
     */
    disconnectedCallback() {
        // Remove the click event listeners
        //this._removeClickEventListener();
    }

    /**
     * Update all the rows in the table.
     */
    update() {

    }

    updateRow(rowIndex) {

    }

    updateCell(rowIndex, columnIndex) {

    }

    _createTable() {
        
    }

    _createHeader() {
        // Set header list
        let headerList = [];

        // If there is a headers attribute
        if (this.hasAttribute('headers') === true) {
            // Get attribute
            const headersValue = this.getAttribute('headers');

            // Split into header list
            headerList = highlightDaysValue.split(',');
        }

        // If no header items then stop here
        if (headerList.length === 0) return;

        // Create THEAD element
        let theadElement = document.createElement('thead');

        // Create TR element
        let trElement = document.createElement('tr');

        // For each header
        for (let index = 0; index < headerList.length; index++) {
            // Get header
            let header = headerList[index];
        }


        // 

        // Create parent cell DIV
        dayOfWeek.parentCell = document.createElement('div');

    }

    _createRows() {

    }

    /**
     * Update the table.
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

    /**
     * Click event.
     * @param {object} event The click event object.
     */
    _clickEvent(event) {
        // If non month then do not process click
        if (event.target.nonMonth === true) return;


        // Dispatch the selected event
        this.dispatchEvent(this.selectedEvent);
    }
}

// Define table web component
customElements.define('zb-table', zbTable);
