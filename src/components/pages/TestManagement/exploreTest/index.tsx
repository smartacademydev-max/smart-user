import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetAllIndividualTestQuery } from "../../../../services/testApi";
import type { QuestionTypeProps } from "../../../../types/question";
import { EmptyList } from "../../../molecules/EmptyList";
import TablePagination from "../../../molecules/Pagination";
import TabController from "../../../molecules/TabController";
import ExploreTestCard from "../../../organism/Cards/ExploreTestCard";
import PageHeader from "../../../organism/PageHeader";
import TableFilter from "../../../organism/TableFilter";

export default function ExploreAllTest() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<QuestionTypeProps>("");

    const [search, setSearch] = useState("")
    const [qp, setQp] = useState({
        pageIndex: 1,
        pageSize: 12
    })

    const { data } = useGetAllIndividualTestQuery({
        ...qp, search: search, type: activeTab

    });

    return (
        <div className="explore__test__root h-full overflow-auto">
            <div className="top__header">
                <PageHeader
                    breadcrumb={[
                        { title: t("menus.exploreTest") }
                    ]}
                />
                <div className="flex flex-col gap-4">
                    <TabController
                        setActiveTab={(newValue) => setActiveTab(newValue)}
                        currentActive={activeTab}
                        options={[
                            { label: "All", value: "" },
                            { label: "Subjective", value: "subjective" },
                            { label: "MCQs", value: "mcq" },
                            { label: "OMR", value: "omr" },
                        ]}
                    />
                    <TableFilter search={search} setSearch={setSearch} />
                </div>
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
