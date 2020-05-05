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
