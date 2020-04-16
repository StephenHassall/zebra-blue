/**
 * Zebra Blue: zbCultureTest
 * @classdesc
 * Unit testing the zbCulture class.
 * @hideconstructor
 */
class zbCultureTest {
    /**
     * Run the zbCulture tests.
     * @public
     * @static
     */
    static run() {
        // Perform each test
        if (zbCultureTest._constructor() === false) { console.log('zbCultureTest.constructor FAILED'); return; }
        if (zbCultureTest._add() === false) { console.log('zbCultureTest.add FAILED'); return; }
        if (zbCultureTest._find() === false) { console.log('zbCultureTest.find FAILED'); return; }
        if (zbCultureTest._default() === false) { console.log('zbCultureTest.default FAILED'); return; }
    }

    /**
     * Test the zbCulture constructor with invalid parameters.
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
     * @return {boolean} True if passed, False if error found.
     */
    static _invalidConstructor(
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
        try {
            // Create a zbCulture object with the invalid parameters
            new zbCulture(
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
                firstDayOfWeek);
        } catch (error) {
            // There must have been an error, so we have passed this test
            return true;
        }

        // Return failed
        return false;
    }

    /**
     * Perform the constructor tests.
     * @return {boolean} True is passed, False if error found.
     * @private
     * @static
     */
    static _constructor() {
        // Set default test parameters
        const p1 = 'abc';
        const p2 = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12'];
        const p3 = ['sm1', 'sm2', 'sm3', 'sm4', 'sm5', 'sm6', 'sm7', 'sm8', 'sm9', 'sm10', 'sm11', 'sm12'];
        const p4 = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7'];
        const p5 = ['sd1', 'sd2', 'sd3', 'sd4', 'sd5', 'sd6', 'sd7'];
        const p6 = [
            'o1', 'o2', 'o3', 'o4', 'o5', 'o6', 'o7', 'o8', 'o9', 'o10',
            'o11', 'o12', 'o13', 'o14', 'o15', 'o16', 'o17', 'o18', 'o19', 'o20',
            'o21', 'o22', 'o23', 'o24', 'o25', 'o26', 'o27', 'o28', 'o29', 'o30',
            'o31'];
        const p7 = 'a1';
        const p8 = 'p1';
        const p9 = 'ldt';
        const p10 = 'sdt';
        const p11 = 'ld';
        const p12 = 'sd';
        const p13 = 'lt';
        const p14 = 'st';
        const p15 = zbDayOfWeek.MONDAY;

        // Test no parameters
        if (zbCultureTest._invalidConstructor() === false) return false;

        // For each of the 15 parameters
        for (let parameter = 0; parameter < 15; parameter++) {
            // Set parameters to use
            const tp = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15];

            // Test invalid parameter types
            tp[parameter] = null;
            if (zbCultureTest._invalidConstructor(
                tp[0], tp[1], tp[2], tp[3], tp[4], tp[5], tp[6], tp[7], tp[8], tp[9], tp[10], tp[11], tp[12], tp[13], tp[14]
            ) === false) return false;
            tp[parameter] = undefined;
            if (zbCultureTest._invalidConstructor(
                tp[0], tp[1], tp[2], tp[3], tp[4], tp[5], tp[6], tp[7], tp[8], tp[9], tp[10], tp[11], tp[12], tp[13], tp[14]
            ) === false) return false;
            tp[parameter] = false;
            if (zbCultureTest._invalidConstructor(
                tp[0], tp[1], tp[2], tp[3], tp[4], tp[5], tp[6], tp[7], tp[8], tp[9], tp[10], tp[11], tp[12], tp[13], tp[14]) === false) return false;
            tp[parameter] = true;
            if (zbCultureTest._invalidConstructor(
                tp[0], tp[1], tp[2], tp[3], tp[4], tp[5], tp[6], tp[7], tp[8], tp[9], tp[10], tp[11], tp[12], tp[13], tp[14]
            ) === false) return false;
            tp[parameter] = {};
            if (zbCultureTest._invalidConstructor(
                tp[0], tp[1], tp[2], tp[3], tp[4], tp[5], tp[6], tp[7], tp[8], tp[9], tp[10], tp[11], tp[12], tp[13], tp[14]
            ) === false) return false;
            tp[parameter] = function() {};
            if (zbCultureTest._invalidConstructor(
                tp[0], tp[1], tp[2], tp[3], tp[4], tp[5], tp[6], tp[7], tp[8], tp[9], tp[10], tp[11], tp[12], tp[13], tp[14]
            ) === false) return false;

            // If array
            if (parameter === 1 || parameter === 2 || parameter === 3 || parameter === 4 || parameter === 5) {
                tp[parameter] = 'string';
                if (zbCultureTest._invalidConstructor(
                    tp[0], tp[1], tp[2], tp[3], tp[4], tp[5], tp[6], tp[7], tp[8], tp[9], tp[10], tp[11], tp[12], tp[13]
                ) === false) return false;
            } else {
                // It is a string
                tp[parameter] = [];
                if (zbCultureTest._invalidConstructor(
                    tp[0], tp[1], tp[2], tp[3], tp[4], tp[5], tp[6], tp[7], tp[8], tp[9], tp[10], tp[11], tp[12], tp[13]
                ) === false) return false;
            }
        }

