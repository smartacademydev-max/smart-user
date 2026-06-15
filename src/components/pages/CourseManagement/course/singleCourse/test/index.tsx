
import { Box } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetCourseTestQuery } from "../../../../../../services/courseApi";
import { EmptyList } from "../../../../../molecules/EmptyList";
import TablePagination from "../../../../../molecules/Pagination";
import TestCard from "../../../../../organism/Cards/TestCard";

interface Props {

    havePurchased: boolean;
}
export default function SinlgeCourseTest({ havePurchased }: Props) {
    const { id } = useParams();
    const [qp, setQp] = useState({
        pageIndex: 1,
        pageSize: 1
    })
    const { data, isLoading } = useGetCourseTestQuery({ id: Number(id), ...qp }, { skip: !id });


    if (!isLoading && !data?.data?.data?.length) {
        return <EmptyList
            title="No Test Found"
            description=""
        />
    }
    return (
        <div className="pb-4">
            <Box mt={1}>
                <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6">
                    {data?.data?.data?.map((test, index) => (
                        <TestCard key={index} test={test} havePurchased={havePurchased} />
                    ))}
                </div>
                {data?.data?.pagination?.total_pages && data?.data?.pagination?.total_pages > 1 ? <TablePagination qp={qp} setQp={setQp} totalPages={data?.data?.pagination?.total_pages || 0} /> : ""}
            </Box>
        </div>
    );
}

