/**
 * Fractal Form Controller
 * @classdesc
 * Controller to handle the fractal form.
 */
class FractalFormController {
    /**
    * Create a new FractalFormController object.
    * @constructor
    */
    constructor() {
        // Set root
        this._rootElement = document.getElementById('fractalFormController');

        // Find and set minimised/maximised elements
        this._parametersMinimisedElement = this._rootElement.querySelector('#parametersMinimised');
        this._parametersMaximisedElement = this._rootElement.querySelector('#parametersMaximised');
        this._parametersMaximisedButtonElement = this._rootElement.querySelector('#parametersMaximisedButton');
        this._helpMinimisedElement = this._rootElement.querySelector('#helpMinimised');
        this._helpMaximisedElement = this._rootElement.querySelector('#helpMaximised');
        this._helpMaximisedButtonElement = this._rootElement.querySelector('#helpMaximisedButton');

        // Find and set progress element
        this._progressElement = this._rootElement.querySelector('#progress');
        this._progressValueElement = this._rootElement.querySelector('#progressValue');

        // Find and set inputs
        this._threadsElement = this._rootElement.querySelector('#threads');
        this._imageWidthElement = this._rootElement.querySelector('#imageWidth');
        this._imageHeightElement = this._rootElement.querySelector('#imageHeight');
        this._antiAliasingElement = this._rootElement.querySelector('#antiAliasing');
        this._colorPaletteElement = this._rootElement.querySelector('#colorPalette');
        this._colorRangeElement = this._rootElement.querySelector('#colorRange');

        // Find and set render button
        this._renderElement = this._rootElement.querySelector('#render');

        // Find and set zb-fractor element (outside of controller)
        this._zbFractorElement = document.getElementById('zbFractal');

        // Bind events to this
        this._parametersMinimisedClickEvent = this._parametersMinimisedClickEvent.bind(this);
        this._parametersMaximisedButtonClickEvent = this._parametersMaximisedButtonClickEvent.bind(this);
        this._helpMinimisedClickEvent = this._helpMinimisedClickEvent.bind(this);
        this._helpMaximisedButtonClickEvent = this._helpMaximisedButtonClickEvent.bind(this);
        this._inputChangedEvent = this._inputChangedEvent.bind(this);
        this._renderClickEvent = this._renderClickEvent.bind(this);
        this._fractorProgressEvent = this._fractorProgressEvent.bind(this);
        this._zoomEvent = this._zoomEvent.bind(this);

        // Set click events
        this._parametersMinimisedElement.addEventListener('click', this._parametersMinimisedClickEvent);
        this._parametersMaximisedButtonElement.addEventListener('click', this._parametersMaximisedButtonClickEvent);
        this._helpMinimisedElement.addEventListener('click', this._helpMinimisedClickEvent);
        this._helpMaximisedButtonElement.addEventListener('click', this._helpMaximisedButtonClickEvent);
        this._renderElement.addEventListener('click', this._renderClickEvent);

        // Set input events
        this._threadsElement.addEventListener('input', this._inputChangedEvent);
        this._imageWidthElement.addEventListener('input', this._inputChangedEvent);
        this._imageHeightElement.addEventListener('input', this._inputChangedEvent);
        this._antiAliasingElement.addEventListener('input', this._inputChangedEvent);
        this._colorPaletteElement.addEventListener('input', this._inputChangedEvent);
        this._colorRangeElement.addEventListener('input', this._inputChangedEvent);

        // Set fractor events
        this._zbFractorElement.addEventListener('progress', this._fractorProgressEvent);
        this._zbFractorElement.addEventListener('zoom', this._zoomEvent);

        // Set the default parameters
        this._threadsElement.value = '1';
        this._imageWidthElement.value = '640';
        this._imageHeightElement.value = '480';
        this._antiAliasingElement.value = '1x1';
        this._colorPaletteElement.value = 'Mixed';
        this._colorRangeElement.value = '16';

        // Set color palette list
        this._colorPaletteList =[
            { name: 'Mixed', colorMap: '66,30,15,25,7,26,9,1,47,4,4,73,0,7,100,12,44,138,24,82,177,57,125,209,134,181,229,211,236,248,241,233,191,248,201,95,255,170,0,204,128,0,153,87,0,106,52,3'},
            { name: 'Red', colorMap: '0,0,0,255,0,0' },
            { name: 'Blue', colorMap: '0,0,0,0,0,255' },
            { name: 'Gray', colorMap: '0,0,0,255,255,255' },
            { name: 'Mixed Blue', colorMap: '131,161,243,92,97,197,68,61,147,92,84,174,70,92,156' },
            { name: 'Mixed Red', colorMap: '83,55,26,49,36,16,54,24,10,156,32,4,50,32,36' },
            { name: 'Mixed Green', colorMap: '247,249,189,148,124,61,20,20,9,164,177,100,84,100,44' },
            { name: 'Mixed Purple', colorMap: '160,100,223,75,45,54,101,108,213,217,97,217,4,12,10' },
            { name: 'Mixed Gray', colorMap: '142,137,160,62,61,87,178,177,191,118,118,129,28,19,27' },
            { name: 'Candy', colorMap: '242,209,95,206,223,233,161,133,90,242,217,235,224,238,240' },
            { name: 'Sky', colorMap: '43,24,29,223,171,173,104,117,151,60,84,112,237,217,227' },
            { name: 'Moonlight', colorMap: '74,78,77,14,154,167,61,164,171,246,205,97,254,138,113' },
            { name: 'Cappuccino', colorMap: '75,56,50,133,68,66,255,244,230,60,47,47,190,155,123'},
            { name: 'Rainbow', colorMap: '148,0,211,75,0,130,0,0,255,0,255,0,255,255,0,255,127,0,255,0,0' },
            { name: 'Pastel Rainbow', colorMap: '168,230,207,220,237,193,255,211,182,255,170,165,255,139,148' }
        ];

        // Set not working
        this._working = false;
    }

