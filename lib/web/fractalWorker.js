/**
 * Fractal worker.
 * This performs the process of rendering the fractal image data.
 *
 * Message>
 *   threadNumber - The thread's number
 *   jobNumber - The job to perform
 *   scaleX - The virtual space to process (for the whole image)
 *   scaleY
 *   scaleWidth
 *   pixelWidth - The screen's pixel width and height (for the whole image)
 *   pixelHeight
 *   colorRange - The number of colors in the palette
 *   colorMap - The map of colors to create the palette from
 *   antiAliasing - The oversampling to use for each pixel of the image
 *   interval - The number of intervals to work with
 *   lineFrom - The lines to render (including the lineTo)
 *   lineTo
 *
 * Message<
 *   done - Is the whole job finished
 *   threadNumber - The thread's number
 *   jobNumber - The job performed
 *   lineNumber - The line created
 *   linePixelData - Line image data (an ImageData object & a transferable object)
 */

// Set color palette list
self.colorPaletteList = null;

/**
 * Create the color palette list.
 * @param {number} colorRange The number of colors in the palette.
 * @param {string} colorMap The map of colors to create the palette from.
 */
self.createColorPaletteList = function(colorRange, colorMap) {
    // If we have already created the color palette list
    if (self.colorPaletteList != null) return;

    // Create color palette list
    self.colorPaletteList = [];

    // For each color palette item
    for (let index = 0; index < colorRange; index++) {
        // Set palette item
        self.colorPaletteList[index] = {};
        self.colorPaletteList[index].red = 0;
        self.colorPaletteList[index].green = 0;
        self.colorPaletteList[index].blue = 0;
    }

    // Create list of colors
    const colorList = [];

    // Split the color map into its parts
    const colorMapPartList = colorMap.split(',');

    // For each color map part
    for (let index = 0; index < colorMapPartList.length; index += 3) {
        // If not enough parts
        if (index + 3 > colorMapPartList.length) continue;

        // Get colors
        const red = parseInt(colorMapPartList[index]);
        const green = parseInt(colorMapPartList[index + 1]);
        const blue = parseInt(colorMapPartList[index + 2]);

        // Create color object
        const color = {};
        color.red = red;
        color.green = green;
        color.blue = blue;

        // Add to color list
        colorList.push(color);
    }

    // Set color gap
    const colorGap = Math.floor(colorRange / (colorList.length - 1));

    // Set interval
    let interval = 0;

    // Set previous color
    let previousColor = colorList[0];

    // For each color
    for (let index = 1; index < colorList.length; index++) {
        // Get color
        const color = colorList[index];

        // Set red, green and blue gaps
        const redGap = (color.red - previousColor.red) / colorGap;
        const greenGap = (color.green - previousColor.green) / colorGap;
        const blueGap = (color.blue - previousColor.blue) / colorGap;

        // Set color parts
        let red = previousColor.red;
        let green = previousColor.green;
        let blue = previousColor.blue;

        // For each palette item
        for (let item = 0; item < colorGap; item++) {
            // Set color parts
            self.colorPaletteList[interval].red = Math.floor(red);
            self.colorPaletteList[interval].green = Math.floor(green);
            self.colorPaletteList[interval].blue = Math.floor(blue);

            // Increase interval
            interval++;

            // If over a color range
            if (interval >= colorRange) break;

            // Increase the color parts by the gaps
            red += redGap;
            green += greenGap;
            blue += blueGap;
        }

        // If interval is over a color range
        if (interval >= colorRange) break;

        // Set pervious color
        previousColor = color;
    }

    // For any remaining colors
    for (let index = interval; index < colorRange; index++) {
        // Set color palette item colors to the previous one
        self.colorPaletteList[index].red = previousColor.red;
        self.colorPaletteList[index].green = previousColor.green;
        self.colorPaletteList[index].blue = previousColor.blue;
    }
};

/**
 * Set on message event. This is fired by the zbFractal class.
 * @param {object} event The event information passed into the PostMessage function.
 */
