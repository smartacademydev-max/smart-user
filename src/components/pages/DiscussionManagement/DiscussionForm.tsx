import { FormHelperText, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { PATH } from "../../../routes/PATH";
import { useGetAllMegaCategoryQuery } from "../../../services/categoryApi";
import { useCreateDiscussionMutation, useGetDiscussionByIdQuery, useUpdateDiscussionMutation } from "../../../services/discussionApi";
import { showToast } from "../../../slice/toastSlice";
import { useAppDispatch } from "../../../store/hook";
import { DiscussionInitialState } from "../../../types/discussion";

import PageHeader from "../../organism/PageHeader";
import FooterAction from "../../molecules/FooterAction";
import TextEditor from "../../atom/TextEditor";

const validationSchema = Yup.object({
	title: Yup.string().required("Title is required"),
	description: Yup.string().required("Description is required"),
	mega_category_id: Yup.number().nullable().required("Mega category is required"),
});

export default function DiscussionForm() {
	const { id } = useParams();
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const { data: existingDiscussion } = useGetDiscussionByIdQuery({ id: Number(id) }, { skip: !id });
	const { data: categoriesData } = useGetAllMegaCategoryQuery();
	const [createDiscussion, { isLoading: creating }] = useCreateDiscussionMutation();
	const [updateDiscussion, { isLoading: updating }] = useUpdateDiscussionMutation();

	const categories = categoriesData?.data || [];

	const formik = useFormik({
		initialValues: existingDiscussion ? existingDiscussion.data : DiscussionInitialState,
		validationSchema,
		enableReinitialize: true,
		onSubmit: async (values) => {
			try {
				const body = {
					title: values.title,
					description: values.description,
					mega_category_id: values.mega_category_id,
					status: values.status,
				};

				const response = id
					? await updateDiscussion({ id: Number(id), body }).unwrap()
					: await createDiscussion(body).unwrap();

				dispatch(showToast({ message: response?.message || t("messages.discussion.saved"), severity: "success" }));
				navigate(PATH.DISCUSSION.ROOT);
			} catch (e: any) {
				dispatch(showToast({ message: e?.data?.message || t("messages.discussion.save_error"), severity: "error" }));
			}
		},
	});

	const isEditMode = Boolean(id);

	return (
		<div className="discussion__form__root h-full flex flex-col">
			<PageHeader
				breadcrumb={[
					{
						title: t("menus.discussion.root"),
						url: PATH.DISCUSSION.ROOT,
						icon: (
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
								<path d="M8 10h8M8 13h5M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.6.376 3.112 1.043 4.453L2 22l5.547-1.043A9.955 9.955 0 0012 22z" stroke="#1D82F5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						),
					},
					{
						title: isEditMode ? t("actions.edit") : t("actions.create"),
					},
				]}
			/>

			<form onSubmit={formik.handleSubmit} className="flex-1 flex flex-col">
				<div className="form__body flex flex-col gap-4 py-4">
					{/* Title */}
					<div>
						<InputLabel className="required">{t("labels.title")}</InputLabel>
						<OutlinedInput
							fullWidth
							name="title"
							value={formik.values.title}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={formik.touched.title && Boolean(formik.errors.title)}
							placeholder={t("placeholders.title")}
						/>
						{formik.touched.title && formik.errors.title && (
							<FormHelperText error>{formik.errors.title}</FormHelperText>
						)}
					</div>

					{/* Mega Category */}
					<div>
						<InputLabel required>{t("labels.mega_category")}</InputLabel>
						<Select
							fullWidth
							name="mega_category_id"
							value={formik.values.mega_category_id ?? ""}
							onChange={(e) => formik.setFieldValue("mega_category_id", e.target.value)}
							onBlur={formik.handleBlur}
							error={formik.touched.mega_category_id && Boolean(formik.errors.mega_category_id)}
							displayEmpty
						>
							<MenuItem value="" disabled>{t("placeholders.select_mega_category")}</MenuItem>
							{categories.map((cat) => (
								<MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
							))}
						</Select>
						{formik.touched.mega_category_id && formik.errors.mega_category_id && (
							<FormHelperText error>{formik.errors.mega_category_id as string}</FormHelperText>
						)}
					</div>

					{/* Description */}
					<div>

						<TextEditor
							label={t("labels.description")}
							required
							value={formik.values.description}
							onChange={(val) => formik.setFieldValue("description", val)}
						/>
						{formik.touched.description && formik.errors.description && (
							<FormHelperText error>{formik.errors.description}</FormHelperText>
						)}
					</div>
				</div>

				<FooterAction
					isLoading={creating}
					isUpdating={updating}
					isEditMode={isEditMode}
					replaceLabel={t("messages.discussion.singular")}
					handleConfirmationChange={() => navigate(PATH.DISCUSSION.ROOT)}
				/>
			</form>
		</div>
	);
}
