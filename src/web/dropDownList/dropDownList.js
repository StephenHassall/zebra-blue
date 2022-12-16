/**
 * Zebra Blue: zbDropDownList (zb-drop-down-list)
 * @classdesc
 * Drop down list web component.
 * <zb-drop-down-list>
 *   <div slot="trigger">TRIGGER</div>
 *   <div slot="item">Item #1</div>
 *   <div slot="item">Item #2</div>
 *   <div slot="item"></div>
 *   <div slot="item">Item #3</div>
 *   <div slot="item">Item #4</div>
 * </zb-drop-down-list>
 * Empty item slots are drawn as gap lines.
 */
class zbDropDownList extends HTMLElement {
    /**
     * Static CSS constant.
     * @return {string} The CSS constant.
     */
    static get CSS() {
        return /*css*/`
:host {
    display: inline-block;
}
.scroll-bar {
}
.scroll-bar::-webkit-scrollbar-track
{
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: #F5F5F5;
}
.scroll-bar::-webkit-scrollbar
{
    width: 6px;
    background-color: #F5F5F5;
}
.scroll-bar::-webkit-scrollbar-thumb
{
    background-color: #7690ec;
}
.drop-down-list {
    position: relative;
}
.drop-down-list-trigger {
}
.drop-down-list-body {
    visibility: hidden;
    position: absolute;
    min-width: 10vw;
    max-width: 80vw;
    box-shadow: 0 2px 6px 0 rgba(0,0,0,.1);
    border: 1px solid rgba(0,0,0,.1);
    background: #fff;
}
.drop-down-list-content {
    overflow: hidden;
    overflow-y: auto;
    max-height: 80vh;
}
#item::slotted(:empty) {
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    margin: 0;
    border-top: 1px solid #ececec;
}
#item::slotted(*) {
    padding-top: 0.4em;
    padding-bottom: 0.4em;
    padding-left: 0.8em;
    padding-right: 0.8em;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
}
#item::slotted(:hover) {
    background-color: lightskyblue;
}
`;
    }

    /**
     * Static HTML constant.
     * @return {string} The HTML constant.
     */
    static get HTML() {
        return /*html*/`
<div class="drop-down-list">
    <!-- Slot Trigger -->
    <slot id="trigger" name="trigger"></slot>

    <!-- Drop Down List Body -->
    <div id="drop-down-list-body" class="drop-down-list-body">
        <!-- Content -->
        <div id="drop-down-list-content" class="drop-down-list-content scroll-bar">
            <!-- Slot Item -->
            <slot id="item" name="item"></slot>
        </div>
    </div>
</div>
`;
    }

    /**
     * Create a new zbDropDownList object.
     * @constructor
     */
    constructor() {
        // Must call super first
        super();

        // Create the CSS parts for the shadow DOM
        const style = document.createElement('style');

        // Set style
        style.textContent = zbDropDownList.CSS;

        // Attach shadow DOM root
        this._shadowRoot = this.attachShadow({mode: 'open'});

        // Add styles
        this._shadowRoot.appendChild(style);

        // Create root HTML
        const rootHtml = document.createElement('div');

        // Set inner HTML
        rootHtml.innerHTML = zbDropDownList.HTML;

        // Add root HTML to shadow DOM
        this._shadowRoot.appendChild(rootHtml);

        // Bind click events to this
        this._triggerClickEvent = this._triggerClickEvent.bind(this);
        this._documentClickEvent = this._documentClickEvent.bind(this);
        this._itemClickEvent = this._itemClickEvent.bind(this);
        this._dropDownListBodyClickEvent = this._dropDownListBodyClickEvent.bind(this);
    }

    /**
     * Gets the position the drop down is shown compared to the trigger element.
     * @type {string}
     */
    get position() {
        // Return the current attribute position
        return this.getAttribute('position');
    }

    /**
     * Sets the position the drop down is shown compared to the trigger element.
     * @param {string} value The position to show the drop down. Can be one of the following.
     * bottom-left
     * bottom-center
     * bottom-right (default)
     * top-left
     * top-center
     * top-right
     * left-top
     * left-center
     * left-bottom
     * right-top
     * right-center
     * right-bottom
     * The position value is automatically checked, and adjusted if needed, to make sure it fits the page correctly. It does
     * this by checking the location of the trigger element within the page (browser window).
     * @type {string}
     */
    set position(value) {
        // Set the attribute
        this.setAttribute('position', value);

        // Update the position of the drop down
        this._updatePosition();
    }