        // Test invalid parameter types
        if (zbCultureTest._invalidConstructor() === false) return false;
        if (zbCultureTest._invalidConstructor(null, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15) === false) return false;
        if (zbCultureTest._invalidConstructor(undefined, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15) === false) return false;
        if (zbCultureTest._invalidConstructor('', p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15) === false) return false;
        if (zbCultureTest._invalidConstructor('', p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15) === false) return false;

        // Test invalid parameters
        if (zbCultureTest._invalidConstructor('', p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15) === false) return false;
        if (zbCultureTest._invalidConstructor(p1, ['only one'], p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15) === false) return false;
        if (zbCultureTest._invalidConstructor(p1, p2, ['only one'], p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15) === false) return false;
        if (zbCultureTest._invalidConstructor(p1, p2, p3, ['only one'], p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15) === false) return false;
        if (zbCultureTest._invalidConstructor(p1, p2, p3, p4, ['only one'], p6, p7, p8, p9, p10, p11, p12, p13, p14, p15) === false) return false;
        if (zbCultureTest._invalidConstructor(p1, p2, p3, p4, p5, ['only one'], p7, p8, p9, p10, p11, p12, p13, p14, p15) === false) return false;

        // Test valid parameters
        try {
            // Should not throw an exception for these parameters
            const culture = new zbCulture(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15);
            if (culture.code !== p1) return false;
            if (culture.monthList[0] !== p2[0]) return false;
            if (culture.shortMonthList[0] !== p3[0]) return false;
            if (culture.dayOfWeekList[0] !== p4[0]) return false;
            if (culture.shortDayOfWeekList[0] !== p5[0]) return false;
            if (culture.ordinalDayList[0] !== p6[0]) return false;
            if (culture.am !== p7) return false;
            if (culture.pm !== p8) return false;
            if (culture.longDateTime !== p9) return false;
            if (culture.shortDateTime !== p10) return false;
            if (culture.longDate !== p11) return false;
            if (culture.shortDate !== p12) return false;
            if (culture.longTime !== p13) return false;
            if (culture.shortTime !== p14) return false;
            if (culture.firstDayOfWeek !== p15) return false;
        } catch (error) {
            // Return failed
            return false;
        }

