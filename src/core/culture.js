/**
 * Zebra Blue: zbCulture
 * @classdesc
 * Contains different localization information.
 */
class zbCulture {
    /**
     * Create a zbCulture object with locale related settings.
     * @param {string} code The culture code (en-GB for example).
     * @param {string[]} monthList A list of month names, from January to December.
     * @param {string[]} shortMonthList A list of short month names, from Jan to Dec.
     * @param {string[]} dayOfWeekList A list of days of the week names, from Sunday to Saturday.
     * @param {string[]} shortDayOfWeekList A list of short of days of the week names. from Sun to Sat.
     * @param {string[]} ordinalDayList A list of the st,nd,rd,th parts of the day of the month. Must be 31 items long and in lower case.
     * @param {string} am The AM text.
     * @param {string} pm The PM text.
     * @param {string} longDateTime The long date time format.
     * @param {string} shortDateTime The short date time format.
     * @param {string} longDate The long date format.
     * @param {string} shortDate The short date format.
     * @param {string} longTime The long time format.
     * @param {string} shortTime The short time format.
     * @param {zbDayOfWeek} firstDayOfWeek The first day of the week.
     * @constructor
     */
    constructor(
        code,
        monthList,
        shortMonthList,
        dayOfWeekList,
        shortDayOfWeekList,
        ordinalDayList,
        am,
        pm,
        longDateTime,
        shortDateTime,
        longDate,
        shortDate,
        longTime,
        shortTime,
        firstDayOfWeek) {
        // Validate parameters
        zbValidate.isStringInRange(code, 1, 10);
        zbValidate.isArrayOfStringInRange(monthList, 12, 12);
        zbValidate.isArrayOfStringInRange(shortMonthList, 12, 12);
        zbValidate.isArrayOfStringInRange(dayOfWeekList, 7, 7);
        zbValidate.isArrayOfStringInRange(shortDayOfWeekList, 7, 7);
        zbValidate.isArrayOfStringInRange(ordinalDayList, 31, 31);
        zbValidate.isString(am);
        zbValidate.isString(pm);
        zbValidate.isString(longDateTime);
        zbValidate.isString(shortDateTime);
        zbValidate.isString(longDate);
        zbValidate.isString(shortDate);
        zbValidate.isString(longTime);
        zbValidate.isString(shortTime);
        zbValidate.isNumberInRange(firstDayOfWeek, 0, 6);

        // Set members
        this._code = code;
        this._monthList = monthList;
        this._shortMonthList = shortMonthList;
        this._dayOfWeekList = dayOfWeekList;
        this._shortDayOfWeekList = shortDayOfWeekList;
        this._ordinalDayList = ordinalDayList;
        this._am = am;
        this._pm = pm;
        this._longDateTime = longDateTime;
        this._shortDateTime = shortDateTime;
        this._longDate = longDate;
        this._shortDate = shortDate;
        this._longTime = longTime;
        this._shortTime = shortTime;
        this._firstDayOfWeek = firstDayOfWeek;
    }

    /**
     * Gets the culture's code. This is normally formatted as lanuage-country.
     * @type {string}
     */
    get code() {
        // Return the code
        return this._code;
    }

    /**
     * Gets the list of month names. January is item 0, December is item 11.
     * @type {string[]}
     */
    get monthList() {
        // Return the list of month names
        return this._monthList;
    }

    /**
     * Gets the list of short month names. Jan is item 0, Dec is item 11.
     * @type {string[]}
     */
    get shortMonthList() {
        // Return the list of short month names
        return this._shortMonthList;
    }

    /**
     * Gets the list of day of week names. Sunday is item 0, Saturday is item 6.
     * @type {string[]}
     */
    get dayOfWeekList() {
        // Return the list of day of week names
        return this._dayOfWeekList;
    }

    /**
     * Gets the list of short day of week names. Sun is item 0, Sat is item 6.
     * @type {string[]}
     */
    get shortDayOfWeekList() {
        // Return the list of short day of week names
        return this._shortDayOfWeekList;
    }

    /**
     * Gets the list of the st,nd,rd,th parts of the day of the month.
     * @type {string[]}
     */
    get ordinalDayList() {
        // Return the list of ordinal day parts
        return this._ordinalDayList;
    }

    /**
     * Gets the AM text.
     * @type {string}
     */
    get am() {
        // Return the am text
        return this._am;
    }

    /**
     * Gets the PM text.
     * @type {string}
     */
    get pm() {
        // Return the pm text
        return this._pm;
    }

    /**
     * Gets the format of the long date time.
     * @type {string}
     */
    get longDateTime() {
        // Return the long date time format
        return this._longDateTime;
    }

    /**
     * Gets the format of the short date time.
     * @type {string}
     */
    get shortDateTime() {
        // Return the short date time format
        return this._shortDateTime;
    }

    /**
     * Gets the format of the long date.
     * @type {string}
     */
    get longDate() {
        // Return the long date format
        return this._longDate;
    }

    /**
     * Gets the format of the short date.
     * @type {string}
     */
    get shortDate() {
        // Return the short date format
        return this._shortDate;
    }

    /**
     * Gets the format of the long time.
     * @type {string}
     */
    get longTime() {
        // Return the long time format
        return this._longTime;
    }

    /**
     * Gets the format of the short time.
     * @type {string}
     */
    get shortTime() {
        // Return the short time format
        return this._shortTime;
    }

    /**
     * Gets the first day of the week.
     * @type {zbDayOfWeek}
     */
    get firstDayOfWeek() {
        // Return the first day of the week
        return this._firstDayOfWeek;
    }

    /**
     * Add the given culture to the list of available cultures that can be used.
     * @param {zbCulture} culture The culture to add.
     * @public
     * @static
     */
    static add(culture) {
        // Validate parameter
        if (!(culture instanceof zbCulture)) throw new Error('Parameter is not a zbCulture object');

        // If no list created yet
        if (!zbCulture._cultureList) {
            // Create the static culture list
            zbCulture._cultureList = [];
        }

        // Add culture to the list
        zbCulture._cultureList.push(culture);
    }

    /**
     * Finds the culture from the to the list of available cultures that match the given code.
     * @param {string} code The culture's code to search with.
     * @return {zbCulture} The found culture, or null if not found.
     * @public
     * @static
     */
    static find(code) {
        // Validate parameter
        zbValidate.isStringInRange(code, 1, 10);

        // If no list created yet
        if (!zbCulture._cultureList) return null;

        // For each culture
        for (let index = 0; index < zbCulture._cultureList.length; index++) {
            // Get culture
            const culture = zbCulture._cultureList[index];

            // If not a match
            if (culture.code !== code) continue;

            // Return the found culture
            return culture;
        }

        // Return not found
        return null;
    }

    /**
     * Gets the default culture object.
     * @type {zbCulture}
     * @static
     */
    static get default() {
        // If no default culture found yet
        if (!zbCulture._defaultCulture) {
            // Find and set the default culture
            zbCulture._defaultCulture = zbCulture.find('en-US');
        }

        // Return the default culture
        return zbCulture._defaultCulture;
    }

    /**
     * Set the default culture.
     * @param {zbCulture} value The culture to use as the default one.
     * @type {string}
     * @static
     */
    static set default(value) {
        // Validate parameter
        if (!(value instanceof zbCulture)) throw new Error('Invalid parameter');

        // Set the default culture
        zbCulture._defaultCulture = value;
    }
}
