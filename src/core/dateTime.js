/**
 * Zebra Blue: zbDateTime
 * @classdesc
 * Gregorian calendar date and time class. Below are some important limitations.
 * <ol>
 * <li>Date ranges from year 1600 to 4000.</li>
 * <li>Works with leap years.</li>
 * <li>Includes time.</li>
 * <li>Does not include leap seconds.</li>
 * <li>No time zones or day light savings.</li>
 * <li>No localization formatting.</li>
 * <li>Is immutable. Once created it can not be changed.</li>
 * </ol>
 */
class zbDateTime {
    /**
     * Create a zbDateTime object with the given year, month, day, hour, minute and second.
     * @param {number} year The year of the date time. Can be any year after 1600 AD and before 4000 AD.
     * @param {number} month The month value of the date time. This can be anything from 1=Jan to 12=Dec.
     * @param {number} day The day value of the date time. Values from 1 to 31 depending on the month and year given.
     * @param {number} hour The hour of the date time. Any value between 0 and 23.
     * @param {number} minute The minute of the date time. This can be 0 to 59.
     * @param {number} second The second of the date time. This can be 0 to 59.
     * @constructor
     */
    constructor(year, month, day, hour, minute, second) {
        // Validate parameters
        zbValidate.isNumberInRange(year, 1600, 4000);
        zbValidate.isNumberInRange(month, 1, 12);
        zbValidate.isNumberInRange(day, 1, 31);
        zbValidate.isNumberInRange(hour, 0, 23);
        zbValidate.isNumberInRange(minute, 0, 59);
        zbValidate.isNumberInRange(second, 0, 59);

        // Validate date
        if (day > zbDateTimeTools.getDaysInMonth(year, month)) throw new Error('Invalid date.');

        // Set members
        this._year = year;
        this._month = month;
        this._day = day;
        this._hour = hour;
        this._minute = minute;
        this._second = second;
    }

    /**
     * The year part of the date time.
     * @type {number}
     */
    get year() {
        // Return the year value
        return this._year;
    }

    /**
     * The month part of the date time.
     * @type {number}
     */
    get month() {
        // Return the month value
        return this._month;
    }

    /**
     * The day part of the date time.
     * @type {number}
     */
    get day() {
        // Return the day value
        return this._day;
    }

    /**
     * The hour part of the date time.
     * @type {number}
     */
    get hour() {
        // Return the hour value
        return this._hour;
    }

    /**
     * The minute part of the date time.
     * @type {number}
     */
    get minute() {
        // Return the minute value
        return this._minute;
    }

    /**
     * The second part of the date time.
     * @type {number}
     */
    get second() {
        // Return the second value
        return this._second;
    }

    /**
     * Convert the date time into a string. Format is YYYY-MM-DD HH:MM:SS.
     * @return {string} The date time formatted as a string.
     * @public
     */
    toString() {
        // Set month text
        let monthText = this._month.toString();
        if (monthText.length === 1) monthText = '0' + monthText;

        // Set day text
        let dayText = this._day.toString();
        if (dayText.length === 1) dayText = '0' + dayText;

        // Set hour text
        let hourText = this._hour.toString();
        if (hourText.length === 1) hourText = '0' + hourText;

        // Set minute text
        let minuteText = this._minute.toString();
        if (minuteText.length === 1) minuteText = '0' + minuteText;

        // Set second text
        let secondText = this._second.toString();
        if (secondText.length === 1) secondText = '0' + secondText;

        // Set the date time text
        const dateTimeText = this._year.toString() + '-' + monthText + '-' + dayText + ' ' + hourText + ':' + minuteText + ':' + secondText;

        // Return the date time text
        return dateTimeText;
    }

    /**
     * Get the date time's day of the year.
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
     * Add the given number of seconds to the current date time and create a new date time object with the resulting date time.
     * The current date time values are not altered.
     * @param {number} seconds The number of seconds to add. The value can be minus to go backwards.
     * @return {zbDateTime} A new zbDateTime object with the resulting date time set.
     * @public
     */
    addSeconds(seconds) {
        // Validate parameter
        zbValidate.isNumber(seconds);

        // Get the total seconds
        let totalSeconds = zbDateTimeTools.getTimeToSeconds(this._hour, this._minute, this._second);

        // Add the seconds to it
        totalSeconds += seconds;

        // Get the time from the total seconds
        const time = zbDateTimeTools.getSecondsToTime(totalSeconds);

        // Create a new zbDateTime object with the new time (same date)
        let dateTime = new zbDateTime(this._year, this._month, this._day, time.hour, time.minute, time.second);

        // If there no days to add then just return the new date time
        if (time.day === 0) return dateTime;

        // Add the days to create the final date time object
        dateTime = dateTime.addDays(time.day);

        // Return the date time object
        return dateTime;
    }

