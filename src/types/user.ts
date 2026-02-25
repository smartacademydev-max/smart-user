import type { Dayjs } from "dayjs";
import type { Pagination } from ".";

export type PermissionProps = string[];
export type Token = {
	access_token: string;
} | null;

export interface RegisterUserProps {
	id?: string;
	name: string;
	email: string;
	phone: string;
	thumbnail?: File | null;
	thumbnail_url?: string;
	interested_categories?: number[];
	address?: string;
	role?: {
		id: string;
		name: string;
	};
	password?: string;
	password_confirmation?: string;
	designation?: string;
}

export const RegisterUserInitialData: RegisterUserProps = {
	name: "",
	email: "",
	phone: "",
	role: {
		name: "",
		id: ""
	},
	password: "",
	password_confirmation: "",
	thumbnail: null,
	thumbnail_url: "",
	designation: "",
}

export interface LoginUserProps {
	phone: string
	otp: string;
}

export interface GlobalResponse {
	message: string;
	status: string;
}

export type Gender = "male" | "female" | "other";
export interface User extends RegisterUserProps {
	permissions: PermissionProps;
	joined_date: string;
	gender: Gender
	country: string;
	province: string;
	city: string
	dob: string | Dayjs
	// role: string[];
}

export interface UserResponse extends GlobalResponse {
	data: {
		user: User;
		token: Token;
	};
}


export interface UserList extends GlobalResponse {
	data: {
		data: RegisterUserProps[];
		pagination: Pagination;
	}
}