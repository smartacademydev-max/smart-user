import type { Pagination } from ".";
import type { GlobalResponse } from "./user";

export type QuestionTypeProps = "mcq" | "subjective"
export interface OptionProps {
    id: number | null,
    option: string,
    is_correct: boolean
}

export interface QuestionProps {
    id: number | null;
    points: number;
    question: string;
    options: OptionProps[],
    megacategory_id: number | null;
    question_type: QuestionTypeProps
    has_image_in_option?: boolean;
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
}




export interface TestList {
    data: {
        data: TestProps[]
        pagination: Pagination
    }
}

export interface SingleMcqResponse extends GlobalResponse {
    data: QuestionProps[];
    overview: {
        name: string;
        time: number;
        test_type: QuestionTypeProps
    }
}
export interface Answers {
    question_id: number | null;
    option_id: number | null;
}
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
