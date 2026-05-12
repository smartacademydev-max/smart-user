import type {
    CanvasContentProgressEntry,
    CanvasContentType,
    ContentCompletionStatus,
    CurriculumNode,
} from "../types/learningCanvas";

/** Threshold above which "Mark as Completed" is allowed for gated media. */
export const COMPLETION_THRESHOLD_PERCENT = 80;

/**
 * Content types that gate Mark-Complete behind the listen threshold.
 * Video is excluded: YouTube embeds don't yield reliable progress, so we allow
 * the learner to mark video complete at any stage.
 */
const MEDIA_TYPES: CanvasContentType[] = ["audio"];

export function findProgress(
    list: CanvasContentProgressEntry[] | undefined,
    contentId: number,
): CanvasContentProgressEntry | null {
    if (!list?.length) return null;
    return list.find((p) => p.content_id === contentId) ?? null;
}

export function canMarkComplete(
    contentType: CanvasContentType,
    progress: CanvasContentProgressEntry | null,
): boolean {
    if (progress?.completed) return true;
    if (!MEDIA_TYPES.includes(contentType)) return true;
    return (progress?.percent ?? 0) >= COMPLETION_THRESHOLD_PERCENT;
}

export function deriveStatus(
    progress: CanvasContentProgressEntry | null,
): ContentCompletionStatus {
    if (!progress) return "not_started";
    if (progress.completed) return "completed";
    if (progress.percent > 0) return "in_progress";
    return "not_started";
}

/** Walks the curriculum tree and counts completed contents vs total. */
export function computeCourseProgress(
    progressList: CanvasContentProgressEntry[] | undefined,
    nodes: CurriculumNode[],
): { completed: number; total: number; percent: number } {
    let completed = 0;
    let total = 0;
    const walk = (n: CurriculumNode) => {
        n.contents?.forEach((c) => {
            total += 1;
            const p = findProgress(progressList, c.id);
            if (p?.completed) completed += 1;
        });
        n.children?.forEach(walk);
    };
    nodes.forEach(walk);
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { completed, total, percent };
}
