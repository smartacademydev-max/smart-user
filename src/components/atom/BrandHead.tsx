import { useEffect } from "react";
import { useThemeSettings } from "../../hooks/useThemeSettings";

export default function BrandHead() {
    const { brandName, tagline, metaDescription, faviconUrl } = useThemeSettings();

    useEffect(() => {
        const parts = [brandName, tagline].filter(Boolean);
        if (parts.length) document.title = parts.join(" | ");
    }, [brandName, tagline]);

    useEffect(() => {
        if (!metaDescription) return;
        let el = document.querySelector<HTMLMetaElement>('meta[name="description"]');
        if (!el) {
            el = document.createElement("meta");
            el.setAttribute("name", "description");
            document.head.appendChild(el);
        }
        el.setAttribute("content", metaDescription);
    }, [metaDescription]);

    useEffect(() => {
        if (!faviconUrl) return;
        let el = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
        if (!el) {
            el = document.createElement("link");
            el.rel = "icon";
            document.head.appendChild(el);
        }
        el.href = faviconUrl;
    }, [faviconUrl]);

    return null;
}
