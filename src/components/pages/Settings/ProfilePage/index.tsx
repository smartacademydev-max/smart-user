import {
    Button,
    Divider,
    FormHelperText,
    InputLabel,
    OutlinedInput,
    Typography
} from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useUpdateProfileMutation } from "../../../../services/settingApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import type { User } from "../../../../types/user";
import ProfileImageUpload from "./ProfileImageUpload";


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
                    formData.append("profile", values.profile);
                }

                if (values.profile_url) {
                    formData.append("profile_url", values.profile_url);
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

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="profile__page__root"
        >
            <Typography variant="h5" fontWeight={600}>{t("messages.profile")}</Typography>
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
    );
}
