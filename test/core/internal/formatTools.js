/**
 * Zebra Blue: zbFormatToolsTest
 * @classdesc
 * Unit testing the zbFormatTools class.
 * @hideconstructor
 */
class zbFormatToolsTest {
    /**
     * Run the zbFormatTools tests.
     * @public
     * @static
     */
    static run() {
        // Perform each test
        if (zbFormatToolsTest._formatDate() === false) { console.log('zbCultureTest.formatDate FAILED'); return; }
        if (zbFormatToolsTest._formatTime() === false) { console.log('zbCultureTest.formatTime FAILED'); return; }
    }

    /**
     * Perform the format date tests.
     * @return {boolean} True is passed, False if error found.
     * @private
     * @static
     */
    static _formatDate() {
        // Get culture
        const culture = zbCulture.find('en-GB');

        // Set date
        const date = new zbDate(2004, 3, 2);

        // Set second date
        const date2 = new zbDate(2019, 12, 23);

        try {
            // Years 2004-03-02
            let yearText = zbFormatTools.formatDate('yyyy', culture, date);
            if (yearText !== '2004') return false;
            yearText = zbFormatTools.formatDate('yy', culture, date);
            if (yearText !== '04') return false;
            yearText = zbFormatTools.formatDate('y', culture, date);
            if (yearText !== '4') return false;

            // Years 2019-12-23
            yearText = zbFormatTools.formatDate('yyyy', culture, date2);
            if (yearText !== '2019') return false;
            yearText = zbFormatTools.formatDate('yy', culture, date2);
            if (yearText !== '19') return false;
            yearText = zbFormatTools.formatDate('y', culture, date2);
            if (yearText !== '19') return false;

            // Month 2004-03-02
            let monthText = zbFormatTools.formatDate('MMMM', culture, date);
            if (monthText !== 'March') return false;
            monthText = zbFormatTools.formatDate('MMM', culture, date);
            if (monthText !== 'Mar') return false;
            monthText = zbFormatTools.formatDate('MM', culture, date);
            if (monthText !== '03') return false;
            monthText = zbFormatTools.formatDate('M', culture, date);
            if (monthText !== '3') return false;

            // Month 2019-12-23
            monthText = zbFormatTools.formatDate('MMMM', culture, date2);
            if (monthText !== 'December') return false;
            monthText = zbFormatTools.formatDate('MMM', culture, date2);
            if (monthText !== 'Dec') return false;
            monthText = zbFormatTools.formatDate('MM', culture, date2);
            if (monthText !== '12') return false;
            monthText = zbFormatTools.formatDate('M', culture, date2);
            if (monthText !== '12') return false;

            // Day 2004-03-02
            let dayText = zbFormatTools.formatDate('dddd', culture, date);
            if (dayText !== 'Tuesday') return false;
            dayText = zbFormatTools.formatDate('ddd', culture, date);
            if (dayText !== 'Tue') return false;
            dayText = zbFormatTools.formatDate('dd', culture, date);
            if (dayText !== '02') return false;
            dayText = zbFormatTools.formatDate('d', culture, date);
            if (dayText !== '2') return false;

            // Day 2019-12-23
            dayText = zbFormatTools.formatDate('dddd', culture, date2);
            if (dayText !== 'Monday') return false;
            dayText = zbFormatTools.formatDate('ddd', culture, date2);
            if (dayText !== 'Mon') return false;
            dayText = zbFormatTools.formatDate('dd', culture, date2);
            if (dayText !== '23') return false;
            dayText = zbFormatTools.formatDate('d', culture, date2);
            if (dayText !== '23') return false;

            // R/r 2004-03-02
            let rText = zbFormatTools.formatDate('r', culture, date);
            if (rText !== 'nd') return false;
            rText = zbFormatTools.formatDate('R', culture, date);
            if (rText !== 'ND') return false;

            // R/r 2019-12-23
            rText = zbFormatTools.formatDate('r', culture, date2);
            if (rText !== 'rd') return false;
            rText = zbFormatTools.formatDate('R', culture, date2);
            if (rText !== 'RD') return false;

            // Escape characters
            let escapeText = zbFormatTools.formatDate('/y', culture, date);
            if (escapeText !== 'y') return false;
            escapeText = zbFormatTools.formatDate('/M', culture, date);
            if (escapeText !== 'M') return false;
            escapeText = zbFormatTools.formatDate('/d', culture, date);
            if (escapeText !== 'd') return false;
            escapeText = zbFormatTools.formatDate('/r', culture, date);
            if (escapeText !== 'r') return false;
            escapeText = zbFormatTools.formatDate('/R', culture, date);
            if (escapeText !== 'R') return false;

            // Long date 2004-03-02 ('dddd, d MMMM yyyy')
            let longDate = zbFormatTools.formatDate(culture.longDate, culture, date);
            if (longDate !== 'Tuesday, 2 March 2004') return false;

            // Long date 2019-12-23 ('dddd, d MMMM yyyy')
            longDate = zbFormatTools.formatDate(culture.longDate, culture, date2);
            if (longDate !== 'Monday, 23 December 2019') return false;
        } catch (error) {
            // Return failed
            return false;
        }

        // Return passed
        return true;
    }

