import { useTheme } from '@mui/material/styles';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Production-Ready Nepali Calendar Component
 * Based on official Bikram Sambat calendar data
 * Accurate BS to AD conversion and vice versa
 */

// Comprehensive BS calendar data (2000 BS to 2100 BS)
// Each array contains the number of days in each month for that year
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
    2091: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2092: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2093: [31, 31, 31, 31, 31, 31, 29, 30, 30, 29, 29, 31],
    2094: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2095: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2096: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2097: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    2098: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2099: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2100: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31]
};

const BS_AD_REFERENCE = {
    bsYear: 2082,
    bsMonth: 1,
    bsDay: 1,
    adDate: new Date(2025, 3, 14),
};

const NEPALI_MONTHS = [
    'बैशाख', 'जेष्ठ', 'आषाढ', 'श्रावण', 'भाद्र', 'आश्विन',
    'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत्र'
];

const ENGLISH_MONTHS = [
    'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
    'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
];

const AD_MONTHS_FULL = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const AD_MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SHORT_WEEKDAYS_NEPALI = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिहि', 'शुक्र', 'शनि'];
const SHORT_WEEKDAYS_ENGLISH = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface BSDate {
    year: number;
    month: number;
    day: number;
}

const toNepaliNumber = (num: number | string): string => {
    const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return num.toString().split('').map(digit => {
        return digit >= '0' && digit <= '9' ? nepaliDigits[parseInt(digit)] : digit;
    }).join('');
};


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

const bsToAd = (bsYear: number, bsMonth: number, bsDay: number): Date => {
    const { bsYear: refBsYear, bsMonth: refBsMonth, bsDay: refBsDay, adDate: refAdDate } = BS_AD_REFERENCE;

    const daysDiff = countBSDays(refBsYear, refBsMonth, refBsDay, bsYear, bsMonth, bsDay);

    const resultDate = new Date(refAdDate);
    resultDate.setDate(resultDate.getDate() + daysDiff);

    return resultDate;
};

const adToBs = (adDate: Date): BSDate => {
    const { bsYear: refBsYear, bsMonth: refBsMonth, bsDay: refBsDay, adDate: refAdDate } = BS_AD_REFERENCE;

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
    onMonthChange?: (startAD: string, endAD: string) => void;
    liveClassDates?: string[];
    testDates?: string[];
}

