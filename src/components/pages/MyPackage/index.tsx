import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageHeader from "../../organism/PageHeader";

export default function MyPackageRoot() {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col h-full">
            <PageHeader
                breadcrumb={[{ title: t("menus.myPackage") }]}
            />
            <div className="flex-1 overflow-auto">
                <Outlet />
            </div>
        </div>
    );
}
