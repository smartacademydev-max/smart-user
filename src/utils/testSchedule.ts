/**
 * Start-window helpers for scheduled tests.
 *
 * A test is only startable once `start_datetime` has passed. Every gate that
 * decides "can this student begin?" must go through here — the previous bug was
 * two call sites disagreeing, one of them reusing a "should I render a live
 * countdown?" flag as if it meant "has the test started?".
 */

/** How far ahead of the start time a live ticking countdown is shown. */
export const COUNTDOWN_WINDOW_MS = 24 * 60 * 60 * 1000;

type Schedulable = {
    is_scheduled?: boolean;
    start_datetime?: string;
};

/**
 * Milliseconds until the test opens. `null` when the test is not scheduled, has
 * no parseable start time, or is already open — i.e. `null` always means "no
 * start restriction applies".
 */
export const msUntilTestStart = (test?: Schedulable | null): number | null => {
    if (!test?.is_scheduled || !test.start_datetime) return null;

    const startTime = new Date(test.start_datetime).getTime();
    if (Number.isNaN(startTime)) return null;

    const diff = startTime - Date.now();
    return diff > 0 ? diff : null;
};

/** True while the test is scheduled and its start time has not arrived yet. */
export const isTestNotStarted = (test?: Schedulable | null): boolean =>
    msUntilTestStart(test) !== null;

/** `1h 12m 30s` — countdown label for the disabled start button. */
export const formatCountdown = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
};
