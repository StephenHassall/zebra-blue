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
/**
 * Zebra Blue: zbFormatTools
 * @classdesc
 * Internal format tools. Used privately by other ZB classes.
 * <pre>
 * Date time formats:
 * y
 * 2000-03-14 = 0
 * 2004-03-14 = 4
 * 2021-03-14 = 21
 * yy
 * 2000-03-14 = 00
 * 2004-03-14 = 04
 * 2021-03-14 = 21
 * yyyy
 * 2000-03-14 = 2000
 * 2004-03-14 = 2004
 * 2021-03-14 = 2021
 * M (month)
 * 2020-03-14 = 3
 * 2020-11-14 = 11
 * MM (month)
 * 2020-03-14 = 03
 * 2020-11-14 = 11
 * MMM (short month name)
 * 2020-03-14 = Mar
 * 2020-11-14 = Nov
 * MMMM (month name)
 * 2020-03-14 = March
 * 2020-11-14 = November
 * d
 * 2020-03-04 = 4
 * 2020-03-12 = 12
 * dd
 * 2020-03-04 = 04
 * 2020-03-12 = 12
 * ddd (short day name)
 * 2020-03-04 = Tue
 * 2020-03-12 = Thu
 * dddd (day name)
 * 2020-03-04 = Tuesday
 * 2020-03-12 = Thursday
 * r (ordinal)
 * 2020-03-01 = st
 * 2020-03-12 = th
 * R (ordinal)
 * 2020-03-01 = ST
 * 2020-03-12 = TH
 * h (12 hour clock)
 * 03:56:34 = 3
 * 10:56:34 = 10
 * 14:56:34 = 2
 * 23:56:34 = 11
 * hh (12 hour clock)
 * 03:56:34 = 03
 * 10:56:34 = 10
 * 14:56:34 = 02
 * 23:56:34 = 11
 * H (24 hour clock)
 * 03:56:34 = 3
 * 10:56:34 = 10
 * 14:56:34 = 14
 * 23:56:34 = 23
 * HH (24 hour clock)
 * 03:56:34 = 03
 * 10:56:34 = 10
 * 14:56:34 = 14
 * 23:56:34 = 23
 * m (minute)
 * 03:06:04 = 0
 * 10:56:35 = 56
 * mm (minute)
 * 03:06:04 = 06
 * 10:56:35 = 56
 * s
 * 03:56:04 = 4
 * 10:56:35 = 35
 * ss
 * 03:56:04 = 04
 * 10:56:35 = 35
 * t
 * 03:56:04 = am
 * 18:56:35 = pm
 * T
 * 03:56:04 = AM
 * 18:56:35 = PM
 * Escape characters (note it is a forward slash)
 * /y
 * /M
 * /d
 * /r
 * /R
 * /h
 * /H
 * /m
 * /s
 * /t
 * /T
 * </pre>
 * @hideconstructor
 */
