/**
 * Zebra Blue: zbValidateTest
 * @classdesc
 * Unit testing the zbValidate class.
 * @hideconstructor
 */
class zbValidateTest {
    /**
     * Run the zbValidate tests.
     * @public
     * @static
     */
    static run() {
        // Perform each test
        if (zbValidateTest._isNumber() === false) { console.log('zbValidateTest.isNumber FAILED'); return; }
        if (zbValidateTest._isNumberInRange() === false) { console.log('zbValidateTest.isNumberInRange FAILED'); return; }
        if (zbValidateTest._isBoolean() === false) { console.log('zbValidateTest.isBoolean FAILED'); return; }
        if (zbValidateTest._isString() === false) { console.log('zbValidateTest.isString FAILED'); return; }
        if (zbValidateTest._isStringInRange() === false) { console.log('zbValidateTest.isStringInRange FAILED'); return; }
        if (zbValidateTest._isStringDigit() === false) { console.log('zbValidateTest.isStringDigit FAILED'); return; }
    }

    /**
     * Test the given function with the given parameter to make sure it fails as excepted
     * and throw an error with the matching error message.
     * @param {function} callFunction The function to call.
     * @param {*} parameter The parameter to be passed to the function.
     * @param {string} errorMessage The error message to compare to the one the function throws.
     * @return {boolean} True is passed, False if error found.
     * @private
     * @static
     */
    static _invalidParameterWithMessage(callFunction, parameter, errorMessage) {
        try {
            // Call the function with the parameter
            callFunction(parameter);
        } catch (error) {
            // If error message does not match
            if (error.message !== errorMessage) return false;

            // Return good, there was an expection and the error message matched
            return true;
        }

        // Return failed
        return false;
    }

    /**
     * Test the given function with the given parameters to make sure it fails as excepted
     * and throw an error with the matching error message.
     * @param {function} callFunction The function to call.
     * @param {*} parameter1 The first parameter to be passed to the function.
     * @param {*} parameter2 The second parameter to be passed to the function.
     * @param {*} parameter3 The third parameter to be passed to the function.
     * @param {string} errorMessage The error message to compare to the one the function throws.
     * @return {boolean} True is passed, False if error found.
     * @private
     * @static
     */
    static _invalidParameter3WithMessage(callFunction, parameter1, parameter2, parameter3, errorMessage) {
        try {
            // Call the function with the parameters
            callFunction(parameter1, parameter2, parameter3);
        } catch (error) {
            // If error message does not match
            if (error.message !== errorMessage) return false;

            // Return good, there was an expection and the error message matched
            return true;
        }

        // Return failed
        return false;
    }

