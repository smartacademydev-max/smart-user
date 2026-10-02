import { useGetControlsQuery } from "../services/controlsApi";

/**
 * The external leaderboard URL for a finished test, or "" when the admin hasn't
 * enabled one for this course. Configured under admin Course Settings → Leaderboard.
 *
 * The admin enters a base page (e.g. https://smartacademyhq.com/leaderboard) and this
 * appends ?test_id=&course_id=. A URL that already uses {test_id} / {course_id}
 * placeholders is filled in instead.
 */
export function useLeaderboardUrl(courseId?: number, testId?: number): string {
    const { data } = useGetControlsQuery();
    const leaderboard = data?.data?.leaderboard;

    if (!leaderboard?.enabled || !leaderboard.url) return "";

    const courseIds = (leaderboard.course_ids ?? []).map(Number);
    if (courseIds.length && (!courseId || !courseIds.includes(courseId))) return "";

    return buildLeaderboardUrl(leaderboard.url, courseId, testId);
}

export function buildLeaderboardUrl(base: string, courseId?: number, testId?: number): string {
    const hasPlaceholders = /\{(test_id|course_id)\}/.test(base);
    const filled = base
        .replace(/\{course_id\}/g, courseId ? String(courseId) : "")
        .replace(/\{test_id\}/g, testId ? String(testId) : "");

    let url: URL;
    try {
        url = new URL(filled);
    } catch {
        return "";
    }
    // Only ever send students to a web page
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";

    if (!hasPlaceholders) {
        if (testId) url.searchParams.set("test_id", String(testId));
        if (courseId) url.searchParams.set("course_id", String(courseId));
    }
    return url.toString();
}
