import { useGetLoginTypeSettingQuery } from "../services/settingApi";
import type { LoginType } from "../types/setting";

export function useLoginType() {
    const { data, isLoading } = useGetLoginTypeSettingQuery();
    return {
        loginType: (data?.data?.login_type ?? "otp") as LoginType,
        isLoading,
    };
}
