/**
 * Zebra Blue: zbDate
 * @classdesc
 * Gregorian calendar date class. Below are some important limitations.
 * <ol>
 * <li>Date ranges from year 1600 to 4000.</li>
 * <li>Works with leap years.</li>
 * <li>No time.</li>
 * <li>No time zones or day light savings.</li>
 * <li>No localization formatting.</li>
 * <li>Is immutable. Once created it can not be changed.</li>
 * </ol>
 */
class zbDate {
    /**
     * Create a zbDate object with the given year, month and day.
     * @param {number} year The year of the date. Can be any year after 1600 AD and before 4000 AD.
     * @param {number} month The month value of the date. This can be anything from 1=Jan to 12=Dec.
     * @param {number} day The day value of the date. Values from 1 to 31 depending on the month and year given.
     * @constructor
     */
    constructor(year, month, day) {
        // Validate parameters
        zbValidate.isNumberInRange(year, 1600, 4000);
        zbValidate.isNumberInRange(month, 1, 12);
        zbValidate.isNumberInRange(day, 1, 31);

        // Validate date
        if (day > zbDateTimeTools.getDaysInMonth(year, month)) throw new Error('Invalid date.');

        // Set members
        this._year = year;
        this._month = month;
        this._day = day;
    }

    /**
     * The year part of the date.
     * @type {number}
     */
    get year() {
        // Return the year value
        return this._year;
    }

    /**
     * The month part of the date.
     * @type {number}
     */
    get month() {
        // Return the month value
        return this._month;
    }

    /**
     * The day part of the date.
     * @type {number}
     */
    get day() {
        // Return the day value
        return this._day;
    }

    /**
     * Convert the date into a string. Format is YYYY-MM-DD.
     * @return {string} The date formatted as a string.
     * @public
     */
    toString() {
        // Set month text
        let monthText = this._month.toString();
        if (monthText.length === 1) monthText = '0' + monthText;

        // Set day text
        let dayText = this._day.toString();
        if (dayText.length === 1) dayText = '0' + dayText;

        // Set the date text
        const dateText = this._year.toString() + '-' + monthText + '-' + dayText;

        // Return the date text
        return dateText;
    }

    /**
     * Get the date's day of the year.
     * @return {number} The day of the year.
     * @public
     */
    getDayOfYear() {
        // Get and return the day of year for the current date
        return zbDateTimeTools.getDayOfYear(this._year, this._month, this._day);
    }

    /**
     * Get the day of the week. Values are as follows
     *  0 = Sunday
     *  1 = Monday
     *  2 = Tuesday
     *  3 = Wednesday
     *  4 = Thursday
     *  5 = Friday
     *  6 = Saturday
     * @return {zbDayOfWeek} The day of the week.
     * @public
     */
    getDayOfWeek() {
        // Get and return the day of week for the current date
        return zbDateTimeTools.getDayOfWeek(this._year, this._month, this._day);
    }

    /**
     * Add the given number of days to the current date and create a new date object with the resulting date.
     * The current date values are not altered.
     * @param {number} days The number of days to add. The value can be minus to go backwards.
     * @return {zbDate} A new zbDate object with the resulting date set. If the resulting date is out of range then
     * null is returned.
     * @public
     */
    addDays(days) {
        // Validate parameter
        zbValidate.isNumber(days);

        // Get day to current date
        let daysToDate = zbDateTimeTools.getDateToDays(this._year, this._month, this._day);

        // Add days to amount
        daysToDate += days;

        // Convert the new days to date into a date object
        const date = zbDateTimeTools.getDaysToDate(daysToDate);

        // Check limits
        if (date.year < 1600 || date.year > 4000) return null;

        // Create and return new zbDate object with the new date
        return new zbDate(date.year, date.month, date.day);
    }

    /**
     * Add the given number of months to the current date and create a new date object with the resulting date.
     * The current date values are not altered.
     * @param {number} months The number of months to add. The value can be minus to go backwards.
     * @return {zbDate} A new zbDate object with the resulting date set. If the resulting date is out of range then
     * null is returned. If the day is on the 31st of the month and the new month only has 30 or less days, then the
     * day part will be moved to the last day of the month.
     * @public
     */
    addMonths(months) {
        // Validate parameter
        zbValidate.isNumber(months);

        // Set adjustment
        let adjustment = 1;
        if (months < 0) adjustment = -1;

        // Set absolute months value
        months = Math.abs(months);

        // Workout the number of years and months
        const addYears = Math.floor(months / 12);
        const addMonths = months % 12;

        // Set year
        let year = this._year;

        // If add years exist
        if (addYears !== 0) {
            // Workout the new year
            year = this._year + (addYears * adjustment);

            // If new year out of range
            if (year < 1600) return null;
            if (year > 4000) return null;
        }

        // Workout the new month
        let month = this._month + (addMonths * adjustment);
        if (month <= 0) {
            year--;
            month += 12;
        } else if (month > 12) {
            year++;
            month -= 12;
        }

        // Get days in month
        const daysInMonth = zbDateTimeTools.getDaysInMonth(year, month);

        // Set new day
        let day = this._day;

        // If new day is over the days in the month then move the day to the end of the month
        if (day > daysInMonth) day = daysInMonth;

        // Create new zbDate object for the new year
        const date = new zbDate(year, month, day);

        // Return the new zbDate object
        return date;
    }

