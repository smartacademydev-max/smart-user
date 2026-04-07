import CloseIcon from "@mui/icons-material/Close";
import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormHelperText,
	IconButton,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select,
	Stack
} from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useCreateTicketMutation, useGetTicketTypesQuery } from "../../../../services/ticketApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";

interface Props {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

const validationSchema = Yup.object({
	subject: Yup.string().required("Subject is required").max(255, "Max 255 characters"),
	description: Yup.string().required("Description is required"),
	type_id: Yup.number().nullable(),
});

export default function TicketForm({ open, onClose, onSuccess }: Props) {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const [createTicket, { isLoading }] = useCreateTicketMutation();
	const { data: typesData } = useGetTicketTypesQuery({ pageIndex: 1, pageSize: 20 });
	const ticketTypes = typesData?.data?.data ?? [];

	const formik = useFormik({
		initialValues: {
			subject: "",
			description: "",
			type_id: null as number | null,
			priority: "low",
		},
		validationSchema,
		onSubmit: async (values) => {
			try {
				const response = await createTicket({
					subject: values.subject,
					description: values.description,
					type_id: values.type_id,
					priority: values.priority,
				}).unwrap();
				dispatch(
					showToast({
						message: response?.message || t("messages.ticket.saved"),
						severity: "success",
					})
				);
				formik.resetForm();
				onSuccess();
			} catch (e: any) {
				dispatch(
					showToast({
						message: e?.data?.message || t("messages.ticket.save_error"),
						severity: "error",
					})
				);
			}
		},
	});

	const handleClose = () => {
		if (!isLoading) {
			formik.resetForm();
			onClose();
		}
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
			<DialogTitle>
				<Stack direction="row" justifyContent="space-between" alignItems="center">
					{t("messages.ticket.new_ticket")}
					<IconButton size="small" onClick={handleClose} disabled={isLoading}>
						<CloseIcon fontSize="small" />
					</IconButton>
				</Stack>
			</DialogTitle>

			<form onSubmit={formik.handleSubmit}>
				<DialogContent dividers>
					<div className="flex flex-col gap-4 md:grid md:grid-cols-2">
						<div className="col-span-2">
							<InputLabel className="required">Subject</InputLabel>
							<OutlinedInput
								fullWidth
								name="subject"
								value={formik.values.subject}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								placeholder="Brief summary of your issue"
							/>
							{formik.touched.subject && formik.errors.subject && (
								<FormHelperText error={true}>{formik.errors.subject}</FormHelperText>
							)}
						</div>
						<div className="col-span-2">
							<InputLabel className="required">Ticket Type</InputLabel>
							<Select
								fullWidth
								name="type_id"
								value={formik.values.type_id ?? ""}
								onChange={(e) =>
									formik.setFieldValue(
										"type_id",
										Number(e.target.value)
									)
								}
							>
								<MenuItem value="">
									<em>None</em>
								</MenuItem>
								{ticketTypes.map((type) => (
									<MenuItem key={type.id} value={type.id}>
										{type.name}
									</MenuItem>
								))}
							</Select>
						</div>

						<div className="col-span-2">
							<InputLabel className="required">Description</InputLabel>
							<OutlinedInput
								fullWidth
								name="description"
								multiline
								minRows={4}
								value={formik.values.description}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								placeholder="Describe your issue in detail..."
							/>
							{formik.touched.description && formik.errors.description && (
								<FormHelperText error={true}>{formik.errors.description}</FormHelperText>
							)}
						</div>
					</div>
				</DialogContent>

				<DialogActions sx={{ px: 3, py: 2 }}>
					<Button variant="outlined" onClick={handleClose} disabled={isLoading}>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="contained"
						disabled={isLoading || !formik.isValid || !formik.dirty}
						startIcon={isLoading ? <CircularProgress size={16} /> : null}
					>
						{isLoading ? "Submitting..." : "Submit Ticket"}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}
