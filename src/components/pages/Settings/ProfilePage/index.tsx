import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Divider,
    FormHelperText,
    IconButton,
    InputLabel,
    OutlinedInput,
    Typography,
    useTheme
} from "@mui/material";
import { useFormik } from "formik";
import { CloseCircle } from "iconsax-reactjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useDownloadAdmitCardQuery } from "../../../../services/courseApi";
import { useUpdateProfileMutation } from "../../../../services/settingApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import type { User } from "../../../../types/user";
import ProfileImageUpload from "./ProfileImageUpload";
import UserEnrolledCourses from "./UserEnrolledCourses";
import UserTransactions from "./UserTransactions";


const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    phone: Yup.string()
        .required("Phone number is required")
        .matches(/^[0-9+]{7,15}$/, "Invalid phone number"),
    address: Yup.string().nullable(),
    profile: Yup.mixed<File>().nullable(),
});
export default function ProfilePageRoot() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();
    const { data, isLoading: downloading } = useDownloadAdmitCardQuery();
    const [open, setOpen] = useState(false);
    const theme = useTheme();


    const formik = useFormik<Partial<User>>({
        initialValues: {
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            address: user?.address || "",
            profile: null,
            profile_url: user?.profile_url || "",
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            try {
                const formData = new FormData();

                formData.append("name", values.name ?? "");
                formData.append("email", values.email ?? "");
                formData.append("phone", values.phone ?? "");

                if (values.address) {
                    formData.append("address", values.address);
                }

                if (values.profile instanceof File) {
                    formData.append("thumbnail", values.profile);
                }

                if (values.profile_url) {
                    formData.append("thumbnail_url", values.profile_url);
                }
                const response = await updateProfile(formData).unwrap();
                dispatch(
                    showToast({
                        message: response?.message || "Profile Updated Successfully",
                        severity: "success"
                    })
                )
            }
            catch (e: any) {
                dispatch(
                    showToast({
                        message: e?.data?.message || "Unable to update profile",
                        severity: "error"
                    })
                )
            }

        },
    });

    const handleAdmitCardDownload = async () => {
        try {
            const downloadUrl = data?.data?.download_url;

            if (!downloadUrl) {
                throw new Error("Download URL not found");
            }

            if (!user?.profile_url) {
                return dispatch(
                    showToast({
                        message: "Please upload profile picture to download admit card",
                        severity: "warning"
                    })
                )
            }

            window.open(downloadUrl, "_blank");
        } catch (e: any) {
            dispatch(
                showToast({
                    message: e?.data?.message || "Unable to download admit card",
                    severity: "error"
                })
            )
        }
    }

    return (
        <div className="profile__page__container  overflow-auto ">
            <form
                onSubmit={formik.handleSubmit}
                className="profile__page__root"
            >
                <div className="flex justify-between items-center flex-wrap">
                    <Typography variant="h5" fontWeight={600}>{t("messages.profile")}</Typography>
                    <Button variant="contained" color="primary" onClick={() => setOpen(true)}>{downloading ? "Downloading" : t("messages.download_admin_card")}</Button>
                </div>
                <Divider className="mt-2! mb-6!" />

                <div className="flex flex-col md:grid md:grid-cols-12 gap-4 lg:gap-6">
                    <div className="md:col-span-2">
                        <InputLabel>Your Profile Picture</InputLabel>

                        <ProfileImageUpload
                            previewUrl={formik.values.profile_url}
                            onChange={(file) => formik.setFieldValue("profile", file)}
                        />
                    </div>
                    <div className="col-span-10">
                        <div className="flex flex-col gap-4 lg:gap-6 md:grid md:grid-cols-2">

                            {/* Username */}
                            <div className="col-span-1">
                                <InputLabel>Full Name</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                />
                                <FormHelperText error>
                                    {formik.touched.name && formik.errors.name}
                                </FormHelperText>
                            </div>

                            {/* Email */}
                            <div className="col-span-1">
                                <InputLabel>Email</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                />
                                <FormHelperText error>
                                    {formik.touched.email && formik.errors.email}
                                </FormHelperText>
                            </div>

                            {/* Phone */}
                            <div className="col-span-1">
                                <InputLabel>Phone</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    name="phone"
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                                />
                                <FormHelperText error>
                                    {formik.touched.phone && formik.errors.phone}
                                </FormHelperText>
                            </div>

                            {/* Address (nullable) */}
                            <div className="col-span-1">
                                <InputLabel>Address</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    name="address"
                                    value={formik.values.address || ""}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter address"
                                    error={formik.touched.address && Boolean(formik.errors.address)}
                                />
                                <FormHelperText error>
                                    {formik.touched.address && formik.errors.address}
                                </FormHelperText>
                            </div>
                        </div>
                    </div>
                </div>
                <Divider className="my-6!" />
                <div className="text-right">
                    <Button variant="contained" type="submit" color="primary" disabled={isLoading}>{isLoading ? "Updating Profile" : "Update Profile"}</Button>
                </div>
            </form>
            <UserEnrolledCourses />
            <UserTransactions />
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg" fullWidth>
                <div className="header flex justify-between items-center px-4 py-4">
                    <Typography variant="h4" fontWeight={500}>Download Admit Card</Typography>
                    <IconButton
                        className="absolute! right-2 top-2"
                        onClick={() => setOpen(false)}
                    >
                        <CloseCircle
                            variant="Bulk"
                            color={theme.palette.error.main}
                        />
                    </IconButton>
                </div>
                <Divider className="my-2!" />
                <DialogContent>
                    <iframe src={data?.data?.preview_url || ""} className="w-full h-full min-h-[60vh]"></iframe>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={handleAdmitCardDownload}>{downloading ? "Downloading" : t("messages.download_admin_card")}</Button>
                    <div
                        style={{
                            display: "block",
                            padding: "40px",
                            background: "#f3f3f3",
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                position: "relative",
                                width: "210mm",
                                height: "297mm",
                                margin: "0 auto",
                                background: "#ffffff",
                                boxShadow: "0 0 20px rgba(0,0,0,0.1)",
                                padding: "15mm 20mm 15mm 20mm",
                                boxSizing: "border-box",
                                fontFamily: "Arial, sans-serif",
                            }}
                        >
                            {/* Watermark */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    textAlign: "center",
                                    opacity: 0.06,
                                    zIndex: 1,
                                }}
                            >
                                <img
                                    src="/logo.svg"
                                    alt="Watermark"
                                    style={{
                                        width: "60%",
                                        marginTop: "120mm",
                                    }}
                                />
                            </div>

                            {/* Content */}
                            <div style={{ position: "relative", zIndex: 2 }}>

                                {/* Logo */}
                                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                                    <img
                                        src="/logo.svg"
                                        alt=""
                                        style={{ width: "200px", height: "auto", margin: "0 auto" }}
                                    />
                                </div>

                                {/* Profile Section */}
                                <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: "20px" }}>
                                    <tr>
                                        {/* Left Column */}
                                        <td width="30%" style={{ verticalAlign: "top" }}>
                                            <img
                                                src="/auth-image.png"
                                                alt=""
                                                style={{ width: "100%", height: "auto" }}
                                            />
                                            <p style={{ fontSize: "8px", marginTop: "5px" }}>
                                                Joined Date: 23rd Feb, 2026
                                            </p>
                                        </td>

                                        {/* Right Column */}
                                        <td width="70%" style={{ verticalAlign: "top", paddingLeft: "15px" }}>
                                            <table width="100%" cellPadding="4" cellSpacing="0">
                                                <tr>
                                                    <td width="50%">
                                                        <div style={{ fontSize: "12px", fontWeight: 600, textAlign: "left" }}>Full Name</div>
                                                        <div style={{ textAlign: "left", fontSize: "12px" }}>John Doe</div>
                                                    </td>
                                                    <td width="50%">
                                                        <div style={{ fontSize: "12px", fontWeight: 600, textAlign: "left" }}>Email</div>
                                                        <div style={{ textAlign: "left", fontSize: "12px" }}>john@example.com</div>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td width="50%">
                                                        <div style={{ fontSize: "12px", fontWeight: 600, textAlign: "left" }}>Phone</div>
                                                        <div style={{ textAlign: "left", fontSize: "12px" }}>+123456789</div>
                                                    </td>
                                                    <td width="50%">
                                                        <div style={{ fontSize: "12px", fontWeight: 600, textAlign: "left" }}>Address</div>
                                                        <div style={{ textAlign: "left", fontSize: "12px" }}>New York, USA</div>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td width="50%">
                                                        <div style={{ fontSize: "12px", fontWeight: 600, textAlign: "left" }}>Gender</div>
                                                        <div style={{ textAlign: "left", fontSize: "12px" }}>Male</div>
                                                    </td>
                                                    <td width="50%">
                                                        <div style={{ fontSize: "12px", fontWeight: 600, textAlign: "left" }}>DOB</div>
                                                        <div style={{ textAlign: "left", fontSize: "12px" }}>01 Jan 1995</div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                {/* Enrolled Courses */}
                                <h4
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: 600,
                                        marginTop: "20px",
                                        marginBottom: "10px",
                                    }}
                                >
                                    Enrolled Courses
                                </h4>

                                <table
                                    width="100%"
                                    cellPadding="8"
                                    cellSpacing="0"
                                    style={{
                                        border: "1px solid #ddd",
                                        borderCollapse: "collapse",
                                        fontSize: "12px",
                                        marginBottom: "20px",
                                    }}
                                >
                                    <thead>
                                        <tr style={{ background: "#303188", color: "#fff" }}>
                                            <th style={{ textAlign: "left", padding: "4px" }}>S.No</th>
                                            <th style={{ textAlign: "left", padding: "4px" }}>Course Name</th>
                                            <th style={{ textAlign: "left", padding: "4px" }}>Purchased Date</th>
                                            <th style={{ textAlign: "left", padding: "4px" }}>End Date</th>
                                            <th style={{ textAlign: "left", padding: "4px" }}>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {[1, 2].map(( index) => (
                                            <tr key={index}>
                                                <td style={{ textAlign: "left", border: "1px solid #eee", padding: "4px", }}>{index + 1}</td>
                                                <td style={{ textAlign: "left", border: "1px solid #eee", padding: "4px", }}>React Course</td>
                                                <td style={{ textAlign: "left", border: "1px solid #eee", padding: "4px", }}>2025-01-01</td>
                                                <td style={{ textAlign: "left", border: "1px solid #eee", padding: "4px", }}>2025-12-31</td>
                                                <td style={{ textAlign: "left", border: "1px solid #eee", padding: "4px", }}>Active</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Transaction History */}
                                <h4
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: 600,
                                        marginBottom: "10px",
                                    }}
                                >
                                    Transaction History
                                </h4>

                                <table
                                    width="100%"
                                    cellPadding="8"
                                    cellSpacing="0"
                                    style={{
                                        border: "1px solid #ddd",
                                        borderCollapse: "collapse",
                                        fontSize: "12px",
                                    }}
                                >
                                    <thead>
                                        <tr style={{ background: "#303188", color: "#fff" }}>
                                            <th style={{ padding: "4px", textAlign: "left" }}>S.No</th>
                                            <th style={{ padding: "4px", textAlign: "left" }}>Course Name</th>
                                            <th style={{ padding: "4px", textAlign: "left" }}>Purchased Date</th>
                                            <th style={{ padding: "4px", textAlign: "left" }}>End Date</th>
                                            <th style={{ padding: "4px", textAlign: "left" }}>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {[1, 2].map((index) => (
                                            <tr key={index}>
                                                <td style={{ textAlign: "left", border: "1px solid #eee", padding: "4px", }}>{index + 1}</td>
                                                <td style={{ textAlign: "left", border: "1px solid #eee", padding: "4px", }}>React Course</td>
                                                <td style={{ textAlign: "left", border: "1px solid #eee", padding: "4px", }}>2025-01-01</td>
                                                <td style={{ textAlign: "left", border: "1px solid #eee", padding: "4px", }}>2025-12-31</td>
                                                <td style={{ textAlign: "left", border: "1px solid #eee", padding: "4px", }}>Active</td>
                                            </tr >
                                        ))
                                        }
                                    </tbody >
                                </table >
                            </div >

                            {/* Footer */}
                            < div
                                style={{
                                    position: "absolute",
                                    bottom: "10mm",
                                    left: "20mm",
                                    right: "20mm",
                                    fontSize: "12px",
                                    color: "#666",
                                }}
                            >
                                <table width="100%">
                                    <tr>
                                        <td align="left">
                                            © {new Date().getFullYear()} Your Company Name
                                        </td>
                                        <td align="right">
                                            Page 1 / 1
                                        </td>
                                    </tr>
                                </table>
                            </div >
                        </div >
                    </div >
                </DialogActions >
            </Dialog >
        </div >
    );
}
