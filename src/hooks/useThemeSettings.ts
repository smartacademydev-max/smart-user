import { useGetThemeSettingsQuery } from "../services/settingApi";

export function useThemeSettings() {
    const { data, isLoading } = useGetThemeSettingsQuery();
    const s = data?.data;

    const brandName = s?.brand_name || s?.company_name || "";
    const companyName = s?.company_name || s?.brand_name || "";
    const logoUrl = s?.logo_url || "/logo.svg";
    const logoDarkUrl = s?.logo_dark_url || "/logo-dark.svg";
    const faviconUrl = s?.favicon_url || "/favicon.svg";

    return {
        brandName,
        companyName,
        tagline: s?.tagline ?? "",
        tpin: s?.tpin ?? "",
        metaDescription: s?.meta_description ?? "",
        logoUrl,
        logoDarkUrl,
        faviconUrl,
        isLoading,
    };
}
