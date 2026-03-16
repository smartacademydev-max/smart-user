import { useParams } from "react-router-dom";
import { PATH } from "../../../../../../routes/PATH";
import { useGetBundleByOverviewQuery } from "../../../../../../services/testApi";
import PageHeader from "../../../../../organism/PageHeader";
import SingleBundleOverview from "./SingleBundleOverview";
import TestInBundle from "./TestInBundle";

export default function SingleBundle() {
    const { id } = useParams();
    // const navigate = useNavigate();
    const { data: overview } = useGetBundleByOverviewQuery({ id: Number(id) }, { skip: !id });
    return (
        <>
            <PageHeader
                breadcrumb={[
                    { title: "Bundle Tests", url: PATH.TEST.EXPLORE_TEST.BUNDLE_TEST.ROOT },
                    { title: overview?.data?.name || "" }
                ]}
            />
            <div className="h-full overflow-auto">
                {overview ? <SingleBundleOverview data={overview.data} /> : ""}
                <TestInBundle />
            </div>

        </>
    )
}