    /**
     * Add the given number of minutes to the current date time and create a new date time object with the resulting date time.
     * The current date time values are not altered.
     * @param {number} minutes The number of minutes to add. The value can be minus to go backwards.
     * @return {zbDateTime} A new zbDateTime object with the resulting date time set.
     * @public
     */
    addMinutes(minutes) {
        // Validate parameter
        zbValidate.isNumber(minutes);

        // Get the total seconds
        let totalSeconds = zbDateTimeTools.getTimeToSeconds(this._hour, this._minute, this._second);

        // Add the minutes to it
        totalSeconds += (minutes * 60);

        // Get the time from the total seconds
        const time = zbDateTimeTools.getSecondsToTime(totalSeconds);

        // Create a new zbDateTime object with the new time (same date)
        let dateTime = new zbDateTime(this._year, this._month, this._day, time.hour, time.minute, time.second);

        // If there no days to add then just return the new date time
        if (time.day === 0) return dateTime;

        // Add the days to create the final date time object
        dateTime = dateTime.addDays(time.day);

        // Return the date time object
        return dateTime;
    }

    /**
     * Add the given number of hours to the current date time and create a new date time object with the resulting date time.
     * The current date time values are not altered.
     * @param {number} hours The number of hours to add. The value can be minus to go backwards.
     * @return {zbDateTime} A new zbDateTime object with the resulting date time set.
     * @public
     */
    addHours(hours) {
        // Validate parameter
        zbValidate.isNumber(hours);

        // Get the total seconds
        let totalSeconds = zbDateTimeTools.getTimeToSeconds(this._hour, this._minute, this._second);

        // Add the hours to it
        totalSeconds += (hours * 60 * 60);

        // Get the time from the total seconds
        const time = zbDateTimeTools.getSecondsToTime(totalSeconds);

        // Create a new zbDateTime object with the new time (same date)
        let dateTime = new zbDateTime(this._year, this._month, this._day, time.hour, time.minute, time.second);

        // If there no days to add then just return the new date time
        if (time.day === 0) return dateTime;

        // Add the days to create the final date time object
        dateTime = dateTime.addDays(time.day);

        // Return the date time object
        return dateTime;
    }

    /**
     * Add the given number of days to the current date time and create a new date time object with the resulting date time.
     * The current date time values are not altered.
     * @param {number} days The number of days to add. The value can be minus to go backwards.
     * @return {zbDateTime} A new zbDateTime object with the resulting date time set. If the resulting date time is out of range then
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

        // Create and return new zbDateTime object with the new date (and same time)
        return new zbDateTime(date.year, date.month, date.day, this._hour, this._minute, this._second);
    }

    /**
     * Add the given number of months to the current date time and create a new date time object with the resulting date time.
     * The current date time values are not altered.
     * @param {number} months The number of months to add. The value can be minus to go backwards.
     * @return {zbDateTime} A new zbDateTime object with the resulting date time set. If the resulting date is out of range then
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

        // Create new zbDateTime object for the new date
        const dateTime = new zbDateTime(year, month, day, this._hour, this._minute, this._second);

        // Return the new zbDateTime object
        return dateTime;
    }

    /**
     * Add the given number of years to the current date time and create a new date time object with the resulting date time.
     * The current date time values are not altered.
     * @param {number} years The number of years to add. The value can be minus to go backwards.
     * @return {zbDateTime} A new zbDateTime object with the resulting date time set. If the resulting date is out of range then
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

        // Create new zbDateTime object for the new date time
        const dateTime = new zbDateTime(year, month, day, this._hour, this._minute, this._second);

        // Return the new zbDateTime object
        return dateTime;
    }

    /**
     * Format the date time using the given format style and culter.
     * @param {string} [format=zbCulture.default.longDateTime] The format style of the date time. If not used then the default long format is used.
     * @param {zbCulture} [culture=zbCulture.default] The culture to use when formatting the date time. If not used then the default culter is used.
     * @return {string} The date time formatted text.
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
            // Format not used therefore use the default long date time format
            format = culture.longDateTime;
        }

        // Get and return the formatted date time
        return zbFormatTools.formatDateTime(format, culture, this);
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
     * Get a new zbDateTime object with the current date and time set. This uses JavaScript's Date object to get
     * todays date and time.
     * @return {zbDateTime} A zbDateTime object with todays date and time set.
     * @public
     * @static
     */
    static getNow() {
        // Get now date and time
        const now = new Date();

        // Create a new zbDateTime with current date and time set
        const nowZbDateTime = new zbDateTime(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());

        // Return the new zbDateTime object
        return nowZbDateTime;
    }

