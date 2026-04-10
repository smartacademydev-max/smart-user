
import { createApi } from "@reduxjs/toolkit/query/react";
import type {
	AuthBridgeResponse,
	DeviceResetRequestPayload,
	GlobalResponse,
	LoginUserProps,
	RegisterUserProps,
	UserResponse,
} from "../types/user";
import { baseQuery } from "./baseQuery";

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: baseQuery,
	endpoints: (builder) => ({
		register: builder.mutation<UserResponse, RegisterUserProps>({
			query: (body) => ({
				url: "/auth/register",
				method: "POST",
				body,
			}),
		}),
		verifyOtp: builder.mutation<UserResponse, LoginUserProps>({
			query: (body) => ({
				url: "/auth/verify-otp",
				method: "POST",
				body,
			}),
		}),
		resendOtp: builder.mutation<GlobalResponse & { data: { otp: string } }, { phone: string }>({
			query: ({ phone }) => ({
				url: "/auth/resend-otp",
				method: "POST",
				body: { phone },
			}),
		}),
		authBridge: builder.mutation<AuthBridgeResponse, { one_time_token: string }>({
			query: ({ one_time_token }) => ({
				url: `/auth/bridge`,
				method: "POST",
				body: {
					bridge_token: one_time_token
				}
			})
		}),
		validateUserExistance: builder.mutation<GlobalResponse, { data: string }>({
			query: (body) => ({
				url: `/auth/has-user`,
				method: "POST",
				body
			})
		}),
		requestDeviceReset: builder.mutation<GlobalResponse, DeviceResetRequestPayload>({
			query: (body) => ({
				url: `/reset-request`,
				method: "POST",
				body,
			}),
		}),
	}),
});

export const {
	useRegisterMutation,
	useVerifyOtpMutation,
	useResendOtpMutation,
	useAuthBridgeMutation,
	useValidateUserExistanceMutation,
	useRequestDeviceResetMutation,
} = authApi;
