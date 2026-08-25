import type { Pagination } from ".";
import type { DiscountTypeProps, SelectionType } from "./course";
import type { GlobalResponse } from "./user";

export type QuestionTypeProps =
    | "mcq"
    | "sata"
    | "select_n"
    | "matrix"
    | "cloze"
    | "highlight"
    | "drag_drop"
    | "bow_tie"
    | "drag_into_text"
    | "subjective"
    | "omr"
    | ""

/** How a format stores its answer key. Mirrors the backend QuestionShape enum. */
export type QuestionShapeProps = "flat" | "grouped" | "ordered" | "gaps" | "manual"

/** Formats where the student may tick more than one option. */
export const MULTI_SELECT_TYPES: QuestionTypeProps[] = [
    "sata", "select_n", "matrix", "cloze", "highlight", "drag_drop", "bow_tie",
    "drag_into_text"
];

/** Formats whose options belong to a row, blank, or zone. */
export const GROUPED_TYPES: QuestionTypeProps[] = ["matrix", "cloze", "bow_tie"];

export interface QuestionGroupProps {
    key: string;
    label?: string | null;
}

export interface OptionProps {
    id: number | null,
    option: string,
    is_correct: boolean,
    position?: number,
    /** Which row / blank / zone this option belongs to. */
    group_key?: string | null
}

export interface QuestionProps {
    id: number | null;
    points: number;
    question: string;
    options: OptionProps[],
    megacategory_id: number | null;
    question_type: QuestionTypeProps
    has_image_in_option?: boolean;
    /** True when more than one option may be selected. */
    allows_multiple?: boolean;
    answer_shape?: QuestionShapeProps;
    /**
     * Select N tells the student how many to pick. Null for every other
     * format — revealing the count would give away the answer.
     */
    required_selection_count?: number | null;
    /** Matrix rows / cloze blanks / bow-tie zones. */
    groups?: QuestionGroupProps[];
    /** Matrix only: the shared answer scale reused across every row. */
    columns?: QuestionGroupProps[];
    /** Matrix only: whether a row accepts more than one answer. */
    multiple_per_row?: boolean;
    /**
     * Cloze only: true when the question text carries the blanks' markers, so
     * the dropdowns render inside the sentence instead of beneath it.
     */
    has_inline_blanks?: boolean;
    /** Highlight only: the text the student marks up. */
    passage?: string | null;
    /** Highlight only: the coloured categories to mark it with. */
    highlight_types?: HighlightTypeProps[];
    /**
     * Bow-tie only: how many tiles each zone's drop area holds, as
     * `zone key => count`. A zone routinely takes more than one — the
     * canonical item is two actions, one condition and two parameters.
     */
    bow_tie_zone_counts?: Record<string, number>;
    /** Bow-tie only: offer a "Check answer" button alongside the question. */
    bow_tie_check_answer?: boolean;
    /** Bow-tie only: how many times it may be used. 0 means unlimited. */
    bow_tie_check_answer_attempts?: number;
    /**
     * Drag into text: the gap numbers the passage declares, written [[1]] in
     * the question text. Which choice belongs in each is never sent.
     */
    text_gaps?: number[];
    /**
     * Drag into text: the colour-coded group each choice belongs to, as
     * `option id => group`. A choice only drops into a gap of the same group.
     */
    choice_groups?: Record<number, number>;
    /** Drag into text: choices reusable across gaps instead of consumed. */
    unlimited_choices?: number[];
}

/** Colours for drag-into-text choice groups, indexed by group number - 1. */
export const CHOICE_GROUP_COLORS: string[] = [
    "#93C5FD", "#86EFAC", "#FDE047", "#FCA5A5", "#D8B4FE", "#7DD3FC"
];

/** A named, coloured category a highlight question is marked up with. */
export interface HighlightTypeProps {
    key: string;
    label?: string | null;
    color?: string;
}

/** A marked range over the passage, as character offsets. */
export interface HighlightSpanProps {
    type: string;
    start: number;
    end: number;
}

export const QuestionInitialState: QuestionProps = {
    id: null,
    points: 0,
    question: "",
    options: [{ id: null, option: "", is_correct: false }],
    megacategory_id: null,
    question_type: "mcq"
};

export interface QuestionList extends GlobalResponse {
    data: {
        data: QuestionProps[];
        pagination: Pagination
    }
}

export interface TestProps {
    id?: number;
    course_id?: number;
    name: string;
    test_type?: string;
    duration: {
        hours: number;
        minutes: number;
    };
    description: string;
    full_mark: number;
    pass_mark: number;
    start_datetime: string;
    end_datetime: string;
    course_ids: number[];
    question_ids: number[];
    category?: string[];
    questions?: number;
    status?: null;
    no_of_students?: number;
    total_questions?: number;
    has_taken_test?: boolean;
    is_scheduled?: boolean;
    is_graded?: boolean;
    has_expired?: boolean;
    marked_price?: string,
    sale_price?: string;
    selections: SelectionType;
    mega_categories?: string[];
    download_format_url?: string;
    /**
     * The student's own attempt. Sent as `result` (singular) by the list endpoints and
     * only once the test has been taken — absent for tests never attempted.
     */
    result?: {
        /** Marks obtained, out of `full_mark`. */
        score: number;
        /** 0–100. Already computed server-side. */
        percentage: number;
        attempted: number;
        total_questions: number;
    };
}
export interface TestList {
    data: {
        data: TestProps[]
        pagination: Pagination
    }
}



