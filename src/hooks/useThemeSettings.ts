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
        /**
         * VAT charged on new sales. Read from settings so checkout and the
         * receipt agree with whatever the backend will actually charge.
         */
        vatPercentage: Number(s?.vat_percentage ?? 0) || 0,
        /** True when the listed price already contains the VAT. */
        vatInclusive: Boolean(s?.vat_inclusive),
        metaDescription: s?.meta_description ?? "",
        logoUrl,
        logoDarkUrl,
        faviconUrl,
        isLoading,
    };
}