class zbFormatTools {
    /**
     * Build a string using the given date and date format.
     * @param {string} format The format the date should look like.
     * @param {zbCulture} culture The culture to format the date against.
     * @param {zbDate} date The date to format as text.
     * @return {string} The formatted date text.
     */
    static formatDate(format, culture, date) {
        // If format date regex not created yet
        if (!zbFormatTools._formatDateRegex) {
            // Create format date regex
            zbFormatTools._formatDateRegex = new RegExp('yyyy|yy|y|MMMM|MMM|MM|M|dddd|ddd|dd|d|r|R|/y|/M|/d|/r|/R|.', 'g');
        }

        // Split the format into its parts list
        const partList = format.match(zbFormatTools._formatDateRegex);

        // Create final text builder
        const finalTextBuilder = [];

        // For each part
        partList.forEach(function(part) {
            // Switch on the part
            switch (part) {
                case 'yyyy': {
                    // Add the full year
                    finalTextBuilder.push(date.year.toString());
                    break;
                }
                case 'yy': {
                    // Add only the last 2 digits of the year
                    finalTextBuilder.push(date.year.toString().substr(2));
                    break;
                }
                case 'y': {
                    // Get the final 2 digits, and remove the leading zero if there is one
                    let yearText = date.year.toString().substr(2);
                    if (yearText.charAt(0) === '0') yearText = yearText.substr(1);

                    // Add the last 2 digits of the year without leading zero
                    finalTextBuilder.push(yearText);
                    break;
                }
                case 'MMMM': {
                    // Add the month name
                    finalTextBuilder.push(culture.monthList[date.month - 1]);
                    break;
                }
                case 'MMM': {
                    // Add the short month name
                    finalTextBuilder.push(culture.shortMonthList[date.month - 1]);
                    break;
                }
                case 'MM': {
                    // Get month text, add leading zero if needed
                    let monthText = date.month.toString();
                    if (monthText.length === 1) monthText = '0' + monthText;

                    // Add the month text
                    finalTextBuilder.push(monthText);
                    break;
                }
                case 'M': {
                    // Add the full month
                    finalTextBuilder.push(date.month.toString());
                    break;
                }
                case 'dddd': {
                    // Add the day of week name
                    finalTextBuilder.push(culture.dayOfWeekList[date.getDayOfWeek()]);
                    break;
                }
                case 'ddd': {
                    // Add the short day of week name
                    finalTextBuilder.push(culture.shortDayOfWeekList[date.getDayOfWeek()]);
                    break;
                }
                case 'dd': {
                    // Get day text, add leading zero if needed
                    let dayText = date.day.toString();
                    if (dayText.length === 1) dayText = '0' + dayText;

                    // Add the day text
                    finalTextBuilder.push(dayText);
                    break;
                }
                case 'd': {
                    // Add the full day
                    finalTextBuilder.push(date.day.toString());
                    break;
                }
                case 'r': {
                    // Add the ordinal day part
                    finalTextBuilder.push(culture.ordinalDayList[date.day - 1]);
                    break;
                }
                case 'R': {
                    // Add the ordinal day part
                    finalTextBuilder.push(culture.ordinalDayList[date.day - 1].toUpperCase());
                    break;
                }
                case '/y':
                case '/M':
                case '/d':
                case '/r':
                case '/R':
                    // Add escape character
                    finalTextBuilder.push(part.substr(1));
                    break;
                default:
                    // Just add the part, no formatting required
                    finalTextBuilder.push(part);
            }
        });

        // Join all the final text parts
        const finalText = finalTextBuilder.join('');

        // Return the final text
        return finalText;
    }

