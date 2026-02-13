import type { GorkhapatraTypes } from "../types/gorkhapatra";
import type { QuestionTypeProps } from "../types/question";

export type StatusVariant = "success" | "info" | "warning" | "error";

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
export const getTestStatus = statusMap<QuestionTypeProps>({
    all: "info",
    mcq: "success",
    subjective: "warning",
    omr: "info"
});