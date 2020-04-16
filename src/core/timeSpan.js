/**
 * Zebra Blue: zbTimeSpan
 * @classdesc
 * Time span class. Used to workout the difference between to date times.
 * <ol>
 * <li>Records days, hours, minutes and seconds.</li>
 * <li>Does not record milliseconds</li>
 * <li>Does not take time zones or day light savings into account.</li>
 * <li>Values are always positive.</li>
 * <li>Is immutable. Once created it can not be changed.</li>
 * </ol>
 */
class zbTimeSpan {
    /**
     * Create a zbTimeSpan object with the given day, hour, minute and second.
     * @param {number} day The day of the time span. Any value equal to or greater than 0.
     * @param {number} hour The hour of the time span. Any value between 0 and 23.
     * @param {number} minute The minute of the time span. This can be 0 to 59.
     * @param {number} second The second of the time span. This can be 0 to 59.
     * @constructor
     */
    constructor(day, hour, minute, second) {
        // Validate parameters
        zbValidate.isNumber(day);
        if (day < 0) throw new Error('Invalid day');
        zbValidate.isNumberInRange(hour, 0, 23);
        zbValidate.isNumberInRange(minute, 0, 59);
        zbValidate.isNumberInRange(second, 0, 59);

        // Set members
        this._day = day;
        this._hour = hour;
        this._minute = minute;
        this._second = second;
    }

    /**
     * The day part of the time span.
     * @type {number}
     */
    get day() {
        // Return the day value
        return this._day;
    }

    /**
     * The hour part of the time span.
     * @type {number}
     */
    get hour() {
        // Return the hour value
        return this._hour;
    }

    /**
     * The minute part of the time span.
     * @type {number}
     */
    get minute() {
        // Return the minute value
        return this._minute;
    }

    /**
     * The second part of the time span.
     * @type {number}
     */
    get second() {
        // Return the second value
        return this._second;
    }

    /**
     * Convert the time span into a string. Format is D HH:MM:SS.
     * @return {string} The time span formatted as a string.
     * @public
     */
    toString() {
        // Set day text
        const dayText = this._day.toString();

        // Set hour text
        let hourText = this._hour.toString();
        if (hourText.length === 1) hourText = '0' + hourText;

        // Set minute text
        let minuteText = this._minute.toString();
        if (minuteText.length === 1) minuteText = '0' + minuteText;

        // Set second text
        let secondText = this._second.toString();
        if (secondText.length === 1) secondText = '0' + secondText;

        // Set the time span text
        const timeSpanText = dayText + ' ' + hourText + ':' + minuteText + ':' + secondText;

        // Return the time span text
        return timeSpanText;
    }

    /**
     * Get the time span between two date time objects.
     * @param {zbDateTime} dateTime1 The first date time object.
     * @param {zbDateTime} dateTime2 The second date time object.
     * @return {zbTimeSpan} The time span of the difference between the two date time objects.
     * @public
     * @static
     */
    static getTimeSpan(dateTime1, dateTime2) {
        // Get date to days for each date time
        const dateToDays1 = zbDateTimeTools.getDateToDays(dateTime1.year, dateTime1.month, dateTime1.day);
        const dateToDays2 = zbDateTimeTools.getDateToDays(dateTime2.year, dateTime2.month, dateTime2.day);

        // Get the seconds
        let timeToSeconds1 = zbDateTimeTools.getTimeToSeconds(dateTime1.hour, dateTime1.minute, dateTime1.second);
        let timeToSeconds2 = zbDateTimeTools.getTimeToSeconds(dateTime2.hour, dateTime2.minute, dateTime2.second);

        // Compare the two date times
        const result = zbDateTime.compare(dateTime1, dateTime2);

        // Set seconds gap
        let secondsGap = 0;

        // Set days gap
        let daysGap = 0;

        // If date time 1 is greater than date time 2
        if (result > 0) {
            // If time part needs adjustment
            if (timeToSeconds2 > timeToSeconds1) timeToSeconds1 += (24 * 60 * 60);

            // Set seconds gap
            secondsGap = timeToSeconds1 - timeToSeconds2;

            // Set days gap
            daysGap = dateToDays1 - dateToDays2;
        } else {
            // If time part needs adjustment
            if (timeToSeconds1 > timeToSeconds2) timeToSeconds2 += (24 * 60 * 60);

            // Set seconds gap
            secondsGap = timeToSeconds2 - timeToSeconds1;

            // Set days gap
            daysGap = dateToDays2 - dateToDays1;
        }

        // Get the time from the total seconds gap
        const time = zbDateTimeTools.getSecondsToTime(secondsGap);

        // Add time's days to days gap
        daysGap += time.day;

        // Create and return a new time span
        return new zbTimeSpan(daysGap, time.hour, time.minute, time.second);
    }

    /**
     * Get the time span's total number of seconds.
     * @return {number} The total number of second.
     * @public
     */
    getTotalSeconds() {
        // Workout the total seconds
        const totalSeconds = (this._day * 24 * 60 * 60) + (this._hour * 60 * 60) + (this._minute * 60) + this._second;

        // Return the total seconds
        return totalSeconds;
    }
}
