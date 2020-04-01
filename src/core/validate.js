/**
 * Zebra Blue: zbValidate
 * @classdesc
 * Validate different parameters and there ranges. All functions are static. They all throw an exception if something is not valid.
 * @hideconstructor
 */
class zbValidate {
    /**
     * Is the given parameter a valid number.
     * @param {number} value The parameter value to test.
     * @public
     * @static
     */
    static isNumber(value) {
        // If there is no value
        if (value === undefined) throw new Error('Parameter is missing');

        // If value is null
        if (value === null) throw new Error('Parameter is missing');

        // If value is not a number
        if (typeof value !== 'number') throw new Error('Parameter is not a number');
    }

    /**
     * Is the given parameter a valid number and is it within the given range.
     * @param {number} value The parameter value to test.
     * @param {number} min The minimum range value. The value can be the same as min but not below it.
     * @param {number} max The maximum range value. The value can be the same as max but not above it.
     * @public
     * @static
     */
    static isNumberInRange(value, min, max) {
        // If there is no value
        if (value === undefined) throw new Error('Parameter is missing');

        // If value is null
        if (value === null) throw new Error('Parameter is missing');

        // If value is not a number
        if (typeof value !== 'number') throw new Error('Parameter is not a number');

        // If below the minimum
        if (value < min) throw new Error('Invalid parameter value');

        // If above the maximum
        if (value > max) throw new Error('Invalid parameter value');
    }

    /**
     * Is the given parameter a valid boolean.
     * @param {boolean} value The parameter value to test.
     * @public
     * @static
     */
    static isBoolean(value) {
        // If there is no value
        if (value === undefined) throw new Error('Parameter is missing');

        // If value is null
        if (value === null) throw new Error('Parameter is missing');

        // If value is not a boolean
        if (typeof value !== 'boolean') throw new Error('Parameter is not a boolean');
    }

    /**
     * Is the given parameter a valid string.
     * @param {string} value The parameter value to test.
     * @public
     * @static
     */
    static isString(value) {
        // If there is no value
        if (value === undefined) throw new Error('Parameter is missing');

        // If value is null
        if (value === null) throw new Error('Parameter is missing');

        // If value is not a string
        if (typeof value !== 'string') throw new Error('Parameter is not a string');
    }

    /**
     * Is the given parameter a valid string and is it's length within the given range.
     * @param {string} value The parameter value to test.
     * @param {number} min The minimum range value. The value can be the same as min but not below it.
     * @param {number} max The maximum range value. The value can be the same as max but not above it.
     * @public
     * @static
     */
    static isStringInRange(value, min, max) {
        // If there is no value
        if (value === undefined) throw new Error('Parameter is missing');

        // If value is null
        if (value === null) throw new Error('Parameter is missing');

        // If value is not a string
        if (typeof value !== 'string') throw new Error('Parameter is not a string');

        // If below the minimum
        if (value.length < min) throw new Error('Invalid parameter length');

        // If above the maximum
        if (value.length > max) throw new Error('Invalid parameter length');
    }

    /**
     * Is the given parameter a valid string and does it only contain digits 0-9? It must contain something. An empty string
     * throws an error.
     * @param {string} value The parameter value to test.
     * @public
     * @static
     */
    static isStringDigit(value) {
        // If there is no value
        if (value === undefined) throw new Error('Parameter is missing');

        // If value is null
        if (value === null) throw new Error('Parameter is missing');

        // If value is not a string
        if (typeof value !== 'string') throw new Error('Parameter is not a string');

        // If empty string
        if (value.length === 0) throw new Error('Parameter cannot be empty');

        // For each character
        for (let index = 0; index < value.length; index++) {
            // Get character
            const character = value.charAt(index);

            // If a digit
            if (character >= '0' && character <= '9') continue;

            // This is not a digit
            throw new Error('Parameter is not a digit');
        }
    }

    /**
     * Is the given parameter a valid array of strings and is its length within the given range.
     * @param {string[]} value The parameter value to test.
     * @param {number} min The minimum range value. The value can be the same as min but not below it.
     * @param {number} max The maximum range value. The value can be the same as max but not above it.
     * @public
     * @static
     */
    static isArrayOfStringInRange(value, min, max) {
        // If there is no value
        if (value === undefined) throw new Error('Parameter is missing');

        // If value is null
        if (value === null) throw new Error('Parameter is missing');

        // If the property is not an array
        if (Array.isArray(value) === false) throw new Error('Parameter is not an array');

        // If below the minimum
        if (value.length < min) throw new Error('Invalid parameter length');

        // If above the maximum
        if (value.length > max) throw new Error('Invalid parameter length');

        // Check each array item
        for (let index = 0; index < value.length; index++) {
            // Get array item
            const item = value[index];

            // If there is no item
            if (item === undefined) throw new Error('Parameter array item is missing');

            // If item is null
            if (item === null) throw new Error('Parameter array item is missing');

            // If item is not a string
            if (typeof item !== 'string') throw new Error('Parameter array item is not a string');
        }
    }
}
