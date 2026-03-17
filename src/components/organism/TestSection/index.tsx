import { useTranslation } from "react-i18next";
import type { TestProps } from "../../../types/question";
import type { TestStatus } from "../../pages/TestManagement/allTest/AllTestList";
import { Box, Button, Divider, Typography } from "@mui/material";
import TestCard from "../Cards/TestCard";
import { EmptyList } from "../../molecules/EmptyList";
import { ArrowDown } from "iconsax-reactjs";
import TestCardSkeleton from "../Loading/LoadingTestCard";

interface TestSectionProps {
    title: string;
    description: string;
    tests: TestProps[];
    isLoading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    showDivider?: boolean;
    status: TestStatus;
}

export default function TestSection({
    title,
    description,
    tests,
    isLoading,
    hasMore,
    onLoadMore,
    showDivider = true,
    status
}: TestSectionProps) {
    const { t } = useTranslation();

    if (!isLoading && !tests.length) return null
    return (
        <>
            <div className="header mb-3">
                <Typography variant="body2" fontWeight={600}>{title}</Typography>
                <Typography variant="subtitle2" color="text.middle" fontWeight={400}>
                    {description}
                </Typography>
            </div>

            <Box>
                {isLoading && tests.length === 0 ? (
                    <div className="flex flex-col gap-4 md:grid grid-cols-2 2xl:grid-cols-3 lg:gap-6">
                        {Array.from({ length: 4 }).map((_, idx) => <TestCardSkeleton key={idx} />)}
                    </div>
                ) : tests.length > 0 ? (
                    <div className="flex flex-col gap-4 sm:grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {tests.map((test) => (
                            <TestCard key={test.id} test={test} havePurchased status={status} />
                        ))}
                    </div>
                ) : (
                    <EmptyList
                        title="No Test Found"
                        description="There are no tests available for the selected course."
                    />
                )}
            </Box>

            {hasMore && (
                <div className="text-center mt-3">
                    <Button
                        variant="text"
                        color="primary"
                        endIcon={<ArrowDown size={16} />}
                        disabled={isLoading}
                        onClick={onLoadMore}
                    >
                        {isLoading ? "Loading More" : t("messages.load_more")}
                    </Button>
                </div>
            )}

            {showDivider && <Divider className="my-4! lg:my-6!" />}
        </>
    );
}