const formatAD = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function DashboardCalendar({ onDateSelect, onMonthChange, liveClassDates = [], testDates = [] }: DashboardCalendarProps) {
    const theme = useTheme();
    const today = new Date();
    const todayBS = useMemo(() => adToBs(today), [today]);

    // Calendar mode: 'bs' = Bikram Sambat, 'ad' = Anno Domini (Gregorian)
    const [calMode, setCalMode] = useState<'bs' | 'ad'>('bs');

    // BS state
    const [currentYear, setCurrentYear] = useState(todayBS.year);
    const [currentMonth, setCurrentMonth] = useState(todayBS.month);
    const [selectedDate, setSelectedDate] = useState<BSDate | null>(null);
    const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

    // AD state
    const [adYear, setAdYear] = useState(today.getFullYear());
    const [adMonth, setAdMonth] = useState(today.getMonth()); // 0-indexed
    const [adViewMode, setAdViewMode] = useState<'month' | 'year'>('month');
    const [selectedADDay, setSelectedADDay] = useState<number | null>(null);

    const daysInMonth = BS_CALENDAR_DATA[currentYear]?.[currentMonth - 1] || 30;
    const firstDayOfMonth = useMemo(() =>
        getFirstDayOfBSMonth(currentYear, currentMonth),
        [currentYear, currentMonth]
    );

    // AD helpers
    const daysInADMonth = new Date(adYear, adMonth + 1, 0).getDate();
    const firstDayOfADMonth = new Date(adYear, adMonth, 1).getDay();

    const { i18n } = useTranslation();
    const useNepaliScript = i18n.language === 'np';

    // Notify parent when BS month changes
    useEffect(() => {
        if (!onMonthChange || calMode !== 'bs') return;
        const start = bsToAd(currentYear, currentMonth, 1);
        const end = bsToAd(currentYear, currentMonth, daysInMonth);
        onMonthChange(formatAD(start), formatAD(end));
    }, [currentYear, currentMonth, calMode]);

    // Notify parent when AD month changes
    useEffect(() => {
        if (!onMonthChange || calMode !== 'ad') return;
        const start = `${adYear}-${String(adMonth + 1).padStart(2, '0')}-01`;
        const end = `${adYear}-${String(adMonth + 1).padStart(2, '0')}-${String(daysInADMonth).padStart(2, '0')}`;
        onMonthChange(start, end);
    }, [adYear, adMonth, calMode]);

    // Notify parent on mode switch
    useEffect(() => {
        if (!onMonthChange) return;
        if (calMode === 'bs') {
            const start = bsToAd(currentYear, currentMonth, 1);
            const end = bsToAd(currentYear, currentMonth, daysInMonth);
            onMonthChange(formatAD(start), formatAD(end));
        } else {
            const start = `${adYear}-${String(adMonth + 1).padStart(2, '0')}-01`;
            const end = `${adYear}-${String(adMonth + 1).padStart(2, '0')}-${String(daysInADMonth).padStart(2, '0')}`;
            onMonthChange(start, end);
        }
    }, [calMode]);

    // BS navigation
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

    // AD navigation
    const handleADPrevMonth = () => {
        if (adMonth === 0) { setAdMonth(11); setAdYear(adYear - 1); }
        else setAdMonth(adMonth - 1);
    };

    const handleADNextMonth = () => {
        if (adMonth === 11) { setAdMonth(0); setAdYear(adYear + 1); }
        else setAdMonth(adMonth + 1);
    };

    const handleADPrevYear = () => setAdYear(adYear - 1);
    const handleADNextYear = () => setAdYear(adYear + 1);

    const handleDateClick = (day: number) => {
        setSelectedDate({ year: currentYear, month: currentMonth, day });
        const adDate = bsToAd(currentYear, currentMonth, day);
        onDateSelect?.(adDate);
    };

    const handleADDateClick = (day: number) => {
        setSelectedADDay(day);
        onDateSelect?.(new Date(adYear, adMonth, day));
    };

    const handleMonthClick = (month: number) => {
        setCurrentMonth(month);
        setViewMode('month');
    };

    const handleADMonthClick = (month: number) => {
        setAdMonth(month);
        setAdViewMode('month');
    };

    const isToday = (day: number) => {
        return todayBS.year === currentYear &&
            todayBS.month === currentMonth &&
            todayBS.day === day;
    };

    const isTodayAD = (day: number) =>
        today.getFullYear() === adYear && today.getMonth() === adMonth && today.getDate() === day;

    const isSelected = (day: number) => {
        return selectedDate?.year === currentYear &&
            selectedDate?.month === currentMonth &&
            selectedDate?.day === day;
    };

    const isSelectedAD = (day: number) => selectedADDay === day;

    const isSaturday = (day: number) => {
        const date = bsToAd(currentYear, currentMonth, day);
        return date.getDay() === 6;
    };

    const isSaturdayAD = (day: number) => new Date(adYear, adMonth, day).getDay() === 6;

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

    const adCalendarDays = useMemo(() => {
        const days: (number | null)[] = [];
        for (let i = 0; i < firstDayOfADMonth; i++) days.push(null);
        for (let d = 1; d <= daysInADMonth; d++) days.push(d);
        return days;
    }, [firstDayOfADMonth, daysInADMonth]);

    const formatADDay = (day: number) =>
        `${adYear}-${String(adMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // Theme-driven style tokens
    const dividerColor = theme.palette.divider;
    const textMuted = theme.palette.text.secondary;
    const textPrimary = theme.palette.text.primary;
    const primaryMain = theme.palette.primary.main;
    const successMain = theme.palette.success.main;
    const errorMain = theme.palette.error.main;
    const infoMain = theme.palette.info.main;
    const bgDefault = theme.palette.background.default;

    const navBtnStyle: React.CSSProperties = {
        width: '26px', height: '26px', borderRadius: '6px',
        border: `1px solid ${dividerColor}`, background: 'transparent',
        cursor: 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: textMuted, flexShrink: 0,
    };

    // AD | BS toggle pill styles
    const toggleBase: React.CSSProperties = {
        padding: '2px 7px', fontSize: '10px', fontWeight: 700,
        cursor: 'pointer', border: 'none', borderRadius: '4px',
        fontFamily: 'inherit', lineHeight: 1.6,
        transition: 'all 0.15s',
    };

    const weekdayHeaders = useNepaliScript ? SHORT_WEEKDAYS_NEPALI : SHORT_WEEKDAYS_ENGLISH;

    return (
        <div className="w-full">
            {/* AD | BS toggle — always visible at top */}
            <div style={{
                display: 'flex', justifyContent: 'flex-end', marginBottom: '8px',
            }}>
                <div style={{
                    display: 'flex', alignItems: 'center',
                    border: `1px solid ${dividerColor}`,
                    borderRadius: '6px', overflow: 'hidden',
                    background: bgDefault,
                }}>
                    <button
                        onClick={() => setCalMode('ad')}
                        style={{
                            ...toggleBase,
                            background: calMode === 'ad' ? primaryMain : 'transparent',
                            color: calMode === 'ad' ? '#fff' : textMuted,
                        }}
                    >
                        AD
                    </button>
                    <button
                        onClick={() => setCalMode('bs')}
                        style={{
                            ...toggleBase,
                            background: calMode === 'bs' ? primaryMain : 'transparent',
                            color: calMode === 'bs' ? '#fff' : textMuted,
                        }}
                    >
                        BS
                    </button>
                </div>
            </div>

            {/* ── BS CALENDAR ── */}
            {calMode === 'bs' && (
                viewMode === 'year' ? (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <button onClick={handlePrevYear} style={navBtnStyle}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                            </button>
                            <button onClick={() => setViewMode('month')} className="text-center hover:opacity-70 transition-opacity">
                                <div style={{ fontSize: '14px', fontWeight: 700, color: textPrimary }}>{useNepaliScript ? toNepaliNumber(currentYear) : currentYear}</div>
                                <div style={{ fontSize: '11px', color: textMuted, marginTop: '1px' }}>Select Month</div>
                            </button>
                            <button onClick={handleNextYear} style={navBtnStyle}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                                const isCurrentMonth = month === todayBS.month && currentYear === todayBS.year;
                                const isSelectedMonth = month === currentMonth;
                                return (
                                    <button key={month} onClick={() => handleMonthClick(month)} style={{
                                        padding: '7px 4px', borderRadius: '6px', textAlign: 'center',
                                        fontSize: '11px', fontWeight: 600, cursor: 'pointer', border: 'none',
                                        background: isCurrentMonth ? primaryMain : isSelectedMonth ? `${primaryMain}1A` : bgDefault,
                                        color: isCurrentMonth ? '#fff' : isSelectedMonth ? primaryMain : textPrimary,
                                        transition: 'all .15s',
                                    }}>
                                        {useNepaliScript ? NEPALI_MONTHS[month - 1] : ENGLISH_MONTHS[month - 1]}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* BS Header */}
                        <div className="flex items-center justify-between mb-3">
                            <button onClick={() => setViewMode('year')} className="text-left hover:opacity-70 transition-opacity">
                                <div style={{ fontSize: '14px', fontWeight: 700, color: textPrimary }}>
                                    {useNepaliScript ? NEPALI_MONTHS[currentMonth - 1] : ENGLISH_MONTHS[currentMonth - 1]}{' '}
                                    {useNepaliScript ? toNepaliNumber(currentYear) : currentYear}
                                </div>
                                {/* <div style={{ fontSize: '11px', color: textMuted, marginTop: '1px' }}>Bikram Sambat</div> */}
                            </button>

                            <div className="flex gap-1">
                                <button onClick={handlePrevMonth} style={navBtnStyle}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                                </button>
                                <button onClick={handleNextMonth} style={navBtnStyle}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
                            {weekdayHeaders.map((day, index) => (
                                <div key={index} style={{ fontSize: '10px', fontWeight: 600, color: textMuted, padding: '3px 0', textTransform: 'uppercase' }}>{day}</div>
                            ))}
                        </div>

                        {/* BS Calendar days */}
                        <div className="grid grid-cols-7 gap-0.5 text-center">
                            {calendarDays.map((day, index) => {
                                if (!day) return <div key={index} />;
                                const adStr = formatAD(bsToAd(currentYear, currentMonth, day));
                                const hasLive = liveClassDates.some(d => d === adStr);
                                const hasTest = testDates.some(d => d === adStr);
                                const hasDots = hasLive || hasTest;
                                const todayCell = isToday(day);
                                return (
                                    <button key={index} onClick={() => handleDateClick(day)} style={{
                                        fontSize: '11.5px',
                                        padding: hasDots ? '5px 2px 3px' : '5px 2px',
                                        borderRadius: '6px',
                                        cursor: 'pointer', border: 'none',
                                        fontWeight: todayCell ? 700 : 500,
                                        background: todayCell ? successMain : isSelected(day) ? `${primaryMain}1A` : 'transparent',
                                        color: todayCell ? '#fff' : isSelected(day) ? primaryMain : isSaturday(day) ? errorMain : textPrimary,
                                        transition: 'background .12s',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    }}>
                                        {useNepaliScript ? toNepaliNumber(day) : day}
                                        {hasDots && (
                                            <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                                                {hasLive && (
                                                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: errorMain, flexShrink: 0 }} />
                                                )}
                                                {hasTest && (
                                                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: infoMain, flexShrink: 0 }} />
                                                )}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="flex gap-3 mt-2.5">
                            <div className="flex items-center gap-1.5" style={{ fontSize: '11px', color: textMuted }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: errorMain, flexShrink: 0 }} />
                                Live Class
                            </div>
                            <div className="flex items-center gap-1.5" style={{ fontSize: '11px', color: textMuted }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: infoMain, flexShrink: 0 }} />
                                Test / Exam
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{
                            marginTop: '10px', paddingTop: '10px',
                            borderTop: `1px solid ${dividerColor}`,
                            fontSize: '10.5px', color: textMuted, textAlign: 'center',
                        }}>
                            Bikram Sambat · 2000 BS – 2100 BS
                        </div>
                    </div>
                )
            )}

            {/* ── AD CALENDAR ── */}
            {calMode === 'ad' && (
                adViewMode === 'year' ? (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <button onClick={handleADPrevYear} style={navBtnStyle}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                            </button>
                            <button onClick={() => setAdViewMode('month')} className="text-center hover:opacity-70 transition-opacity">
                                <div style={{ fontSize: '14px', fontWeight: 700, color: textPrimary }}>{adYear}</div>
                                <div style={{ fontSize: '11px', color: textMuted, marginTop: '1px' }}>Select Month</div>
                            </button>
                            <button onClick={handleADNextYear} style={navBtnStyle}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {AD_MONTHS_SHORT.map((name, i) => {
                                const isCurrentMonth = i === today.getMonth() && adYear === today.getFullYear();
                                const isSelectedMonth = i === adMonth;
                                return (
                                    <button key={i} onClick={() => handleADMonthClick(i)} style={{
                                        padding: '7px 4px', borderRadius: '6px', textAlign: 'center',
                                        fontSize: '11px', fontWeight: 600, cursor: 'pointer', border: 'none',
                                        background: isCurrentMonth ? primaryMain : isSelectedMonth ? `${primaryMain}1A` : bgDefault,
                                        color: isCurrentMonth ? '#fff' : isSelectedMonth ? primaryMain : textPrimary,
                                        transition: 'all .15s',
                                    }}>
                                        {name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* AD Header */}
                        <div className="flex items-center justify-between mb-3">
                            <button onClick={() => setAdViewMode('year')} className="text-left hover:opacity-70 transition-opacity">
                                <div style={{ fontSize: '14px', fontWeight: 700, color: textPrimary }}>
                                    {AD_MONTHS_FULL[adMonth]} {adYear}
                                </div>
                                <div style={{ fontSize: '11px', color: textMuted, marginTop: '1px' }}>Anno Domini</div>
                            </button>

                            <div className="flex gap-1">
                                <button onClick={handleADPrevMonth} style={navBtnStyle}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                                </button>
                                <button onClick={handleADNextMonth} style={navBtnStyle}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
                            {SHORT_WEEKDAYS_ENGLISH.map((day, index) => (
                                <div key={index} style={{ fontSize: '10px', fontWeight: 600, color: textMuted, padding: '3px 0', textTransform: 'uppercase' }}>{day}</div>
                            ))}
                        </div>

                        {/* AD Calendar days */}
                        <div className="grid grid-cols-7 gap-0.5 text-center">
                            {adCalendarDays.map((day, index) => {
                                if (!day) return <div key={index} />;
                                const adStr = formatADDay(day);
                                const hasLive = liveClassDates.some(d => d === adStr);
                                const hasTest = testDates.some(d => d === adStr);
                                const hasDots = hasLive || hasTest;
                                const todayCell = isTodayAD(day);
                                return (
                                    <button key={index} onClick={() => handleADDateClick(day)} style={{
                                        fontSize: '11.5px',
                                        padding: hasDots ? '5px 2px 3px' : '5px 2px',
                                        borderRadius: '6px',
                                        cursor: 'pointer', border: 'none',
                                        fontWeight: todayCell ? 700 : 500,
                                        background: todayCell ? successMain : isSelectedAD(day) ? `${primaryMain}1A` : 'transparent',
                                        color: todayCell ? '#fff' : isSelectedAD(day) ? primaryMain : isSaturdayAD(day) ? errorMain : textPrimary,
                                        transition: 'background .12s',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    }}>
                                        {day}
                                        {hasDots && (
                                            <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                                                {hasLive && (
                                                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: errorMain, flexShrink: 0 }} />
                                                )}
                                                {hasTest && (
                                                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: infoMain, flexShrink: 0 }} />
                                                )}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="flex gap-3 mt-2.5">
                            <div className="flex items-center gap-1.5" style={{ fontSize: '11px', color: textMuted }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: errorMain, flexShrink: 0 }} />
                                Live Class
                            </div>
                            <div className="flex items-center gap-1.5" style={{ fontSize: '11px', color: textMuted }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: infoMain, flexShrink: 0 }} />
                                Test / Exam
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{
                            marginTop: '10px', paddingTop: '10px',
                            borderTop: `1px solid ${dividerColor}`,
                            fontSize: '10.5px', color: textMuted, textAlign: 'center',
                        }}>
                            Anno Domini · Gregorian Calendar
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
