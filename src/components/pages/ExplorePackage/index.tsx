import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import PageHeader from "../../organism/PageHeader";

export default function ExplorePackageRoot() {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col h-full">
            <PageHeader
                breadcrumb={[{ title: t("menus.explorePackage") }]}
            />
            <Outlet />
        </div>
    );
}
