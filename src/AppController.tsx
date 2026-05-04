import React, { useEffect } from "react";
import BrandHead from "./components/atom/BrandHead";
import MaintenancePage from "./components/pages/Maintenance";
import ScreenProtection from "./ScreenProtection";
import { useGetControlsQuery } from "./services/controlsApi";
import { captureAttribution } from "./utils/attribution";

type Props = {
    children: React.ReactNode;
};

export default function AppController({ children }: Props) {
    const { data, isLoading } = useGetControlsQuery();

    useEffect(() => {
        captureAttribution(new URLSearchParams(window.location.search));
    }, []);

    // Don't block rendering while fetching — show content immediately,
    // maintenance / protection kicks in once the response arrives.
    if (isLoading) return <><BrandHead />{children}</>;

    const controls = data?.data;

    if (controls?.maintenance_mode) {
        return <><BrandHead /><MaintenancePage /></>;
    }

    if (controls?.screen_protection) {
        return <><BrandHead /><ScreenProtection>{children}</ScreenProtection></>;
    }

    return <><BrandHead />{children}</>;
}