    /**
    * Override connectedCallback function to handle when component is attached into the DOM.
    * @override
    */
    connectedCallback() {
        // Get and set the trigger element
        this._triggerElement = this._shadowRoot.getElementById('trigger');

        // If found
        if (this._triggerElement !== null) {
            // Add trigger click event listener
            this._triggerElement.addEventListener('click', this._triggerClickEvent);

            // Set we have set the trigger click event
            this._triggerClickSet = true;
        }

        // Get and set the drop down list body element
        this._dropDownListBodyElement = this._shadowRoot.getElementById('drop-down-list-body');

        // If found
        if (this._dropDownListBodyElement !== null) {
            // Add drop down list body click event listener
            this._dropDownListBodyElement.addEventListener('click', this._dropDownListBodyClickEvent);

            // Set we have set the drop down list body click event
            this._dropDownListBodyClickSet = true;
        }

        // Set we have not set the drop down list body click event
        this._dropDownListBodyClickSet = false;

        // Set we have not set the document click event
        this._documentClickSet = false;

        // Get slot items list
        this._items = this.shadowRoot.querySelector('#item');

        // Set items click event
        this._items.addEventListener('click', this._itemClickEvent);

        // Set skip document click event
        this._skipDocumentClickEvent = false;
    }

    /**
     * Override disconnectedCallback function to handle when component is detached from the DOM.
     * @override
     */
    disconnectedCallback() {
        // Remove the trigger click event listener
        if (this._triggerClickSet === true) {
            this._triggerElement.removeEventListener('click', this._triggerClickEvent);
            this._triggerClickSet = false;
        }

        // Remove the document click event listener
        if (this._documentClickSet === true) {
            document.removeEventListener('click', this._documentClickEvent);
            this._documentClickSet = false;
        }

        // Remove the drop down list body click event listener
        if (this._dropDownListBodyClickSet === true) {
            this._dropDownListBodyElement.removeEventListener('click', this._dropDownListBodyClickEvent);
            this._dropDownListBodyClickSet = false;
        }

        // Remove items click event
        this._items.removeEventListener('click', this._itemClickEvent);
    }

    /**
     * Override attributeChangedCallback function to handle attribute changes
     * @param {string} name Then name of the attribute that has changed.
     * @param {string} oldValue The old value of the attribute before it was changed.
     * @param {string} newValue The new value the attribute is being changed to.
     * @override
     */
    attributeChangedCallback(name, oldValue, newValue) {
        // If position then update the position
        if (name === 'position') this._updatePosition();
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
        return ['position'];
    }

    /**
     * Update the position attribute.
     */
    _updatePosition() {
        // If not drop down list body element
        if (this._dropDownListBodyElement === null) return;

        // Set defaults
        this._dropDownListBodyElement.style.right = '';
        this._dropDownListBodyElement.style.left = '';
        this._dropDownListBodyElement.style.top = '';
        this._dropDownListBodyElement.style.bottom = '';
        this._dropDownListBodyElement.style.transform = '';

        // Set position
        let position = 'bottom-right';

        // If position attribute does exists
        if (this.hasAttribute('position') === true) position = this.getAttribute('position');

        // If there is a trigger element
        if (this._triggerElement !== null) {
            // Get the dimensions
            const rect = this.getBoundingClientRect();

            // Check bottom parts
            if (position === 'bottom-left' || position === 'bottom-center' || position === 'bottom-right') {
                if (rect.top > window.innerHeight * 0.6666) {
                    if (position === 'bottom-left') position = 'top-left';
                    if (position === 'bottom-center') position = 'top-center';
                    if (position === 'bottom-right') position = 'top-right';
                }
            }

            // Check top parts
            if (position === 'top-left' || position === 'top-center' || position === 'top-right') {
                if (rect.top < window.innerHeight * 0.3333) {
                    if (position === 'top-left') position = 'bottom-left';
                    if (position === 'top-center') position = 'bottom-center';
                    if (position === 'top-right') position = 'bottom-right';
                }
            }

            // Check left parts
            if (position === 'left-top' || position === 'left-center' || position === 'left-bottom') {
                if (rect.left < window.innerWidth * 0.2) {
                    if (position === 'left-top') position = 'right-top';
                    if (position === 'left-center') position = 'right-center';
                    if (position === 'left-bottom') position = 'right-bottom';
                }
            }

            // Check right parts
            if (position === 'right-top' || position === 'right-center' || position === 'right-bottom') {
                if (rect.left > window.innerWidth * 0.8) {
                    if (position === 'right-top') position = 'left-top';
                    if (position === 'right-center') position = 'left-center';
                    if (position === 'right-bottom') position = 'left-bottom';
                }
            }
        }

        // Switch on the position and set the styles to cope
        switch (position) {
            case 'bottom-left':
                this._dropDownListBodyElement.style.right = '0px';
                break;
            case 'bottom-center':
                this._dropDownListBodyElement.style.left = '50%';
                this._dropDownListBodyElement.style.transform = 'translateX(-50%)';
                break;
            case 'bottom-right':
                this._dropDownListBodyElement.style.left = '0px';
                break;
            case 'top-left':
                this._dropDownListBodyElement.style.right = '0px';
                this._dropDownListBodyElement.style.bottom = '100%';
                break;
            case 'top-center':
                this._dropDownListBodyElement.style.left = '50%';
                this._dropDownListBodyElement.style.transform = 'translateX(-50%)';
                this._dropDownListBodyElement.style.bottom = '100%';
                break;
            case 'top-right':
                this._dropDownListBodyElement.style.left = '0px';
                this._dropDownListBodyElement.style.bottom = '100%';
                break;
            case 'left-top':
                this._dropDownListBodyElement.style.bottom = '0px';
                this._dropDownListBodyElement.style.transform = 'translateX(-100%)';
                break;
            case 'left-center':
                this._dropDownListBodyElement.style.transform = 'translate(-100%, -50%)';
                break;
            case 'left-bottom':
                this._dropDownListBodyElement.style.top = '0px';
                this._dropDownListBodyElement.style.transform = 'translateX(-100%)';
                break;
            case 'right-top':
                this._dropDownListBodyElement.style.left = '100%';
                this._dropDownListBodyElement.style.bottom = '0px';
                break;
            case 'right-center':
                this._dropDownListBodyElement.style.left = '100%';
                this._dropDownListBodyElement.style.transform = 'translateY(-50%)';
                break;
            case 'right-bottom':
                this._dropDownListBodyElement.style.top = '0px';
                this._dropDownListBodyElement.style.left = '100%';
                break;
        }
    }

