/**
 * Zebra Blue: zbTestText (zb-test-text)
 * @classdesc
 * Simple test text web component.
 */
class zbTestText extends HTMLElement {
    /**
     * Create a new zbTestText object.
     * @constructor
     */
    constructor() {
        // Must call super first
        super();

        // Create the CSS parts for the shadow DOM
        const style = document.createElement('style');

        // Set style
        style.textContent = /*css*/`
:host {
    display: inline-block;
}
.parent-text {
    position: relative;
    background-color: lightgrey;
    width: 100%;
    height: 100%;
}
.child-text {
    position: absolute;
    color: rgb(48, 48, 48);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    user-select: none;
}`;

        // Attach shadow DOM root
        this._shadowRoot = this.attachShadow({mode: 'open'});

        // Add styles
        this._shadowRoot.appendChild(style);
    }

    /**
    * Override connectedCallback function to handle when component is attached into the DOM.
    * @override
    */
    connectedCallback() {
        // Create parts
        this._create();
    }

    /**
     * Override disconnectedCallback function to handle when component is detached from the DOM.
     * @override
     */
    disconnectedCallback() {
    }

    /**
     * Override attributeChangedCallback function to handle attribute changes
     * @param {string} name Then name of the attribute that has changed.
     * @param {string} oldValue The old value of the attribute before it was changed.
     * @param {string} newValue The new value the attribute is being changed to.
     * @override
     */
    attributeChangedCallback(name, oldValue, newValue) {
        // If text attribute changed
        if (name === 'text') {
            // Update text
            if (this._textDiv) {
                this._textDiv.innerText = this.getAttribute('text');
            }
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
        return ['text'];
    }

    /**
     * Create the DOM elements.
     * @private
     */
    _create() {
        // Create root DIV
        const rootDiv = document.createElement('div');

        // Set class
        rootDiv.setAttribute('class', 'parent-text');

        // Create text DIV
        this._textDiv = document.createElement('div');

        // Set class
        this._textDiv.setAttribute('class', 'child-text');

        // If position attribute does exists
        if (this.hasAttribute('text') === true) {
            // Set text
            this._textDiv.innerText = this.getAttribute('text');
        }

        // Add child to parent
        rootDiv.appendChild(this._textDiv);

        // Add root DIV to shadow DOM
        this._shadowRoot.appendChild(rootDiv);
    }
}

// Define analogue web component
customElements.define('zb-test-text', zbTestText);
