/**
 * Zebra Blue: zbTestException
 * @classdesc
 * Tools for testing exceptions are thrown when using invalid parameters.
 * @hideconstructor
 */
class zbTestException {
    /**
     * Test the given static function with the given parameter to make sure it fails as excepted.
     * @param {function} callFunction The function to call.
     * @param {*} parameter The parameter to be passed to the function.
     * @return {boolean} True is passed, False if error found.
     * @public
     * @static
     */
    static invalidStaticParameter(callFunction, parameter) {
        try {
            // Call the function with the parameter
            callFunction(parameter);
        } catch (error) {
            // Return good, there was an expection
            return true;
        }

        // Return failed
        return false;
    }

    /**
     * Test the given static function with the given parameters to make sure it fails as excepted.
     * @param {function} callFunction The function to call.
     * @param {*} parameter1 The first parameter to be passed to the function.
     * @param {*} parameter2 The second parameter to be passed to the function.
     * @return {boolean} True is passed, False if error found.
     * @public
     * @static
     */
    static invalidStaticParameter2(callFunction, parameter1, parameter2) {
        try {
            // Call the function with the parameters
            callFunction(parameter1, parameter2);
        } catch (error) {
            // Return good, there was an expection
            return true;
        }

        // Return failed
        return false;
    }

    /**
     * Test the given function with the given parameters to make sure it fails as excepted.
     * @param {function} callFunction The function to call.
     * @param {*} parameter1 The first parameter to be passed to the function.
     * @param {*} parameter2 The second parameter to be passed to the function.
     * @param {*} parameter3 The third parameter to be passed to the function.
     * @return {boolean} True is passed, False if error found.
     * @public
     * @static
     */
    static invalidStaticParameter3(callFunction, parameter1, parameter2, parameter3) {
        try {
            // Call the function with the parameters
            callFunction(parameter1, parameter2, parameter3);
        } catch (error) {
            // Return good, there was an expection
            return true;
        }

        // Return failed
        return false;
    }

    /**
     * Test the given object's function with the given parameter to make sure it fails as excepted.
     * @param {object} object The object we are going to call a function in.
     * @param {string} functionName The name of the function to call.
     * @param {*} parameter The parameter to be passed to the function.
     * @return {boolean} True is passed, False if error found.
     * @public
     * @static
     */
    static invalidObjectParameter(object, functionName, parameter) {
        try {
            // Call the function with the parameter
            object[functionName](parameter);
        } catch (error) {
            // Return good, there was an expection
            return true;
        }

        // Return failed
        return false;
    }

    /**
     * Test the given object's function with the given parameters to make sure it fails as excepted.
     * @param {object} object The object we are going to call a function in.
     * @param {string} functionName The name of the function to call.
     * @param {*} parameter1 The first parameter to be passed to the function.
     * @param {*} parameter2 The second parameter to be passed to the function.
     * @return {boolean} True is passed, False if error found.
     * @public
     * @static
     */
    static invalidObjectParameter2(object, functionName, parameter1, parameter2) {
        try {
            // Call the function with the parameters
            object[functionName](parameter1, parameter2);
        } catch (error) {
            // Return good, there was an expection
            return true;
        }

        // Return failed
        return false;
    }
}