export interface TestCategory {
    id?: number;
    name: string;
    slug: string;
    image: File | null;
    image_url: string | null;
    description?: string;
}

export interface TestCategoryListing {
    data: {
        data: TestCategory[];
        pagination: Pagination;
    }
}

export interface SingleMcqResponse extends GlobalResponse {
    data: QuestionProps[];
    overview: TestProps & {
        name: string;
        time: number;
        test_type: QuestionTypeProps;
        end_datetime: string;
    }
}
/**
 * One answer, in whichever shape the format needs.
 *
 * `option_id` stays for plain multiple choice so existing callers and the
 * attempted-check predicates keep working; the other fields are additive and
 * only ever set for the format that uses them.
 */
export interface Answers {
    question_id: number | null;
    option_id: number | null;
    /** Flat multi-select: SATA, Select N, Highlight. */
    selected_option_ids?: number[];
    /** Grouped: matrix rows, cloze blanks, bow-tie zones. */
    group_answers?: Record<string, number[]>;
    /** Drag into text: gap number => the option dropped into it. */
    gap_answers?: Record<number, number>;
    /** Ordered: drag and drop. The sequence is the answer. */
    ordered_option_ids?: number[];
    /** Highlight: the character ranges the student marked. */
    spans?: HighlightSpanProps[];
}

/** Whether an answer carries any selection at all, in any format. */
export const isAnswered = (answer?: Answers): boolean => {
    if (!answer) return false;
    if (answer.option_id !== null && answer.option_id !== undefined) return true;
    if (answer.selected_option_ids?.length) return true;
    if (answer.ordered_option_ids?.length) return true;
    if (answer.spans?.length) return true;
    if (Object.keys(answer.gap_answers ?? {}).length > 0) return true;
    return Object.values(answer.group_answers ?? {}).some((ids) => ids.length > 0);
};
export interface SubjectiveAnswers {
    question_id: number | null;
    answer_id: number[];
}

export interface McqSubmissionPayload {
    answers: Answers[]
    time_taken: number;
}
export interface McqSubmissionData {
    score: number;
    correct: number;
    incorrect: number;
    skipped: number;
    time_taken: string;
    attempted: number;
    total_questions: number;
    percentage: number;
    test_type: "mcq" | string;
    test_name: string;
}

export interface McqSubmissionResponse extends GlobalResponse {
    data: McqSubmissionData;
}


export interface McqReportAnswerItem {
    question: string;
    your_answer_id: number | null;
    options: OptionProps[];
    /** Multi-select answers; the scalar above is only the first selection. */
    your_answer_ids?: number[];
    correct_answer_ids?: number[];
    /**
     * The format the question was answered in, so review can redraw it the way
     * the student saw it rather than as a flat option list.
     */
    question_type?: QuestionTypeProps;
    groups?: QuestionGroupProps[];
    columns?: QuestionGroupProps[];
    /** Matrix: whether a row accepted more than one answer. */
    multiple_per_row?: boolean;
    passage?: string | null;
    bow_tie_zone_counts?: Record<string, number>;
    text_gaps?: number[];
    /** Highlight: the coloured types and the spans, revealed after grading. */
    highlight_types?: HighlightTypeProps[];
    expected_spans?: HighlightSpanProps[];
    submitted_spans?: HighlightSpanProps[];
    /** Per-row / per-zone outcome, keyed by group. */
    group_detail?: Record<string, {
        selected_option_ids: number[];
        correct_option_ids: number[];
        is_correct: boolean;
    }>;
    /** Per-gap outcome, keyed by gap number. */
    gap_detail?: Record<string, {
        selected_option_id: number | null;
        correct_option_id: number | null;
        is_correct: boolean;
        /** True when the gap has no answer key, so it cannot be judged. */
        ungraded?: boolean;
    }>;
}
export interface McqReportData {
    test_name: string;
    total_questions: number;
    timer: string;
    start_date: string;
    start_time: string;
    end_time: string;
    correct_answers: McqReportAnswerItem[];
    incorrect_answers: McqReportAnswerItem[];
    skipped_answers: McqReportAnswerItem[];
}

export type TestTypeProps = "subjective" | "mcq"


export interface SetProps {
    id?: number;
    name: string;
    description: string;
    price: string;
    discount_type: DiscountTypeProps;
    discount: string;
    set_count: string;
    test_ids: number[];
    thumbnail: File | null;
    thumbnail_url: string;
    status: "published" | "draft";
    marked_price?: string;
    sale_price?: string;
    sets: { label: string; value: string }[]
    selections: SelectionType;
    created_at: string
    mega_categories?: string[];
    enrolled: number;
    avg_score: number;
    progress: number;
    completed: number;
    has_purchased: boolean;
    not_started_count: number;
    in_progress_count: number;
}


export interface SetList extends GlobalResponse {
    data: {
        data: SetProps[];
        pagination: Pagination
    }
}

export interface SetOveriew extends SetProps {
    total_questions: number;
}