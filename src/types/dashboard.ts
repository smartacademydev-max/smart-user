export interface Analytics {
    title: string;
    value: string;
    description: string;
    type: "success" | "error" | "info" | "warning"
}

export interface AnalyticsList {
    data: Analytics[];
}

// ─── Daily Quiz ───────────────────────────────────────────────────────────────

export interface DailyQuizOption {
    id: number;
    option: string;
    is_correct: boolean;
}

export interface DailyQuizQuestion {
    id: number;
    question: string;
    category: string;
    options: DailyQuizOption[];
}


export interface DailyQuizStats {
    streak: number;
    best_streak: number;
    answered_today: boolean;
    selected_option_id: number | null;
}

export interface DailyQuizResponse {
    message: string;
    status: string;
    data: {
        quiz: DailyQuizQuestion;
        stats: DailyQuizStats;
    };
}

export interface DailyQuizSubmitPayload {
    quiz_id: number;
    option_id: number;
}

export interface DailyQuizSubmitResponse {
    message: string;
    status: string;
    data: {
        is_correct: boolean;
        stats: DailyQuizStats;
    };
}