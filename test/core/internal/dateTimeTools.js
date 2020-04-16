/**
 * Zebra Blue: zbDateTimeToolsTest
 * @classdesc
 * Unit testing the zbDateTimeTools class.
 * @hideconstructor
 */
class zbDateTimeToolsTest {
    /**
     * Run the zbDateTimeTools tests.
     * @public
     * @static
     */
    static run() {
        // Perform each test
        if (zbDateTimeToolsTest._getDayOfYear() === false) { console.log('zbDateTimeToolsTest.getDayOfYear FAILED'); return; }
        if (zbDateTimeToolsTest._getDayOfWeek() === false) { return; }
        if (zbDateTimeToolsTest._isLeapYear() === false) { console.log('zbDateTimeToolsTest.isLeapYear FAILED'); return; }
        if (zbDateTimeToolsTest._getDaysInMonth() === false) { console.log('zbDateTimeToolsTest.getDaysInMonth FAILED'); return; }
        if (zbDateTimeToolsTest._getDaysInYear() === false) { console.log('zbDateTimeToolsTest.getDaysInYear FAILED'); return; }
        if (zbDateTimeToolsTest._dateToDays() === false) { return; }
        if (zbDateTimeToolsTest._daysToDate() === false) { return; }
        if (zbDateTimeToolsTest._dateToDaysToDate() === false) { console.log('zbDateTimeToolsTest.dateToDaysToDate FAILED'); return; }
        if (zbDateTimeToolsTest._getTimeToSeconds() === false) { return; }
    }

    /**
     * Perform the getDayOfYear tests.
     * @return {boolean} True if passed, False if error found.
     * @private
     * @static
     */
    static _getDayOfYear() {
        // Set year to 2020 (it is a leap year)
        let year = 2020;

        // Set day count
        let dayCount = 0;

        // For each month
        for (let month = 1; month <= 12; month++) {
            // Get the number of days in the month
            const daysInMonth = zbDateTimeTools.getDaysInMonth(year, month);

            // For each day
            for (let day = 1; day <= daysInMonth; day++) {
                // Increase the day count
                dayCount++;

                // Get the day of the year
                const dayOfYear = zbDateTimeTools.getDayOfYear(year, month, day);

                // If not the same
                if (dayOfYear !== dayCount) {
                    // Log error
                    console.log(`zbDateTimeToolsTest.getDayOfYear FAILED ${year}, ${month}, ${day}`);

                    // Return failed
                    return false;
                }
            }
        }

        // Set year to 2019 (it is not a leap year)
        year = 2019;

        // Reset day count
        dayCount = 0;

        // For each month
        for (let month = 1; month <= 12; month++) {
            // Get the number of days in the month
            const daysInMonth = zbDateTimeTools.getDaysInMonth(year, month);

            // For each day
            for (let day = 1; day <= daysInMonth; day++) {
                // Increase the day count
                dayCount++;

                // Get the day of the year
                const dayOfYear = zbDateTimeTools.getDayOfYear(year, month, day);

                // If not the same
                if (dayOfYear !== dayCount) {
                    // Log error
                    console.log(`zbDateTimeToolsTest.getDayOfYear FAILED ${year}, ${month}, ${day}`);

                    // Return failed
                    return false;
                }
            }
        }

        // Return passed
        return true;
    }

    /**
     * Perform the getDayOfWeek tests.
     * @return {boolean} True if passed, False if error found.
     * @private
     * @static
     */
    static _getDayOfWeek() {
        // Set day of week (1st Jan 1600 was a Saturday)
        let dayOfWeek = zbDayOfWeek.SATURDAY;

        // For each year (1600 to 2400)
        for (let year = 1600; year <= 2400; year++) {
            // For each month
            for (let month = 1; month <= 12; month++) {
                // Get the number of days in the month
                const daysInMonth = zbDateTimeTools.getDaysInMonth(year, month);

                // For each day
                for (let day = 1; day <= daysInMonth; day++) {
                    // Check day of week
                    if (zbDateTimeTools.getDayOfWeek(year, month, day) !== dayOfWeek) {
                        // Log error
                        console.log(`zbDateTimeToolsTest.getDayOfWeek FAILED ${year}, ${month}, ${day}`);

                        // Return failed
                        return false;
                    }

                    // Move day of week
                    if (dayOfWeek === zbDayOfWeek.MONDAY) dayOfWeek = zbDayOfWeek.TUESDAY;
                    else if (dayOfWeek === zbDayOfWeek.TUESDAY) dayOfWeek = zbDayOfWeek.WEDNESDAY;
                    else if (dayOfWeek === zbDayOfWeek.WEDNESDAY) dayOfWeek = zbDayOfWeek.THURSDAY;
                    else if (dayOfWeek === zbDayOfWeek.THURSDAY) dayOfWeek = zbDayOfWeek.FRIDAY;
                    else if (dayOfWeek === zbDayOfWeek.FRIDAY) dayOfWeek = zbDayOfWeek.SATURDAY;
                    else if (dayOfWeek === zbDayOfWeek.SATURDAY) dayOfWeek = zbDayOfWeek.SUNDAY;
                    else if (dayOfWeek === zbDayOfWeek.SUNDAY) dayOfWeek = zbDayOfWeek.MONDAY;
                }
            }
        }

        // Check a known date
        if (zbDateTimeTools.getDayOfWeek(2020, 3, 4) !== zbDayOfWeek.WEDNESDAY) {
            // Log error
            console.log('zbDateTimeToolsTest.getDayOfWeek FAILED 2020, 3, 4');

            // Return failed
            return false;
        }

        // Return passed
        return true;
    }

