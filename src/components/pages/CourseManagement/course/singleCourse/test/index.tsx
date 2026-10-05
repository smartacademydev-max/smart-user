import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useGetSelectedTestBasedOnTestCategoryAndCourseIdQuery, useUseGetAllTestCategoryInACourseQuery } from "../../../../../../services/courseApi";
import type { QueryParams } from "../../../../../../types";
import type { TestCategory } from "../../../../../../types/question";
import { EmptyList } from "../../../../../molecules/EmptyList";
import TablePagination from "../../../../../molecules/Pagination";
import SortByButton from "../../../../../molecules/SortByButton";
import TestCard from "../../../../../organism/Cards/TestCard";
import TestCategoryCard from "../../../../../organism/Cards/TestCategoryCard";
import TestCardSkeleton from "../../../../../organism/Loading/LoadingTestCard";
import TableFilter from "../../../../../organism/TableFilter";

interface Props {
    havePurchased: boolean;
}
export default function SingleCourseTest({ havePurchased }: Props) {
    const { id } = useParams();

    const [qp, setQp] = useState<QueryParams>({
        pageIndex: 1,
        pageSize: 12
    });

    const [mediaQp, setMediaQp] = useState<QueryParams>({ pageIndex: 1, pageSize: 20 });

    // The opened test category lives in the URL (?category=12) so a refresh stays inside it
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryId = Number(searchParams.get("category")) || null;
    const setCategoryId = (value: number | null) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (value) next.set("category", String(value));
            else next.delete("category");
            return next;
        }, { replace: true });
    };
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [alphabeticOrder, setAlphabeticOrder] = useState<"a-z" | "z-a">("a-z");

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);


    const { data, isLoading } = useUseGetAllTestCategoryInACourseQuery(
        { pageIndex: qp.pageIndex, pageSize: qp.pageSize, id: Number(id) },
        { skip: !id }
    );


    // The category's name comes from the loaded list; a category on another page of that
    // list (after a refresh) still opens, just with a generic heading.
    const selectedPlaylist = categoryId
        ? data?.data?.data?.find((category) => Number(category.id) === categoryId) ?? { id: categoryId, name: "Tests" } as TestCategory
        : null;

    const { data: media, isLoading: loadingMedia } = useGetSelectedTestBasedOnTestCategoryAndCourseIdQuery(
        {
            pageIndex: mediaQp.pageIndex,
            pageSize: mediaQp.pageSize,
            search: debouncedSearch,
            course_id: Number(id),
            test_category_id: Number(categoryId),
            alphabetic_order: alphabeticOrder,
        },
        { skip: !id || !categoryId }
    );

    const mediaItems = media?.data?.data || [];
    const mediaTotalPages = media?.data?.pagination?.total_pages || 0;

    const handleSelectPlaylist = (category: TestCategory) => {
        setCategoryId(Number(category.id));
        setSearch("");
        setDebouncedSearch("");
        setMediaQp({ pageIndex: 1, pageSize: 20 });
    };

    const handleBack = () => {
        setCategoryId(null);
        setSearch("");
        setDebouncedSearch("");
        setMediaQp({ pageIndex: 1, pageSize: 20 });
    };

    if (!isLoading && !data?.data?.data?.length) {
        return <EmptyList
            title="No Test Found"
            description=""
        />
    }

    if (selectedPlaylist) {
        return (
            <div className="pb-4">
                <div className="mb-4">
                    <Button
                        variant="text"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                        sx={{ color: (theme) => theme.palette.separator.darkest }}
                    >
                        <Typography color="text.middle">{selectedPlaylist.name}</Typography>
                    </Button>
                </div>

                <div className="flex gap-2 items-center">
                    <div className="flex-1">
                        <TableFilter search={search} setSearch={setSearch} />
                    </div>
                    <SortByButton
                        value={alphabeticOrder}
                        onChange={(val) => { setAlphabeticOrder(val); setMediaQp({ pageIndex: 1, pageSize: 20 }); }}
                    />
                </div>

                <div className="mt-6">
                    {loadingMedia ? (
                        <div className="flex flex-col gap-3">
                            {[...Array(6)].map((_, idx) => <TestCardSkeleton key={idx} />)}
                        </div>
                    ) : mediaItems.length > 0 ? (
                        <div className="flex flex-col gap-4 md:grid grid-cols-2 2xl:grid-cols-3  lg:gap-6">
                            {mediaItems.map((media) => (
                                <TestCard
                                    havePurchased={havePurchased}
                                    key={media.id}
                                    test={media}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyList
                            title={`No Tests Found`}
                            description={`There are no test available in this chapter.`}
                            image="/empty-list-placeholder.svg"
                        />
                    )}
                </div>

                {!loadingMedia && mediaTotalPages > 1 && (
                    <div className="mt-6">
                        <TablePagination qp={mediaQp} setQp={setMediaQp} totalPages={mediaTotalPages} />
                    </div>
                )}
            </div>
        );
    }
    return (
        <div className="pb-4">
            <Box mt={1}>
                <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6">
                    {data?.data?.data?.map((test, index) => (
                        <TestCategoryCard key={index} data={test} onClick={() => handleSelectPlaylist(test)} />
                    ))}
                </div>
                {data?.data?.pagination?.total_pages && data?.data?.pagination?.total_pages > 1 ? (
                    <TablePagination qp={qp} setQp={setQp} totalPages={data?.data?.pagination?.total_pages || 0} />
                ) : ""}
            </Box>
        </div>
    );
}