    /**
     * Perform the format time tests.
     * @return {boolean} True is passed, False if error found.
     * @private
     * @static
     */
    static _formatTime() {
        // Get culture
        const culture = zbCulture.find('en-GB');

        // Set time
        const time = new zbTime(4, 3, 2);

        // Set second time
        const time2 = new zbTime(11, 12, 13);

        // Set third time
        const time3 = new zbTime(14, 15, 16);

        try {
            // Hours 04:03:02
            let hourText = zbFormatTools.formatTime('h', culture, time);
            if (hourText !== '4') return false;
            hourText = zbFormatTools.formatTime('hh', culture, time);
            if (hourText !== '04') return false;
            hourText = zbFormatTools.formatTime('H', culture, time);
            if (hourText !== '4') return false;
            hourText = zbFormatTools.formatTime('HH', culture, time);
            if (hourText !== '04') return false;

            // Hours 11:12:13
            hourText = zbFormatTools.formatTime('h', culture, time2);
            if (hourText !== '11') return false;
            hourText = zbFormatTools.formatTime('hh', culture, time2);
            if (hourText !== '11') return false;
            hourText = zbFormatTools.formatTime('H', culture, time2);
            if (hourText !== '11') return false;
            hourText = zbFormatTools.formatTime('HH', culture, time2);
            if (hourText !== '11') return false;

            // Hours 14:15:16
            hourText = zbFormatTools.formatTime('h', culture, time3);
            if (hourText !== '2') return false;
            hourText = zbFormatTools.formatTime('hh', culture, time3);
            if (hourText !== '02') return false;
            hourText = zbFormatTools.formatTime('H', culture, time3);
            if (hourText !== '14') return false;
            hourText = zbFormatTools.formatTime('HH', culture, time3);
            if (hourText !== '14') return false;

            // Minutes 04:03:02
            let minuteText = zbFormatTools.formatTime('m', culture, time);
            if (minuteText !== '3') return false;
            minuteText = zbFormatTools.formatTime('mm', culture, time);
            if (minuteText !== '03') return false;

            // Minutes 11:12:13
            minuteText = zbFormatTools.formatTime('m', culture, time2);
            if (minuteText !== '12') return false;
            minuteText = zbFormatTools.formatTime('mm', culture, time2);
            if (minuteText !== '12') return false;

            // Seconds 04:03:02
            let secondText = zbFormatTools.formatTime('s', culture, time);
            if (secondText !== '2') return false;
            secondText = zbFormatTools.formatTime('ss', culture, time);
            if (secondText !== '02') return false;

            // Seconds 11:12:13
            secondText = zbFormatTools.formatTime('s', culture, time2);
            if (secondText !== '13') return false;
            secondText = zbFormatTools.formatTime('ss', culture, time2);
            if (secondText !== '13') return false;

            // AM/PM 11:13:14
            let ampmText = zbFormatTools.formatTime('t', culture, time2);
            if (ampmText !== 'am') return false;
            ampmText = zbFormatTools.formatTime('T', culture, time2);
            if (ampmText !== 'AM') return false;

            // AM/PM 14:15:16
            ampmText = zbFormatTools.formatTime('t', culture, time3);
            if (ampmText !== 'pm') return false;
            ampmText = zbFormatTools.formatTime('T', culture, time3);
            if (ampmText !== 'PM') return false;

            // Escape characters
            let escapeText = zbFormatTools.formatTime('/h', culture, time);
            if (escapeText !== 'h') return false;
            escapeText = zbFormatTools.formatTime('/H', culture, time);
            if (escapeText !== 'H') return false;
            escapeText = zbFormatTools.formatTime('/m', culture, time);
            if (escapeText !== 'm') return false;
            escapeText = zbFormatTools.formatTime('/s', culture, time);
            if (escapeText !== 's') return false;
            escapeText = zbFormatTools.formatTime('/t', culture, time);
            if (escapeText !== 't') return false;
            escapeText = zbFormatTools.formatTime('/T', culture, time);
            if (escapeText !== 'T') return false;

            // Long time 04:03:02 ('HH:mm:ss')
            const longTime = zbFormatTools.formatTime(culture.longTime, culture, time);
            if (longTime !== '04:03:02') return false;
        } catch (error) {
            // Return failed
            return false;
        }

        // Return passed
        return true;
    }
}
