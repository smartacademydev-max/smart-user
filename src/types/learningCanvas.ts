import type { GlobalResponse } from "./user";

// ─── Canvas-specific extensions (everything else reuses course.ts / question.ts) ─

export type CanvasCourseStatus = "all" | "not_started" | "in_progress" | "completed";

export type CanvasContentType = "video" | "audio" | "note" | "test" | "quiz" | "assignment";

// ─── Nested curriculum (chapter → unit → lesson → child_lesson) ──────────────

export type CanvasNodeLevel = "subject" | "chapter" | "unit" | "lesson" | "child_lesson";

export interface CanvasContent {
    id: number;
    title: string;
    content_type: CanvasContentType;
    completion_status: ContentCompletionStatus;
    is_locked: boolean;
    reference_id: number;
    /** Direct media URL (video / audio / pdf) when available from the API */
    url?: string;
    file_name?: string;
    duration_minutes?: number;
}

export interface CurriculumNode {
    id: number;
    level: CanvasNodeLevel;
    name: string;
    /** CK editor HTML — optional intro/description for this node */
    description?: string;
    order: number;
    /** Content rows attached directly to this node (any combination, all optional) */
    contents?: CanvasContent[];
    /** Nested children (unit → lesson → child_lesson) */
    children?: CurriculumNode[];
}

export type ContentCompletionStatus = "completed" | "in_progress" | "not_started";

// ─── Curriculum with content completion status ───────────────────────────────

export interface CanvasCurriculumItem {
    id: number;
    title: string;
    content_type: CanvasContentType;
    order: number;
    completion_status: ContentCompletionStatus;
    is_locked: boolean;
    reference_id: number;
}

export interface CanvasCurriculumSection {
    id: number;
    name: string;
    order: number;
    items: CanvasCurriculumItem[];
}

export interface CanvasCurriculumResponse extends GlobalResponse {
    data: {
        sections: CanvasCurriculumSection[];
        progress: number;
        expires_in_days: number | null;
    };
}

// ─── Course progress sidebar ─────────────────────────────────────────────────

export interface StudyStreakDay {
    date: string;
    has_activity: boolean;
}

export interface CanvasCourseProgressResponse extends GlobalResponse {
    data: {
        progress: number;
        lessons_done: number;
        quizzes_passed: number;
        /** Number of assignments the user has submitted. */
        assignments_done?: number;
        /** Total assignments in the course. */
        total_assignments?: number;
        /** Human-readable label (e.g. "1st April") or ISO date — accepts both. */
        expires_on?: string | null;
        study_streak: StudyStreakDay[];
        next_up: {
            content_id: number;
            content_title: string;
            content_type: CanvasContentType;
            section_name: string;
            /** Optional secondary label (e.g. "Video · 18 min"). */
            duration_label?: string;
        } | null;
        course_stats: {
            total_subjects: number;
            total_notes: number;
            total_audios: number;
            total_videos: number;
            total_tests: number;
            /** Per-type consumption counts (watched / listened / read) — optional fallback to 0. */
            videos_watched?: number;
            audios_listened?: number;
            notes_read?: number;
        };
    };
}

// ─── Course completion / certificate ─────────────────────────────────────────

export interface CourseCompletionResponse extends GlobalResponse {
    data: {
        course_name: string;
        user_name: string;
        progress: number;
        lessons_done: number;
        quizzes_passed: number;
        certificate_url: string;
        certificate_file_name: string;
        certificate_file_size: string;
        completed_at: string;
    };
}

// ─── Mark content complete (extends existing trackCourseProgress) ────────────

export interface MarkCanvasContentPayload {
    content_id: number;
    content_type: CanvasContentType;
}

// ─── Per-content progress (resume position + watched %) ─────────────────────

export interface CanvasContentProgressEntry {
    content_id: number;
    content_type: CanvasContentType;
    position: number;     // seconds — used to resume playback
    percent: number;      // 0..100 — watched / listened fraction
    completed: boolean;
    updated_at?: string;
}

export interface CanvasContentsProgressResponse extends GlobalResponse {
    data: {
        data: CanvasContentProgressEntry[];
    };
}

export interface SaveCanvasProgressPayload {
    content_id: number;
    content_type: CanvasContentType;
    position: number;
    percent: number;
}