    /**
     * Perform the isLeapYear tests.
     * @return {boolean} True is passed, False if error found.
     * @private
     * @static
     */
    static _isLeapYear() {
        // Set known leap years list
        const knownLeapYearList = [
            1600, 1604, 1608, 1612, 1616, 1620, 1624, 1628, 1632, 1636, 1640, 1644, 1648,
            1652, 1656, 1660, 1664, 1668, 1672, 1676, 1680, 1684, 1688, 1692, 1696, 1704,
            1708, 1712, 1716, 1720, 1724, 1728, 1732, 1736, 1740, 1744, 1748, 1752, 1756,
            1760, 1764, 1768, 1772, 1776, 1780, 1784, 1788, 1792, 1796, 1804, 1808, 1812,
            1816, 1820, 1824, 1828, 1832, 1836, 1840, 1844, 1848, 1852, 1856, 1860, 1864,
            1868, 1872, 1876, 1880, 1884, 1888, 1892, 1896, 1904, 1908, 1912, 1916, 1920,
            1924, 1928, 1932, 1936, 1940, 1944, 1948, 1952, 1956, 1960, 1964, 1968, 1972,
            1976, 1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016, 2020, 2024,
            2028, 2032, 2036, 2040, 2044, 2048, 2052, 2056, 2060, 2064, 2068, 2072, 2076,
            2080, 2084, 2088, 2092, 2096, 2104, 2108, 2112, 2116, 2120, 2124, 2128, 2132,
            2136, 2140, 2144, 2148, 2152, 2156, 2160, 2164, 2168, 2172, 2176, 2180, 2184,
            2188, 2192, 2196];

        // For each year from 1600 to 2200
        for (let year = 1600; year < 2200; year++) {
            // Set is leap year
            let isLeapYear = false;

            // For each known leap year
            for (let index = 0; index < knownLeapYearList.length; index++) {
                // Get leap year
                const leapYear = knownLeapYearList[index];

                // If not the same year
                if (year !== leapYear) continue;

                // Set is leap year and stop looking
                isLeapYear = true;
                break;
            }

            // Check is leap year function
            if (zbDateTimeTools.isLeapYear(year) !== isLeapYear) return false;
        }

        // Return passed
        return true;
    }

    /**
     * Perform the getDaysInMonth tests.
     * @return {boolean} True is passed, False if error found.
     * @private
     * @static
     */
    static _getDaysInMonth() {
        // Test months 1 to 12 (for leap year)
        if (zbDateTimeTools.getDaysInMonth(2020, 1) !== 31) return false;
        if (zbDateTimeTools.getDaysInMonth(2020, 2) !== 29) return false;
        if (zbDateTimeTools.getDaysInMonth(2020, 3) !== 31) return false;
        if (zbDateTimeTools.getDaysInMonth(2020, 4) !== 30) return false;
        if (zbDateTimeTools.getDaysInMonth(2020, 5) !== 31) return false;
        if (zbDateTimeTools.getDaysInMonth(2020, 6) !== 30) return false;
        if (zbDateTimeTools.getDaysInMonth(2020, 7) !== 31) return false;
        if (zbDateTimeTools.getDaysInMonth(2020, 8) !== 31) return false;
        if (zbDateTimeTools.getDaysInMonth(2020, 9) !== 30) return false;
        if (zbDateTimeTools.getDaysInMonth(2020, 10) !== 31) return false;
        if (zbDateTimeTools.getDaysInMonth(2020, 11) !== 30) return false;
        if (zbDateTimeTools.getDaysInMonth(2020, 12) !== 31) return false;

        // Test months 1 to 12 (for non-leap year)
        if (zbDateTimeTools.getDaysInMonth(2019, 1) !== 31) return false;
        if (zbDateTimeTools.getDaysInMonth(2019, 2) !== 28) return false;
        if (zbDateTimeTools.getDaysInMonth(2019, 3) !== 31) return false;
        if (zbDateTimeTools.getDaysInMonth(2019, 4) !== 30) return false;
        if (zbDateTimeTools.getDaysInMonth(2019, 5) !== 31) return false;
        if (zbDateTimeTools.getDaysInMonth(2019, 6) !== 30) return false;
        if (zbDateTimeTools.getDaysInMonth(2019, 7) !== 31) return false;
        if (zbDateTimeTools.getDaysInMonth(2019, 8) !== 31) return false;
        if (zbDateTimeTools.getDaysInMonth(2019, 9) !== 30) return false;
        if (zbDateTimeTools.getDaysInMonth(2019, 10) !== 31) return false;
        if (zbDateTimeTools.getDaysInMonth(2019, 11) !== 30) return false;
        if (zbDateTimeTools.getDaysInMonth(2019, 12) !== 31) return false;

        // Return passed
        return true;
    }

