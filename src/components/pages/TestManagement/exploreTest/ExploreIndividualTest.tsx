import { useState } from "react";
import { useGetAllIndividualTestQuery } from "../../../../services/testApi";
import { EmptyList } from "../../../molecules/EmptyList";
import TablePagination from "../../../molecules/Pagination";
import ExploreTestCard from "../../../organism/Cards/ExploreTestCard";
import TableFilter from "../../../organism/TableFilter";

export default function ExploreIndividualTest() {
    const [search, setSearch] = useState("")
    const [qp, setQp] = useState({
        pageIndex: 1,
        pageSize: 12
    })

    const { data } = useGetAllIndividualTestQuery({
        ...qp, search: search
    });

    return (
        <div className="individual__root">
            <div className="top__header mt-4">
                <TableFilter search={search} setSearch={setSearch} />
            </div>
            {data && data?.data?.data?.length > 0 ? <>
                <div className="flex flex-col gap-4 md:grid grid-cols-2 xl:grid-cols-3 lg:gap-6 mt-4">
                    {data?.data?.data?.map((test) => (
                        <ExploreTestCard
                            test={test}
                            key={test.id}
                        />
                    ))}
                </div>
                <TablePagination
                    qp={qp}
                    setQp={setQp}
                    totalPages={data?.data?.pagination?.total_pages}
                />
            </>
                : <EmptyList
                    title="No Test Found"
                    description="There are no tests available for the selected course."
                />}
        </div>
    )
}