    /**
     * Run the render process. Call this after the page has loaded.
     * @public
     */
    run() {
        // Get document dimensions
        const documentWidth = document.documentElement.scrollWidth - 4;
        const documentHeight = document.documentElement.scrollHeight - 4;

        // Adjust the image's dimensions
        this._zbFractorElement.setAttribute('pixel-width', documentWidth);
        this._zbFractorElement.setAttribute('pixel-height', documentHeight);

        // Set the parameter values
        this._imageWidthElement.value = documentWidth;
        this._imageHeightElement.value = documentHeight;

        // Call the render click event to start rendering again
        this._renderClickEvent();
    }

    /**
     * Parameters minimised click event.
     * @private
     */
    _parametersMinimisedClickEvent() {
        // Switch to show parameters
        this._parametersMinimisedElement.style.display = 'none';
        this._parametersMaximisedElement.style.display = 'inline-block';
    }

    /**
     * Parameters maximised button click event.
     * @private
     */
    _parametersMaximisedButtonClickEvent() {
        // Switch to hide parameters
        this._parametersMinimisedElement.style.display = 'inline-block';
        this._parametersMaximisedElement.style.display = 'none';
    }

    /**
     * Help minimised click event.
     * @private
     */
    _helpMinimisedClickEvent() {
        // Switch to show help
        this._helpMinimisedElement.style.display = 'none';
        this._helpMaximisedElement.style.display = 'inline-block';
    }

    /**
     * Help maximised button click event.
     * @private
     */
    _helpMaximisedButtonClickEvent() {
        // Switch to hide help
        this._helpMinimisedElement.style.display = 'inline-block';
        this._helpMaximisedElement.style.display = 'none';
    }

