import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams } from "../types";
import type { McqReportData, McqSubmissionPayload, McqSubmissionResponse, QuestionTypeProps, SingleMcqResponse, TestList } from "../types/question";
import type { GlobalResponse } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseQuery } from "./baseQuery";

export const testApi = createApi({
    reducerPath: "testApi",
    baseQuery: baseQuery,
    tagTypes: ["Test"],
    endpoints: (builder) => ({
        getUserAllTest: builder.query<TestList, QueryParams & { id?: number }>({
            query: ({ id, pageIndex, pageSize, search, startDate, endDate }) => ({
                url: `my-test?${buildQueryParams({
                    page: pageIndex, page_size: pageSize, search, course_id: id, start_date: startDate,
                    end_date: endDate,
                })}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Test" as const, id }],
        }),
        getTestById: builder.query<SingleMcqResponse, { courseId: number; testId: number }>({
            query: ({ courseId, testId }) => ({
                url: `/course/${courseId}/test/${testId}`,
                method: "GET",
            }),

        }),
        submitMcq: builder.mutation<McqSubmissionResponse, { body: McqSubmissionPayload, courseId: number; testId: number }>({
            query: ({ courseId, testId, body }) => ({
                url: `/course/${courseId}/test/${testId}/mcq`,
                method: "POST",
                body
            })
        }),
        uploadSubjectiveAnswers: builder.mutation<GlobalResponse & {
            data: {
                id: number;
                url: string
            }[]
        }, { courseId: number; testId: number, questionId: number, body: FormData }>({
            query: ({ courseId, testId, questionId, body }) => ({
                url: `/course/${courseId}/test/${testId}/subjective/${questionId}/media`,
                method: "POST",
                body: body
            })
        }),
        getSubjectiveAnswer: builder.query<GlobalResponse & {
            data: {
                id: number;
                url: string
            }[]
        }, { courseId: number; testId: number, questionId: number }>({
            query: ({ courseId, testId, questionId }) => ({
                url: `/course/${courseId}/test/${testId}/subjective/${questionId}/media`,
                method: "GET",
            })
        }),
        deleteSubjectiveAnswers: builder.mutation<GlobalResponse & {
            data: {
                id: number;
                url: string
            }[]
        }, { courseId: number; testId: number, questionId: number, mediaId: number }>({
            query: ({ courseId, testId, questionId, mediaId }) => ({
                url: `/course/${courseId}/test/${testId}/subjective/${questionId}/media/${mediaId}`,
                method: "DELETE",
            })
        }),
        reviewTestResult: builder.query<{ data: McqReportData }, { courseId: number; testId: number }>({
            query: ({ courseId, testId }) => ({
                url: `/course/${courseId}/test/${testId}/review`,
                method: "GET",
            })
        }),
        reviewSubjectiveTestResult: builder.query<{ data: any }, { courseId: number; testId: number }>({
            query: ({ courseId, testId }) => ({
                url: `/course/${courseId}/test/${testId}/review/subjective`,
                method: "GET",
            })
        }),
        submitSubjectiveFinal: builder.mutation<GlobalResponse, { courseId: number; testId: number, questionId: number }>({
            query: ({ courseId, testId }) => ({
                url: `/course/${courseId}/test/${testId}/subjective/submit`,
                method: "POST",
            }),
            invalidatesTags: () => [{ id: "LIST", type: "Test" }]
        }),
        getTestResult: builder.query<GlobalResponse & McqSubmissionResponse, { courseId: number; testId: number }>({
            query: ({ courseId, testId }) => ({
                url: `/course/${courseId}/test/${testId}/result`,
                method: "GET",
            })
        }),
        getTestSample: builder.query<GlobalResponse & {
            data: {
                sample: File | null;
                sample_url: string;
                video_url: string;
            }
        }, { id?: number | null }>({
            query: ({ id }) => ({
                url: `/test/${id}/sample`,
                method: "GET",
            }),
        }),
        getAllIndividualTest: builder.query<TestList, QueryParams & { type: QuestionTypeProps }>({
            query: ({ pageIndex, pageSize, search, type }) => ({
                url: `/test?${buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize,
                    search: search,
                    type: type
                })}`
            }),
            providesTags: [{ type: "Test", id: "LIST" }]
        })
    })
})

export const {
    useGetUserAllTestQuery,
    useGetTestByIdQuery,
    useSubmitMcqMutation,
    useReviewTestResultQuery,
    useUploadSubjectiveAnswersMutation,
    useDeleteSubjectiveAnswersMutation,
    useGetSubjectiveAnswerQuery,
    useReviewSubjectiveTestResultQuery,
    useSubmitSubjectiveFinalMutation,
    useGetTestResultQuery,
    useGetTestSampleQuery,
    useGetAllIndividualTestQuery
} = testApi;