/**
 * Zebra Blue: zbDateTest
 * @classdesc
 * Unit testing the zbDate class.
 * @hideconstructor
 */
class zbDateTest {
    /**
     * Run the zbDate tests.
     * @public
     * @static
     */
    static run() {
        // Perform each test
        if (zbDateTest._constructor() === false) { console.log('zbDateTest.constructor FAILED'); return; }
        if (zbDateTest._toString() === false) { console.log('zbDateTest.toString FAILED'); return; }
        if (zbDateTest._getDayOfYear() === false) { console.log('zbDateTest.getDayOfYear FAILED'); return; }
        if (zbDateTest._getDayOfWeek() === false) { return; }
        if (zbDateTest._addDays() === false) { console.log('zbDateTest.addDays FAILED'); return; }
        if (zbDateTest._addMonths() === false) { console.log('zbDateTest.addMonths FAILED'); return; }
        if (zbDateTest._addYears() === false) { console.log('zbDateTest.addYears FAILED'); return; }
        if (zbDateTest._format() === false) { console.log('zbDateTest.format FAILED'); return; }
        if (zbDateTest._isLeapYear() === false) { console.log('zbDateTest.isLeapYear FAILED'); return; }
        if (zbDateTest._getDaysInMonth() === false) { console.log('zbDateTest.getDaysInMonth FAILED'); return; }
        if (zbDateTest._getDaysInYear() === false) { console.log('zbDateTest.getDaysInYear FAILED'); return; }
        if (zbDateTest._getToday() === false) { console.log('zbDateTest.getToday FAILED'); return; }
        if (zbDateTest._fromString() === false) { console.log('zbDateTest.fromString FAILED'); return; }
        if (zbDateTest._compare() === false) { console.log('zbDateTest.compare FAILED'); return; }
    }

    /**
     * Test the zbDate constructor with invalid parameters.
     * @param {number} year The year part of the date.
     * @param {number} month The month part of the date.
     * @param {number} day The day part of the date.
     * @return {boolean} True if passed, False if error found.
     * @private
     * @static
     */
    static _invalidConstructor(year, month, day) {
        try {
            // Create a zbDate object with the invalid parameters
            new zbDate(year, month, day);
        } catch (error) {
            // There must have been an error, so we have passed this test
            return true;
        }

        // Return failed
        return false;
    }

    /**
     * Perform the constructor tests.
     * @return {boolean} True if passed, False if error found.
     * @private
     * @static
     */
    static _constructor() {
        // Test invalid parameter types
        if (zbDateTest._invalidConstructor() === false) return false;
        if (zbDateTest._invalidConstructor(2020) === false) return false;
        if (zbDateTest._invalidConstructor(2020, 1) === false) return false;
        if (zbDateTest._invalidConstructor('2020/01/02') === false) return false;
        if (zbDateTest._invalidConstructor(true, false, true) === false) return false;
        if (zbDateTest._invalidConstructor([]) === false) return false;
        if (zbDateTest._invalidConstructor(function() {}) === false) return false;
        if (zbDateTest._invalidConstructor({year: 2020, month: 1, day: 1}) === false) return false;

        // Test invalid year parameters
        if (zbDateTest._invalidConstructor(0, 1, 1) === false) return false;
        if (zbDateTest._invalidConstructor(1599, 1, 1) === false) return false;
        if (zbDateTest._invalidConstructor(4001, 1, 1) === false) return false;
        if (zbDateTest._invalidConstructor(-2020, 1, 1) === false) return false;

        // Test invalid month parameters
        if (zbDateTest._invalidConstructor(2020, 0, 1) === false) return false;
        if (zbDateTest._invalidConstructor(2020, -5, 1) === false) return false;
        if (zbDateTest._invalidConstructor(2020, 13, 1) === false) return false;

        // Test invalid day parameters
        if (zbDateTest._invalidConstructor(2020, 5, 0) === false) return false;
        if (zbDateTest._invalidConstructor(2020, 5, -20) === false) return false;
        if (zbDateTest._invalidConstructor(2020, 5, 32) === false) return false;

        // Test invalid date (leap year)
        if (zbDateTest._invalidConstructor(2019, 2, 29) === false) return false;

        // Test valid date
        const date = new zbDate(2020, 2, 29);
        if (date.year !== 2020) return false;
        if (date.month !== 2) return false;
        if (date.day !== 29) return false;

        // Return passed
        return true;
    }

