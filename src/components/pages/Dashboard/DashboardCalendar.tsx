import { useTheme } from '@mui/material/styles';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    BS_CALENDAR_DATA,
    ENGLISH_MONTHS,
    NEPALI_MONTHS,
    SHORT_WEEKDAYS_ENGLISH,
    SHORT_WEEKDAYS_NEPALI,
    adToBs,
    bsToAd,
    getDaysInBSMonth,
    getFirstDayOfBSMonth,
    toNepaliNumber,
    type BSDate,
} from '../../../utils/nepaliCalendar';

const AD_MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const AD_MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface DashboardCalendarProps {
    onDateSelect?: (adDate: Date) => void;
    onMonthChange?: (startAD: string, endAD: string) => void;
    liveClassDates?: string[];
    testDates?: string[];
}

const formatAD = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export default function DashboardCalendar({
    onDateSelect,
    onMonthChange,
    liveClassDates = [],
    testDates = [],
}: DashboardCalendarProps) {
    const theme = useTheme();
    const today = new Date();
    const todayBS = useMemo(() => adToBs(new Date()), []);

    const [calMode, setCalMode] = useState<'bs' | 'ad'>('bs');

    // BS state
    const [currentYear, setCurrentYear] = useState(todayBS.year);
    const [currentMonth, setCurrentMonth] = useState(todayBS.month);
    const [selectedDate, setSelectedDate] = useState<BSDate | null>(null);
    const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

    // AD state
    const [adYear, setAdYear] = useState(today.getFullYear());
    const [adMonth, setAdMonth] = useState(today.getMonth());
    const [adViewMode, setAdViewMode] = useState<'month' | 'year'>('month');
    const [selectedADDay, setSelectedADDay] = useState<number | null>(null);

    const { i18n } = useTranslation();
    const useNepaliScript = i18n.language === 'np';

    const daysInMonth = getDaysInBSMonth(currentYear, currentMonth);
    const firstDayOfMonth = useMemo(() => getFirstDayOfBSMonth(currentYear, currentMonth), [currentYear, currentMonth]);
    const firstAdDate = useMemo(() => bsToAd(currentYear, currentMonth, 1), [currentYear, currentMonth]);

    const daysInADMonth = new Date(adYear, adMonth + 1, 0).getDate();
    const firstDayOfADMonth = new Date(adYear, adMonth, 1).getDay();

    const adRangeLabel = useMemo(() => {
        const last = new Date(firstAdDate.getTime() + (daysInMonth - 1) * 86400000);
        const m1 = AD_MONTHS_SHORT[firstAdDate.getMonth()];
        const m2 = AD_MONTHS_SHORT[last.getMonth()];
        return firstAdDate.getMonth() === last.getMonth()
            ? `${m1} ${last.getFullYear()}`
            : `${m1}/${m2} ${last.getFullYear()}`;
    }, [firstAdDate, daysInMonth]);

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
        if (currentMonth === 1) { if (BS_CALENDAR_DATA[currentYear - 1]) { setCurrentMonth(12); setCurrentYear(currentYear - 1); } }
        else setCurrentMonth(currentMonth - 1);
    };
    const handleNextMonth = () => {
        if (currentMonth === 12) { if (BS_CALENDAR_DATA[currentYear + 1]) { setCurrentMonth(1); setCurrentYear(currentYear + 1); } }
        else setCurrentMonth(currentMonth + 1);
    };
    const handlePrevYear = () => { if (BS_CALENDAR_DATA[currentYear - 1]) setCurrentYear(currentYear - 1); };
    const handleNextYear = () => { if (BS_CALENDAR_DATA[currentYear + 1]) setCurrentYear(currentYear + 1); };

    // AD navigation
    const handleADPrevMonth = () => { if (adMonth === 0) { setAdMonth(11); setAdYear(adYear - 1); } else setAdMonth(adMonth - 1); };
    const handleADNextMonth = () => { if (adMonth === 11) { setAdMonth(0); setAdYear(adYear + 1); } else setAdMonth(adMonth + 1); };
    const handleADPrevYear = () => setAdYear(adYear - 1);
    const handleADNextYear = () => setAdYear(adYear + 1);

    const handleDateClick = (day: number) => {
        setSelectedDate({ year: currentYear, month: currentMonth, day });
        onDateSelect?.(new Date(firstAdDate.getTime() + (day - 1) * 86400000));
    };
    const handleADDateClick = (day: number) => {
        setSelectedADDay(day);
        onDateSelect?.(new Date(adYear, adMonth, day));
    };

    const calendarDays = useMemo(() => {
        const days: (number | null)[] = Array(firstDayOfMonth).fill(null);
        for (let d = 1; d <= daysInMonth; d++) days.push(d);
        return days;
    }, [firstDayOfMonth, daysInMonth]);

    const adCalendarDays = useMemo(() => {
        const days: (number | null)[] = Array(firstDayOfADMonth).fill(null);
        for (let d = 1; d <= daysInADMonth; d++) days.push(d);
        return days;
    }, [firstDayOfADMonth, daysInADMonth]);

    const formatADDay = (day: number) =>
        `${adYear}-${String(adMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // Theme tokens
    const dividerColor = theme.palette.divider;
    const textMuted = theme.palette.text.secondary;
    const textPrimary = theme.palette.text.primary;
    const primaryMain = theme.palette.primary.main;
    const successMain = theme.palette.success.main;
    const errorMain = theme.palette.error.main;
    const infoMain = theme.palette.info.main;
    const bgDefault = theme.palette.background.default;
    const bgPaper = theme.palette.background.paper;

    const navBtn: React.CSSProperties = {
        width: '26px', height: '26px', borderRadius: '6px',
        border: `1px solid ${dividerColor}`, background: 'transparent',
        cursor: 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: textMuted, flexShrink: 0,
    };

    const toggleBase: React.CSSProperties = {
        padding: '2px 8px', fontSize: '10px', fontWeight: 700,
        cursor: 'pointer', border: 'none', borderRadius: '4px',
        fontFamily: 'inherit', lineHeight: 1.6, transition: 'all 0.15s',
    };

    return (
        <div className="w-full">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                <div style={{
                    display: 'flex', alignItems: 'center',
                    border: `1px solid ${dividerColor}`, borderRadius: '6px',
                    overflow: 'hidden', background: bgDefault,
                }}>
                    <button onClick={() => setCalMode('ad')} style={{
                        ...toggleBase,
                        background: calMode === 'ad' ? primaryMain : 'transparent',
                        color: calMode === 'ad' ? '#fff' : textMuted,
                    }}>AD</button>
                    <button onClick={() => setCalMode('bs')} style={{
                        ...toggleBase,
                        background: calMode === 'bs' ? primaryMain : 'transparent',
                        color: calMode === 'bs' ? '#fff' : textMuted,
                    }}>BS</button>
                </div>
            </div>

            {calMode === 'bs' && (
                viewMode === 'year' ? (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <button onClick={handlePrevYear} style={navBtn}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                            </button>
                            <button onClick={() => setViewMode('month')} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center' }}>
                                <div style={{ fontSize: '14px', fontWeight: 700, color: textPrimary }}>
                                    {useNepaliScript ? toNepaliNumber(currentYear) : currentYear}
                                </div>
                                <div style={{ fontSize: '11px', color: textMuted, marginTop: '1px' }}>Select Month</div>
                            </button>
                            <button onClick={handleNextYear} style={navBtn}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => {
                                const isCur = month === todayBS.month && currentYear === todayBS.year;
                                const isSel = month === currentMonth;
                                return (
                                    <button key={month} onClick={() => { setCurrentMonth(month); setViewMode('month'); }} style={{
                                        padding: '7px 4px', borderRadius: '6px', textAlign: 'center',
                                        fontSize: '11px', fontWeight: 600, cursor: 'pointer', border: 'none',
                                        background: isCur ? primaryMain : isSel ? `${primaryMain}1A` : bgDefault,
                                        color: isCur ? '#fff' : isSel ? primaryMain : textPrimary,
                                        transition: 'all .15s',
                                    }}>
                                        {useNepaliScript ? NEPALI_MONTHS[month - 1] : ENGLISH_MONTHS[month - 1]}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    /* Month view — image-style layout */
                    <div>
                        {/* Header: BS month name (left) | nav arrows | AD range (right) */}
                        <div style={{
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between', marginBottom: '8px',
                        }}>
                            <button onClick={() => setViewMode('year')} style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                padding: 0, textAlign: 'left',
                            }}>
                                <span style={{ fontSize: '15px', fontWeight: 700, color: textPrimary }}>
                                    {useNepaliScript ? NEPALI_MONTHS[currentMonth - 1] : ENGLISH_MONTHS[currentMonth - 1]}
                                </span>
                            </button>

                            <span style={{ fontSize: '11px', color: textMuted, fontWeight: 500 }}>
                                {adRangeLabel}
                            </span>
                        </div>

                        {/* Navigation row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <button onClick={handlePrevMonth} style={navBtn}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                            </button>
                            <button onClick={handleNextMonth} style={navBtn}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                            </button>
                        </div>

                        {/* Weekday headers */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '4px' }}>
                            {SHORT_WEEKDAYS_NEPALI.map((label, i) => (
                                <div key={i} style={{
                                    textAlign: 'center', fontSize: '11px', fontWeight: 600, padding: '2px 0',
                                    color: i === 6 ? errorMain : textMuted,
                                }}>
                                    {label}
                                </div>
                            ))}
                        </div>

                        {/* Calendar cells */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: '2px' }}>
                            {calendarDays.map((day, index) => {
                                if (!day) return <div key={index} />;

                                const dayOfWeek = (firstDayOfMonth + day - 1) % 7;
                                const isSat = dayOfWeek === 6;
                                const adDayDate = new Date(firstAdDate.getTime() + (day - 1) * 86400000);
                                const adDayNum = adDayDate.getDate();
                                const adStr = formatAD(adDayDate);
                                const hasLive = liveClassDates.includes(adStr);
                                const hasTest = testDates.includes(adStr);
                                const isToday = todayBS.year === currentYear && todayBS.month === currentMonth && todayBS.day === day;
                                const isSel = selectedDate?.year === currentYear && selectedDate?.month === currentMonth && selectedDate?.day === day;

                                const dayColor = isToday ? '#fff'
                                    : isSel ? primaryMain
                                        : isSat ? errorMain
                                            : textPrimary;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleDateClick(day)}
                                        style={{
                                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                                            padding: '3px 1px', border: 'none', background: 'transparent',
                                            cursor: 'pointer', borderRadius: '6px',
                                        }}
                                    >
                                        {/* BS numeral in circle (today gets filled circle) */}
                                        <span style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            width: '22px', height: '22px', borderRadius: '50%',
                                            background: isToday ? successMain : isSel ? `${primaryMain}20` : 'transparent',
                                            fontSize: '13px', fontWeight: 700, lineHeight: 1,
                                            color: dayColor,
                                            transition: 'background .12s',
                                        }}>
                                            {toNepaliNumber(day)}
                                        </span>

                                        {/* AD date */}
                                        <span style={{
                                            fontSize: '9px', lineHeight: 1.3,
                                            color: isSat ? errorMain : textMuted,
                                        }}>
                                            {adDayNum}
                                        </span>

                                        {/* Event dots */}
                                        {(hasLive || hasTest) && (
                                            <div style={{ display: 'flex', gap: '2px', marginTop: '1px' }}>
                                                {hasLive && <div style={{ width: 3, height: 3, borderRadius: '50%', background: errorMain }} />}
                                                {hasTest && <div style={{ width: 3, height: 3, borderRadius: '50%', background: infoMain }} />}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: textMuted }}>
                                <div style={{ width: 7, height: 7, borderRadius: '50%', background: errorMain }} />
                                Live Class
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: textMuted }}>
                                <div style={{ width: 7, height: 7, borderRadius: '50%', background: infoMain }} />
                                Test / Exam
                            </div>
                        </div>
                    </div>
                )
            )}

            {/* ── AD CALENDAR ── */}
            {calMode === 'ad' && (
                adViewMode === 'year' ? (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <button onClick={handleADPrevYear} style={navBtn}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                            </button>
                            <button onClick={() => setAdViewMode('month')} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center' }}>
                                <div style={{ fontSize: '14px', fontWeight: 700, color: textPrimary }}>{adYear}</div>
                                <div style={{ fontSize: '11px', color: textMuted, marginTop: '1px' }}>Select Month</div>
                            </button>
                            <button onClick={handleADNextYear} style={navBtn}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {AD_MONTHS_SHORT.map((name, i) => {
                                const isCur = i === today.getMonth() && adYear === today.getFullYear();
                                const isSel = i === adMonth;
                                return (
                                    <button key={i} onClick={() => { setAdMonth(i); setAdViewMode('month'); }} style={{
                                        padding: '7px 4px', borderRadius: '6px', textAlign: 'center',
                                        fontSize: '11px', fontWeight: 600, cursor: 'pointer', border: 'none',
                                        background: isCur ? primaryMain : isSel ? `${primaryMain}1A` : bgDefault,
                                        color: isCur ? '#fff' : isSel ? primaryMain : textPrimary,
                                        transition: 'all .15s',
                                    }}>{name}</button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* AD Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <button onClick={() => setAdViewMode('year')} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                                <div style={{ fontSize: '15px', fontWeight: 700, color: textPrimary }}>
                                    {AD_MONTHS_FULL[adMonth]} {adYear}
                                </div>
                                <div style={{ fontSize: '10px', color: textMuted }}>Anno Domini</div>
                            </button>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <button onClick={handleADPrevMonth} style={navBtn}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                                </button>
                                <button onClick={handleADNextMonth} style={navBtn}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* Weekday headers */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '4px' }}>
                            {SHORT_WEEKDAYS_ENGLISH.map((d, i) => (
                                <div key={i} style={{
                                    textAlign: 'center', fontSize: '10px', fontWeight: 600, padding: '3px 0',
                                    color: i === 6 ? errorMain : textMuted, textTransform: 'uppercase',
                                }}>{d}</div>
                            ))}
                        </div>

                        {/* AD Calendar cells */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: '2px' }}>
                            {adCalendarDays.map((day, index) => {
                                if (!day) return <div key={index} />;
                                const adStr = formatADDay(day);
                                const hasLive = liveClassDates.includes(adStr);
                                const hasTest = testDates.includes(adStr);
                                const isToday = today.getFullYear() === adYear && today.getMonth() === adMonth && today.getDate() === day;
                                const isSel = selectedADDay === day;
                                const isSat = new Date(adYear, adMonth, day).getDay() === 6;
                                const dayColor = isToday ? '#fff' : isSel ? primaryMain : isSat ? errorMain : textPrimary;

                                return (
                                    <button key={index} onClick={() => handleADDateClick(day)} style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                                        padding: '3px 1px', border: 'none', background: 'transparent',
                                        cursor: 'pointer', borderRadius: '6px',
                                    }}>
                                        <span style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            width: '22px', height: '22px', borderRadius: '50%',
                                            background: isToday ? successMain : isSel ? `${primaryMain}20` : 'transparent',
                                            fontSize: '12px', fontWeight: isToday ? 700 : 500, lineHeight: 1,
                                            color: dayColor, transition: 'background .12s',
                                        }}>{day}</span>
                                        {(hasLive || hasTest) && (
                                            <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                                                {hasLive && <div style={{ width: 3, height: 3, borderRadius: '50%', background: errorMain }} />}
                                                {hasTest && <div style={{ width: 3, height: 3, borderRadius: '50%', background: infoMain }} />}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: textMuted }}>
                                <div style={{ width: 7, height: 7, borderRadius: '50%', background: errorMain }} />
                                Live Class
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: textMuted }}>
                                <div style={{ width: 7, height: 7, borderRadius: '50%', background: infoMain }} />
                                Test / Exam
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
