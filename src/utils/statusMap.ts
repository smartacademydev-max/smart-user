import type { GorkhapatraTypes } from "../types/gorkhapatra";
import type { QuestionTypeProps } from "../types/question";
import type { TicketPriority, TicketStatus } from "../types/ticket";

export type StatusVariant = "success" | "info" | "warning" | "error" | "primary";
export type ProgressStatusProps = "in_progress" | "not_started" | "completed" | "awaiting_review"
export type PublishedStatus = "draft" | "published"

export function statusMap<T extends string>(map: Record<T, StatusVariant>) {
    return (key: T): StatusVariant => {
        return map[key] ?? "info";
    };
}

export const getPublishedStatus = statusMap<PublishedStatus>({
    published: "success",
    draft: "warning",
});

export const getGorkhapatraStatus = statusMap<GorkhapatraTypes>({
    all: "info",
    mcqs: "success",
    descriptive: "warning",
});
export const getTransactionStatus = statusMap<"failed" | "success" | "pending">({
    failed: "error",
    success: "success",
    pending: "warning",
});

export const getCourseStatus = (progress?: number): StatusVariant => {
    if (progress === 0) return "error";
    if (progress === 100) return "success";
    return "warning";
};

export const getTestStatus = statusMap<QuestionTypeProps>({
    "": "info",
    mcq: "success",
    subjective: "warning",
    omr: "primary"
});
export const getTestProgressStatus = statusMap<ProgressStatusProps>({
    completed: "success",
    in_progress: "warning",
    not_started: "error",
    awaiting_review: "info",
});

export const getDiscussionStatus = statusMap<"visible" | "hidden">({
    visible: "success",
    hidden: "warning",
});

export const getTicketStatus = statusMap<TicketStatus>({
    open: "info",
    assigned: "primary",
    waiting_for_reply: "warning",
    resolved: "success",
});

export const getTicketPriority = statusMap<TicketPriority>({
    low: "info",
    medium: "warning",
    high: "error",
    urgent: "error",
});