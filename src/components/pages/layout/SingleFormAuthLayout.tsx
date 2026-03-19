import { Button } from "@mui/material";
import { ArrowLeft } from "iconsax-reactjs";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hook";

export default function SingleFormAuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const navigate = useNavigate();
	const location = useLocation();
	const route = location.pathname.split("/");
	const currentRoute = route[route.length - 1];
	const { mode } = useAppSelector((state) => state.smart_theme)

	return (
		<>
			{currentRoute === "verify-otp" ? <Button onClick={() => navigate(-1)} variant="text" color="primary" startIcon={<ArrowLeft />} className="mb-8! lg:mb-16!">Change the number</Button> : ""}

			{currentRoute === "verify-otp" ? <img src={mode === "light" ? "/logo-dark.svg" : "/logo.svg"} alt="" width={132} height={70} className="mb-8" /> : ""}
			{children}
		</>
	);
}
