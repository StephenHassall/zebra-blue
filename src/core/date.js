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
        if (day > zbDate._getDaysInMonth(year, month)) throw new Error('Invalid date.');

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
        // Set day of year
        let dayOfYear = 0;

        // For each month before the current one
        for (let month = 1; month < this._month; month++) dayOfYear += zbDate._getDaysInMonth(this._year, month);

        // Add this month's days to the total
        dayOfYear += this._day;

        // Return the day of year
        return dayOfYear;
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
        // Use Carl Friedrich Gauss algorithm to calculate the day of the week

        // Set month table
        const monthTable = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];

        // Set year adjustment
        let yearAdjustment = 0;
        if (this._month < 3) yearAdjustment = 1;

        // Set the year part
        const year = this._year - yearAdjustment;

        // Set the different parts
        const part1 = year;
        const part2 = Math.floor(year / 4);
        const part3 = Math.floor(year / 100);
        const part4 = Math.floor(year / 400);
        const part5 = monthTable[this._month - 1];
        const part6 = this._day;

        // Put the parts together to make the total
        const total = part1 + part2 - part3 + part4 + part5 + part6;

        // Workout the final day of week value
        const dayOfWeek = total % 7;

        // Return the day of week value
        return dayOfWeek;
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
        // Validate parameters
        zbValidate.isNumber(days);

        // Get day to current date
        let daysToDate = zbDate._getDateToDays(this._year, this._month, this._day);

        // Add days to amount
        daysToDate += days;

        // Convert the new days to date into a date object
        const date = zbDate._getDaysToDate(daysToDate);

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
        // Validate parameters
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
        const daysInMonth = zbDate._getDaysInMonth(year, month);

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
        // Validate parameters
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
            if (zbDate._isLeapYear(year) === false) day = 28;
        }

        // Create new zbDate object for the new year
        const date = new zbDate(year, month, day);

        // Return the new zbDate object
        return date;
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
        return zbDate._isLeapYear(year);
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
        return zbDate._getDaysInMonth(year, month);
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

        // If leap year then return 366 days
        if (zbDate._isLeapYear(year) === true) return 366;

        // Otherwise return 365 days
        return 365;
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
     * Compare two dates and returns either -1, 0, 1.
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

    /**
     * Get the number of days in a month. This can depend on the year. February can have 28 or 29 days if it is a leap year.
     * @param {number} year The year part to workout the days in a month.
     * @param {number} month The month to find out the number of days in.
     * @return {number} The number of days in the given month.
     * @private
     * @static
     */
    static _getDaysInMonth(year, month) {
        // If February
        if (month === 2) {
            // If leap year
            if (zbDate._isLeapYear(year) === true) return 29;

            // Return 28 days
            return 28;
        }

        // If 30 day month
        if (month === 4 || month === 6 || month === 9 || month === 11) return 30;

        // Otherwise this month contains 31 days
        return 31;
    }

    /**
     * Is the given year a leap year?
     * @param {number} year The year to check against.
     * @return {boolean} True if the given year is a leap year, false if it is not a leap year.
     * @private
     * @static
     */
    static _isLeapYear(year) {
        // If not divisable by 4
        if (year % 4 !== 0) return false;

        // If not divisable by 100
        if (year % 100 !== 0) return true;

        // If not divisable by 400
        if (year % 400 !== 0) return false;

        // Must be a leap year
        return true;
    }

    /**
     * Get the number of leap years there have been since year 1 to the given year.
     * @param {number} year The year we want the leap year count up to.
     * @return {number} The number of leap years there has been.
     * @private
     * @static
     */
    static _getLeapYearCount(year) {
        // Set how many years are divisible by 4 (these are leap years, sort of)
        const divisibleBy4 = Math.floor(year / 4);

        // Set how many years are divisible by 100 (these are not leap years)
        const divisibleBy100 = Math.floor(year / 100);

        // Set how many years are divisible by 400 (these are leap years)
        const divisibleBy400 = Math.floor(year / 400);

        // Set how many leap years have there been
        const leapYears = divisibleBy4 - divisibleBy100 + divisibleBy400;

        // Return the number of leap years
        return leapYears;
    }

    /**
     * Get the total number of days from year 1, month 1, day 1, of the given date.
     * @param {number} year The year part of the date. Cannot be zero.
     * @param {number} month The month part of the date (1 to 12).
     * @param {number} day The day part of the date.
     * @return {number} The total number of days since day 1 year 1 AD.
     * @private
     * @static
     */
    static _getDateToDays(year, month, day) {
        // Set day of year
        let dayOfYear = 0;

        // For each month
        for (let monthCount = 1; monthCount < month; monthCount++) dayOfYear += zbDate._getDaysInMonth(year, monthCount);

        // Add the month's days to the total
        dayOfYear += day;

        // Get leap year count
        const leapYears = zbDate._getLeapYearCount(year - 1);

        // Set total days
        const totalDays = ((year - 1) * 365) + leapYears + dayOfYear;

        // Return the total days
        return totalDays;
    }

    /**
     * Get a date from the total number of days from year 1, month 1, day 1.
     * @param {number} days The total number of days to convert into a date.
     * @return {object} An object with year, month and day parts set to the worked out date.
     * @private
     * @static
     */
    static _getDaysToDate(days) {
        // Estimate the number of years
        let year = Math.floor((days - 1) / 365) + 1;

        // Set days left
        let daysLeft = days;

        // Loop until we get the right year
        while (true) {
            // Get the number of leap years
            const leapYears = zbDate._getLeapYearCount(year - 1);

            // Set total days for the year
            const totalDaysForYear = ((year - 1) * 365) + leapYears;

            // Workout the days left
            daysLeft = days - totalDaysForYear;

            // Set days in year
            let daysInYear = 365;
            if (zbDate._isLeapYear(year) === true) daysInYear = 366;

            // If more days than there are in the year
            if (daysLeft > daysInYear) {
                // Increase the year by one and have another go
                year++;
                continue;
            }

            // If we have gone too far
            if (daysLeft <= 0) {
                // Decrease the year by one and have another go
                year--;
                continue;
            }

            // This is the year we are looking for
            break;
        }

        // Set month and day
        let month = 1;
        let day = 1;

        // For each month
        for (let monthCount = 1; monthCount <= 12; monthCount++) {
            // Get days in month
            const daysInMonth = zbDate._getDaysInMonth(year, monthCount);

            // If days left are over the days in this month
            if (daysLeft > daysInMonth) {
                // Decrease the days left by days in this month
                daysLeft -= daysInMonth;
            } else {
                // Set month, day and stop looking
                month = monthCount;
                day = daysLeft;
                break;
            }
        }

        // Create date object with results
        const date = {
            year: year,
            month: month,
            day: day
        };

        // Return date object
        return date;
    }
}
