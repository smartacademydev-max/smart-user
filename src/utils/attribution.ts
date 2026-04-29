const ATTRIBUTION_KEY = "attribution";
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export type AttributionType = "referral" | "marketing";

export interface Attribution {
    type: AttributionType;
    code: string;
    captured_at: number;
}

export function captureAttribution(searchParams: URLSearchParams): void {
    const ref = searchParams.get("ref");
    const campaign = searchParams.get("campaign");
    if (!ref && !campaign) return;

    const entry: Attribution = {
        type: ref ? "referral" : "marketing",
        code: (ref ?? campaign)!,
        captured_at: Date.now(),
    };
    try {
        localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(entry));
    } catch {}
}

export function getAttribution(): Attribution | null {
    try {
        const raw = localStorage.getItem(ATTRIBUTION_KEY);
        if (!raw) return null;
        const entry: Attribution = JSON.parse(raw);
        if (Date.now() - entry.captured_at > TTL_MS) {
            localStorage.removeItem(ATTRIBUTION_KEY);
            return null;
        }
        return entry;
    } catch {
        return null;
    }
}

export function clearAttribution(): void {
    try {
        localStorage.removeItem(ATTRIBUTION_KEY);
    } catch {}
}