        // Return passed
        return true;
    }

    /**
     * Perform the add tests.
     * @return {boolean} True is passed, False if error found.
     * @private
     * @static
     */
    static _add() {
        // Create a test culture
        const culture = new zbCulture(
            'test',
            ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12'],
            ['sm1', 'sm2', 'sm3', 'sm4', 'sm5', 'sm6', 'sm7', 'sm8', 'sm9', 'sm10', 'sm11', 'sm12'],
            ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7'],
            ['sd1', 'sd2', 'sd3', 'sd4', 'sd5', 'sd6', 'sd7'],
            [
                'o1', 'o2', 'o3', 'o4', 'o5', 'o6', 'o7', 'o8', 'o9', 'o10',
                'o11', 'o12', 'o13', 'o14', 'o15', 'o16', 'o17', 'o18', 'o19', 'o20',
                'o21', 'o22', 'o23', 'o24', 'o25', 'o26', 'o27', 'o28', 'o29', 'o30',
                'o31'
            ],
            'a1',
            'p1',
            'ldt',
            'sdt',
            'ld',
            'sd',
            'lt',
            'st',
            zbDayOfWeek.MONDAY
        );

        // Test invalid parameters
        if (zbTestException.invalidStaticParameter(zbCulture.add, undefined) === false) return false;
        if (zbTestException.invalidStaticParameter(zbCulture.add, null) === false) return false;
        if (zbTestException.invalidStaticParameter(zbCulture.add, 123) === false) return false;
        if (zbTestException.invalidStaticParameter(zbCulture.add, 'string') === false) return false;
        if (zbTestException.invalidStaticParameter(zbCulture.add, true) === false) return false;
        if (zbTestException.invalidStaticParameter(zbCulture.add, false) === false) return false;
        if (zbTestException.invalidStaticParameter(zbCulture.add, {}) === false) return false;
        if (zbTestException.invalidStaticParameter(zbCulture.add, []) === false) return false;
        if (zbTestException.invalidStaticParameter(zbCulture.add, function() {}) === false) return false;

        // Test valid parameters
        try {
            // Add culture to the global list
            zbCulture.add(culture);

            // Look for test culture
            const findCulture = zbCulture.find('test');
            if (findCulture === null) return false;

            // Make sure its the same
            if (findCulture.code !== 'test') return false;
        } catch (error) {
            // Return failed
            return false;
        }

        // Return passed
        return true;
    }

    /**
     * Perform the find tests.
     * @return {boolean} True is passed, False if error found.
     * @private
     * @static
     */
    static _find() {
        // Test invalid parameters
        if (zbTestException.invalidStaticParameter(zbCulture.find, undefined) === false) return false;
        if (zbTestException.invalidStaticParameter(zbCulture.find, null) === false) return false;
        if (zbTestException.invalidStaticParameter(zbCulture.find, 123) === false) return false;
        if (zbTestException.invalidStaticParameter(zbCulture.find, true) === false) return false;
        if (zbTestException.invalidStaticParameter(zbCulture.find, false) === false) return false;
        if (zbTestException.invalidStaticParameter(zbCulture.find, {}) === false) return false;
        if (zbTestException.invalidStaticParameter(zbCulture.find, []) === false) return false;
        if (zbTestException.invalidStaticParameter(zbCulture.find, function() {}) === false) return false;

        // Test valid parameters
        try {
            // Look for unknown culture
            let culture = zbCulture.find('unknown');
            if (culture !== null) return false;

            // Look for default culture
            culture = zbCulture.find('en-US');
            if (culture === null) return false;

            // Look for en-GB culture
            culture = zbCulture.find('en-GB');
            if (culture === null) return false;
        } catch (error) {
            // Return failed
            return false;
        }

        // Return passed
        return true;
    }

    /**
     * Perform the default tests.
     * @return {boolean} True is passed, False if error found.
     * @private
     * @static
     */
    static _default() {
        // Test default
        try {
            // Get default
            const defaultCulture = zbCulture.default;

            // Make sure it is the default one (en-US)
            if (defaultCulture.code !== 'en-US') return false;
        } catch (error) {
            // Return failed
            return false;
        }

        // Create a test culture
        const culture = new zbCulture(
            'test',
            ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12'],
            ['sm1', 'sm2', 'sm3', 'sm4', 'sm5', 'sm6', 'sm7', 'sm8', 'sm9', 'sm10', 'sm11', 'sm12'],
            ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7'],
            ['sd1', 'sd2', 'sd3', 'sd4', 'sd5', 'sd6', 'sd7'],
            [
                'o1', 'o2', 'o3', 'o4', 'o5', 'o6', 'o7', 'o8', 'o9', 'o10',
                'o11', 'o12', 'o13', 'o14', 'o15', 'o16', 'o17', 'o18', 'o19', 'o20',
                'o21', 'o22', 'o23', 'o24', 'o25', 'o26', 'o27', 'o28', 'o29', 'o30',
                'o31'
            ],
            'a1',
            'p1',
            'ldt',
            'sdt',
            'ld',
            'sd',
            'lt',
            'st',
            zbDayOfWeek.MONDAY
        );

        // Set got error
        let gotError = true;

        // Test invalid parameters
        try {
            // Set to undefined
            zbCulture.default = undefined;
        } catch (error) {
            // Set we have got an error
            gotError = true;
        }

        // If we didn't get an error then something is wrong
        if (gotError === false) return false;

        // Test setting a new default
        try {
            // Add culture to the global list
            zbCulture.add(culture);

            // Set as the default one
            zbCulture.default = culture;

            // Get default
            const defaultCulture = zbCulture.default;

            // Make sure it is the default one (test)
            if (defaultCulture.code !== 'test') return false;
        } catch (error) {
            // Return failed
            return false;
        }

        // Reset default for testing other parts
        zbCulture.default = zbCulture.find('en-US');

        // Return passed
        return true;
    }
}