    /**
     * Build a string using the given date time and date time format.
     * @param {string} format The format the date time should look like.
     * @param {zbCulture} culture The culture to format the date time against.
     * @param {zbDateTime} dateTime The date time to format as text.
     * @return {string} The formatted date time text.
     */
    static formatDateTime(format, culture, dateTime) {
        // If format date time regex not created yet
        if (!zbFormatTools._formatDateTimeRegex) {
            // Create format date time regex
            zbFormatTools._formatDateTimeRegex =
                new RegExp('yyyy|yy|y|MMMM|MMM|MM|M|dddd|ddd|dd|d|r|R|hh|h|HH|H|mm|m|ss|s|t|T|/y|/M|/d|/r|/R|/h|/H|/m|/s|/t|/T|.', 'g');
        }

        // Split the format into its parts list
        const partList = format.match(zbFormatTools._formatDateTimeRegex);

        // Create final text builder
        const finalTextBuilder = [];

        // For each part
        partList.forEach(function(part) {
            // Switch on the part
            switch (part) {
                case 'yyyy': {
                    // Add the full year
                    finalTextBuilder.push(dateTime.year.toString());
                    break;
                }
                case 'yy': {
                    // Add only the last 2 digits of the year
                    finalTextBuilder.push(dateTime.year.toString().substr(2));
                    break;
                }
                case 'y': {
                    // Get the final 2 digits, and remove the leading zero if there is one
                    let yearText = dateTime.year.toString().substr(2);
                    if (yearText.charAt(0) === '0') yearText = yearText.substr(1);

                    // Add the last 2 digits of the year without leading zero
                    finalTextBuilder.push(yearText);
                    break;
                }
                case 'MMMM': {
                    // Add the month name
                    finalTextBuilder.push(culture.monthList[dateTime.month - 1]);
                    break;
                }
                case 'MMM': {
                    // Add the short month name
                    finalTextBuilder.push(culture.shortMonthList[dateTime.month - 1]);
                    break;
                }
                case 'MM': {
                    // Get month text, add leading zero if needed
                    let monthText = dateTime.month.toString();
                    if (monthText.length === 1) monthText = '0' + monthText;

                    // Add the month text
                    finalTextBuilder.push(monthText);
                    break;
                }
                case 'M': {
                    // Add the full month
                    finalTextBuilder.push(dateTime.month.toString());
                    break;
                }
                case 'dddd': {
                    // Add the day of week name
                    finalTextBuilder.push(culture.dayOfWeekList[dateTime.getDayOfWeek()]);
                    break;
                }
                case 'ddd': {
                    // Add the short day of week name
                    finalTextBuilder.push(culture.shortDayOfWeekList[dateTime.getDayOfWeek()]);
                    break;
                }
                case 'dd': {
                    // Get day text, add leading zero if needed
                    let dayText = dateTime.day.toString();
                    if (dayText.length === 1) dayText = '0' + dayText;

                    // Add the day text
                    finalTextBuilder.push(dayText);
                    break;
                }
                case 'd': {
                    // Add the full day
                    finalTextBuilder.push(dateTime.day.toString());
                    break;
                }
                case 'r': {
                    // Add the ordinal day part
                    finalTextBuilder.push(culture.ordinalDayList[dateTime.day - 1]);
                    break;
                }
                case 'R': {
                    // Add the ordinal day part
                    finalTextBuilder.push(culture.ordinalDayList[dateTime.day - 1].toUpperCase());
                    break;
                }
                case 'hh': {
                    // Set 12 hour clock hour
                    let hour = dateTime.hour;
                    if (hour > 12) hour -= 12;

                    // Get hour text, add leading zero if needed
                    let hourText = hour.toString();
                    if (hourText.length === 1) hourText = '0' + hourText;

                    // Add the hour text
                    finalTextBuilder.push(hourText);
                    break;
                }
                case 'h': {
                    // Set 12 hour clock hour
                    let hour = dateTime.hour;
                    if (hour > 12) hour -= 12;

                    // Add the 12 hour clock hour
                    finalTextBuilder.push(hour.toString());
                    break;
                }
                case 'HH': {
                    // Get 24 hour clock hour text, add leading zero if needed
                    let hourText = dateTime.hour.toString();
                    if (hourText.length === 1) hourText = '0' + hourText;

                    // Add the hour text
                    finalTextBuilder.push(hourText);
                    break;
                }
                case 'H': {
                    // Add the 24 hour clock hour
                    finalTextBuilder.push(dateTime.hour.toString());
                    break;
                }
                case 'mm': {
                    // Get minute text, add leading zero if needed
                    let minuteText = dateTime.minute.toString();
                    if (minuteText.length === 1) minuteText = '0' + minuteText;

                    // Add the minute text
                    finalTextBuilder.push(minuteText);
                    break;
                }
                case 'm': {
                    // Add the full minute
                    finalTextBuilder.push(dateTime.minute.toString());
                    break;
                }
                case 'ss': {
                    // Get second text, add leading zero if needed
                    let secondText = dateTime.second.toString();
                    if (secondText.length === 1) secondText = '0' + secondText;

                    // Add the second text
                    finalTextBuilder.push(secondText);
                    break;
                }
                case 's': {
                    // Add the full second
                    finalTextBuilder.push(dateTime.second.toString());
                    break;
                }
                case 't': {
                    // Set am/pm text
                    let apmText = culture.am;
                    if (dateTime.hour > 12) apmText = culture.pm;

                    // Add the AM/PM part
                    finalTextBuilder.push(apmText);
                    break;
                }
                case 'T': {
                    // Set am/pm text
                    let apmText = culture.am;
                    if (dateTime.hour > 12) apmText = culture.pm;

                    // Add the AM/PM part
                    finalTextBuilder.push(apmText.toUpperCase());
                    break;
                }
                case '/y':
                case '/M':
                case '/d':
                case '/r':
                case '/R':
                case '/h':
                case '/H':
                case '/m':
                case '/s':
                case '/t':
                case '/T':
                    // Add escape character
                    finalTextBuilder.push(part.substr(1));
                    break;
                default:
                    // Just add the part, no formatting required
                    finalTextBuilder.push(part);
            }
        });

        // Join all the final text parts
        const finalText = finalTextBuilder.join('');

        // Return the final text
        return finalText;
    }