    /**
     * Perform the toString tests.
     * @return {boolean} True if passed, False if error found.
     * @private
     * @static
     */
    static _toString() {
        // Test leading zeros
        let date = new zbDate(2020, 2, 3);
        if (date.toString() !== '2020-02-03') return false;

        // Test no leading zeros
        date = new zbDate(2020, 12, 28);
        if (date.toString() !== '2020-12-28') return false;

        // Return passed
        return true;
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
            const daysInMonth = zbDate.getDaysInMonth(year, month);

            // For each day
            for (let day = 1; day <= daysInMonth; day++) {
                // Increase the day count
                dayCount++;

                // Create zbDate for this date
                const date = new zbDate(year, month, day);

                // Get the day of the year
                const dayOfYear = date.getDayOfYear();

                // If not the same
                if (dayOfYear !== dayCount) {
                    // Log error
                    console.log(`zbDateTest.getDayOfYear FAILED ${year}, ${month}, ${day}`);

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
            const daysInMonth = zbDate.getDaysInMonth(year, month);

            // For each day
            for (let day = 1; day <= daysInMonth; day++) {
                // Increase the day count
                dayCount++;

                // Create zbDate for this date
                const date = new zbDate(year, month, day);

                // Get the day of the year
                const dayOfYear = date.getDayOfYear();

                // If not the same
                if (dayOfYear !== dayCount) {
                    // Log error
                    console.log(`zbDateTest.getDayOfYear FAILED ${year}, ${month}, ${day}`);

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
                const daysInMonth = zbDate.getDaysInMonth(year, month);

                // For each day
                for (let day = 1; day <= daysInMonth; day++) {
                    // Create zbDate for this date
                    const date = new zbDate(year, month, day);

                    // Check day of week
                    if (date.getDayOfWeek() !== dayOfWeek) {
                        // Log error
                        console.log(`zbDateTest.getDayOfWeek FAILED ${year}, ${month}, ${day}`);

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
        if (new zbDate(2020, 3, 4).getDayOfWeek() !== zbDayOfWeek.WEDNESDAY) {
            // Log error
            console.log('zbDateTest.getDayOfWeek FAILED 2020, 3, 4');

            // Return failed
            return false;
        }

        // Return passed
        return true;
    }

    /**
     * Perform the addDays tests.
     * @return {boolean} True if passed, False if error found.
     * @private
     * @static
     */
    static _addDays() {
        // Create date object
        let date = new zbDate(2020, 3, 5);

        // Test invalid parameters
        if (zbTestException.invalidObjectParameter(date, 'addDays', undefined) === false) return false;
        if (zbTestException.invalidObjectParameter(date, 'addDays', null) === false) return false;
        if (zbTestException.invalidObjectParameter(date, 'addDays', 'string') === false) return false;
        if (zbTestException.invalidObjectParameter(date, 'addDays', true) === false) return false;
        if (zbTestException.invalidObjectParameter(date, 'addDays', false) === false) return false;
        if (zbTestException.invalidObjectParameter(date, 'addDays', {}) === false) return false;
        if (zbTestException.invalidObjectParameter(date, 'addDays', []) === false) return false;
        if (zbTestException.invalidObjectParameter(date, 'addDays', function() {}) === false) return false;

        // Test invalid parameter values
        if (date.addDays(-1000000) !== null) return false;
        if (date.addDays(1000000) !== null) return false;

        // Test leap year
        date = new zbDate(2020, 2, 29).addDays(1);
        if (date.year !== 2020 || date.month !== 3 || date.day !== 1) return false;
        date = new zbDate(2020, 2, 28).addDays(1);
        if (date.year !== 2020 || date.month !== 2 || date.day !== 29) return false;
        date = new zbDate(2019, 2, 28).addDays(1);
        if (date.year !== 2019 || date.month !== 3 || date.day !== 1) return false;
        date = new zbDate(2020, 3, 1).addDays(-1);
        if (date.year !== 2020 || date.month !== 2 || date.day !== 29) return false;
        date = new zbDate(2019, 3, 1).addDays(-1);
        if (date.year !== 2019 || date.month !== 2 || date.day !== 28) return false;

        // Test add zero
        date = new zbDate(2020, 2, 29).addDays(0);
        if (date.year !== 2020 || date.month !== 2 || date.day !== 29) return false;

        // Test add
        date = new zbDate(2020, 2, 1).addDays(10);
        if (date.year !== 2020 || date.month !== 2 || date.day !== 11) return false;
        date = new zbDate(2020, 2, 1).addDays(40);
        if (date.year !== 2020 || date.month !== 3 || date.day !== 12) return false;

        // Test minus
        date = new zbDate(2020, 2, 10).addDays(-1);
        if (date.year !== 2020 || date.month !== 2 || date.day !== 9) return false;
        date = new zbDate(2020, 1, 1).addDays(-1);
        if (date.year !== 2019 || date.month !== 12 || date.day !== 31) return false;
        date = new zbDate(2020, 2, 28).addDays(-10);
        if (date.year !== 2020 || date.month !== 2 || date.day !== 18) return false;
        date = new zbDate(2020, 2, 28).addDays(-40);
        if (date.year !== 2020 || date.month !== 1 || date.day !== 19) return false;

        // Return passed
        return true;
    }

    /**
     * Perform the addMonths tests.
     * @return {boolean} True if passed, False if error found.
     * @private
     * @static
     */
    static _addMonths() {
        // Create date object
        let date = new zbDate(2020, 3, 5);

        // Test invalid parameters
        if (zbTestException.invalidObjectParameter(date, 'addMonths', undefined) === false) return false;
        if (zbTestException.invalidObjectParameter(date, 'addMonths', null) === false) return false;
        if (zbTestException.invalidObjectParameter(date, 'addMonths', 'string') === false) return false;
        if (zbTestException.invalidObjectParameter(date, 'addMonths', true) === false) return false;
        if (zbTestException.invalidObjectParameter(date, 'addMonths', false) === false) return false;
        if (zbTestException.invalidObjectParameter(date, 'addMonths', {}) === false) return false;
        if (zbTestException.invalidObjectParameter(date, 'addMonths', []) === false) return false;
        if (zbTestException.invalidObjectParameter(date, 'addMonths', function() {}) === false) return false;

        // Test invalid parameter values
        if (date.addMonths(-100000) !== null) return false;
        if (date.addMonths(100000) !== null) return false;

        // Test leap year
        date = new zbDate(2020, 1, 31).addMonths(1);
        if (date.year !== 2020 || date.month !== 2 || date.day !== 29) return false;
        date = new zbDate(2019, 1, 31).addMonths(1);
        if (date.year !== 2019 || date.month !== 2 || date.day !== 28) return false;
        date = new zbDate(2020, 3, 31).addMonths(-1);
        if (date.year !== 2020 || date.month !== 2 || date.day !== 29) return false;
        date = new zbDate(2019, 3, 31).addMonths(-1);
        if (date.year !== 2019 || date.month !== 2 || date.day !== 28) return false;

        // Test add zero
        date = new zbDate(2020, 2, 29).addMonths(0);
        if (date.year !== 2020 || date.month !== 2 || date.day !== 29) return false;

        // Test add
        date = new zbDate(2020, 12, 5).addMonths(2);
        if (date.year !== 2021 || date.month !== 2 || date.day !== 5) return false;
        date = new zbDate(2020, 2, 5).addMonths(2);
        if (date.year !== 2020 || date.month !== 4 || date.day !== 5) return false;
        date = new zbDate(2020, 12, 1).addMonths(1);
        if (date.year !== 2021 || date.month !== 1 || date.day !== 1) return false;

        // Test minus
        date = new zbDate(2020, 1, 5).addMonths(-2);
        if (date.year !== 2019 || date.month !== 11 || date.day !== 5) return false;
        date = new zbDate(2020, 7, 5).addMonths(-2);
        if (date.year !== 2020 || date.month !== 5 || date.day !== 5) return false;
        date = new zbDate(2021, 1, 1).addMonths(-1);
        if (date.year !== 2020 || date.month !== 12 || date.day !== 1) return false;

        // Test over many months (plus values)

        // Set starting date
        date = new zbDate(1900, 1, 1);

        // Set year and month
        let year = 1900;
        let month = 1;

        // For each add month (over 40 years)
        for (let addMonth = 1; addMonth <= 480; addMonth++) {
            // Increase month and year parts
            month++;
            if (month > 12) { month = 1; year++; }

            // Add months
            const resultDate = date.addMonths(addMonth);

            // Make sure the result is correct
            if (resultDate.year !== year || resultDate.month !== month) {
                // Log error
                console.log(`zbDateTest.addMonths plus test FAILED ${addMonth}`);

                // Return failed
                return false;
            }
        }

        // Test over many months (minus values)

        // Set starting date
        date = new zbDate(2020, 1, 1);

        // Set year and month
        year = 2020;
        month = 1;

        // For each minus month (over 40 years)
        for (let minusMonth = 1; minusMonth <= 480; minusMonth++) {
            // Decrease month and year parts
            month--;
            if (month <= 0) { month = 12; year--; }

            // Add months
            const resultDate = date.addMonths(-minusMonth);

            // Make sure the result is correct
            if (resultDate.year !== year || resultDate.month !== month) {
                // Log error
                console.log(`zbDateTest.addMonths minus test FAILED ${minusMonth}`);

                // Return failed
                return false;
            }
        }

        // Return passed
        return true;
    }

    /**
     * Perform the addYears tests.
     * @return {boolean} True if passed, False if error found.
     * @private
     * @static
     */
    static _addYears() {
        // Create date object
        let date = new zbDate(2020, 3, 5);

        // Test invalid parameters
        if (zbTestException.invalidObjectParameter(date, 'addYears', undefined) === false) return false;
        if (zbTestException.invalidObjectParameter(date, 'addYears', null) === false) return false;
        if (zbTestException.invalidObjectParameter(date, 'addYears', 'string') === false) return false;
        if (zbTestException.invalidObjectParameter(date, 'addYears', true) === false) return false;
        if (zbTestException.invalidObjectParameter(date, 'addYears', false) === false) return false;
        if (zbTestException.invalidObjectParameter(date, 'addYears', {}) === false) return false;
        if (zbTestException.invalidObjectParameter(date, 'addYears', []) === false) return false;
        if (zbTestException.invalidObjectParameter(date, 'addYears', function() {}) === false) return false;

        // Test invalid parameter values
        if (date.addYears(-5000) !== null) return false;
        if (date.addYears(5000) !== null) return false;

        // Test leap year
        date = new zbDate(2020, 2, 29).addYears(1);
        if (date.year !== 2021 || date.month !== 2 || date.day !== 28) return false;
        date = new zbDate(2019, 2, 28).addYears(1);
        if (date.year !== 2020 || date.month !== 2 || date.day !== 28) return false;
        date = new zbDate(2020, 2, 29).addYears(-1);
        if (date.year !== 2019 || date.month !== 2 || date.day !== 28) return false;
        date = new zbDate(2021, 2, 28).addYears(-1);
        if (date.year !== 2020 || date.month !== 2 || date.day !== 28) return false;

        // Test add zero
        date = new zbDate(2020, 2, 29).addYears(0);
        if (date.year !== 2020 || date.month !== 2 || date.day !== 29) return false;

        // Test add
        date = new zbDate(2020, 12, 5).addYears(2);
        if (date.year !== 2022 || date.month !== 12 || date.day !== 5) return false;
        date = new zbDate(2020, 2, 5).addYears(3);
        if (date.year !== 2023 || date.month !== 2 || date.day !== 5) return false;

        // Test minus
        date = new zbDate(2020, 1, 5).addYears(-2);
        if (date.year !== 2018 || date.month !== 1 || date.day !== 5) return false;
        date = new zbDate(2020, 7, 5).addYears(-3);
        if (date.year !== 2017 || date.month !== 7 || date.day !== 5) return false;

        // Return passed
        return true;
    }

    /**
     * Perform the format tests.
     * @return {boolean} True if passed, False if error found.
     * @private
     * @static
     */
    static _format() {
        // Create date object
        const date = new zbDate(2020, 3, 5);

        // Test invalid parameters
        if (zbTestException.invalidObjectParameter2(date, 'format', 'yyyy', null) === false) return false;
        if (zbTestException.invalidObjectParameter2(date, 'format', 'yyyy', 'string') === false) return false;
        if (zbTestException.invalidObjectParameter2(date, 'format', 'yyyy', true) === false) return false;
        if (zbTestException.invalidObjectParameter2(date, 'format', 'yyyy', false) === false) return false;
        if (zbTestException.invalidObjectParameter2(date, 'format', 'yyyy', {}) === false) return false;
        if (zbTestException.invalidObjectParameter2(date, 'format', 'yyyy', []) === false) return false;
        if (zbTestException.invalidObjectParameter2(date, 'format', 'yyyy', function() {}) === false) return false;
        if (zbTestException.invalidObjectParameter2(date, 'format', null, zbCulture.default) === false) return false;
        if (zbTestException.invalidObjectParameter2(date, 'format', true, zbCulture.default) === false) return false;
        if (zbTestException.invalidObjectParameter2(date, 'format', false, zbCulture.default) === false) return false;
        if (zbTestException.invalidObjectParameter2(date, 'format', {}, zbCulture.default) === false) return false;
        if (zbTestException.invalidObjectParameter2(date, 'format', [], zbCulture.default) === false) return false;
        if (zbTestException.invalidObjectParameter2(date, 'format', function() {}, zbCulture.default) === false) return false;

        // Defaults
        let text = date.format();
        if (text.length === 0) return false;

        // Month in default culture (en-US)
        text = date.format('MMMM');
        if (text !== 'March') return false;

        // Month in fr-FR culture
        text = date.format('MMMM', zbCulture.find('fr-FR'));
        if (text !== 'mars') return false;

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
        // Test invalid parameter types
        if (zbTestException.invalidStaticParameter(zbDate.isLeapYear, undefined) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.isLeapYear, null) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.isLeapYear, 'string') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.isLeapYear, true) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.isLeapYear, false) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.isLeapYear, {}) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.isLeapYear, []) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.isLeapYear, function() {}) === false) return false;

