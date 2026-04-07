import {
	Box,
	CircularProgress,
	ClickAwayListener,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	OutlinedInput,
	Paper,
	Popper,
	Typography,
} from "@mui/material";
import { Send2 } from "iconsax-reactjs";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useGetAllUserInDiscussionQuery } from "../../../../services/discussionApi";
interface MentionState {
	query: string;
	startIndex: number;
}

interface Props {
	onSubmit: (body: string, mentionedUserIds: number[]) => void;
	placeholder?: string;
	loading?: boolean;
	initialValue?: string;
	onCancel?: () => void;
	autoFocus?: boolean;
	minRows?: number;
}

export default function CommentInput({ onSubmit, placeholder, loading = false, initialValue = "", onCancel, autoFocus = false, minRows = 2 }: Props) {
	const { t } = useTranslation();
	const { id } = useParams();
	const [value, setValue] = useState(initialValue);
	const [mentionState, setMentionState] = useState<MentionState | null>(null);
	const [mentionedUserIds, setMentionedUserIds] = useState<number[]>([]);
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const { data: usersData, isFetching: searchingUsers } = useGetAllUserInDiscussionQuery(
		{ pageIndex: 1, pageSize: 8, search: mentionState?.query ?? "", id: id ? Number(id) : 0 },
		{ skip: !mentionState }
	);

	const users = usersData?.data?.data ?? [];

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		const val = e.target.value;
		setValue(val);

		const cursor = (e.target as HTMLTextAreaElement).selectionStart ?? val.length;
		const textBefore = val.slice(0, cursor);
		const match = textBefore.match(/@(\w*)$/);

		if (match && match.index !== undefined) {
			setMentionState({ query: match[1], startIndex: match.index });
		} else {
			setMentionState(null);
		}
	};

	const handleMentionSelect = (user: { id: number; name: string }) => {
		if (!mentionState) return;
		const textBefore = value.slice(0, mentionState.startIndex);
		const textAfter = value.slice(mentionState.startIndex + 1 + mentionState.query.length);
		const newText = `${textBefore}@${user.name} ${textAfter}`;
		setValue(newText);
		setMentionState(null);
		setMentionedUserIds((prev) => (prev.includes(user.id) ? prev : [...prev, user.id]));

		// Restore focus to input
		setTimeout(() => inputRef.current?.focus(), 0);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape" && mentionState) {
			setMentionState(null);
			return;
		}
		if (e.key === "Enter" && !e.shiftKey && !mentionState) {
			e.preventDefault();
			handleSubmit();
		}
	};

	const handleSubmit = () => {
		const trimmed = value.trim();
		if (!trimmed) return;
		onSubmit(trimmed, mentionedUserIds);
		setValue("");
		setMentionedUserIds([]);
		setMentionState(null);
	};

	const showDropdown = Boolean(mentionState) && (searchingUsers || users.length > 0);

	return (
		<Box ref={containerRef} className="relative">
			<OutlinedInput
				multiline
				minRows={minRows}
				fullWidth
				value={value}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				placeholder={placeholder ?? t("messages.comment.placeholder")}
				autoFocus={autoFocus}
				inputRef={inputRef}
				disabled={loading}
				endAdornment={
					<Box className="self-end flex gap-1 pb-1">
						{onCancel && (
							<IconButton size="small" onClick={onCancel} disabled={loading}>
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
									<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
								</svg>
							</IconButton>
						)}
						<IconButton size="small" onClick={handleSubmit} disabled={loading || !value.trim()} color="primary">
							{loading ? <CircularProgress size={16} /> : <Send2 size={18} />}
						</IconButton>
					</Box>
				}
				sx={{ alignItems: "flex-start", pr: 1, "& .MuiOutlinedInput-input": { fontSize: "0.875rem" } }}
			/>

			<Popper
				open={showDropdown}
				anchorEl={containerRef.current}
				placement="bottom-start"
				sx={{ zIndex: 1300, width: containerRef.current?.offsetWidth ?? 300 }}
			>
				<ClickAwayListener onClickAway={() => setMentionState(null)}>
					<Paper elevation={4}>
						{searchingUsers ? (
							<Box className="flex justify-center p-3">
								<CircularProgress size={20} />
							</Box>
						) : users.length === 0 ? (
							<Box className="p-3">
								<Typography variant="caption" color="text.secondary">
									{t("messages.comment.no_users_found")}
								</Typography>
							</Box>
						) : (
							<List dense disablePadding sx={{ maxHeight: 200, overflow: "auto" }}>
								{users.map((user) => (
									<ListItem key={user.id} disablePadding>
										<ListItemButton onClick={() => handleMentionSelect({ id: Number(user.id), name: user.name })}>
											<Box className="flex flex-col">
												<ListItemText primary={user.name} primaryTypographyProps={{ variant: "body2", fontWeight: 500 }} />
												{user.designation && (
													<Typography variant="caption" color="text.secondary">
														{user.designation}
													</Typography>
												)}
											</Box>
										</ListItemButton>
									</ListItem>
								))}
							</List>
						)}
					</Paper>
				</ClickAwayListener>
			</Popper>
		</Box>
	);
}
