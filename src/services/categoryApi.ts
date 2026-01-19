import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams } from "../types";
import type { CategoryProps, CategoryTypeResponse, CategroyList } from "../types/category";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseQuery } from "./baseQuery";

export const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery: baseQuery,
    tagTypes: ["Category"],
    endpoints: (builder) => ({
        getAllCategory: builder.query<CategroyList, QueryParams>({
            query: ({ pageIndex, pageSize, search }) => {
                const queryString = buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize,
                    search: search,
                })

                return {
                    url: `/category/megacategories?${queryString}`,
                    method: "GET",
                };
            },
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map((user) => ({ type: "Category" as const, id: user.id })),
                        { type: "Category", id: "LIST" },
                    ]
                    : [{ type: "Category", id: "LIST" }],
        }),
        getAllInterest: builder.query<{ data: { id: number; name: string; courses: number }[] }, void>({
            query: () => {

                return {
                    url: `/interests`,
                    method: "GET",
                };
            },
        }),

        getCategoryById: builder.query<{ data: CategoryProps }, { id: string }>({
            query: ({ id }) => ({
                url: `/admin/category/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Category", id }],
        }),

        getAllMegaCategory: builder.query<CategoryTypeResponse, void>({
            query: () => ({
                url: `/course/category`,
                method: "GET",
            }),
            providesTags: () => [{ type: "Category", id: "LIST" }],
        }),

        getAllCategoryRelatedToMegaCategory: builder.query<CategoryTypeResponse, { currentCategory: string }>({
            query: ({ currentCategory }) => ({
                url: `/course/category/children?category=${currentCategory}`,
                method: "GET",
            }),
            providesTags: () => [{ type: "Category", id: "LIST" }],
        }),

        getAllSubCategoryRelatedToCategory: builder.query<CategoryTypeResponse, { currentCategory: string }>({
            query: ({ currentCategory }) => ({
                url: `/course/category/sub-children?category=${currentCategory}`,
                method: "GET",
            }),
            providesTags: () => [{ type: "Category", id: "LIST" }],
        }),

        updateUserInterest: builder.mutation<void, { categories: number[] }>({
            query: (body) => ({
                url: "/interest",
                method: "POST",
                body
            })
        }),
    })
})

export const {
    useGetAllCategoryQuery,
    useGetCategoryByIdQuery,
    useGetAllMegaCategoryQuery,
    useGetAllCategoryRelatedToMegaCategoryQuery,
    useGetAllSubCategoryRelatedToCategoryQuery,
    useUpdateUserInterestMutation,
    useGetAllInterestQuery
} = categoryApi;