/**
 * Zebra Blue: zbTime
 * @classdesc
 * Time of day class. Only handles hours, minutes and seconds, no milliseconds. Below are some important limitations.
 * <ol>
 * <li>Time is based on the 24 hour clock.</li>
 * <li>Is immutable. Once created it can not be changed.</li>
 * </ol>
 */
class zbTime {
    /**
     * Create a zbTime object with the given hour, minute and second.
     * @param {number} hour The hour of the time. Any value between 0 and 23.
     * @param {number} minute The minute of the time. This can be 0 to 59.
     * @param {number} second The second of the time. This can be 0 to 59.
     * @constructor
     */
    constructor(hour, minute, second) {
        // Validate parameters
        zbValidate.isNumberInRange(hour, 0, 23);
        zbValidate.isNumberInRange(minute, 0, 59);
        zbValidate.isNumberInRange(second, 0, 59);

        // Set members
        this._hour = hour;
        this._minute = minute;
        this._second = second;
    }

    /**
     * The hour part of the time.
     * @type {number}
     */
    get hour() {
        // Return the hour value
        return this._hour;
    }

    /**
     * The minute part of the time.
     * @type {number}
     */
    get minute() {
        // Return the minute value
        return this._minute;
    }

    /**
     * The second part of the time.
     * @type {number}
     */
    get second() {
        // Return the second value
        return this._second;
    }

    /**
     * Convert the time into a string. Format is HH:MM:SS.
     * @return {string} The time formatted as a string.
     * @public
     */
    toString() {
        // Set hour text
        let hourText = this._hour.toString();
        if (hourText.length === 1) hourText = '0' + hourText;

        // Set minute text
        let minuteText = this._minute.toString();
        if (minuteText.length === 1) minuteText = '0' + minuteText;

        // Set second text
        let secondText = this._second.toString();
        if (secondText.length === 1) secondText = '0' + secondText;

        // Set the time text
        const timeText = hourText + ':' + minuteText + ':' + secondText;

        // Return the time text
        return timeText;
    }

    /**
     * Get the time's total number of seconds.
     * @return {number} The total number of second.
     * @public
     */
    getTotalSeconds() {
        // Get and return time to seconds
        return zbDateTimeTools.getTimeToSeconds(this._hour, this._minute, this._second);
    }

    /**
     * Add the given number of seconds to the current time and create a new time object with the resulting time.
     * The current time values are not altered. The time will move into the next/previous day and only the time
     * part is saved. So, 23:59:45 + 30 seconds will end up as 00:00:15.
     * @param {number} seconds The number of seconds to add. The value can be minus to go backwards.
     * @return {zbTime} A new zbTime object with the resulting time set.
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

        // Create and return new zbTime object with the new time
        return new zbTime(time.hour, time.minute, time.second);
    }

    /**
     * Add the given number of minutes to the current time and create a new time object with the resulting time.
     * The current time values are not altered. The time will move into the next/previous day and only the time
     * part is saved. So, 23:45:00 + 20 minutes will end up as 00:05:00.
     * @param {number} minutes The number of minutes to add. The value can be minus to go backwards.
     * @return {zbTime} A new zbTime object with the resulting time set.
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

        // Create and return new zbTime object with the new time
        return new zbTime(time.hour, time.minute, time.second);
    }

    /**
     * Add the given number of hours to the current time and create a new time object with the resulting time.
     * The current time values are not altered. The time will move into the next/previous day and only the time
     * part is saved. So, 23:15:00 + 2 hours will end up as 01:15:00.
     * @param {number} hours The number of hours to add. The value can be minus to go backwards.
     * @return {zbTime} A new zbTime object with the resulting time set.
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

        // Create and return new zbTime object with the new time
        return new zbTime(time.hour, time.minute, time.second);
    }

    /**
     * Format the time using the given format style and culter.
     * @param {string} [format=zbCulture.default.longTime] The format style of the time. If not used then the default long format is used.
     * @param {zbCulture} [culture=zbCulture.default] The culture to use when formatting the time. If not used then the default culter is used.
     * @return {string} The time formatted text.
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
            // Format not used therefore use the default long time format
            format = culture.longTime;
        }

        // Get and return the formatted date time
        return zbFormatTools.formatDateTime(format, culture, this);
    }

    /**
     * Get a new zbTime object with the time right now set. This uses JavaScript's Date object to get
     * the time.
     * @return {zbTime} A zbTime object with the time set.
     * @public
     * @static
     */
    static getNow() {
        // Get today's date and time
        const todayDateTime = new Date();

        // Create a new zbTime using the time now
        const nowZbTime = new zbTime(todayDateTime.getHours(), todayDateTime.getMinutes(), todayDateTime.getSeconds());

        // Return the new zbTime object
        return nowZbTime;
    }

    /**
     * Create a new zbTime object using the given string time.
     * @param {string} value A time as a string in the format HH:MM:SS.
     * @return {zbTime} A new zbTime object with the time set.
     * @public
     * @static
     */
    static fromString(value) {
        // Validate parameter
        zbValidate.isStringInRange(value, 8, 8);

        // Check ':' characters
        if (value.charAt(2) !== ':') throw new Error('Invalid parameter');
        if (value.charAt(5) !== ':') throw new Error('Invalid parameter');

        // Get hour, minute, second text parts
        const hourText = value.substr(0, 2);
        const minuteText = value.substr(3, 2);
        const secondText = value.substr(6, 2);

        // Validate text parts
        zbValidate.isStringDigit(hourText);
        zbValidate.isStringDigit(minuteText);
        zbValidate.isStringDigit(secondText);

        // Convert into numbers
        const hour = parseInt(hourText);
        const minute = parseInt(minuteText);
        const second = parseInt(secondText);

        // Create new zbTime object using the time parts
        const time = new zbTime(hour, minute, second);

        // Return the new zbTime object
        return time;
    }

    /**
     * Compare two times and return either -1, 0, 1.
     * @param {zbTime} time1 The first time to compare with.
     * @param {zbTime} time2 The second time to compare against.
     * @return {number} -1 if time1 is after time2, +1 if time1 is before time2, and 0 if both times are the same.
     */
    static compare(time1, time2) {
        // Validate parameters
        if (!(time1 instanceof zbTime)) throw new Error('Invalid parameter');
        if (!(time2 instanceof zbTime)) throw new Error('Invalid parameter');

        // Compare hours
        if (time1.hour < time2.hour) return -1;
        if (time1.hour > time2.hour) return 1;

        // Compare minutes
        if (time1.minute < time2.minute) return -1;
        if (time1.minute > time2.minute) return 1;

        // Compare seconds
        if (time1.second < time2.second) return -1;
        if (time1.second > time2.second) return 1;

        // Return equal
        return 0;
    }
}
