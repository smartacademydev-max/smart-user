import { useEffect, useState } from "react";
import { useGetAllCategoryQuery } from "../../../../services/categoryApi";
import { useGetAllIndividualTestQuery } from "../../../../services/testApi";
import { EmptyList } from "../../../molecules/EmptyList";
import TablePagination from "../../../molecules/Pagination";
import TabController from "../../../molecules/TabController";
import ExploreTestCard from "../../../organism/Cards/ExploreTestCard";
import TableFilter from "../../../organism/TableFilter";

export default function ExploreAllTest() {
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
    const [qp, setQp] = useState({
        pageIndex: 1,
        pageSize: 12
    })

    const { data: categories } = useGetAllCategoryQuery({ pageIndex: 1, pageSize: 10 });
    const [options, setOptions] = useState<{ label: string; value: number }[]>([]);
    const [activeCategory, setActiveCategory] = useState(0);

    const { data } = useGetAllIndividualTestQuery({
        ...qp,
        search: debouncedSearch,
        ...(activeCategory !== 0 && {
            categoryFilter: {
                mega_category: [activeCategory],
            },
        }),
    });

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 1000);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const list = categories?.data || [];
        const formatted = list.map((category) => ({
            label: category.name,
            value: Number(category?.id),
        }));
        setOptions([{ label: "All", value: 0 }, ...formatted]);
    }, [categories]);

    useEffect(() => {
        setQp((prev) => ({ ...prev, pageIndex: 1 }));
    }, [activeCategory, debouncedSearch]);

    return (
        <>
            <div className="top__header mt-4 pb-1 flex flex-col gap-4 md:grid md:grid-cols-12">
                <div className="col-span-7">
                    <TabController
                        options={options}
                        currentActive={activeCategory}
                        setActiveTab={(val) => setActiveCategory(val)}
                    />
                </div>
                <div className="col-span-1"></div>
                <div className="col-span-4">
                    <TableFilter search={search} setSearch={setSearch} />
                </div>
            </div>
            <div className="explore_all__test__root h-full overflow-auto pt-4 pr-2">
                {data && data?.data?.data?.length > 0 ? <>
                    <div className="flex flex-col gap-4 md:grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 lg:gap-4 ">
                        {data?.data?.data?.map((test) => (
                            <ExploreTestCard
                                test={test}
                                key={test.id}
                            />
                        ))}
                    </div>

                </>
                    : <EmptyList
                        title="No Test Found"
                        description="There are no tests available for the selected course."
                    />}
            </div>
            <TablePagination
                qp={qp}
                setQp={setQp}
                totalPages={data?.data?.pagination?.total_pages || 0}
            />
        </>
    )
}