    /**
     * Perform the isNumber tests.
     * @return {boolean} True if passed, False if error found.
     * @private
     * @static
     */
    static _isNumber() {
        // Test invalid parameters
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isNumber, undefined, 'Parameter is missing') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isNumber, null, 'Parameter is missing') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isNumber, 'string', 'Parameter is not a number') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isNumber, false, 'Parameter is not a number') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isNumber, true, 'Parameter is not a number') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isNumber, {}, 'Parameter is not a number') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isNumber, [], 'Parameter is not a number') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isNumber, function() {}, 'Parameter is not a number') === false) return false;

        // Test valid parameters
        try {
            // Should not throw an exception for these parameters
            zbValidate.isNumber(-1);
            zbValidate.isNumber(0);
            zbValidate.isNumber(1);
            zbValidate.isNumber(1.23);
            let number = 123;
            zbValidate.isNumber(number);
            number = -456.78;
            zbValidate.isNumber(number);
        } catch (error) {
            // Return failed
            return false;
        }

        // Return passed
        return true;
    }

    /**
     * Perform the isNumberInRange tests.
     * @return {boolean} True if passed, False if error found.
     * @private
     * @static
     */
    static _isNumberInRange() {
        // Test invalid parameters
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isNumberInRange, undefined, 0, 0, 'Parameter is missing') === false) return false;
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isNumberInRange, null, 0, 0, 'Parameter is missing') === false) return false;
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isNumberInRange, 'string', 0, 0, 'Parameter is not a number') === false) return false;
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isNumberInRange, false, 0, 0, 'Parameter is not a number') === false) return false;
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isNumberInRange, true, 0, 0, 'Parameter is not a number') === false) return false;
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isNumberInRange, {}, 0, 0, 'Parameter is not a number') === false) return false;
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isNumberInRange, [], 0, 0, 'Parameter is not a number') === false) return false;
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isNumberInRange, function() {}, 0, 0, 'Parameter is not a number') === false) return false;

        // Test invalid range
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isNumberInRange, -1, 0, 1, 'Invalid parameter value') === false) return false;
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isNumberInRange, -1, 1, 2, 'Invalid parameter value') === false) return false;
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isNumberInRange, -20, -19, 3, 'Invalid parameter value') === false) return false;
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isNumberInRange, 1, 2, 3, 'Invalid parameter value') === false) return false;
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isNumberInRange, 20, 21, 23, 'Invalid parameter value') === false) return false;
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isNumberInRange, 3, 1, 2, 'Invalid parameter value') === false) return false;
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isNumberInRange, 20, 1, 19, 'Invalid parameter value') === false) return false;
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isNumberInRange, -20, -100, -21, 'Invalid parameter value') === false) return false;

        // Test valid parameters
        try {
            // Should not throw an exception for these parameters
            zbValidate.isNumberInRange(1, 1, 1);
            zbValidate.isNumberInRange(1, 1, 2);
            zbValidate.isNumberInRange(1, 0, 1);
            zbValidate.isNumberInRange(1, 0, 2);
            zbValidate.isNumberInRange(-1, -1, -1);
            zbValidate.isNumberInRange(-2, -2, -1);
            zbValidate.isNumberInRange(-2, -3, -2);
            zbValidate.isNumberInRange(0.5, 0, 1);
            let numberValue = 10;
            let numberMin = 5;
            let numberMax = 15;
            zbValidate.isNumberInRange(numberValue, numberMin, numberMax);
            numberValue = -12.34;
            numberMin = -20.45;
            numberMax = -10.56;
            zbValidate.isNumberInRange(numberValue, numberMin, numberMax);
        } catch (error) {
            // Return failed
            return false;
        }

        // Return passed
        return true;
    }

    /**
     * Perform the isBoolean tests.
     * @return {boolean} True if passed, False if error found.
     * @private
     * @static
     */
    static _isBoolean() {
        // Test invalid parameters
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isBoolean, undefined, 'Parameter is missing') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isBoolean, null, 'Parameter is missing') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isBoolean, 123, 'Parameter is not a boolean') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isBoolean, 123.45, 'Parameter is not a boolean') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isBoolean, 'string', 'Parameter is not a boolean') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isBoolean, {}, 'Parameter is not a boolean') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isBoolean, [], 'Parameter is not a boolean') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isBoolean, function() {}, 'Parameter is not a boolean') === false) return false;

        // Test valid parameters
        try {
            // Should not throw an exception for these parameters
            zbValidate.isBoolean(true);
            zbValidate.isBoolean(false);
            let boolean = true;
            zbValidate.isBoolean(boolean);
            boolean = false;
            zbValidate.isBoolean(boolean);
        } catch (error) {
            // Return failed
            return false;
        }

        // Return passed
        return true;
    }

    /**
     * Perform the isString tests.
     * @return {boolean} True if passed, False if error found.
     * @private
     * @static
     */
    static _isString() {
        // Test invalid parameters
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isString, undefined, 'Parameter is missing') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isString, null, 'Parameter is missing') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isString, 12.34, 'Parameter is not a string') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isString, false, 'Parameter is not a string') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isString, true, 'Parameter is not a string') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isString, {}, 'Parameter is not a string') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isString, [], 'Parameter is not a string') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isString, function() {}, 'Parameter is not a string') === false) return false;

        // Test valid parameters
        try {
            // Should not throw an exception for these parameters
            zbValidate.isString('');
            zbValidate.isString('1');
            zbValidate.isString(' ');
            zbValidate.isString('abcdefg');
            let string = '';
            zbValidate.isString(string);
            string = '  hello  ';
            zbValidate.isString(string);
        } catch (error) {
            // Return failed
            return false;
        }

        // Return passed
        return true;
    }

    /**
     * Perform the isStringInRange tests.
     * @return {boolean} True if passed, False if error found.
     * @private
     * @static
     */
    static _isStringInRange() {
        // Test invalid parameters
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isStringInRange, undefined, 0, 0, 'Parameter is missing') === false) return false;
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isStringInRange, null, 0, 0, 'Parameter is missing') === false) return false;
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isStringInRange, 12.34, 0, 0, 'Parameter is not a string') === false) return false;
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isStringInRange, false, 0, 0, 'Parameter is not a string') === false) return false;
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isStringInRange, true, 0, 0, 'Parameter is not a string') === false) return false;
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isStringInRange, {}, 0, 0, 'Parameter is not a string') === false) return false;
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isStringInRange, [], 0, 0, 'Parameter is not a string') === false) return false;
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isStringInRange, function() {}, 0, 0, 'Parameter is not a string') === false) return false;

        // Test invalid range
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isStringInRange, '', 1, 1, 'Invalid parameter length') === false) return false;
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isStringInRange, 'x', 2, 3, 'Invalid parameter length') === false) return false;
        if (zbValidateTest._invalidParameter3WithMessage(zbValidate.isStringInRange, 'abcdef', 2, 3, 'Invalid parameter length') === false) return false;

        // Test valid parameters
        try {
            // Should not throw an exception for these parameters
            zbValidate.isStringInRange('', 0, 0);
            zbValidate.isStringInRange('', 0, 1);
            zbValidate.isStringInRange('x', 1, 1);
            zbValidate.isStringInRange('x', 0, 1);
            zbValidate.isStringInRange('x', 0, 2);
            zbValidate.isStringInRange('x', 1, 2);
            zbValidate.isStringInRange('abc', 0, 5);
            zbValidate.isStringInRange('abc', 3, 3);
            zbValidate.isStringInRange('abc', 1, 3);
            zbValidate.isStringInRange('abc', 1, 4);
            let stringValue = 'abcdef';
            let stringMin = 5;
            let stringMax = 15;
            zbValidate.isStringInRange(stringValue, stringMin, stringMax);
            stringValue = 'xyz';
            stringMin = 3;
            stringMax = 4;
            zbValidate.isStringInRange(stringValue, stringMin, stringMax);
        } catch (error) {
            // Return failed
            return false;
        }

        // Return passed
        return true;
    }

    /**
     * Perform the isStringDigit tests.
     * @return {boolean} True if passed, False if error found.
     * @private
     * @static
     */
    static _isStringDigit() {
        // Test invalid parameters
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isStringDigit, undefined, 'Parameter is missing') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isStringDigit, null, 'Parameter is missing') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isStringDigit, 12.34, 'Parameter is not a string') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isStringDigit, false, 'Parameter is not a string') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isStringDigit, true, 'Parameter is not a string') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isStringDigit, {}, 'Parameter is not a string') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isStringDigit, [], 'Parameter is not a string') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isStringDigit, function() {}, 'Parameter is not a string') === false) return false;

        // Test invalid values
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isStringDigit, '', 'Parameter cannot be empty') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isStringDigit, 'abc', 'Parameter is not a digit') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isStringDigit, '1abc', 'Parameter is not a digit') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isStringDigit, 'a1b2c', 'Parameter is not a digit') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isStringDigit, 'abc1', 'Parameter is not a digit') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isStringDigit, '-1', 'Parameter is not a digit') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isStringDigit, '1234h567890', 'Parameter is not a digit') === false) return false;
        if (zbValidateTest._invalidParameterWithMessage(zbValidate.isStringDigit, ' ', 'Parameter is not a digit') === false) return false;

        // Test valid parameters
        try {
            // Should not throw an exception for these parameters
            zbValidate.isStringDigit('0');
            zbValidate.isStringDigit('01234567890');
            zbValidate.isStringDigit('000000');
            zbValidate.isStringDigit('111111');
            const string = '1234567890';
            zbValidate.isStringDigit(string);
        } catch (error) {
            // Return failed
            return false;
        }

        // Return passed
        return true;
    }
}
