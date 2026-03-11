import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";
import LinkController from "../../../molecules/TabController/LinkController";
import PageHeader from "../../../organism/PageHeader";

export default function ExploreTestRoot() {
    const { t } = useTranslation();

    return (
        <div className="explore__test__root h-full overflow-auto">
            <div className="top__header">
                <PageHeader
                    breadcrumb={[
                        { title: t("menus.exploreTest") }
                    ]}
                />
                <div className="flex flex-col gap-4">
                    <LinkController
                        options={[
                            { label: "All", value: PATH.TEST.EXPLORE_TEST.ROOT },
                            { label: "Individual Test", value: PATH.TEST.EXPLORE_TEST.INDIVIDUAl_TEST.ROOT },
                            { label: "Bundle Test", value: PATH.TEST.EXPLORE_TEST.BUNDLE_TEST.ROOT },
                            { label: "OMR", value: PATH.TEST.EXPLORE_TEST.OMR.ROOT },
                        ]}
                    />

                </div>
            </div>

            <Outlet />
        </div>
    )
}