onmessage = function(event) {
    // Set render data
    const render = event.data;

    // Create the color palette list
    self.createColorPaletteList(render.colorRange, render.colorMap);

    // Set scale height
    const scaleHeight = (render.pixelHeight / render.pixelWidth) * render.scaleWidth;

    // Set anti aliasing gaps
    const antiAliasingXGap = (render.scaleWidth / render.pixelWidth) / render.antiAliasing;
    const antiAliasingYGap = (scaleHeight / render.pixelHeight) / render.antiAliasing;

    // Set anti aliasing total
    const antiAliasingTotal = render.antiAliasing * render.antiAliasing;

    // Create variables
    let xRender = 0.0;
    let yRender = 0.0;
    let xAA = 0.0;
    let yAA = 0.0;
    let x = 0.0;
    let y = 0.0;
    let interval = 0;
    let xx = 0.0;
    let yy = 0.0;
    let xtemp = 0.0;
    let colorInterval = 0;
    let colorTotalRed = 0.0;
    let colorTotalGreen = 0.0;
    let colorTotalBlue = 0.0;

    // For each line
    for (let line = render.lineFrom; line <= render.lineTo; line++) {
        // Create single line image
        const linePixelData = new ImageData(render.pixelWidth, 1);

        // Set y part
        yRender = render.scaleY + ((line / render.pixelHeight) * scaleHeight);

        // For each pixel in line
        for (let pixel = 0; pixel < render.pixelWidth; pixel++) {
            // Set x part
            xRender = render.scaleX + ((pixel / render.pixelWidth) * render.scaleWidth);

            // Set color totals
            colorTotalRed = 0.0;
            colorTotalGreen = 0.0;
            colorTotalBlue = 0.0;

            // For each anti aliasing X
            for (let anitAliasingX = 0; anitAliasingX < render.antiAliasing; anitAliasingX++) {
                // Set xAA
                xAA = xRender + (anitAliasingX * antiAliasingXGap);

                // For each anti aliasing Y
                for (let anitAliasingY = 0; anitAliasingY < render.antiAliasing; anitAliasingY++) {
                    // Set yAA
                    yAA = yRender + (anitAliasingY * antiAliasingYGap);

                    // Reset variables
                    x = 0.0;
                    y = 0.0;
                    interval = 0;

                    // Loop
                    while (true) {
                        // If over interval
                        if (interval >= render.interval) break;

                        // Square x and y
                        xx = x * x;
                        yy = y * y;

                        // If over the limit
                        if (xx + yy > 4.0) break;

                        // Do calculations
                        xtemp = xx - yy + xAA;
                        y = (2 * x * y) + yAA;
                        x = xtemp;

                        // Increase interval
                        interval++;
                    }

                    // Set color interval
                    colorInterval = interval % render.colorRange;

                    // Add to color totals
                    colorTotalRed += colorPaletteList[colorInterval].red;
                    colorTotalGreen += colorPaletteList[colorInterval].green;
                    colorTotalBlue += colorPaletteList[colorInterval].blue;
                }
            }

            // Set the color of the pixel
            linePixelData.data[pixel * 4] = Math.floor(colorTotalRed / antiAliasingTotal);
            linePixelData.data[(pixel * 4) + 1] = Math.floor(colorTotalGreen / antiAliasingTotal);
            linePixelData.data[(pixel * 4) + 2] = Math.floor(colorTotalBlue / antiAliasingTotal);
            linePixelData.data[(pixel * 4) + 3] = 255;
        }

        // Create result to post back
        const result = {};
        result.done = false;
        result.threadNumber = render.threadNumber;
        result.jobNumber = render.jobNumber;
        result.lineNumber = line;
        result.linePixelData = linePixelData;

        // Post result back
        self.postMessage(result, result.linePixelData);
    }

    // Create result to post back
    const result = {};
    result.done = true;
    result.jobNumber = render.jobNumber;
    result.threadNumber = render.threadNumber;

    // Post final result back
    self.postMessage(result);
};

