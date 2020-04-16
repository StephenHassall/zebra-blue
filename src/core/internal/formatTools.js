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