    /**
     * Drop down list body click event.
     * @param {object} event The click event object.
     */
    _dropDownListBodyClickEvent(event) {
        // We need to stop the event from moving up
        event.stopPropagation();
    }

    /**
     * Item click event.
     * @param {object} event The click event object.
     */
    _itemClickEvent(event) {
        // Dispatch the event with the element selected
        this.dispatchEvent(new CustomEvent(
            'select',
            {
                detail: event.target
            })
        );

        // We need to stop the event from moving up
        event.stopPropagation();

        // If there is adrop down list body element
        if (this._dropDownListBodyElement !== null) {
            // Hide the drop down list body
            this._dropDownListBodyElement.style.visibility = 'hidden';

            // Add trigger click event listener
            this._triggerElement.addEventListener('click', this._triggerClickEvent);
            this._triggerClickSet = true;
        }
    }

    /**
     * Click event.
     * @param {object} event The click event object.
     */
    _triggerClickEvent(event) {
        // If there is a drop down list body element
        if (this._dropDownListBodyElement !== null) {
            // If currently visible
            if (this._dropDownListBodyElement.style.visibility === 'visible') {
                // If the document click event has been set then remove it
                if (this._documentClickSet === true) document.removeEventListener('click', this._documentClickEvent);

                // Hide the drop down list body
                this._dropDownListBodyElement.style.visibility = 'hidden';
            } else {
                // If the document click event has not been set yet
                if (this._documentClickSet === false) {
                    // Set the document click event
                    document.addEventListener('click', this._documentClickEvent);
                    this._documentClickSet = true;
                }

                // Check the position
                this._updatePosition();

                // Make sure the drop down list body is visible
                this._dropDownListBodyElement.style.visibility = 'visible';

                // Remove the trigger click event
                this._triggerElement.removeEventListener('click', this._triggerClickEvent);
                this._triggerClickSet = false;

                // Set to skip document click event
                this._skipDocumentClickEvent = true;
            }
        }
    }

    /**
     * Document click event.
     * @param {object} event The click event object.
     */
    _documentClickEvent(event) {
        // If we need to skip the document click event
        if (this._skipDocumentClickEvent === true) {
            // Reset the skip document click event
            this._skipDocumentClickEvent = false;

            // Stop here
            return;
        }

        // If there is adrop down list body element
        if (this._dropDownListBodyElement !== null) {
            // Hide the drop down list body
            this._dropDownListBodyElement.style.visibility = 'hidden';

            // Add trigger click event listener
            this._triggerElement.addEventListener('click', this._triggerClickEvent);
            this._triggerClickSet = true;

            // Stop the event moving up
            event.stopPropagation();
        }
    }
}

// Define drop down list web component
customElements.define('zb-drop-down-list', zbDropDownList);