    /**
     * Add the given number of years to the current date and create a new date object with the resulting date.
     * The current date values are not altered.
     * @param {number} years The number of years to add. The value can be minus to go backwards.
     * @return {zbDate} A new zbDate object with the resulting date set. If the resulting date is out of range then
     * null is returned. If the date is 29th of February and the resulting year is not on a leap year, then the day
     * part will be moved to the 28th.
     * @public
     */
    addYears(years) {
        // Validate parameter
        zbValidate.isNumber(years);

        // Workout the new year
        const year = this._year + years;

        // If new year out of range
        if (year < 1600) return null;
        if (year > 4000) return null;

        // Set month and day parts
        const month = this._month;
        let day = this._day;

        // If on the 29th of February
        if (this._month === 2 && this._day === 29) {
            // If the new year is not on a leap then move the day to the 28th
            if (zbDateTimeTools.isLeapYear(year) === false) day = 28;
        }

        // Create new zbDate object for the new year
        const date = new zbDate(year, month, day);

        // Return the new zbDate object
        return date;
    }

    /**
     * Format the date using the given format style and culter.
     * @param {string} [format=zbCulture.default.longDate] The format style of the date. If not used then the default long format is used.
     * @param {zbCulture} [culture=zbCulture.default] The culture to use when formatting the date. If not used then the default culter is used.
     * @return {string} The formatted date text.
     */
    format(format, culture) {
        // Check culture
        if (culture !== undefined) {
            // Validate parameter
            if (!(culture instanceof zbCulture)) throw new Error('Invalid parameter');
        } else {
            // Culture not used therefore use the default one
            culture = zbCulture.default;
        }

        // Check format
        if (format !== undefined) {
            // Validate parameter
            zbValidate.isString(format);
        } else {
            // Format not used therefore use the default long date format
            format = culture.longDate;
        }

        // Get and return the formatted date
        return zbFormatTools.formatDate(format, culture, this);
    }

    /**
     * Is the given year a leap year?
     * @param {number} year The year to check against.
     * @return {boolean} True if the given year is a leap year, false if it is not a leap year.
     * @public
     * @static
     */
    static isLeapYear(year) {
        // Validate parameter
        zbValidate.isNumberInRange(year, 1600, 4000);

        // Get and return if the year is a leap year
        return zbDateTimeTools.isLeapYear(year);
    }

    /**
     * Get the number of days in a month. This can depend on the year. February can have 28 or 29 days if it is a leap year.
     * @param {number} year The year part to workout the days in a month.
     * @param {number} month The month to find out the number of days in.
     * @return {number} The number of days in the given month.
     * @public
     * @static
     */
    static getDaysInMonth(year, month) {
        // Validate parameters
        zbValidate.isNumberInRange(year, 1600, 4000);
        zbValidate.isNumberInRange(month, 1, 12);

        // Get and return the day in month
        return zbDateTimeTools.getDaysInMonth(year, month);
    }

    /**
     * Get the number of days in the given year. This can depend on the year. Leap years have 366 days instead of 365.
     * @param {number} year The year to get the number of days for.
     * @return {number} The number of days in the given year.
     * @public
     * @static
     */
    static getDaysInYear(year) {
        // Validate parameter
        zbValidate.isNumberInRange(year, 1600, 4000);

        // Get and return the days in the given year
        return zbDateTimeTools.getDaysInYear(year);
    }

    /**
     * Get a new zbDate object with todays date set. This uses JavaScript's Date object to get
     * todays date.
     * @return {zbDate} A zbDate object with todays date set.
     * @public
     * @static
     */
    static getToday() {
        // Get today's date
        const todayDate = new Date();

        // Create a new zbDate with today's date
        const todayZbDate = new zbDate(todayDate.getFullYear(), todayDate.getMonth() + 1, todayDate.getDate());

        // Return the new zbDate object
        return todayZbDate;
    }

    /**
     * Create a new zbDate object using the given string date.
     * @param {string} value A date as a string in the format YYYY-MM-DD.
     * @return {zbDate} A new zbDate object with the date set.
     * @public
     * @static
     */
    static fromString(value) {
        // Validate parameter
        zbValidate.isStringInRange(value, 10, 10);

        // Check '-' characters
        if (value.charAt(4) !== '-') throw new Error('Invalid parameter');
        if (value.charAt(7) !== '-') throw new Error('Invalid parameter');

        // Get year, month and day text parts
        const yearText = value.substr(0, 4);
        const monthText = value.substr(5, 2);
        const dayText = value.substr(8, 2);

        // Validate text parts
        zbValidate.isStringDigit(yearText);
        zbValidate.isStringDigit(monthText);
        zbValidate.isStringDigit(dayText);

        // Convert into numbers
        const year = parseInt(yearText);
        const month = parseInt(monthText);
        const day = parseInt(dayText);

        // Create new zbDate object using the date parts
        const date = new zbDate(year, month, day);

        // Return the new zbDate object
        return date;
    }

    /**
     * Compare two dates and return either -1, 0, 1.
     * @param {zbDate} date1 The first date to compare with.
     * @param {zbDate} date2 The second date to compare against.
     * @return {number} -1 if date1 is after date2, +1 if date1 is before date2, and 0 if both dates are the same.
     */
    static compare(date1, date2) {
        // Validate parameters
        if (!(date1 instanceof zbDate)) throw new Error('Invalid parameter');
        if (!(date2 instanceof zbDate)) throw new Error('Invalid parameter');

        // Compare years
        if (date1.year < date2.year) return -1;
        if (date1.year > date2.year) return 1;

        // Compare months
        if (date1.month < date2.month) return -1;
        if (date1.month > date2.month) return 1;

        // Compare months
        if (date1.day < date2.day) return -1;
        if (date1.day > date2.day) return 1;

        // Return equal
        return 0;
    }
}