        // Test invalid parameter values
        if (zbTestException.invalidStaticParameter(zbDate.isLeapYear, 1599) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.isLeapYear, -2020) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.isLeapYear, 0) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.isLeapYear, 4001) === false) return false;

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
            if (zbDate.isLeapYear(year) !== isLeapYear) return false;
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
        // Test invalid parameter types
        if (zbTestException.invalidStaticParameter2(zbDate.getDaysInMonth, undefined, undefined) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDate.getDaysInMonth, null, null) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDate.getDaysInMonth, 'string', 'string') === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDate.getDaysInMonth, true, true) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDate.getDaysInMonth, false, false) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDate.getDaysInMonth, {}, {}) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDate.getDaysInMonth, [], []) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDate.getDaysInMonth, function() {}, function() {}) === false) return false;

        // Test invalid parameter values
        if (zbTestException.invalidStaticParameter2(zbDate.getDaysInMonth, 1599, 1) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDate.getDaysInMonth, -2020, 1) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDate.getDaysInMonth, 4001, 1) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDate.getDaysInMonth, 0, 1) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDate.getDaysInMonth, 2020, 0) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDate.getDaysInMonth, 2020, -5) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDate.getDaysInMonth, 2020, 13) === false) return false;

        // Test months 1 to 12 (for leap year)
        if (zbDate.getDaysInMonth(2020, 1) !== 31) return false;
        if (zbDate.getDaysInMonth(2020, 2) !== 29) return false;
        if (zbDate.getDaysInMonth(2020, 3) !== 31) return false;
        if (zbDate.getDaysInMonth(2020, 4) !== 30) return false;
        if (zbDate.getDaysInMonth(2020, 5) !== 31) return false;
        if (zbDate.getDaysInMonth(2020, 6) !== 30) return false;
        if (zbDate.getDaysInMonth(2020, 7) !== 31) return false;
        if (zbDate.getDaysInMonth(2020, 8) !== 31) return false;
        if (zbDate.getDaysInMonth(2020, 9) !== 30) return false;
        if (zbDate.getDaysInMonth(2020, 10) !== 31) return false;
        if (zbDate.getDaysInMonth(2020, 11) !== 30) return false;
        if (zbDate.getDaysInMonth(2020, 12) !== 31) return false;

        // Test months 1 to 12 (for non-leap year)
        if (zbDate.getDaysInMonth(2019, 1) !== 31) return false;
        if (zbDate.getDaysInMonth(2019, 2) !== 28) return false;
        if (zbDate.getDaysInMonth(2019, 3) !== 31) return false;
        if (zbDate.getDaysInMonth(2019, 4) !== 30) return false;
        if (zbDate.getDaysInMonth(2019, 5) !== 31) return false;
        if (zbDate.getDaysInMonth(2019, 6) !== 30) return false;
        if (zbDate.getDaysInMonth(2019, 7) !== 31) return false;
        if (zbDate.getDaysInMonth(2019, 8) !== 31) return false;
        if (zbDate.getDaysInMonth(2019, 9) !== 30) return false;
        if (zbDate.getDaysInMonth(2019, 10) !== 31) return false;
        if (zbDate.getDaysInMonth(2019, 11) !== 30) return false;
        if (zbDate.getDaysInMonth(2019, 12) !== 31) return false;

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
        // Test invalid parameter types
        if (zbTestException.invalidStaticParameter(zbDate.getDaysInYear, undefined) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.getDaysInYear, null) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.getDaysInYear, 'string') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.getDaysInYear, true) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.getDaysInYear, false) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.getDaysInYear, {}) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.getDaysInYear, []) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.getDaysInYear, function() {}) === false) return false;

        // Test invalid parameter values
        if (zbTestException.invalidStaticParameter(zbDate.getDaysInYear, 1599) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.getDaysInYear, -2020) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.getDaysInYear, 4001) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.getDaysInYear, 0) === false) return false;

        // Test for leap year
        if (zbDate.getDaysInYear(2020) !== 366) return false;

        // Test for non-leap year
        if (zbDate.getDaysInYear(2019) !== 365) return false;

        // Return passed
        return true;
    }

    /**
     * Perform the getToday tests.
     * @return {boolean} True is passed, False if error found.
     * @private
     * @static
     */
    static _getToday() {
        // Get now
        const now = new Date();

        // Get today
        const date = zbDate.getToday();

        // Must be the same
        if (date.year !== now.getFullYear() || date.month !== now.getMonth() + 1 || date.day !== now.getDate()) return false;

        // Return passed
        return true;
    }

    /**
     * Perform the fromString tests.
     * @return {boolean} True is passed, False if error found.
     * @private
     * @static
     */
    static _fromString() {
        // Test invalid parameter types
        if (zbTestException.invalidStaticParameter(zbDate.fromString, undefined) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.fromString, null) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.fromString, 123.45) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.fromString, true) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.fromString, false) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.fromString, {}) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.fromString, []) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.fromString, function() {}) === false) return false;

        // Test invalid parameter values
        if (zbTestException.invalidStaticParameter(zbDate.fromString, '') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.fromString, '1234') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.fromString, 'abcdefg') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.fromString, 'YYYY-MM-DD') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.fromString, '1599-01-01') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.fromString, '0000-01-01') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.fromString, '4001-01-01') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.fromString, '9999-01-01') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.fromString, '2020-00-01') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.fromString, '2020-13-01') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.fromString, '2020-99-01') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.fromString, '2020-05-00') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.fromString, '2020-05-32') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.fromString, '2020-05-99') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.fromString, '2019-02-29') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.fromString, '2019/02/01') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDate.fromString, '2019:02:01') === false) return false;

        // Test leap year
        let date = zbDate.fromString('2020-02-29');
        if (date.year !== 2020 || date.month !== 2 || date.day !== 29) return false;

        // Test leading zeros
        date = zbDate.fromString('2020-02-03');
        if (date.year !== 2020 || date.month !== 2 || date.day !== 3) return false;

        // Test non-leading zeros
        date = zbDate.fromString('2020-10-13');
        if (date.year !== 2020 || date.month !== 10 || date.day !== 13) return false;

        // Return passed
        return true;
    }

    /**
     * Perform the compare tests.
     * @return {boolean} True is passed, False if error found.
     * @private
     * @static
     */
    static _compare() {
        // Test invalid parameter types
        if (zbTestException.invalidStaticParameter2(zbDate.compare, undefined, undefined) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDate.compare, null, null) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDate.compare, 'string', 'string') === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDate.compare, true, true) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDate.compare, false, false) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDate.compare, {}, {}) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDate.compare, [], []) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDate.compare, function() {}, function() {}) === false) return false;

        // Compare less then
        let result = zbDate.compare(new zbDate(2020, 2, 29), new zbDate(2020, 3, 1));
        if (result !== -1) return false;
        result = zbDate.compare(new zbDate(2020, 2, 15), new zbDate(2020, 2, 16));
        if (result !== -1) return false;
        result = zbDate.compare(new zbDate(2020, 1, 17), new zbDate(2020, 2, 16));
        if (result !== -1) return false;
        result = zbDate.compare(new zbDate(2019, 3, 17), new zbDate(2020, 2, 16));
        if (result !== -1) return false;

        // Compare greater then
        result = zbDate.compare(new zbDate(2020, 3, 1), new zbDate(2020, 2, 29));
        if (result !== 1) return false;
        result = zbDate.compare(new zbDate(2020, 2, 15), new zbDate(2020, 2, 14));
        if (result !== 1) return false;
        result = zbDate.compare(new zbDate(2020, 2, 15), new zbDate(2020, 1, 16));
        if (result !== 1) return false;
        result = zbDate.compare(new zbDate(2020, 2, 15), new zbDate(2019, 3, 16));
        if (result !== 1) return false;

        // Compare equal
        result = zbDate.compare(new zbDate(2020, 3, 1), new zbDate(2020, 3, 1));
        if (result !== 0) return false;

        // Compare the same date object
        const date = new zbDate(2020, 2, 29);
        result = zbDate.compare(date, date);
        if (result !== 0) return false;

        // Return passed
        return true;
    }
}