    /**
     * Create a new zbDateTime object using the given string date time.
     * @param {string} value A date time as a string in the format YYYY-MM-DD HH:MM:SS.
     * @return {zbDateTime} A new zbDateTime object with the date set.
     * @public
     * @static
     */
    static fromString(value) {
        // Validate parameter
        zbValidate.isStringInRange(value, 19, 19);

        // Check characters
        if (value.charAt(4) !== '-') throw new Error('Invalid parameter');
        if (value.charAt(7) !== '-') throw new Error('Invalid parameter');
        if (value.charAt(10) !== ' ') throw new Error('Invalid parameter');
        if (value.charAt(13) !== ':') throw new Error('Invalid parameter');
        if (value.charAt(16) !== ':') throw new Error('Invalid parameter');

        // Get year, month and day text parts
        const yearText = value.substr(0, 4);
        const monthText = value.substr(5, 2);
        const dayText = value.substr(8, 2);
        const hourText = value.substr(11, 2);
        const minuteText = value.substr(14, 2);
        const secondText = value.substr(17, 2);

        // Validate text parts
        zbValidate.isStringDigit(yearText);
        zbValidate.isStringDigit(monthText);
        zbValidate.isStringDigit(dayText);
        zbValidate.isStringDigit(hourText);
        zbValidate.isStringDigit(minuteText);
        zbValidate.isStringDigit(secondText);

        // Convert into numbers
        const year = parseInt(yearText);
        const month = parseInt(monthText);
        const day = parseInt(dayText);
        const hour = parseInt(hourText);
        const minute = parseInt(minuteText);
        const second = parseInt(secondText);

        // Create new zbDateTime object using the date time parts
        const dateTime = new zbDateTime(year, month, day, hour, minute, second);

        // Return the new zbDateTime object
        return dateTime;
    }

    /**
     * Compare two date times and return either -1, 0, 1.
     * @param {zbDateTime} dateTime1 The first date time to compare with.
     * @param {zbDateTime} dateTime2 The second date time to compare against.
     * @return {number} -1 if dateTime1 is after dateTime2, +1 if dateTime1 is before dateTime2, and 0 if both date times are the same.
     */
    static compare(dateTime1, dateTime2) {
        // Validate parameters
        if (!(dateTime1 instanceof zbDateTime)) throw new Error('Invalid parameter');
        if (!(dateTime2 instanceof zbDateTime)) throw new Error('Invalid parameter');

        // Compare years
        if (dateTime1.year < dateTime2.year) return -1;
        if (dateTime1.year > dateTime2.year) return 1;

        // Compare months
        if (dateTime1.month < dateTime2.month) return -1;
        if (dateTime1.month > dateTime2.month) return 1;

        // Compare months
        if (dateTime1.day < dateTime2.day) return -1;
        if (dateTime1.day > dateTime2.day) return 1;

        // Compare hours
        if (dateTime1.hour < dateTime2.hour) return -1;
        if (dateTime1.hour > dateTime2.hour) return 1;

        // Compare minutes
        if (dateTime1.minute < dateTime2.minute) return -1;
        if (dateTime1.minute > dateTime2.minute) return 1;

        // Compare seconds
        if (dateTime1.second < dateTime2.second) return -1;
        if (dateTime1.second > dateTime2.second) return 1;

        // Return equal
        return 0;
    }
}