    /**
     * Build a string using the given time and time format.
     * @param {string} format The format the time should look like.
     * @param {zbCulture} culture The culture to format the time against.
     * @param {zbTime} time The time to format as text.
     * @return {string} The formatted time text.
     */
    static formatTime(format, culture, time) {
        // If format time regex not created yet
        if (!zbFormatTools._formatTimeRegex) {
            // Create format time regex
            zbFormatTools._formatTimeRegex = new RegExp('hh|h|HH|H|mm|m|ss|s|t|T|/h|/H|/m|/s|/t|/T|.', 'g');
        }

        // Split the format into its parts list
        const partList = format.match(zbFormatTools._formatTimeRegex);

        // Create final text builder
        const finalTextBuilder = [];

        // For each part
        partList.forEach(function(part) {
            // Switch on the part
            switch (part) {
                case 'hh': {
                    // Set 12 hour clock hour
                    let hour = time.hour;
                    if (hour > 12) hour -= 12;

                    // Get hour text, add leading zero if needed
                    let hourText = hour.toString();
                    if (hourText.length === 1) hourText = '0' + hourText;

                    // Add the hour text
                    finalTextBuilder.push(hourText);
                    break;
                }
                case 'h': {
                    // Set 12 hour clock hour
                    let hour = time.hour;
                    if (hour > 12) hour -= 12;

                    // Add the 12 hour clock hour
                    finalTextBuilder.push(hour.toString());
                    break;
                }
                case 'HH': {
                    // Get 24 hour clock hour text, add leading zero if needed
                    let hourText = time.hour.toString();
                    if (hourText.length === 1) hourText = '0' + hourText;

                    // Add the hour text
                    finalTextBuilder.push(hourText);
                    break;
                }
                case 'H': {
                    // Add the 24 hour clock hour
                    finalTextBuilder.push(time.hour.toString());
                    break;
                }
                case 'mm': {
                    // Get minute text, add leading zero if needed
                    let minuteText = time.minute.toString();
                    if (minuteText.length === 1) minuteText = '0' + minuteText;

                    // Add the minute text
                    finalTextBuilder.push(minuteText);
                    break;
                }
                case 'm': {
                    // Add the full minute
                    finalTextBuilder.push(time.minute.toString());
                    break;
                }
                case 'ss': {
                    // Get second text, add leading zero if needed
                    let secondText = time.second.toString();
                    if (secondText.length === 1) secondText = '0' + secondText;

                    // Add the second text
                    finalTextBuilder.push(secondText);
                    break;
                }
                case 's': {
                    // Add the full second
                    finalTextBuilder.push(time.second.toString());
                    break;
                }
                case 't': {
                    // Set am/pm text
                    let apmText = culture.am;
                    if (time.hour > 12) apmText = culture.pm;

                    // Add the AM/PM part
                    finalTextBuilder.push(apmText);
                    break;
                }
                case 'T': {
                    // Set am/pm text
                    let apmText = culture.am;
                    if (time.hour > 12) apmText = culture.pm;

                    // Add the AM/PM part
                    finalTextBuilder.push(apmText.toUpperCase());
                    break;
                }
                case '/h':
                case '/H':
                case '/m':
                case '/s':
                case '/t':
                case '/T':
                    // Add escape character
                    finalTextBuilder.push(part.substr(1));
                    break;
                default:
                    // Just add the part, no formatting required
                    finalTextBuilder.push(part);
            }
        });

        // Join all the final text parts
        const finalText = finalTextBuilder.join('');

        // Return the final text
        return finalText;
    }
}
/**
 * Zebra Blue: zbDayOfWeek
 * @description
 * Day of week constants.
 * @readonly
 * @enum {number}
 */
const zbDayOfWeek = {
    /**
     * Sunday (0).
     */
    SUNDAY: 0,

    /**
     * Monday (1).
     */
    MONDAY: 1,

    /**
     * Tuesday (2).
     */
    TUESDAY: 2,

    /**
     * Wednesday (3).
     */
    WEDNESDAY: 3,

    /**
     * Thursday (4).
     */
    THURSDAY: 4,

    /**
     * Friday (5).
     */
    FRIDAY: 5,

    /**
     * Saturday (6).
     */
    SATURDAY: 6
};
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
/**
 * Zebra Blue: zbCulture for en-GB (English-United Kingdom)
 */
