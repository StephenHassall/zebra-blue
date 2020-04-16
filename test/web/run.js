/**
 * Zebra Blue: zbTestRun
 * @classdesc
 * Run all the unit testing.
 * @hideconstructor
 */
class zbTestRun {
    /**
     * Run all the unit tests.
     * @public
     * @static
     */
    static run() {
        // Create list if tests
        const testList = [
            zbValidateTest,
            zbCultureTest,
            zbDateTimeToolsTest,
            zbDateTest,
            zbTimeTest,
            zbDateTimeTest,
            zbFormatToolsTest,
            zbTimeSpanTest
        ];

        // For each test
        for (let index = 0; index < testList.length; index++) {
            // Run the test
            if (testList[index].run() === false) break;
        }

        // All done
        console.log('Finished');
    }
}
