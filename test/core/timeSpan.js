/**
 * Zebra Blue: zbTimeSpanTest
 * @classdesc
 * Unit testing the zbTimeSpan class.
 * @hideconstructor
 */
class zbTimeSpanTest {
    /**
     * Run the zbTimeSpan tests.
     * @public
     * @static
     */
    static run() {
        // Perform each test
        if (zbTimeSpanTest._constructor() === false) { console.log('zbTimeSpanTest.constructor FAILED'); return; }
        if (zbTimeSpanTest._toString() === false) { console.log('zbTimeSpanTest.toString FAILED'); return; }
        if (zbTimeSpanTest._getTimeSpan() === false) { return; }
    }

    /**
     * Test the zbSpanTime constructor with invalid parameters.
     * @param {number} day The day part of the time.
     * @param {number} hour The hour part of the time.
     * @param {number} minute The minute part of the time.
     * @param {number} second The second part of the time.
     * @return {boolean} True if passed, False if error found.
     * @private
     * @static
     */
    static _invalidConstructor(day, hour, minute, second) {
        try {
            // Create a zbTimeSpan object with the invalid parameters
            new zbTimeSpan(day, hour, minute, second);
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
        if (zbTimeSpanTest._invalidConstructor() === false) return false;
        if (zbTimeSpanTest._invalidConstructor(10) === false) return false;
        if (zbTimeSpanTest._invalidConstructor(10, 2) === false) return false;
        if (zbTimeSpanTest._invalidConstructor('23:45:56') === false) return false;
        if (zbTimeSpanTest._invalidConstructor(true, false, true, false) === false) return false;
        if (zbTimeSpanTest._invalidConstructor([]) === false) return false;
        if (zbTimeSpanTest._invalidConstructor(function() {}) === false) return false;
        if (zbTimeSpanTest._invalidConstructor({day: 1, hour: 23, minute: 45, second: 56}) === false) return false;

        // Test invalid day parameters
        if (zbTimeSpanTest._invalidConstructor(-1, 0, 0, 0) === false) return false;

        // Test invalid hour parameters
        if (zbTimeSpanTest._invalidConstructor(0, -1, 0, 0) === false) return false;
        if (zbTimeSpanTest._invalidConstructor(0, 24, 0, 0) === false) return false;
        if (zbTimeSpanTest._invalidConstructor(0, 35, 0, 1) === false) return false;

        // Test invalid minute parameters
        if (zbTimeSpanTest._invalidConstructor(0, 23, -1, 0) === false) return false;
        if (zbTimeSpanTest._invalidConstructor(0, 23, 60, 0) === false) return false;
        if (zbTimeSpanTest._invalidConstructor(0, 23, 123, 1) === false) return false;

        // Test invalid second parameters
        if (zbTimeSpanTest._invalidConstructor(0, 23, 45, -1) === false) return false;
        if (zbTimeSpanTest._invalidConstructor(0, 23, 45, 60) === false) return false;
        if (zbTimeSpanTest._invalidConstructor(0, 23, 45, 123) === false) return false;

        // Test valid time
        const timeSpan = new zbTimeSpan(2, 23, 45, 56);
        if (timeSpan.day !== 2) return false;
        if (timeSpan.hour !== 23) return false;
        if (timeSpan.minute !== 45) return false;
        if (timeSpan.second !== 56) return false;

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
        let timeSpan = new zbTimeSpan(1, 2, 3, 4);
        if (timeSpan.toString() !== '1 02:03:04') return false;

        // Test no leading zeros
        timeSpan = new zbTimeSpan(12, 23, 34, 45);
        if (timeSpan.toString() !== '12 23:34:45') return false;

        // Test zeros
        timeSpan = new zbTimeSpan(0, 0, 0, 0);
        if (timeSpan.toString() !== '0 00:00:00') return false;

        // Return passed
        return true;
    }

    /**
     * Perform the getTimeSpan tests.
     * @return {boolean} True if passed, False if error found.
     * @private
     * @static
     */
    static _getTimeSpan() {
        // Set date time 1 (2020/01/01 00:00:00)
        const dateTime1 = new zbDateTime(2020, 1, 1, 0, 0, 0);

        // Set add second
        let addSecond = 0;

        // For each day over 10 days
        for (let day = 0; day <= 10; day++) {
            // For each second in a day
            for (let second = 0; second < 86400; second++) {
                // Increase add second
                addSecond++;

                // Set date time 2
                const dateTime2 = dateTime1.addSeconds(addSecond);

                // Get first time span
                const timeSpan1 = zbTimeSpan.getTimeSpan(dateTime1, dateTime2);

                // Get second time span
                const timeSpan2 = zbTimeSpan.getTimeSpan(dateTime2, dateTime1);

                // Set error
                let error = false;

                // Compare the two time spans
                if (timeSpan1.day !== timeSpan2.day) error = true;
                if (timeSpan1.hour !== timeSpan2.hour) error = true;
                if (timeSpan1.minute !== timeSpan2.minute) error = true;
                if (timeSpan1.second !== timeSpan2.second) error = true;

                // Compare total seconds
                if (timeSpan1.getTotalSeconds() !== timeSpan2.getTotalSeconds()) error = true;

                // If no error
                if (error === false) continue;

                // Log error
                console.log(`zbTimeSpanTest.getTimeSpan FAILED ${dateTime1} to ${dateTime2}`);

                // Return failed
                return false;
            }
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
        // Create time object
        let time = new zbTime(23, 35, 10);

        // Test invalid parameters
        if (zbTestException.invalidObjectParameter(time, 'addSeconds', undefined) === false) return false;
        if (zbTestException.invalidObjectParameter(time, 'addSeconds', null) === false) return false;
        if (zbTestException.invalidObjectParameter(time, 'addSeconds', 'string') === false) return false;
        if (zbTestException.invalidObjectParameter(time, 'addSeconds', true) === false) return false;
        if (zbTestException.invalidObjectParameter(time, 'addSeconds', false) === false) return false;
        if (zbTestException.invalidObjectParameter(time, 'addSeconds', {}) === false) return false;
        if (zbTestException.invalidObjectParameter(time, 'addSeconds', []) === false) return false;
        if (zbTestException.invalidObjectParameter(time, 'addSeconds', function() {}) === false) return false;

        // Test add zero
        time = new zbTime(23, 34, 45).addSeconds(0);
        if (time.hour !== 23 || time.minute !== 34 || time.second !== 45) return false;

        // Test add
        time = new zbTime(23, 34, 45).addSeconds(1);
        if (time.hour !== 23 || time.minute !== 34 || time.second !== 46) return false;
        time = new zbTime(22, 59, 59).addSeconds(1);
        if (time.hour !== 23 || time.minute !== 0 || time.second !== 0) return false;
        time = new zbTime(22, 12, 59).addSeconds(1);
        if (time.hour !== 22 || time.minute !== 13 || time.second !== 0) return false;
        time = new zbTime(23, 34, 45).addSeconds(60);
        if (time.hour !== 23 || time.minute !== 35 || time.second !== 45) return false;
        time = new zbTime(23, 34, 45).addSeconds(60 * 60);
        if (time.hour !== 0 || time.minute !== 34 || time.second !== 45) return false;
        time = new zbTime(23, 34, 45).addSeconds(24 * 60 * 60);
        if (time.hour !== 23 || time.minute !== 34 || time.second !== 45) return false;

        // Test minus
        time = new zbTime(23, 34, 45).addSeconds(-1);
        if (time.hour !== 23 || time.minute !== 34 || time.second !== 44) return false;
        time = new zbTime(23, 0, 0).addSeconds(-1);
        if (time.hour !== 22 || time.minute !== 59 || time.second !== 59) return false;
        time = new zbTime(23, 13, 0).addSeconds(-1);
        if (time.hour !== 23 || time.minute !== 12 || time.second !== 59) return false;
        time = new zbTime(23, 34, 45).addSeconds(-60);
        if (time.hour !== 23 || time.minute !== 33 || time.second !== 45) return false;
        time = new zbTime(23, 34, 45).addSeconds(-60 * 60);
        if (time.hour !== 22 || time.minute !== 34 || time.second !== 45) return false;

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
        // Create time object
        let time = new zbTime(23, 35, 10);

        // Test invalid parameters
        if (zbTestException.invalidObjectParameter(time, 'addMinutes', undefined) === false) return false;
        if (zbTestException.invalidObjectParameter(time, 'addMinutes', null) === false) return false;
        if (zbTestException.invalidObjectParameter(time, 'addMinutes', 'string') === false) return false;
        if (zbTestException.invalidObjectParameter(time, 'addMinutes', true) === false) return false;
        if (zbTestException.invalidObjectParameter(time, 'addMinutes', false) === false) return false;
        if (zbTestException.invalidObjectParameter(time, 'addMinutes', {}) === false) return false;
        if (zbTestException.invalidObjectParameter(time, 'addMinutes', []) === false) return false;
        if (zbTestException.invalidObjectParameter(time, 'addMinutes', function() {}) === false) return false;

        // Test add zero
        time = new zbTime(23, 34, 45).addMinutes(0);
        if (time.hour !== 23 || time.minute !== 34 || time.second !== 45) return false;

        // Test add
        time = new zbTime(23, 34, 45).addMinutes(1);
        if (time.hour !== 23 || time.minute !== 35 || time.second !== 45) return false;
        time = new zbTime(22, 59, 59).addMinutes(1);
        if (time.hour !== 23 || time.minute !== 0 || time.second !== 59) return false;
        time = new zbTime(22, 12, 59).addMinutes(1);
        if (time.hour !== 22 || time.minute !== 13 || time.second !== 59) return false;
        time = new zbTime(0, 0, 0).addMinutes(1);
        if (time.hour !== 0 || time.minute !== 1 || time.second !== 0) return false;
        time = new zbTime(22, 34, 45).addMinutes(60);
        if (time.hour !== 23 || time.minute !== 34 || time.second !== 45) return false;
        time = new zbTime(23, 34, 45).addMinutes(24 * 60);
        if (time.hour !== 23 || time.minute !== 34 || time.second !== 45) return false;

        // Test minus
        time = new zbTime(23, 34, 45).addMinutes(-1);
        if (time.hour !== 23 || time.minute !== 33 || time.second !== 45) return false;
        time = new zbTime(23, 0, 0).addMinutes(-1);
        if (time.hour !== 22 || time.minute !== 59 || time.second !== 0) return false;
        time = new zbTime(0, 0, 0).addMinutes(-1);
        if (time.hour !== 23 || time.minute !== 59 || time.second !== 0) return false;
        time = new zbTime(23, 34, 45).addMinutes(-60);
        if (time.hour !== 22 || time.minute !== 34 || time.second !== 45) return false;
        time = new zbTime(23, 34, 45).addMinutes(-23 * 60);
        if (time.hour !== 0 || time.minute !== 34 || time.second !== 45) return false;

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
        // Create time object
        let time = new zbTime(23, 35, 10);

        // Test invalid parameters
        if (zbTestException.invalidObjectParameter(time, 'addHours', undefined) === false) return false;
        if (zbTestException.invalidObjectParameter(time, 'addHours', null) === false) return false;
        if (zbTestException.invalidObjectParameter(time, 'addHours', 'string') === false) return false;
        if (zbTestException.invalidObjectParameter(time, 'addHours', true) === false) return false;
        if (zbTestException.invalidObjectParameter(time, 'addHours', false) === false) return false;
        if (zbTestException.invalidObjectParameter(time, 'addHours', {}) === false) return false;
        if (zbTestException.invalidObjectParameter(time, 'addHours', []) === false) return false;
        if (zbTestException.invalidObjectParameter(time, 'addHours', function() {}) === false) return false;

        // Test add zero
        time = new zbTime(23, 34, 45).addHours(0);
        if (time.hour !== 23 || time.minute !== 34 || time.second !== 45) return false;

        // Test add
        time = new zbTime(23, 34, 45).addHours(1);
        if (time.hour !== 0 || time.minute !== 34 || time.second !== 45) return false;
        time = new zbTime(22, 59, 59).addHours(1);
        if (time.hour !== 23 || time.minute !== 59 || time.second !== 59) return false;
        time = new zbTime(0, 0, 0).addHours(1);
        if (time.hour !== 1 || time.minute !== 0 || time.second !== 0) return false;
        time = new zbTime(22, 34, 45).addHours(2);
        if (time.hour !== 0 || time.minute !== 34 || time.second !== 45) return false;
        time = new zbTime(23, 34, 45).addHours(24);
        if (time.hour !== 23 || time.minute !== 34 || time.second !== 45) return false;

        // Test minus
        time = new zbTime(23, 34, 45).addHours(-1);
        if (time.hour !== 22 || time.minute !== 34 || time.second !== 45) return false;
        time = new zbTime(23, 0, 0).addHours(-1);
        if (time.hour !== 22 || time.minute !== 0 || time.second !== 0) return false;
        time = new zbTime(0, 0, 0).addHours(-1);
        if (time.hour !== 23 || time.minute !== 0 || time.second !== 0) return false;
        time = new zbTime(23, 34, 45).addHours(-2);
        if (time.hour !== 21 || time.minute !== 34 || time.second !== 45) return false;
        time = new zbTime(23, 34, 45).addHours(-24);
        if (time.hour !== 23 || time.minute !== 34 || time.second !== 45) return false;

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
        // Create time object
        const time = new zbTime(1, 2, 3);

        // Test invalid parameters
        if (zbTestException.invalidObjectParameter2(time, 'format', 'HH', null) === false) return false;
        if (zbTestException.invalidObjectParameter2(time, 'format', 'HH', 'string') === false) return false;
        if (zbTestException.invalidObjectParameter2(time, 'format', 'HH', true) === false) return false;
        if (zbTestException.invalidObjectParameter2(time, 'format', 'HH', false) === false) return false;
        if (zbTestException.invalidObjectParameter2(time, 'format', 'HH', {}) === false) return false;
        if (zbTestException.invalidObjectParameter2(time, 'format', 'HH', []) === false) return false;
        if (zbTestException.invalidObjectParameter2(time, 'format', 'HH', function() {}) === false) return false;
        if (zbTestException.invalidObjectParameter2(time, 'format', null, zbCulture.default) === false) return false;
        if (zbTestException.invalidObjectParameter2(time, 'format', true, zbCulture.default) === false) return false;
        if (zbTestException.invalidObjectParameter2(time, 'format', false, zbCulture.default) === false) return false;
        if (zbTestException.invalidObjectParameter2(time, 'format', {}, zbCulture.default) === false) return false;
        if (zbTestException.invalidObjectParameter2(time, 'format', [], zbCulture.default) === false) return false;
        if (zbTestException.invalidObjectParameter2(time, 'format', function() {}, zbCulture.default) === false) return false;

        // Defaults
        let text = time.format();
        if (text.length === 0) return false;

        // Hour in default culture (en-US)
        text = time.format('HH');
        if (text !== '01') return false;

        // Hour in fr-FR culture
        text = time.format('HH', zbCulture.find('fr-FR'));
        if (text !== '01') return false;

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
        if (zbTestException.invalidStaticParameter(zbTime.fromString, undefined) === false) return false;
        if (zbTestException.invalidStaticParameter(zbTime.fromString, null) === false) return false;
        if (zbTestException.invalidStaticParameter(zbTime.fromString, 123.45) === false) return false;
        if (zbTestException.invalidStaticParameter(zbTime.fromString, true) === false) return false;
        if (zbTestException.invalidStaticParameter(zbTime.fromString, false) === false) return false;
        if (zbTestException.invalidStaticParameter(zbTime.fromString, {}) === false) return false;
        if (zbTestException.invalidStaticParameter(zbTime.fromString, []) === false) return false;
        if (zbTestException.invalidStaticParameter(zbTime.fromString, function() {}) === false) return false;

        // Test invalid parameter values
        if (zbTestException.invalidStaticParameter(zbTime.fromString, '') === false) return false;
        if (zbTestException.invalidStaticParameter(zbTime.fromString, '1234') === false) return false;
        if (zbTestException.invalidStaticParameter(zbTime.fromString, 'abcdefg') === false) return false;
        if (zbTestException.invalidStaticParameter(zbTime.fromString, 'HH:MM:SS') === false) return false;
        if (zbTestException.invalidStaticParameter(zbTime.fromString, '24:01:01') === false) return false;
        if (zbTestException.invalidStaticParameter(zbTime.fromString, '-1:01:01') === false) return false;
        if (zbTestException.invalidStaticParameter(zbTime.fromString, '99:01:01') === false) return false;
        if (zbTestException.invalidStaticParameter(zbTime.fromString, '00:60:01') === false) return false;
        if (zbTestException.invalidStaticParameter(zbTime.fromString, '00:99:01') === false) return false;
        if (zbTestException.invalidStaticParameter(zbTime.fromString, '00:00:60') === false) return false;
        if (zbTestException.invalidStaticParameter(zbTime.fromString, '00:00:99') === false) return false;
        if (zbTestException.invalidStaticParameter(zbTime.fromString, '00-00-00') === false) return false;
        if (zbTestException.invalidStaticParameter(zbTime.fromString, '00/00/00') === false) return false;

        // Test zeros
        let time = zbTime.fromString('00:00:00');
        if (time.hour !== 0 || time.minute !== 0 || time.second !== 0) return false;

        // Test leading zeros
        time = zbTime.fromString('01:02:03');
        if (time.hour !== 1 || time.minute !== 2 || time.second !== 3) return false;

        // Test non-leading zeros
        time = zbTime.fromString('11:12:13');
        if (time.hour !== 11 || time.minute !== 12 || time.second !== 13) return false;

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
        if (zbTestException.invalidStaticParameter2(zbTime.compare, undefined, undefined) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbTime.compare, null, null) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbTime.compare, 'string', 'string') === false) return false;
        if (zbTestException.invalidStaticParameter2(zbTime.compare, true, true) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbTime.compare, false, false) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbTime.compare, {}, {}) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbTime.compare, [], []) === false) return false;
        if (zbTestException.invalidStaticParameter2(zbTime.compare, function() {}, function() {}) === false) return false;

        // Compare less then
        let result = zbTime.compare(new zbTime(12, 23, 34), new zbTime(12, 23, 35));
        if (result !== -1) return false;
        result = zbTime.compare(new zbTime(12, 22, 36), new zbTime(12, 23, 35));
        if (result !== -1) return false;
        result = zbTime.compare(new zbTime(11, 24, 36), new zbTime(12, 23, 35));
        if (result !== -1) return false;

        // Compare greater then
        result = zbTime.compare(new zbTime(12, 23, 34), new zbTime(12, 23, 33));
        if (result !== 1) return false;
        result = zbTime.compare(new zbTime(12, 23, 34), new zbTime(12, 21, 35));
        if (result !== 1) return false;
        result = zbTime.compare(new zbTime(12, 23, 34), new zbTime(11, 24, 35));
        if (result !== 1) return false;

        // Compare equal
        result = zbTime.compare(new zbTime(12, 23, 34), new zbTime(12, 23, 34));
        if (result !== 0) return false;

        // Compare the same time object
        const time = new zbTime(12, 23, 34);
        result = zbTime.compare(time, time);
        if (result !== 0) return false;

        // Return passed
        return true;
    }
}