zbCulture.add(new zbCulture(
    // Code
    'en-GB',

    // Month list
    [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ],

    // Short month list
    [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ],

    // Day list
    [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ],

    // Short day list
    [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
    ],

    // Ordinal day list
    [
        'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th',
        'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th',
        'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th',
        'st'
    ],

    // AM
    'am',

    // PM
    'pm',

    // Long date time
    'dddd, d MMMM yyyy HH:mm',

    // Short date time
    'dd/MM/yyyy HH:mm',

    // Long date
    'dddd, d MMMM yyyy',

    // Short date
    'dd/MM/yyyy',

    // Long time
    'HH:mm:ss',

    // Short time
    'HH:mm',

    // First day of week
    zbDayOfWeek.MONDAY
));
/**
 * Zebra Blue: zbCulture for en-US (English-United States of America)
 */
zbCulture.add(new zbCulture(
    // Code
    'en-US',

    // Month list
    [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ],

    // Short month list
    [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ],

    // Day list
    [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ],

    // Short day list
    [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
    ],

    // Ordinal day list
    [
        'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th',
        'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th',
        'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th',
        'st'
    ],

    // AM
    'am',

    // PM
    'pm',

    // Long date time
    'dddd, MMMM d yyyy h:mm t',

    // Short date time
    'MMMM d, yyyy h:mm t',

    // Long date
    'dddd, MMMM d yyyy',

    // Short date
    'MM/dd/yyyy',

    // Long time
    'h:mm:ss t',

    // Short time
    'h:mm t',

    // First day of week
    zbDayOfWeek.MONDAY
));
/**
 * Zebra Blue: zbCulture for es-ES (Spanish-Spain)
 */
zbCulture.add(new zbCulture(
    // Code
    'es-ES',

    // Month list
    [
        'enero',
        'febrero',
        'marzo',
        'abril',
        'mayo',
        'junio',
        'julio',
        'agosto',
        'septiembre',
        'octubre',
        'noviembre',
        'diciembre'
    ],

    // Short month list
    [
        'ene',
        'feb',
        'mar',
        'abr',
        'may',
        'jun',
        'jul',
        'ago',
        'sep',
        'oct',
        'nov',
        'dic'
    ],

    // Day list
    [
        'domingo',
        'lunes',
        'martes',
        'miércoles',
        'jueves',
        'viernes',
        'sábado'
    ],

    // Short day list
    [
        'dom',
        'lun',
        'mar',
        'mié',
        'jue',
        'vie',
        'sáb'
    ],

    // Ordinal day list
    [
        'º', 'º', 'º', 'º', 'º', 'º', 'º', 'º', 'º', 'º',
        'º', 'º', 'º', 'º', 'º', 'º', 'º', 'º', 'º', 'º',
        'º', 'º', 'º', 'º', 'º', 'º', 'º', 'º', 'º', 'º',
        'º'
    ],

    // AM
    'am',

    // PM
    'pm',

    // Long date time
    'dddd, d /de MMMM /de yyyy H:mm:ss',

    // Short date time
    'dd/MM/yyyy H:mm',

    // Long date
    'dddd, d /de MMMM /de yyyy',

    // Short date
    'dd/MM/yyyy',

    // Long time
    'H:mm:ss',

    // Short time
    'HH:mm',

    // First day of week
    zbDayOfWeek.MONDAY
));
/**
 * Zebra Blue: zbCulture for fr-FR (French-France)
 */
zbCulture.add(new zbCulture(
    // Code
    'fr-FR',

    // Month list
    [
        'janvier',
        'février',
        'mars',
        'avril',
        'mai',
        'juin',
        'juillet',
        'août',
        'septembre',
        'octobre',
        'novembre',
        'décembre'
    ],

    // Short month list
    [
        'janv',
        'févr',
        'mars',
        'avr',
        'mai',
        'juin',
        'juil',
        'août',
        'sept',
        'oct',
        'nov',
        'déc'
    ],

    // Day list
    [
        'dimanche',
        'lundi',
        'mardi',
        'mercredi',
        'jeudi',
        'vendredi',
        'samedi'
    ],

    // Short day list
    [
        'dim',
        'lun',
        'mar',
        'mer',
        'jeu',
        'ven',
        'sam'
    ],

    // Ordinal day list
    [
        'er', '', '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '', '',
        ''
    ],

    // AM
    'am',

    // PM
    'pm',

    // Long date time
    'dddd d MMMM yyyy HH:mm:ss',

    // Short date time
    'dd/MM/yyyy HH:mm',

    // Long date
    'dddd d MMMM yyyy',

    // Short date
    'dd/MM/yyyy',

    // Long time
    'HH:mm:ss',

    // Short time
    'HH:mm',

    // First day of week
    zbDayOfWeek.MONDAY
));
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
