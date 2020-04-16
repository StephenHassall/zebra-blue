/**
 * Zebra Blue: zbDateTimeTest
 * @classdesc
 * Unit testing the zbDateTime class.
 * @hideconstructor
 */
class zbDateTimeTest {
    /**
     * Run the zbDateTime tests.
     * @public
     * @static
     */
    static run() {
        // Perform each test
        if (zbDateTimeTest._constructor() === false) { console.log('zbDateTimeTest.constructor FAILED'); return; }
        if (zbDateTimeTest._toString() === false) { console.log('zbDateTimeTest.toString FAILED'); return; }
        if (zbDateTimeTest._getDayOfYear() === false) { console.log('zbDateTimeTest.getDayOfYear FAILED'); return; }
        if (zbDateTimeTest._getDayOfWeek() === false) { return; }
        if (zbDateTimeTest._addSeconds() === false) { console.log('zbDateTimeTest.addSeconds FAILED'); return; }
        if (zbDateTimeTest._addMinutes() === false) { console.log('zbDateTimeTest.addMinutes FAILED'); return; }
        if (zbDateTimeTest._addHours() === false) { console.log('zbDateTimeTest.addHours FAILED'); return; }
        if (zbDateTimeTest._addDays() === false) { console.log('zbDateTimeTest.addDays FAILED'); return; }
        if (zbDateTimeTest._addMonths() === false) { console.log('zbDateTimeTest.addMonths FAILED'); return; }
        if (zbDateTimeTest._addYears() === false) { console.log('zbDateTimeTest.addYears FAILED'); return; }
        if (zbDateTimeTest._format() === false) { console.log('zbDateTimeTest.format FAILED'); return; }
        if (zbDateTimeTest._isLeapYear() === false) { console.log('zbDateTimeTest.isLeapYear FAILED'); return; }
        if (zbDateTimeTest._getDaysInMonth() === false) { console.log('zbDateTimeTest.getDaysInMonth FAILED'); return; }
        if (zbDateTimeTest._getDaysInYear() === false) { console.log('zbDateTimeTest.getDaysInYear FAILED'); return; }
        if (zbDateTimeTest._getNow() === false) { console.log('zbDateTimeTest.getNow FAILED'); return; }
        if (zbDateTimeTest._fromString() === false) { console.log('zbDateTimeTest.fromString FAILED'); return; }
        if (zbDateTimeTest._compare() === false) { console.log('zbDateTimeTest.compare FAILED'); return; }
    }

