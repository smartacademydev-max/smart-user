const BS_CALENDAR_DATA: { [key: number]: number[] } = {
    2082: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 29],
    2083: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2084: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2085: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2086: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2087: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2088: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2089: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2090: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
};

const REFERENCE = { bsYear: 2082, bsMonth: 1, bsDay: 1, adDate: new Date(2025, 3, 14) };

const NEPALI_MONTHS_EN = ['Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'];
const NEPALI_MONTHS_NP = ['बैशाख', 'जेष्ठ', 'आषाढ', 'श्रावण', 'भाद्र', 'आश्विन', 'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत्र'];

export function toNepaliDigits(num: number | string): string {
    const d = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return num.toString().split('').map(c => (c >= '0' && c <= '9' ? d[+c] : c)).join('');
}

export function adToBs(adDate: Date): { year: number; month: number; day: number } {
    const { bsYear: refBsYear, bsMonth: refBsMonth, bsDay: refBsDay, adDate: refAdDate } = REFERENCE;

    const timeDiff = adDate.getTime() - refAdDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    let currentYear = refBsYear;
    let currentMonth = refBsMonth;
    let currentDay = refBsDay;
    let remainingDays = daysDiff;

    if (daysDiff >= 0) {
        while (remainingDays > 0) {
            const daysInCurrentMonth = BS_CALENDAR_DATA[currentYear][currentMonth - 1];
            const daysLeftInMonth = daysInCurrentMonth - currentDay + 1;

            if (remainingDays >= daysLeftInMonth) {
                remainingDays -= daysLeftInMonth;
                currentDay = 1;
                currentMonth++;
                if (currentMonth > 12) { currentMonth = 1; currentYear++; }
            } else {
                currentDay += remainingDays;
                remainingDays = 0;
            }
        }
    } else {
        remainingDays = Math.abs(daysDiff);
        while (remainingDays > 0) {
            if (remainingDays >= currentDay) {
                remainingDays -= currentDay;
                currentMonth--;
                if (currentMonth < 1) { currentMonth = 12; currentYear--; }
                currentDay = BS_CALENDAR_DATA[currentYear][currentMonth - 1];
            } else {
                currentDay -= remainingDays;
                remainingDays = 0;
            }
        }
    }

    return { year: currentYear, month: currentMonth, day: currentDay };
}

export function getTodayBSFormatted(lang: 'en' | 'np' = 'en'): string {
    const { year, month, day } = adToBs(new Date());
    if (lang === 'np') {
        return `${NEPALI_MONTHS_NP[month - 1]} ${toNepaliDigits(day)}, ${toNepaliDigits(year)}`;
    }
    return `${NEPALI_MONTHS_EN[month - 1]} ${day}, ${year}`;
}

export function getTodayADFormatted(): string {
    const today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
}
