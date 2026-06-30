import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";
import { useUseGetAllTestCategoryInACourseQuery } from "../../../../services/courseApi";
import TablePagination from "../../../molecules/Pagination";
import TestCategoryCard from "../../../organism/Cards/TestCategoryCard";
import PageHeader from "../../../organism/PageHeader";
import TableFilter from "../../../organism/TableFilter";

export default function TestCategoryInCourse() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [qp, setQp] = useState({
        pageIndex: 1,
        pageSize: 20,
    })
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebounceSearch] = useState("")

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceSearch(search);
        }, 1000);
        return () => clearTimeout(timer);
    }, [search]);

    const { data } = useUseGetAllTestCategoryInACourseQuery(
        { id: Number(courseId), pageIndex: qp.pageIndex, pageSize: qp.pageSize, search: debouncedSearch },
        { skip: !courseId }
    );
    const items = data?.data?.data ?? [];
    const total = data?.data?.pagination?.total_pages ?? items.length;
    return (
        <>
            <PageHeader breadcrumb={[
                { title: "My Test", url: PATH.TEST.MY_TEST.ROOT },
                { title: "Test Category" }
            ]} />

            <TableFilter
                search={search}
                setSearch={setSearch}
            />

            <div className="flex flex-col gap-4 sm:grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {items.map((test) => (
                    <TestCategoryCard key={test.id} data={test} onClick={() => { navigate(PATH.TEST.MY_TEST.TEST_CATEGORY.VIEW_TEST_CATEGORY.ROOT(Number(courseId), Number(test.id))) }} />
                ))}
            </div>

            <TablePagination qp={qp} setQp={setQp} totalPages={total} />
        </>
    )
}
