/**
 * Zebra Blue: zbDateTimeTools
 * @classdesc
 * Internal date time tools. Used privately by other ZB classes.
 * @hideconstructor
 */
class zbDateTimeTools {
    /**
     * Get the given date's day of the year.
     * @param {number} year The year value of the date.
     * @param {number} month The month value of the date (1 to 12).
     * @param {number} day The day value of the date.
     * @return {number} The day of the year.
     * @public
     * @static
     */
    static getDayOfYear(year, month, day) {
        // Set day of year
        let dayOfYear = 0;

        // For each month before the given one
        for (let monthCount = 1; monthCount < month; monthCount++) dayOfYear += zbDateTimeTools.getDaysInMonth(year, monthCount);

        // Add this month's days to the total
        dayOfYear += day;

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
     * @param {number} year The year value of the date.
     * @param {number} month The month value of the date (1 to 12).
     * @param {number} day The day value of the date.
     * @return {zbDayOfWeek} The day of the week.
     * @public
     * @static
     */
    static getDayOfWeek(year, month, day) {
        // Use Carl Friedrich Gauss algorithm to calculate the day of the week

        // Set month table
        const monthTable = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];

        // Set year adjustment
        let yearAdjustment = 0;
        if (month < 3) yearAdjustment = 1;

        // Set the year part
        year = year - yearAdjustment;

        // Set the different parts
        const part1 = year;
        const part2 = Math.floor(year / 4);
        const part3 = Math.floor(year / 100);
        const part4 = Math.floor(year / 400);
        const part5 = monthTable[month - 1];
        const part6 = day;

        // Put the parts together to make the total
        const total = part1 + part2 - part3 + part4 + part5 + part6;

        // Workout the final day of week value
        const dayOfWeek = total % 7;

        // Return the day of week value
        return dayOfWeek;
    }

    /**
     * Get the number of days in the given year. This can depend on the year. Leap years have 366 days instead of 365.
     * @param {number} year The year to get the number of days for.
     * @return {number} The number of days in the given year.
     * @public
     * @static
     */
    static getDaysInYear(year) {
        // If leap year then return 366 days
        if (zbDateTimeTools.isLeapYear(year) === true) return 366;

        // Otherwise return 365 days
        return 365;
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
        // If February
        if (month === 2) {
            // If leap year
            if (zbDateTimeTools.isLeapYear(year) === true) return 29;

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
     * @public
     * @static
     */
    static isLeapYear(year) {
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
     * Get the total number of days from year 1, month 1, day 1, of the given date.
     * @param {number} year The year part of the date. Cannot be zero.
     * @param {number} month The month part of the date (1 to 12).
     * @param {number} day The day part of the date.
     * @return {number} The total number of days since day 1 year 1 AD.
     * @public
     * @static
     */
    static getDateToDays(year, month, day) {
        // Set day of year
        let dayOfYear = 0;

        // For each month
        for (let monthCount = 1; monthCount < month; monthCount++) dayOfYear += zbDateTimeTools.getDaysInMonth(year, monthCount);

        // Add the month's days to the total
        dayOfYear += day;

        // Get leap year count
        const leapYears = zbDateTimeTools._getLeapYearCount(year - 1);

        // Set total days
        const totalDays = ((year - 1) * 365) + leapYears + dayOfYear;

        // Return the total days
        return totalDays;
    }

    /**
     * Get a date from the total number of days from year 1, month 1, day 1.
     * @param {number} days The total number of days to convert into a date.
     * @return {object} An object with year, month and day parts set to the worked out date.
     * @public
     * @static
     */
    static getDaysToDate(days) {
        // Estimate the number of years
        let year = Math.floor((days - 1) / 365) + 1;

        // Set days left
        let daysLeft = days;

        // Loop until we get the right year
        while (true) {
            // Get the number of leap years
            const leapYears = zbDateTimeTools._getLeapYearCount(year - 1);

            // Set total days for the year
            const totalDaysForYear = ((year - 1) * 365) + leapYears;

            // Workout the days left
            daysLeft = days - totalDaysForYear;

            // Set days in year
            let daysInYear = 365;
            if (zbDateTimeTools.isLeapYear(year) === true) daysInYear = 366;

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
            const daysInMonth = zbDateTimeTools.getDaysInMonth(year, monthCount);

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

    /**
     * Get the total number of seconds for the given time.
     * @param {number} hour The hour part of the time (0 to 23).
     * @param {number} minute The minute part of the time (0 to 59).
     * @param {number} second The second part of the time (0 to 59).
     * @return {number} The total number of seconds for the time.
     * @public
     * @static
     */
    static getTimeToSeconds(hour, minute, second) {
        // Workout the total seconds
        const totalSeconds = (hour * 60 * 60) + (minute * 60) + second;

        // Return the total seconds
        return totalSeconds;
    }

    /**
     * Get a time from the total number of seconds.
     * @param {number} seconds The total number of seconds to convert into a time.
     * @return {object} An object with day, hour, minute and second parts set to the worked out time.
     * @public
     * @static
     */
    static getSecondsToTime(seconds) {
        // Workout the total days
        const days = Math.floor(seconds / (24 * 60 * 60));

        // Remove the days from seconds
        seconds -= (days * 24 * 60 * 60);

        // Workout the total hours
        const hours = Math.floor(seconds / (60 * 60));

        // Remove the hours from the seconds
        seconds -= (hours * 60 * 60);

        // Workout the total minutes
        const minutes = Math.floor(seconds / 60);

        // Remove the minutes from the seconds
        seconds -= (minutes * 60);

        // Create time object with results
        const time = {
            day: days,
            hour: hours,
            minute: minutes,
            second: seconds
        };

        // Return time object
        return time;
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
}
