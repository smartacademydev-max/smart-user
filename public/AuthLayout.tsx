import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../../../store/hook";

export default function AuthLayout() {
	const { mode } = useAppSelector((state) => state.theme)
	return (
		<Box
			// sx={{
			// 	width: {
			// 		xs: "100%",
			// 		xl: "62%",
			// 	},
			// }}
			className="lg:grid lg:grid-cols-2 lg:gap-10 2xl:gap-20">
			<div className="auth__image__wrapper col-span-1 hidden lg:block">
				<img
					src={mode === "light" ? "/logo-dark.svg" : "/logo.svg"}
					alt=""
					width={132}
					height={70}
					className="mb-[104px]"
				/>
				<img
					src="/auth-image.png"
					alt=""
					width={430}
					height={302}
					className="pl-14 pr-[26px]"
				/>
			</div>
			<div className="auth__form__wrapper col-span-1">
				<Outlet />
			</div>
		</Box>
	);
}