    /**
     * Test the zbDateTime constructor with invalid parameters.
     * @param {number} year The year part of the date time.
     * @param {number} month The month part of the date time.
     * @param {number} day The day part of the date time.
     * @param {number} hour The hour part of the date time.
     * @param {number} minute The minute part of the date time.
     * @param {number} second The second part of the date time.
     * @return {boolean} True if passed, False if error found.
     * @private
     * @static
     */
    static _invalidConstructor(year, month, day, hour, minute, second) {
        try {
            // Create a zbDateTime object with the invalid parameters
            new zbDateTime(year, month, day, hour, minute, second);
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
        if (zbDateTimeTest._invalidConstructor() === false) return false;
        if (zbDateTimeTest._invalidConstructor(2020) === false) return false;
        if (zbDateTimeTest._invalidConstructor(2020, 1) === false) return false;
        if (zbDateTimeTest._invalidConstructor(2020, 1, 2) === false) return false;
        if (zbDateTimeTest._invalidConstructor(2020, 1, 2, 3) === false) return false;
        if (zbDateTimeTest._invalidConstructor(2020, 1, 2, 3, 4) === false) return false;
        if (zbDateTimeTest._invalidConstructor('2020/01/02 03:04:05') === false) return false;
        if (zbDateTimeTest._invalidConstructor(true, false, true, false, true, false) === false) return false;
        if (zbDateTimeTest._invalidConstructor([], [], [], [], [], []) === false) return false;
        if (zbDateTimeTest._invalidConstructor(function() {}) === false) return false;
        if (zbDateTimeTest._invalidConstructor({year: 2020, month: 1, day: 2, hour: 3, minute: 4, second: 5}) === false) return false;

        // Test invalid year parameters
        if (zbDateTimeTest._invalidConstructor(0, 1, 1, 1, 1, 1) === false) return false;
        if (zbDateTimeTest._invalidConstructor(1599, 1, 1, 1, 1, 1) === false) return false;
        if (zbDateTimeTest._invalidConstructor(4001, 1, 1, 1, 1, 1) === false) return false;
        if (zbDateTimeTest._invalidConstructor(-2020, 1, 1, 1, 1, 1) === false) return false;

        // Test invalid month parameters
        if (zbDateTimeTest._invalidConstructor(2020, 0, 1, 1, 1, 1) === false) return false;
        if (zbDateTimeTest._invalidConstructor(2020, -5, 1, 1, 1, 1) === false) return false;
        if (zbDateTimeTest._invalidConstructor(2020, 13, 1, 1, 1, 1) === false) return false;

        // Test invalid day parameters
        if (zbDateTimeTest._invalidConstructor(2020, 5, 0, 1, 1, 1) === false) return false;
        if (zbDateTimeTest._invalidConstructor(2020, 5, -20, 1, 1, 1) === false) return false;
        if (zbDateTimeTest._invalidConstructor(2020, 5, 32, 1, 1, 1) === false) return false;

        // Test invalid hour parameters
        if (zbDateTimeTest._invalidConstructor(2020, 1, 2, -1, 0, 0) === false) return false;
        if (zbDateTimeTest._invalidConstructor(2020, 1, 2, 24, 0, 0) === false) return false;
        if (zbDateTimeTest._invalidConstructor(2020, 1, 2, 35, 0, 1) === false) return false;

        // Test invalid minute parameters
        if (zbDateTimeTest._invalidConstructor(2020, 1, 2, 23, -1, 0) === false) return false;
        if (zbDateTimeTest._invalidConstructor(2020, 1, 2, 23, 60, 0) === false) return false;
        if (zbDateTimeTest._invalidConstructor(2020, 1, 2, 23, 123, 1) === false) return false;

        // Test invalid second parameters
        if (zbDateTimeTest._invalidConstructor(2020, 1, 2, 23, 45, -1) === false) return false;
        if (zbDateTimeTest._invalidConstructor(2020, 1, 2, 23, 45, 60) === false) return false;
        if (zbDateTimeTest._invalidConstructor(2020, 1, 2, 23, 45, 123) === false) return false;

        // Test invalid date (leap year)
        if (zbDateTimeTest._invalidConstructor(2019, 2, 29, 1, 1, 1) === false) return false;

        // Test valid date time
        const dateTime = new zbDateTime(2020, 2, 29, 1, 2, 3);
        if (dateTime.year !== 2020) return false;
        if (dateTime.month !== 2) return false;
        if (dateTime.day !== 29) return false;
        if (dateTime.hour !== 1) return false;
        if (dateTime.minute !== 2) return false;
        if (dateTime.second !== 3) return false;

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
        let dateTime = new zbDateTime(2020, 2, 3, 4, 5, 6);
        if (dateTime.toString() !== '2020-02-03 04:05:06') return false;

        // Test no leading zeros
        dateTime = new zbDateTime(2020, 12, 28, 14, 15, 16);
        if (dateTime.toString() !== '2020-12-28 14:15:16') return false;

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
            const daysInMonth = zbDateTime.getDaysInMonth(year, month);

            // For each day
            for (let day = 1; day <= daysInMonth; day++) {
                // Increase the day count
                dayCount++;

                // Create zbDateTime for this date
                const dateTime = new zbDateTime(year, month, day, 1, 2, 3);

                // Get the day of the year
                const dayOfYear = dateTime.getDayOfYear();

                // If not the same
                if (dayOfYear !== dayCount) {
                    // Log error
                    console.log(`zbDateTimeTest.getDayOfYear FAILED ${year}, ${month}, ${day}`);

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
            const daysInMonth = zbDateTime.getDaysInMonth(year, month);

            // For each day
            for (let day = 1; day <= daysInMonth; day++) {
                // Increase the day count
                dayCount++;

                // Create zbDateTime for this date
                const dateTime = new zbDateTime(year, month, day, 1, 2, 3);

                // Get the day of the year
                const dayOfYear = dateTime.getDayOfYear();

                // If not the same
                if (dayOfYear !== dayCount) {
                    // Log error
                    console.log(`zbDateTimeTest.getDayOfYear FAILED ${year}, ${month}, ${day}`);

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
                const daysInMonth = zbDateTime.getDaysInMonth(year, month);

                // For each day
                for (let day = 1; day <= daysInMonth; day++) {
                    // Create zbDateTime for this date
                    const dateTime = new zbDateTime(year, month, day, 1, 2, 3);

                    // Check day of week
                    if (dateTime.getDayOfWeek() !== dayOfWeek) {
                        // Log error
                        console.log(`zbDateTimeTest.getDayOfWeek FAILED ${year}, ${month}, ${day}`);

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
        if (new zbDateTime(2020, 3, 4, 1, 2, 3).getDayOfWeek() !== zbDayOfWeek.WEDNESDAY) {
            // Log error
            console.log('zbDateTimeTest.getDayOfWeek FAILED 2020, 3, 4');

            // Return failed
            return false;
        }

        // Return passed
        return true;
    }

    /**
     * Perform the addSeconds tests.
     * @return {boolean} True if passed, False if error found.
     * @private
     * @static
     */
    static _addSeconds() {
        // Create date time object
        let dateTime = new zbDateTime(2020, 1, 2, 23, 35, 10);

        // Test invalid parameters
        if (zbTestException.invalidObjectParameter(dateTime, 'addSeconds', undefined) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addSeconds', null) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addSeconds', 'string') === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addSeconds', true) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addSeconds', false) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addSeconds', {}) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addSeconds', []) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addSeconds', function() {}) === false) return false;

        // Test add zero
        dateTime = new zbDateTime(2020, 1, 2, 23, 34, 45).addSeconds(0);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 23 || dateTime.minute !== 34 || dateTime.second !== 45) return false;

        // Test add (in the same day)
        dateTime = new zbDateTime(2020, 1, 2, 13, 34, 45).addSeconds(1);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 13 || dateTime.minute !== 34 || dateTime.second !== 46) return false;
        dateTime = new zbDateTime(2020, 1, 2, 12, 59, 59).addSeconds(1);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 13 || dateTime.minute !== 0 || dateTime.second !== 0) return false;
        dateTime = new zbDateTime(2020, 1, 2, 12, 12, 59).addSeconds(1);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 12 || dateTime.minute !== 13 || dateTime.second !== 0) return false;
        dateTime = new zbDateTime(2020, 1, 2, 13, 34, 45).addSeconds(60);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 13 || dateTime.minute !== 35 || dateTime.second !== 45) return false;
        dateTime = new zbDateTime(2020, 1, 2, 13, 34, 45).addSeconds(60 * 60);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 14 || dateTime.minute !== 34 || dateTime.second !== 45) return false;

