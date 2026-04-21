// Verified BS calendar data (source: Nepali Patro). Do not modify without a reference.
export const BS_CALENDAR_DATA: { [key: number]: number[] } = {
    2082: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2083: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2084: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2085: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2086: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2087: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2088: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2089: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2090: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
};

// Anchor: Baisakh 1, 2083 BS = April 14, 2026 AD (Tuesday). Verified: Baisakh 8, 2083 = April 21, 2026.
export const BS_AD_ANCHOR = {
    bsYear: 2083,
    bsMonth: 1,
    bsDay: 1,
    adDate: new Date(2026, 3, 14),
};

export const NEPALI_MONTHS = [
    'बैशाख', 'जेष्ठ', 'आषाढ', 'श्रावण', 'भाद्र', 'आश्विन',
    'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत्र',
];

export const ENGLISH_MONTHS = [
    'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
    'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra',
];

export const SHORT_WEEKDAYS_NEPALI = ['आ', 'सो', 'मं', 'बु', 'बि', 'शु', 'श'];
export const SHORT_WEEKDAYS_ENGLISH = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface BSDate {
    year: number;
    month: number;
    day: number;
}

export const toNepaliNumber = (num: number | string): string => {
    const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return num.toString().split('').map(c =>
        c >= '0' && c <= '9' ? nepaliDigits[parseInt(c)] : c
    ).join('');
};

export const getDaysInBSMonth = (year: number, month: number): number =>
    BS_CALENDAR_DATA[year]?.[month - 1] ?? 30;

export const getTotalDaysInBSYear = (year: number): number => {
    const data = BS_CALENDAR_DATA[year];
    return data ? data.reduce((s, d) => s + d, 0) : 365;
};

export const isBSDateValid = (year: number, month: number, day: number): boolean => {
    if (!BS_CALENDAR_DATA[year] || month < 1 || month > 12) return false;
    return day >= 1 && day <= getDaysInBSMonth(year, month);
};

// Days between two BS dates. Same-month guard prevents phantom extra days from
// cross-month accumulation when from and to are in the same month.
const daysBetween = (fy: number, fm: number, fd: number, ty: number, tm: number, td: number): number => {
    if (fy === ty && fm === tm && fd === td) return 0;
    if (fy > ty || (fy === ty && fm > tm) || (fy === ty && fm === tm && fd > td)) {
        return -daysBetween(ty, tm, td, fy, fm, fd);
    }
    if (fy === ty && fm === tm) return td - fd;

    let total = getDaysInBSMonth(fy, fm) - fd;
    let cy = fy, cm = fm + 1;
    while (cy < ty || (cy === ty && cm < tm)) {
        if (cm > 12) { cm = 1; cy++; }
        total += getDaysInBSMonth(cy, cm);
        cm++;
    }
    return total + td;
};

export const bsToAd = (bsYear: number, bsMonth: number, bsDay: number): Date => {
    const { bsYear: ry, bsMonth: rm, bsDay: rd, adDate: ra } = BS_AD_ANCHOR;
    const diff = daysBetween(ry, rm, rd, bsYear, bsMonth, bsDay);
    const result = new Date(ra);
    result.setDate(result.getDate() + diff);
    return result;
};

export const adToBs = (adDate: Date): BSDate => {
    const { bsYear: ry, bsMonth: rm, bsDay: rd, adDate: ra } = BS_AD_ANCHOR;
    let rem = Math.floor((adDate.getTime() - ra.getTime()) / 86400000);
    let year = ry, month = rm, day = rd;

    if (rem >= 0) {
        while (rem > 0) {
            const left = getDaysInBSMonth(year, month) - day + 1;
            if (rem >= left) { rem -= left; day = 1; month++; if (month > 12) { month = 1; year++; } }
            else { day += rem; rem = 0; }
        }
    } else {
        rem = Math.abs(rem);
        while (rem > 0) {
            if (rem >= day) { rem -= day; month--; if (month < 1) { month = 12; year--; } day = getDaysInBSMonth(year, month); }
            else { day -= rem; rem = 0; }
        }
    }

    return { year, month, day };
};

export const getFirstDayOfBSMonth = (year: number, month: number): number =>
    bsToAd(year, month, 1).getDay();
