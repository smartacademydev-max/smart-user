import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Production-Ready Nepali Calendar Component
 * Based on official Bikram Sambat calendar data
 * Accurate BS to AD conversion and vice versa
 */

// Comprehensive BS calendar data (2000 BS to 2100 BS)
// Each array contains the number of days in each month for that year
const BS_CALENDAR_DATA: { [key: number]: number[] } = {
    2000: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2001: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2002: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2003: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2004: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2005: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2006: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2007: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2008: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
    2009: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2010: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2011: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2012: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    2013: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2014: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2015: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2016: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    2017: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2018: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2019: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2020: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    2021: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2022: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    2023: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2024: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    2025: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2026: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2027: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2028: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2029: [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
    2030: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2031: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2032: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2033: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2034: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2035: [30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
    2036: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2037: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2038: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2039: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    2040: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2041: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2042: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2043: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    2044: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2045: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2046: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2047: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    2048: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2049: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    2050: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2051: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    2052: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2053: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    2054: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2055: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2056: [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
    2057: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2058: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2059: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2060: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2061: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2062: [30, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31],
    2063: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2064: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2065: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2066: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
    2067: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2068: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2069: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2070: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    2071: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2072: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2073: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2074: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    2075: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2076: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    2077: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2078: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    2079: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    2081: [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    2082: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    2083: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
    2084: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
    2085: [31, 32, 31, 32, 30, 31, 30, 30, 29, 30, 30, 30],
    2086: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    2087: [31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
    2088: [30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30],
    2089: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    2090: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    2091: [31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
    2092: [30, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    2093: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    2094: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
    2095: [31, 31, 32, 31, 31, 31, 30, 29, 30, 30, 30, 30],
    2096: [30, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2097: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    2098: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
    2099: [31, 31, 32, 31, 31, 31, 30, 29, 29, 30, 30, 30],
    2100: [31, 32, 31, 32, 30, 31, 30, 29, 30, 29, 30, 30],
};

const BS_AD_REFERENCE = {
    bsYear: 2000,
    bsMonth: 1,
    bsDay: 1,
    adDate: new Date(1943, 3, 14),
};

const NEPALI_MONTHS = [
    'बैशाख', 'जेष्ठ', 'आषाढ', 'श्रावण', 'भाद्र', 'आश्विन',
    'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत्र'
];

const ENGLISH_MONTHS = [
    'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
    'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
];

// const NEPALI_WEEKDAYS = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहिबार', 'शुक्रबार', 'शनिबार'];
// const ENGLISH_WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SHORT_WEEKDAYS_NEPALI = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिहि', 'शुक्र', 'शनि'];
const SHORT_WEEKDAYS_ENGLISH = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface BSDate {
    year: number;
    month: number;
    day: number;
}

/**
 * Convert English digits to Nepali digits
 */
const toNepaliNumber = (num: number | string): string => {
    const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return num.toString().split('').map(digit => {
        return digit >= '0' && digit <= '9' ? nepaliDigits[parseInt(digit)] : digit;
    }).join('');
};

/**
 * Count total days from reference BS date to target BS date
 */
const countBSDays = (fromYear: number, fromMonth: number, fromDay: number,
    toYear: number, toMonth: number, toDay: number): number => {
    let totalDays = 0;

    if (fromYear === toYear && fromMonth === toMonth && fromDay === toDay) {
        return 0;
    }

    if (toYear > fromYear || (toYear === fromYear && toMonth > fromMonth) ||
        (toYear === fromYear && toMonth === fromMonth && toDay > fromDay)) {

        totalDays += (BS_CALENDAR_DATA[fromYear][fromMonth - 1] - fromDay);

        let currentYear = fromYear;
        let currentMonth = fromMonth + 1;

        while (currentYear < toYear || (currentYear === toYear && currentMonth < toMonth)) {
            if (currentMonth > 12) {
                currentMonth = 1;
                currentYear++;
            }

            if (BS_CALENDAR_DATA[currentYear]) {
                totalDays += BS_CALENDAR_DATA[currentYear][currentMonth - 1];
            }
            currentMonth++;
        }

        totalDays += toDay;

        return totalDays;
    }

    return -countBSDays(toYear, toMonth, toDay, fromYear, fromMonth, fromDay);
};

/**
 * Convert BS date to AD date
 */
const bsToAd = (bsYear: number, bsMonth: number, bsDay: number): Date => {
    const { bsYear: refBsYear, bsMonth: refBsMonth, bsDay: refBsDay, adDate: refAdDate } = BS_AD_REFERENCE;

    const daysDiff = countBSDays(refBsYear, refBsMonth, refBsDay, bsYear, bsMonth, bsDay);

    const resultDate = new Date(refAdDate);
    resultDate.setDate(resultDate.getDate() + daysDiff);

    return resultDate;
};

/**
 * Convert AD date to BS date
 */
const adToBs = (adDate: Date): BSDate => {
    const { bsYear: refBsYear, bsMonth: refBsMonth, bsDay: refBsDay, adDate: refAdDate } = BS_AD_REFERENCE;

    // Calculate days difference
    const timeDiff = adDate.getTime() - refAdDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    let currentYear = refBsYear;
    let currentMonth = refBsMonth;
    let currentDay = refBsDay;
    let remainingDays = daysDiff;

    if (daysDiff >= 0) {
        // Forward calculation
        while (remainingDays > 0) {
            const daysInCurrentMonth = BS_CALENDAR_DATA[currentYear][currentMonth - 1];
            const daysLeftInMonth = daysInCurrentMonth - currentDay;

            if (remainingDays > daysLeftInMonth) {
                remainingDays -= (daysLeftInMonth + 1);
                currentDay = 1;
                currentMonth++;

                if (currentMonth > 12) {
                    currentMonth = 1;
                    currentYear++;
                }
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

                if (currentMonth < 1) {
                    currentMonth = 12;
                    currentYear--;
                }

                currentDay = BS_CALENDAR_DATA[currentYear][currentMonth - 1];
            } else {
                currentDay -= remainingDays;
                remainingDays = 0;
            }
        }
    }

    return { year: currentYear, month: currentMonth, day: currentDay };
};


const getFirstDayOfBSMonth = (year: number, month: number): number => {
    const adDate = bsToAd(year, month, 1);
    return adDate.getDay();
};


interface DashboardCalendarProps {
    onDateSelect?: (adDate: Date) => void;
}
export default function DashboardCalendar({ onDateSelect }: DashboardCalendarProps) {
    const today = new Date();
    const todayBS = useMemo(() => adToBs(today), [today]);

    const [currentYear, setCurrentYear] = useState(todayBS.year);
    const [currentMonth, setCurrentMonth] = useState(todayBS.month);
    const [selectedDate, setSelectedDate] = useState<BSDate | null>(null);
    const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

    const daysInMonth = BS_CALENDAR_DATA[currentYear]?.[currentMonth - 1] || 30;
    const firstDayOfMonth = useMemo(() =>
        getFirstDayOfBSMonth(currentYear, currentMonth),
        [currentYear, currentMonth]
    );

    const { i18n } = useTranslation();

    const useNepaliScript = i18n.language === "np";
    const handlePrevMonth = () => {
        if (currentMonth === 1) {
            if (BS_CALENDAR_DATA[currentYear - 1]) {
                setCurrentMonth(12);
                setCurrentYear(currentYear - 1);
            }
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 12) {
            if (BS_CALENDAR_DATA[currentYear + 1]) {
                setCurrentMonth(1);
                setCurrentYear(currentYear + 1);
            }
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handlePrevYear = () => {
        if (BS_CALENDAR_DATA[currentYear - 1]) {
            setCurrentYear(currentYear - 1);
        }
    };

    const handleNextYear = () => {
        if (BS_CALENDAR_DATA[currentYear + 1]) {
            setCurrentYear(currentYear + 1);
        }
    };

    const handleDateClick = (day: number) => {
        setSelectedDate({ year: currentYear, month: currentMonth, day });
        const adDate = bsToAd(currentYear, currentMonth, day);
        onDateSelect?.(adDate);
    };



    const handleMonthClick = (month: number) => {
        setCurrentMonth(month);
        setViewMode('month');
    };

    const handleToday = () => {
        setCurrentYear(todayBS.year);
        setCurrentMonth(todayBS.month);
        setSelectedDate(todayBS);
        setViewMode('month');
    };

    const isToday = (day: number) => {
        return todayBS.year === currentYear &&
            todayBS.month === currentMonth &&
            todayBS.day === day;
    };

    const isSelected = (day: number) => {
        return selectedDate?.year === currentYear &&
            selectedDate?.month === currentMonth &&
            selectedDate?.day === day;
    };

    const isSaturday = (day: number) => {
        const date = bsToAd(currentYear, currentMonth, day);
        return date.getDay() === 6;
    };

    const calendarDays = useMemo(() => {
        const days: (number | null)[] = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    }, [firstDayOfMonth, daysInMonth]);

    // const formatSelectedDate = () => {
    //     if (!selectedDate) return null;

    //     const adDate = bsToAd(selectedDate.year, selectedDate.month, selectedDate.day);
    //     const weekDay = adDate.getDay();

    //     if (useNepaliScript) {
    //         return {
    //             bs: `${NEPALI_WEEKDAYS[weekDay]}, ${NEPALI_MONTHS[selectedDate.month - 1]} ${toNepaliNumber(selectedDate.day)}, ${toNepaliNumber(selectedDate.year)}`,
    //             ad: `${adDate.toLocaleDateString('en-US', { weekday: 'long' })}, ${adDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
    //         };
    //     } else {
    //         return {
    //             bs: `${ENGLISH_WEEKDAYS[weekDay]}, ${ENGLISH_MONTHS[selectedDate.month - 1]} ${selectedDate.day}, ${selectedDate.year}`,
    //             ad: `${adDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`
    //         };
    //     }
    // };
    // const selectedDateFormatted = selectedDate ? formatSelectedDate() : null;
    return (
        <div className="w-full mx-auto p-6 bg-white rounded-xl ">
            <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between">
                    {viewMode === 'month' ? (
                        <>
                            <button
                                onClick={handlePrevMonth}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Previous month"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <div className="text-center">
                                <button
                                    onClick={() => setViewMode('year')}
                                    className="hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors flex gap-2 items-center"
                                >
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {useNepaliScript ? NEPALI_MONTHS[currentMonth - 1] : ENGLISH_MONTHS[currentMonth - 1]}
                                    </h2>
                                    <p className="text-lg text-gray-600">
                                        ( {useNepaliScript ? toNepaliNumber(currentYear) : currentYear})
                                    </p>
                                </button>
                            </div>

                            <button
                                onClick={handleNextMonth}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Next month"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handlePrevYear}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Previous year"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {useNepaliScript ? toNepaliNumber(currentYear) : currentYear}
                                </h2>
                                <p className="text-sm text-gray-500">Select Month</p>
                            </div>

                            <button
                                onClick={handleNextYear}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Next year"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 justify-center">
                    <button
                        onClick={handleToday}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                        {useNepaliScript ? 'आज' : 'Today'}
                    </button>
                    {viewMode === 'month' && (
                        <button
                            onClick={() => setViewMode('year')}
                            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
                        >
                            {useNepaliScript ? 'महिना छान्नुहोस्' : 'Select Month'}
                        </button>
                    )}
                </div>

                {/* {selectedDateFormatted && (
                    <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <p className="font-bold text-green-800 text-lg">{selectedDateFormatted.bs}</p>
                        <p className="text-sm text-gray-600 mt-1">{selectedDateFormatted.ad}</p>
                    </div>
                )} */}
            </div>

            {/* Calendar Content */}
            {viewMode === 'month' ? (
                <div>
                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {(useNepaliScript ? SHORT_WEEKDAYS_NEPALI : SHORT_WEEKDAYS_ENGLISH).map((day, index) => (
                            <div
                                key={index}
                                className={`text-center font-bold py-3 text-sm ${index === 6 ? 'text-red-600' : 'text-gray-700'
                                    }`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day, index) => (
                            <div key={index} className="aspect-square">
                                {day ? (
                                    <button
                                        onClick={() => handleDateClick(day)}
                                        className={`relative w-full h-full flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${isToday(day)
                                            ? 'bg-blue-600 text-white hover:bg-blue-700 ring-2 ring-blue-300'
                                            : isSelected(day)
                                                ? 'bg-green-500 text-white hover:bg-green-600'
                                                : isSaturday(day)
                                                    ? 'text-red-600 hover:bg-red-50'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {useNepaliScript ? toNepaliNumber(day) : day}
                                        <span className="absolute bottom-1 right-1 text-[10px] opacity-70 font-normal">
                                            {(() => {
                                                const ad = bsToAd(currentYear, currentMonth, day);
                                                return ad.getDate();
                                            })()}
                                        </span>
                                    </button>
                                ) : (
                                    <div className="w-full h-full bg-gray-50 rounded-lg" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* Year View - Month Selector */
                <div className="grid grid-cols-3 gap-3">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                        const isCurrentMonth = month === todayBS.month && currentYear === todayBS.year;
                        const isSelectedMonth = month === currentMonth;

                        return (
                            <button
                                key={month}
                                onClick={() => handleMonthClick(month)}
                                className={`p-4 rounded-lg text-center font-semibold transition-all ${isCurrentMonth
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : isSelectedMonth
                                        ? 'bg-green-100 text-green-800 border-2 border-green-500'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {useNepaliScript ? NEPALI_MONTHS[month - 1] : ENGLISH_MONTHS[month - 1]}
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
                <p>{useNepaliScript ? 'बिक्रम संवत पात्रो' : 'Bikram Sambat Calendar'}</p>
                <p className="mt-1">
                    {useNepaliScript
                        ? `${toNepaliNumber(2000)} - ${toNepaliNumber(2100)} सम्म उपलब्ध`
                        : 'Available from 2000 BS to 2100 BS'
                    }
                </p>
            </div>
        </div>
    );
}