        // Test add (into the next day)
        dateTime = new zbDateTime(2020, 1, 2, 23, 59, 59).addSeconds(1);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 3) return false;
        if (dateTime.hour !== 0 || dateTime.minute !== 0 || dateTime.second !== 0) return false;
        dateTime = new zbDateTime(2020, 1, 2, 23, 59, 59).addSeconds(2);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 3) return false;
        if (dateTime.hour !== 0 || dateTime.minute !== 0 || dateTime.second !== 1) return false;
        dateTime = new zbDateTime(2020, 1, 2, 23, 59, 0).addSeconds(60);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 3) return false;
        if (dateTime.hour !== 0 || dateTime.minute !== 0 || dateTime.second !== 0) return false;
        dateTime = new zbDateTime(2020, 1, 2, 23, 0, 0).addSeconds(60 * 60);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 3) return false;
        if (dateTime.hour !== 0 || dateTime.minute !== 0 || dateTime.second !== 0) return false;
        dateTime = new zbDateTime(2020, 1, 2, 10, 11, 12).addSeconds(24 * 60 * 60);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 3) return false;
        if (dateTime.hour !== 10 || dateTime.minute !== 11 || dateTime.second !== 12) return false;

        // Test minus (on the same day)
        dateTime = new zbDateTime(2020, 1, 2, 23, 34, 45).addSeconds(-1);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 23 || dateTime.minute !== 34 || dateTime.second !== 44) return false;
        dateTime = new zbDateTime(2020, 1, 2, 23, 0, 0).addSeconds(-1);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 22 || dateTime.minute !== 59 || dateTime.second !== 59) return false;
        dateTime = new zbDateTime(2020, 1, 2, 23, 13, 0).addSeconds(-1);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 23 || dateTime.minute !== 12 || dateTime.second !== 59) return false;
        dateTime = new zbDateTime(2020, 1, 2, 23, 34, 45).addSeconds(-60);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 23 || dateTime.minute !== 33 || dateTime.second !== 45) return false;
        dateTime = new zbDateTime(2020, 1, 2, 23, 34, 45).addSeconds(-60 * 60);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 22 || dateTime.minute !== 34 || dateTime.second !== 45) return false;

        // Test minus (into the previous day)
        dateTime = new zbDateTime(2020, 1, 2, 0, 0, 0).addSeconds(-1);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 1) return false;
        if (dateTime.hour !== 23 || dateTime.minute !== 59 || dateTime.second !== 59) return false;
        dateTime = new zbDateTime(2020, 1, 2, 0, 0, 0).addSeconds(-2);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 1) return false;
        if (dateTime.hour !== 23 || dateTime.minute !== 59 || dateTime.second !== 58) return false;
        dateTime = new zbDateTime(2020, 1, 2, 0, 0, 0).addSeconds(-60);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 1) return false;
        if (dateTime.hour !== 23 || dateTime.minute !== 59 || dateTime.second !== 0) return false;
        dateTime = new zbDateTime(2020, 1, 2, 0, 0, 0).addSeconds(-60 * 60);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 1) return false;
        if (dateTime.hour !== 23 || dateTime.minute !== 0 || dateTime.second !== 0) return false;
        dateTime = new zbDateTime(2020, 1, 2, 10, 11, 12).addSeconds(-24 * 60 * 60);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 1) return false;
        if (dateTime.hour !== 10 || dateTime.minute !== 11 || dateTime.second !== 12) return false;

        // Return passed
        return true;
    }

    /**
     * Perform the addMinutes tests.
     * @return {boolean} True if passed, False if error found.
     * @private
     * @static
     */
    static _addMinutes() {
        // Create date time object
        let dateTime = new zbDateTime(2020, 1, 2, 23, 35, 10);

        // Test invalid parameters
        if (zbTestException.invalidObjectParameter(dateTime, 'addMinutes', undefined) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addMinutes', null) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addMinutes', 'string') === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addMinutes', true) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addMinutes', false) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addMinutes', {}) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addMinutes', []) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addMinutes', function() {}) === false) return false;

        // Test add zero
        dateTime = new zbDateTime(2020, 1, 2, 23, 34, 45).addMinutes(0);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 23 || dateTime.minute !== 34 || dateTime.second !== 45) return false;

        // Test add (on the same day)
        dateTime = new zbDateTime(2020, 1, 2, 23, 34, 45).addMinutes(1);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 23 || dateTime.minute !== 35 || dateTime.second !== 45) return false;
        dateTime = new zbDateTime(2020, 1, 2, 22, 59, 59).addMinutes(1);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 23 || dateTime.minute !== 0 || dateTime.second !== 59) return false;
        dateTime = new zbDateTime(2020, 1, 2, 22, 12, 59).addMinutes(1);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 22 || dateTime.minute !== 13 || dateTime.second !== 59) return false;
        dateTime = new zbDateTime(2020, 1, 2, 0, 0, 0).addMinutes(1);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 0 || dateTime.minute !== 1 || dateTime.second !== 0) return false;
        dateTime = new zbDateTime(2020, 1, 2, 22, 34, 45).addMinutes(60);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 23 || dateTime.minute !== 34 || dateTime.second !== 45) return false;

        // Test add (into the next day)
        dateTime = new zbDateTime(2020, 1, 2, 23, 59, 45).addMinutes(1);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 3) return false;
        if (dateTime.hour !== 0 || dateTime.minute !== 0 || dateTime.second !== 45) return false;
        dateTime = new zbDateTime(2020, 1, 2, 23, 59, 45).addMinutes(2);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 3) return false;
        if (dateTime.hour !== 0 || dateTime.minute !== 1 || dateTime.second !== 45) return false;
        dateTime = new zbDateTime(2020, 1, 2, 23, 34, 45).addMinutes(60);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 3) return false;
        if (dateTime.hour !== 0 || dateTime.minute !== 34 || dateTime.second !== 45) return false;
        dateTime = new zbDateTime(2020, 1, 2, 23, 34, 45).addMinutes(24 * 60);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 3) return false;
        if (dateTime.hour !== 23 || dateTime.minute !== 34 || dateTime.second !== 45) return false;

        // Test minus (on the same day)
        dateTime = new zbDateTime(2020, 1, 2, 23, 34, 45).addMinutes(-1);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 23 || dateTime.minute !== 33 || dateTime.second !== 45) return false;
        dateTime = new zbDateTime(2020, 1, 2, 23, 0, 0).addMinutes(-1);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 22 || dateTime.minute !== 59 || dateTime.second !== 0) return false;
        dateTime = new zbDateTime(2020, 1, 2, 0, 1, 0).addMinutes(-1);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 0 || dateTime.minute !== 0 || dateTime.second !== 0) return false;
        dateTime = new zbDateTime(2020, 1, 2, 23, 34, 45).addMinutes(-60);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 22 || dateTime.minute !== 34 || dateTime.second !== 45) return false;
        dateTime = new zbDateTime(2020, 1, 2, 23, 34, 45).addMinutes(-23 * 60);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 0 || dateTime.minute !== 34 || dateTime.second !== 45) return false;

        // Test minus (into the previous day)
        dateTime = new zbDateTime(2020, 1, 2, 0, 0, 0).addMinutes(-1);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 1) return false;
        if (dateTime.hour !== 23 || dateTime.minute !== 59 || dateTime.second !== 0) return false;
        dateTime = new zbDateTime(2020, 1, 2, 0, 0, 0).addMinutes(-2);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 1) return false;
        if (dateTime.hour !== 23 || dateTime.minute !== 58 || dateTime.second !== 0) return false;
        dateTime = new zbDateTime(2020, 1, 2, 0, 0, 0).addMinutes(-60);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 1) return false;
        if (dateTime.hour !== 23 || dateTime.minute !== 0|| dateTime.second !== 0) return false;
        dateTime = new zbDateTime(2020, 1, 2, 10, 11, 12).addMinutes(-24 * 60);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 1) return false;
        if (dateTime.hour !== 10 || dateTime.minute !== 11 || dateTime.second !== 12) return false;

        // Return passed
        return true;
    }

    /**
     * Perform the addHours tests.
     * @return {boolean} True if passed, False if error found.
     * @private
     * @static
     */
    static _addHours() {
        // Create date time object
        let dateTime = new zbDateTime(2020, 1, 2, 23, 35, 10);

        // Test invalid parameters
        if (zbTestException.invalidObjectParameter(dateTime, 'addHours', undefined) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addHours', null) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addHours', 'string') === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addHours', true) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addHours', false) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addHours', {}) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addHours', []) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addHours', function() {}) === false) return false;

        // Test add zero
        dateTime = new zbDateTime(2020, 1, 2, 23, 34, 45).addHours(0);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 23 || dateTime.minute !== 34 || dateTime.second !== 45) return false;

        // Test add (on the same day)
        dateTime = new zbDateTime(2020, 1, 2, 22, 34, 45).addHours(1);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 23 || dateTime.minute !== 34 || dateTime.second !== 45) return false;
        dateTime = new zbDateTime(2020, 1, 2, 2, 59, 59).addHours(1);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 3 || dateTime.minute !== 59 || dateTime.second !== 59) return false;
        dateTime = new zbDateTime(2020, 1, 2, 0, 0, 0).addHours(1);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 0 || dateTime.second !== 0) return false;
        dateTime = new zbDateTime(2020, 1, 2, 21, 34, 45).addHours(2);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 23 || dateTime.minute !== 34 || dateTime.second !== 45) return false;

        // Test add (into the next day)
        dateTime = new zbDateTime(2020, 1, 2, 23, 34, 45).addHours(1);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 3) return false;
        if (dateTime.hour !== 0 || dateTime.minute !== 34 || dateTime.second !== 45) return false;
        dateTime = new zbDateTime(2020, 1, 2, 23, 34, 45).addHours(2);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 3) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 34 || dateTime.second !== 45) return false;
        dateTime = new zbDateTime(2020, 1, 2, 23, 34, 45).addHours(24);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 3) return false;
        if (dateTime.hour !== 23 || dateTime.minute !== 34 || dateTime.second !== 45) return false;

        // Test minus (on the same day)
        dateTime = new zbDateTime(2020, 1, 2, 23, 34, 45).addHours(-1);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 22 || dateTime.minute !== 34 || dateTime.second !== 45) return false;
        dateTime = new zbDateTime(2020, 1, 2, 23, 0, 0).addHours(-1);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 22 || dateTime.minute !== 0 || dateTime.second !== 0) return false;
        dateTime = new zbDateTime(2020, 1, 2, 23, 34, 45).addHours(-2);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 2) return false;
        if (dateTime.hour !== 21 || dateTime.minute !== 34 || dateTime.second !== 45) return false;

        // Test minus (into the previous day)
        dateTime = new zbDateTime(2020, 1, 2, 0, 0, 0).addHours(-1);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 1) return false;
        if (dateTime.hour !== 23 || dateTime.minute !== 0 || dateTime.second !== 0) return false;
        dateTime = new zbDateTime(2020, 1, 2, 1, 34, 45).addHours(-2);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 1) return false;
        if (dateTime.hour !== 23 || dateTime.minute !== 34 || dateTime.second !== 45) return false;
        dateTime = new zbDateTime(2020, 1, 2, 23, 34, 45).addHours(-24);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 1) return false;
        if (dateTime.hour !== 23 || dateTime.minute !== 34 || dateTime.second !== 45) return false;
        dateTime = new zbDateTime(2020, 1, 2, 23, 34, 45).addHours(-25);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 1) return false;
        if (dateTime.hour !== 22 || dateTime.minute !== 34 || dateTime.second !== 45) return false;

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
        // Create date time object
        let dateTime = new zbDateTime(2020, 3, 5, 1, 2, 3);

        // Test invalid parameters
        if (zbTestException.invalidObjectParameter(dateTime, 'addDays', undefined) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addDays', null) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addDays', 'string') === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addDays', true) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addDays', false) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addDays', {}) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addDays', []) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addDays', function() {}) === false) return false;

        // Test invalid parameter values
        if (dateTime.addDays(-1000000) !== null) return false;
        if (dateTime.addDays(1000000) !== null) return false;

        // Test leap year
        dateTime = new zbDateTime(2020, 2, 29, 1, 2, 3).addDays(1);
        if (dateTime.year !== 2020 || dateTime.month !== 3 || dateTime.day !== 1) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;
        dateTime = new zbDateTime(2020, 2, 28, 1, 2, 3).addDays(1);
        if (dateTime.year !== 2020 || dateTime.month !== 2 || dateTime.day !== 29) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;
        dateTime = new zbDateTime(2019, 2, 28, 1, 2, 3).addDays(1);
        if (dateTime.year !== 2019 || dateTime.month !== 3 || dateTime.day !== 1) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;
        dateTime = new zbDateTime(2020, 3, 1, 1, 2, 3).addDays(-1);
        if (dateTime.year !== 2020 || dateTime.month !== 2 || dateTime.day !== 29) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;
        dateTime = new zbDateTime(2019, 3, 1, 1, 2, 3).addDays(-1);
        if (dateTime.year !== 2019 || dateTime.month !== 2 || dateTime.day !== 28) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;

        // Test add zero
        dateTime = new zbDateTime(2020, 2, 29, 1, 2, 3).addDays(0);
        if (dateTime.year !== 2020 || dateTime.month !== 2 || dateTime.day !== 29) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;

        // Test add
        dateTime = new zbDateTime(2020, 2, 1, 1, 2, 3).addDays(10);
        if (dateTime.year !== 2020 || dateTime.month !== 2 || dateTime.day !== 11) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;
        dateTime = new zbDateTime(2020, 2, 1, 1, 2, 3).addDays(40);
        if (dateTime.year !== 2020 || dateTime.month !== 3 || dateTime.day !== 12) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;

        // Test minus
        dateTime = new zbDateTime(2020, 2, 10, 1, 2, 3).addDays(-1);
        if (dateTime.year !== 2020 || dateTime.month !== 2 || dateTime.day !== 9) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;
        dateTime = new zbDateTime(2020, 1, 1, 1, 2, 3).addDays(-1);
        if (dateTime.year !== 2019 || dateTime.month !== 12 || dateTime.day !== 31) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;
        dateTime = new zbDateTime(2020, 2, 28, 1, 2, 3).addDays(-10);
        if (dateTime.year !== 2020 || dateTime.month !== 2 || dateTime.day !== 18) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;
        dateTime = new zbDateTime(2020, 2, 28, 1, 2, 3).addDays(-40);
        if (dateTime.year !== 2020 || dateTime.month !== 1 || dateTime.day !== 19) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;

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
        // Create date time object
        let dateTime = new zbDateTime(2020, 3, 5, 1, 2, 3);

        // Test invalid parameters
        if (zbTestException.invalidObjectParameter(dateTime, 'addMonths', undefined) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addMonths', null) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addMonths', 'string') === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addMonths', true) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addMonths', false) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addMonths', {}) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addMonths', []) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addMonths', function() {}) === false) return false;

        // Test invalid parameter values
        if (dateTime.addMonths(-100000) !== null) return false;
        if (dateTime.addMonths(100000) !== null) return false;

        // Test leap year
        dateTime = new zbDateTime(2020, 1, 31, 1, 2, 3).addMonths(1);
        if (dateTime.year !== 2020 || dateTime.month !== 2 || dateTime.day !== 29) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;
        dateTime = new zbDateTime(2019, 1, 31, 1, 2, 3).addMonths(1);
        if (dateTime.year !== 2019 || dateTime.month !== 2 || dateTime.day !== 28) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;
        dateTime = new zbDateTime(2020, 3, 31, 1, 2, 3).addMonths(-1);
        if (dateTime.year !== 2020 || dateTime.month !== 2 || dateTime.day !== 29) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;
        dateTime = new zbDateTime(2019, 3, 31, 1, 2, 3).addMonths(-1);
        if (dateTime.year !== 2019 || dateTime.month !== 2 || dateTime.day !== 28) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;

        // Test add zero
        dateTime = new zbDateTime(2020, 2, 29, 1, 2, 3).addMonths(0);
        if (dateTime.year !== 2020 || dateTime.month !== 2 || dateTime.day !== 29) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;

        // Test add
        dateTime = new zbDateTime(2020, 12, 5, 1, 2, 3).addMonths(2);
        if (dateTime.year !== 2021 || dateTime.month !== 2 || dateTime.day !== 5) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;
        dateTime = new zbDateTime(2020, 2, 5, 1, 2, 3).addMonths(2);
        if (dateTime.year !== 2020 || dateTime.month !== 4 || dateTime.day !== 5) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;
        dateTime = new zbDateTime(2020, 12, 1, 1, 2, 3).addMonths(1);
        if (dateTime.year !== 2021 || dateTime.month !== 1 || dateTime.day !== 1) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;

        // Test minus
        dateTime = new zbDateTime(2020, 1, 5, 1, 2, 3).addMonths(-2);
        if (dateTime.year !== 2019 || dateTime.month !== 11 || dateTime.day !== 5) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;
        dateTime = new zbDateTime(2020, 7, 5, 1, 2, 3).addMonths(-2);
        if (dateTime.year !== 2020 || dateTime.month !== 5 || dateTime.day !== 5) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;
        dateTime = new zbDateTime(2021, 1, 1, 1, 2, 3).addMonths(-1);
        if (dateTime.year !== 2020 || dateTime.month !== 12 || dateTime.day !== 1) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;

        // Test over many months (plus values)

        // Set starting date
        dateTime = new zbDateTime(1900, 1, 1, 2, 3, 4);

        // Set year and month
        let year = 1900;
        let month = 1;

        // For each add month (over 40 years)
        for (let addMonth = 1; addMonth <= 480; addMonth++) {
            // Increase month and year parts
            month++;
            if (month > 12) { month = 1; year++; }

            // Add months
            const resultDate = dateTime.addMonths(addMonth);

            // Make sure the result is correct
            if (resultDate.year !== year || resultDate.month !== month) {
                // Log error
                console.log(`zbDateTimeTest.addMonths plus test FAILED ${addMonth}`);

                // Return failed
                return false;
            }
        }

        // Test over many months (minus values)

        // Set starting date
        dateTime = new zbDateTime(2020, 1, 1, 2, 3, 4);

        // Set year and month
        year = 2020;
        month = 1;

        // For each minus month (over 40 years)
        for (let minusMonth = 1; minusMonth <= 480; minusMonth++) {
            // Decrease month and year parts
            month--;
            if (month <= 0) { month = 12; year--; }

            // Add months
            const resultDate = dateTime.addMonths(-minusMonth);

            // Make sure the result is correct
            if (resultDate.year !== year || resultDate.month !== month) {
                // Log error
                console.log(`zbDateTimeTest.addMonths minus test FAILED ${minusMonth}`);

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
        // Create date time object
        let dateTime = new zbDateTime(2020, 3, 5, 1, 2, 3);

        // Test invalid parameters
        if (zbTestException.invalidObjectParameter(dateTime, 'addYears', undefined) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addYears', null) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addYears', 'string') === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addYears', true) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addYears', false) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addYears', {}) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addYears', []) === false) return false;
        if (zbTestException.invalidObjectParameter(dateTime, 'addYears', function() {}) === false) return false;

        // Test invalid parameter values
        if (dateTime.addYears(-5000) !== null) return false;
        if (dateTime.addYears(5000) !== null) return false;

        // Test leap year
        dateTime = new zbDateTime(2020, 2, 29, 1, 2, 3).addYears(1);
        if (dateTime.year !== 2021 || dateTime.month !== 2 || dateTime.day !== 28) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;
        dateTime = new zbDateTime(2019, 2, 28, 1, 2, 3).addYears(1);
        if (dateTime.year !== 2020 || dateTime.month !== 2 || dateTime.day !== 28) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;
        dateTime = new zbDateTime(2020, 2, 29, 1, 2, 3).addYears(-1);
        if (dateTime.year !== 2019 || dateTime.month !== 2 || dateTime.day !== 28) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;
        dateTime = new zbDateTime(2021, 2, 28, 1, 2, 3).addYears(-1);
        if (dateTime.year !== 2020 || dateTime.month !== 2 || dateTime.day !== 28) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;

        // Test add zero
        dateTime = new zbDateTime(2020, 2, 29, 1, 2, 3).addYears(0);
        if (dateTime.year !== 2020 || dateTime.month !== 2 || dateTime.day !== 29) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;

        // Test add
        dateTime = new zbDateTime(2020, 12, 5, 1, 2, 3).addYears(2);
        if (dateTime.year !== 2022 || dateTime.month !== 12 || dateTime.day !== 5) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;
        dateTime = new zbDateTime(2020, 2, 5, 1, 2, 3).addYears(3);
        if (dateTime.year !== 2023 || dateTime.month !== 2 || dateTime.day !== 5) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;

        // Test minus
        dateTime = new zbDateTime(2020, 1, 5, 1, 2, 3).addYears(-2);
        if (dateTime.year !== 2018 || dateTime.month !== 1 || dateTime.day !== 5) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;
        dateTime = new zbDateTime(2020, 7, 5, 1, 2, 3).addYears(-3);
        if (dateTime.year !== 2017 || dateTime.month !== 7 || dateTime.day !== 5) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;

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
        // Create date time object
        const dateTime = new zbDateTime(2020, 3, 5, 1, 2, 3);

        // Test invalid parameters
        if (zbTestException.invalidObjectParameter2(dateTime, 'format', 'yyyy', null) === false) return false;
        if (zbTestException.invalidObjectParameter2(dateTime, 'format', 'yyyy', 'string') === false) return false;
        if (zbTestException.invalidObjectParameter2(dateTime, 'format', 'yyyy', true) === false) return false;
        if (zbTestException.invalidObjectParameter2(dateTime, 'format', 'yyyy', false) === false) return false;
        if (zbTestException.invalidObjectParameter2(dateTime, 'format', 'yyyy', {}) === false) return false;
        if (zbTestException.invalidObjectParameter2(dateTime, 'format', 'yyyy', []) === false) return false;
        if (zbTestException.invalidObjectParameter2(dateTime, 'format', 'yyyy', function() {}) === false) return false;
        if (zbTestException.invalidObjectParameter2(dateTime, 'format', null, zbCulture.default) === false) return false;
        if (zbTestException.invalidObjectParameter2(dateTime, 'format', true, zbCulture.default) === false) return false;
        if (zbTestException.invalidObjectParameter2(dateTime, 'format', false, zbCulture.default) === false) return false;
        if (zbTestException.invalidObjectParameter2(dateTime, 'format', {}, zbCulture.default) === false) return false;
        if (zbTestException.invalidObjectParameter2(dateTime, 'format', [], zbCulture.default) === false) return false;
        if (zbTestException.invalidObjectParameter2(dateTime, 'format', function() {}, zbCulture.default) === false) return false;

        // Defaults
        let text = dateTime.format();
        if (text.length === 0) return false;

        // Month and hour in default culture (en-US)
        text = dateTime.format('MMMM HH');
        if (text !== 'March 01') return false;

        // Month and hour in fr-FR culture
        text = dateTime.format('MMMM HH', zbCulture.find('fr-FR'));
        if (text !== 'mars 01') return false;

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
        if (zbTestException.invalidStaticParameter(zbDateTime.isLeapYear, undefined) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.isLeapYear, null) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.isLeapYear, 'string') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.isLeapYear, true) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.isLeapYear, false) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.isLeapYear, {}) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.isLeapYear, []) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.isLeapYear, function() {}) === false) return false;

        // Test invalid parameter values
        if (zbTestException.invalidStaticParameter(zbDateTime.isLeapYear, 1599) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.isLeapYear, -2020) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.isLeapYear, 0) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.isLeapYear, 4001) === false) return false;

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
            if (zbDateTime.isLeapYear(year) !== isLeapYear) return false;
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
        if (zbTestException.invalidStaticParameter2(zbDateTime.getDaysInMonth, undefined, undefined) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDateTime.getDaysInMonth, null, null) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDateTime.getDaysInMonth, 'string', 'string') === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDateTime.getDaysInMonth, true, true) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDateTime.getDaysInMonth, false, false) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDateTime.getDaysInMonth, {}, {}) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDateTime.getDaysInMonth, [], []) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDateTime.getDaysInMonth, function() {}, function() {}) === false) return false;

        // Test invalid parameter values
        if (zbTestException.invalidStaticParameter2(zbDateTime.getDaysInMonth, 1599, 1) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDateTime.getDaysInMonth, -2020, 1) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDateTime.getDaysInMonth, 4001, 1) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDateTime.getDaysInMonth, 0, 1) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDateTime.getDaysInMonth, 2020, 0) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDateTime.getDaysInMonth, 2020, -5) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDateTime.getDaysInMonth, 2020, 13) === false) return false;

        // Test months 1 to 12 (for leap year)
        if (zbDateTime.getDaysInMonth(2020, 1) !== 31) return false;
        if (zbDateTime.getDaysInMonth(2020, 2) !== 29) return false;
        if (zbDateTime.getDaysInMonth(2020, 3) !== 31) return false;
        if (zbDateTime.getDaysInMonth(2020, 4) !== 30) return false;
        if (zbDateTime.getDaysInMonth(2020, 5) !== 31) return false;
        if (zbDateTime.getDaysInMonth(2020, 6) !== 30) return false;
        if (zbDateTime.getDaysInMonth(2020, 7) !== 31) return false;
        if (zbDateTime.getDaysInMonth(2020, 8) !== 31) return false;
        if (zbDateTime.getDaysInMonth(2020, 9) !== 30) return false;
        if (zbDateTime.getDaysInMonth(2020, 10) !== 31) return false;
        if (zbDateTime.getDaysInMonth(2020, 11) !== 30) return false;
        if (zbDateTime.getDaysInMonth(2020, 12) !== 31) return false;

        // Test months 1 to 12 (for non-leap year)
        if (zbDateTime.getDaysInMonth(2019, 1) !== 31) return false;
        if (zbDateTime.getDaysInMonth(2019, 2) !== 28) return false;
        if (zbDateTime.getDaysInMonth(2019, 3) !== 31) return false;
        if (zbDateTime.getDaysInMonth(2019, 4) !== 30) return false;
        if (zbDateTime.getDaysInMonth(2019, 5) !== 31) return false;
        if (zbDateTime.getDaysInMonth(2019, 6) !== 30) return false;
        if (zbDateTime.getDaysInMonth(2019, 7) !== 31) return false;
        if (zbDateTime.getDaysInMonth(2019, 8) !== 31) return false;
        if (zbDateTime.getDaysInMonth(2019, 9) !== 30) return false;
        if (zbDateTime.getDaysInMonth(2019, 10) !== 31) return false;
        if (zbDateTime.getDaysInMonth(2019, 11) !== 30) return false;
        if (zbDateTime.getDaysInMonth(2019, 12) !== 31) return false;

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
        if (zbDateTime.getDaysInYear(2020) !== 366) return false;

        // Test for non-leap year
        if (zbDateTime.getDaysInYear(2019) !== 365) return false;

        // Return passed
        return true;
    }

    /**
     * Perform the getNow tests.
     * @return {boolean} True is passed, False if error found.
     * @private
     * @static
     */
    static _getNow() {
        // Get now
        const now = new Date();

        // Get today
        const dateTime = zbDateTime.getNow();

        // Must be the same (don't look at seconds, they maybe different)
        if (dateTime.year !== now.getFullYear() || dateTime.month !== now.getMonth() + 1 || dateTime.day !== now.getDate()) return false;
        if (dateTime.hour !== now.getHours() || dateTime.minute !== now.getMinutes()) return false;

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
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, undefined) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, null) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, 123.45) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, true) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, false) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, {}) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, []) === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, function() {}) === false) return false;

        // Test invalid parameter values
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, '') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, '1234') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, 'abcdefg') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, 'YYYY-MM-DD') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, '1599-01-01 00:00:00') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, '0000-01-01 00:00:00') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, '4001-01-01 00:00:00') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, '9999-01-01 00:00:00') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, '2020-00-01 00:00:00') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, '2020-13-01 00:00:00') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, '2020-99-01 00:00:00') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, '2020-05-00 00:00:00') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, '2020-05-32 00:00:00') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, '2020-05-99 00:00:00') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, '2019-02-29 00:00:00') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, '2019/02/01 00:00:00') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, '2019:02:01 00:00:00') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, '2020-02-03 HH:MM:SS') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, '2020-02-03 24:01:01') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, '2020-02-03 -1:01:01') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, '2020-02-03 99:01:01') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, '2020-02-03 00:60:01') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, '2020-02-03 00:99:01') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, '2020-02-03 00:00:60') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, '2020-02-03 00:00:99') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, '2020-02-03 00-00-00') === false) return false;
        if (zbTestException.invalidStaticParameter(zbDateTime.fromString, '2020-02-03 00/00/00') === false) return false;

        // Test leap year
        let dateTime = zbDateTime.fromString('2020-02-29 01:02:03');
        if (dateTime.year !== 2020 || dateTime.month !== 2 || dateTime.day !== 29) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;

        // Test leading zeros
        dateTime = zbDateTime.fromString('2020-02-03 01:02:03');
        if (dateTime.year !== 2020 || dateTime.month !== 2 || dateTime.day !== 3) return false;
        if (dateTime.hour !== 1 || dateTime.minute !== 2 || dateTime.second !== 3) return false;

        // Test non-leading zeros
        dateTime = zbDateTime.fromString('2020-10-13 11:12:13');
        if (dateTime.year !== 2020 || dateTime.month !== 10 || dateTime.day !== 13) return false;
        if (dateTime.hour !== 11 || dateTime.minute !== 12 || dateTime.second !== 13) return false;

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
        if (zbTestException.invalidStaticParameter2(zbDateTime.compare, undefined, undefined) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDateTime.compare, null, null) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDateTime.compare, 'string', 'string') === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDateTime.compare, true, true) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDateTime.compare, false, false) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDateTime.compare, {}, {}) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDateTime.compare, [], []) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbDateTime.compare, function() {}, function() {}) === false) return false;

        // Compare less then
        let result = zbDateTime.compare(new zbDateTime(2020, 2, 29, 1, 1, 1), new zbDateTime(2020, 3, 1, 1, 1, 1));
        if (result !== -1) return false;
        result = zbDateTime.compare(new zbDateTime(2020, 2, 15, 1, 1, 1), new zbDateTime(2020, 2, 16, 1, 1, 1));
        if (result !== -1) return false;
        result = zbDateTime.compare(new zbDateTime(2020, 1, 17, 1, 1, 1), new zbDateTime(2020, 2, 16, 1, 1, 1));
        if (result !== -1) return false;
        result = zbDateTime.compare(new zbDateTime(2019, 3, 17, 1, 1, 1), new zbDateTime(2020, 2, 16, 1, 1, 1));
        if (result !== -1) return false;
        result = zbDateTime.compare(new zbDateTime(2020, 1, 1, 12, 23, 34), new zbDateTime(2020, 1, 1, 12, 23, 35));
        if (result !== -1) return false;
        result = zbDateTime.compare(new zbDateTime(2020, 1, 1, 12, 22, 36), new zbDateTime(2020, 1, 1, 12, 23, 35));
        if (result !== -1) return false;
        result = zbDateTime.compare(new zbDateTime(2020, 1, 1, 11, 24, 36), new zbDateTime(2020, 1, 1, 12, 23, 35));
        if (result !== -1) return false;

        // Compare greater then
        result = zbDateTime.compare(new zbDateTime(2020, 3, 1, 1, 1, 1), new zbDateTime(2020, 2, 29, 1, 1, 1));
        if (result !== 1) return false;
        result = zbDateTime.compare(new zbDateTime(2020, 2, 15, 1, 1, 1), new zbDateTime(2020, 2, 14, 1, 1, 1));
        if (result !== 1) return false;
        result = zbDateTime.compare(new zbDateTime(2020, 2, 15, 1, 1, 1), new zbDateTime(2020, 1, 16, 1, 1, 1));
        if (result !== 1) return false;
        result = zbDateTime.compare(new zbDateTime(2020, 2, 15, 1, 1, 1), new zbDateTime(2019, 3, 16, 1, 1, 1));
        if (result !== 1) return false;
        result = zbDateTime.compare(new zbDateTime(2020, 1, 1, 12, 23, 34), new zbDateTime(2020, 1, 1, 12, 23, 33));
        if (result !== 1) return false;
        result = zbDateTime.compare(new zbDateTime(2020, 1, 1, 12, 23, 34), new zbDateTime(2020, 1, 1, 12, 21, 35));
        if (result !== 1) return false;
        result = zbDateTime.compare(new zbDateTime(2020, 1, 1, 12, 23, 34), new zbDateTime(2020, 1, 1, 11, 24, 35));
        if (result !== 1) return false;

        // Compare equal
        result = zbDateTime.compare(new zbDateTime(2020, 3, 1, 2, 3, 4), new zbDateTime(2020, 3, 1, 2, 3, 4));
        if (result !== 0) return false;

        // Compare the same date object
        const date = new zbDateTime(2020, 2, 29, 2, 3, 4);
        result = zbDateTime.compare(date, date);
        if (result !== 0) return false;

        // Return passed
        return true;
    }
}
