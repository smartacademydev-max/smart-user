import React from "react";
import MaintenancePage from "./components/pages/Maintenance";
import ScreenProtection from "./ScreenProtection";
import { useGetControlsQuery } from "./services/controlsApi";

type Props = {
    children: React.ReactNode;
};

export default function AppController({ children }: Props) {
    const { data, isLoading } = useGetControlsQuery();

    // Don't block rendering while fetching — show content immediately,
    // maintenance / protection kicks in once the response arrives.
    if (isLoading) return <>{children}</>;

    const controls = data?.data;

    if (controls?.maintenance_mode) {
        return <MaintenancePage />;
    }

    if (controls?.screen_protection) {
        return <ScreenProtection>{children}</ScreenProtection>;
    }

    return <>{children}</>;
}