    /**
     * Perform the getDaysInYear tests.
     * @return {boolean} True is passed, False if error found.
     * @private
     * @static
     */
    static _getDaysInYear() {
        // Test for leap year
        if (zbDateTimeTools.getDaysInYear(2020) !== 366) return false;

        // Test for non-leap year
        if (zbDateTimeTools.getDaysInYear(2019) !== 365) return false;

        // Return passed
        return true;
    }

    /**
     * Perform the dateToDays test.
     * @return {boolean} True is passed, False if error found.
     * @private
     * @static
     */
    static _dateToDays() {
        // Set day count
        let dayCount = 0;

        // For each year (1 to 2400)
        for (let year = 1; year <= 2400; year++) {
            // For each month (1 to 12)
            for (let month = 1; month <= 12; month++) {
                // Set days in month
                const daysInMonth = zbDateTimeTools.getDaysInMonth(year, month);

                // For each day
                for (let day = 1; day <= daysInMonth; day++) {
                    // Increase day count
                    dayCount++;

                    // Get date to days
                    const dateToDays = zbDateTimeTools.getDateToDays(year, month, day);

                    // If they do not match
                    if (dayCount !== dateToDays) {
                        // Log error
                        console.log(`zbDateTimeToolsTest.dateToDays FAILED ${year}, ${month}, ${day}`);

                        // Return failed
                        return false;
                    }
                }
            }
        }

        // Return passed
        return true;
    }

    /**
     * Perform the daysToDate test.
     * @return {boolean} True is passed, False if error found.
     * @private
     * @static
     */
    static _daysToDate() {
        // Set day count
        let dayCount = 0;

        // For each year (1 to 2400)
        for (let year = 1; year <= 2400; year++) {
            // For each month (1 to 12)
            for (let month = 1; month <= 12; month++) {
                // Set days in month
                const daysInMonth = zbDateTimeTools.getDaysInMonth(year, month);

                // For each day
                for (let day = 1; day <= daysInMonth; day++) {
                    // Increase day count
                    dayCount++;

                    // Get days to date
                    const date = zbDateTimeTools.getDaysToDate(dayCount);

                    // If they do not match
                    if (date.year !== year || date.month !== month || date.day !== day) {
                        // Log error
                        console.log(`zbDateTimeToolsTest.daysToDate FAILED ${dayCount}`);

                        // Return failed
                        return false;
                    }
                }
            }
        }

        // Return passed
        return true;
    }

    /**
     * Perform some date to days and back again testing.
     * @return {boolean} True is passed, False if error found.
     * @private
     * @static
     */
    static _dateToDaysToDate() {
        // Get date to days
        const dateToDays = zbDateTimeTools.getDateToDays(2020, 2, 29);

        // Convert back into a date
        const date = zbDateTimeTools.getDaysToDate(dateToDays);

        // Check match
        if (date.year !== 2020) return false;
        if (date.month !== 2) return false;
        if (date.day !== 29) return false;

        // Return passed
        return true;
    }

    /**
     * Perform the getTimeToSeconds tests.
     * @return {boolean} True if passed, False if error found.
     * @private
     * @static
     */
    static _getTimeToSeconds() {
        // Set second count
        let secondCount = 0;

        // For each hour
        for (let hour = 0; hour <= 23; hour++) {
            // For each minute
            for (let minute = 0; minute <= 59; minute++) {
                // For each second
                for (let second = 0; second <= 59; second++) {
                    // Get the total seconds
                    const totalSeconds = zbDateTimeTools.getTimeToSeconds(hour, minute, second);

                    // If not the same
                    if (totalSeconds !== secondCount) {
                        // Log error
                        console.log(`zbDateTimeToolsTest.getTimeToSeconds Part 1 FAILED ${hour}, ${minute}, ${second}`);

                        // Return failed
                        return false;
                    }

                    // Get time from seconds
                    const time = zbDateTimeTools.getSecondsToTime(totalSeconds);

                    // If not the same
                    if (time.hour !== hour || time.minute !== minute || time.second !== second) {
                        // Log error
                        console.log(`zbDateTimeToolsTest.getTimeToSeconds Part 2 FAILED ${hour}, ${minute}, ${second}`);

                        // Return failed
                        return false;
                    }

                    // Increase second count
                    secondCount++;
                }
            }
        }

        // Return passed
        return true;
    }
}