    /**
     * Input changed event.
     * @private
     */
    _inputChangedEvent() {
        // Get and set threads parameter
        const threads = this._threadsElement.value;
        this._zbFractorElement.setAttribute('threads', threads);

        // Get image width
        const imageWidth = this._imageWidthElement.value;

        // If changed
        if (this._zbFractorElement.getAttribute('pixel-width') !== imageWidth) {
            // Change the image's width
            this._zbFractorElement.setAttribute('pixel-width', imageWidth);
        }

        // Get image height
        const imageHeight = this._imageHeightElement.value;

        // If changed
        if (this._zbFractorElement.getAttribute('pixel-height') !== imageHeight) {
            // Change the image's height
            this._zbFractorElement.setAttribute('pixel-height', imageHeight);
        }

        // Get and set anti aliasing
        const antiAliasing = this._antiAliasingElement.value;
        this._zbFractorElement.setAttribute('anti-aliasing', antiAliasing);

        // Get and set color palette
        const colorPaletteName = this._colorPaletteElement.value;
        for (let index = 0; index < this._colorPaletteList.length; index++) {
            // If the same
            if (this._colorPaletteList[index].name === colorPaletteName) {
                // Set color map
                this._zbFractorElement.setAttribute('color-map', this._colorPaletteList[index].colorMap);
                break;
            }
        }

        // Get and set color range
        const colorRange = this._colorRangeElement.value;
        this._zbFractorElement.setAttribute('color-range', colorRange);
    }

    /**
     * Render click event.
     * @private
     */
    _renderClickEvent() {
        // If not already working
        if (this._working === false) {
            // Disable the parameters
            this._threadsElement.setAttribute('disabled', true);
            this._imageWidthElement.setAttribute('disabled', true);
            this._imageHeightElement.setAttribute('disabled', true);
            this._antiAliasingElement.setAttribute('disabled', true);
            this._colorPaletteElement.setAttribute('disabled', true);
            this._colorRangeElement.setAttribute('disabled', true);

            // Change render text to stop
            this._renderElement.innerText = 'Stop';

            // Show progress
            this._progressValueElement.innerText = '0%';
            this._progressElement.style.display = 'inline-block';

            // Start rendering
            this._zbFractorElement.renderStart();

            // Set working
            this._working = true;
        } else {
            // Was already working

            // Stop rendering
            this._zbFractorElement.renderStop();

            // Hide progress
            this._progressElement.style.display = 'none';

            // Enable the parameters
            this._threadsElement.removeAttribute('disabled');
            this._imageWidthElement.removeAttribute('disabled');
            this._imageHeightElement.removeAttribute('disabled');
            this._antiAliasingElement.removeAttribute('disabled');
            this._colorPaletteElement.removeAttribute('disabled');
            this._colorRangeElement.removeAttribute('disabled');

            // Change render text back to render image
            this._renderElement.innerText = 'Render Image';

            // Set not working
            this._working = false;
        }
    }

    /**
     * Fractor progress event.
     * @param {object} event The progress event.
     * @private
     */
    _fractorProgressEvent(event) {
        // Workout progress percentage
        let progressPercentage = (event.detail.done / event.detail.toDo) * 100.0;

        // Check range
        if (progressPercentage < 0.0) progressPercentage = 0.0;
        if (progressPercentage > 100.0) progressPercentage = 100.0;

        // Set progress text
        const progressText = progressPercentage.toFixed(0) + '%';

        // Update progress
        this._progressValueElement.innerText = progressText;

        // If not finished
        if (event.detail.done !== event.detail.toDo) return;

        // Hide progress
        this._progressElement.style.display = 'none';

        // Enable the parameters
        this._threadsElement.removeAttribute('disabled');
        this._imageWidthElement.removeAttribute('disabled');
        this._imageHeightElement.removeAttribute('disabled');
        this._antiAliasingElement.removeAttribute('disabled');
        this._colorPaletteElement.removeAttribute('disabled');
        this._colorRangeElement.removeAttribute('disabled');

        // Change render text back to render image
        this._renderElement.innerText = 'Render Image';

        // Set not working
        this._working = false;
    }

    /**
     * Zoom event.
     * @param {object} event The zoom event.
     */
    _zoomEvent(event) {
        // If working then do nothing
        if (this._working === true) return;

        // Reset attributes
        this._zbFractorElement.setAttribute('scale-x', event.detail.scaleX.toString());
        this._zbFractorElement.setAttribute('scale-y', event.detail.scaleY.toString());
        this._zbFractorElement.setAttribute('scale-width', event.detail.scaleWidth.toString());

        // Call the render click event to start rendering again
        this._renderClickEvent();
    }
}
