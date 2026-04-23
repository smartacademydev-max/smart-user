import { useMemo } from "react";
import { useGetPaymentGatewaysQuery } from "../services/settingApi";
import type { PaymentOption } from "../types/purchase";

const GATEWAY_UI: Record<string, { label: string; image: string }> = {
    esewa: { label: "Esewa", image: "/esewa.svg" },
    khalti: { label: "Khalti", image: "/khalti.svg" },
};

export function usePaymentGateways() {
    const { data, isLoading } = useGetPaymentGatewaysQuery();

    const gateways = data?.data ?? [];

    const activeGateways = useMemo(() => gateways.filter((g) => g.is_active), [gateways]);

    const paymentOptions = useMemo<PaymentOption[]>(
        () =>
            activeGateways
                .filter((g) => GATEWAY_UI[g.slug])
                .map((g, i) => ({
                    id: i + 1,
                    label: GATEWAY_UI[g.slug].label,
                    value: g.slug,
                    image: GATEWAY_UI[g.slug].image,
                })),
        [activeGateways]
    );

    return {
        gateways,
        activeGateways,
        anyActive: activeGateways.length > 0,
        paymentOptions,
        isLoading,
    };
}
