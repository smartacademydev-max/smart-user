import { Box, Chip, Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { Dislike, Eye, Like1, Messages1 } from 'iconsax-reactjs';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../../../routes/PATH';
import { useDislikeDiscussionMutation, useLikeDiscussionMutation } from '../../../services/discussionApi';
import { showToast } from '../../../slice/toastSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hook';
import type { DiscussionProps } from '../../../types/discussion';
import { formatDateForDisplay } from '../../../utils/dateFormat';
import { getDiscussionStatus } from '../../../utils/statusMap';
import StatusPill from '../../atom/StatusPill';
import Actions from '../../molecules/Action';

function stripHtml(html: string): string {
	return html.replace(/<[^>]*>/g, '').trim();
}

interface Props {
	data: DiscussionProps;
	onDelete?: () => void;
	onToggleVisibility?: () => void;
}

export default function DiscussionCard({ data, onDelete }: Props) {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const user = useAppSelector((state) => state.auth.user);
	const statusVariant = getDiscussionStatus(data.status);
	const date = formatDateForDisplay(data?.created_at);
	const excerpt = stripHtml(data.description).slice(0, 180) + (stripHtml(data.description).length > 180 ? '...' : '');

	const isOwner = !!user?.id && data.created_by_id === Number(user.id);

	const [likeDiscussion] = useLikeDiscussionMutation();
	const [dislikeDiscussion] = useDislikeDiscussionMutation();

	const isLiked = data.user_reaction === 'liked';
	const isDisliked = data.user_reaction === 'disliked';

	const handleLike = async (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!data.id) return;
		try {
			await likeDiscussion({ id: data.id }).unwrap();
		} catch {
			dispatch(showToast({ message: t('messages.toasts.error_general'), severity: 'error' }));
		}
	};

	const handleDislike = async (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!data.id) return;
		try {
			await dislikeDiscussion({ id: data.id }).unwrap();
		} catch {
			dispatch(showToast({ message: t('messages.toasts.error_general'), severity: 'error' }));
		}
	};

	return (
		<Box
			className="discussion__card cursor-pointer"
			sx={{
				border: (theme) => `1px solid ${theme.palette.textField.border}`,
				borderRadius: 2,
				p: { xs: 2, sm: 2.5 },
				transition: 'border-color 0.15s, box-shadow 0.15s',
				'&:hover': {
					borderColor: 'primary.main',
					boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
				},
			}}
			onClick={() => navigate(PATH.DISCUSSION.DETAIL.ROOT(data.id))}
		>
			<Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
				<Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
					{data.mega_category_name && (
						<Chip label={data.mega_category_name} size="small" color="primary" variant="outlined" />
					)}
					<StatusPill variant={statusVariant} status={data.status} />
				</Stack>
				{isOwner && (
					<Box onClick={(e) => e.stopPropagation()} sx={{ ml: 1, flexShrink: 0 }}>
						<Actions
							editUrl={PATH.DISCUSSION.EDIT.ROOT(data.id)}
							onDelete={onDelete}
						/>
					</Box>
				)}
			</Stack>

			<Typography
				variant="h6"
				fontWeight={600}
				className="line-clamp-2"
			>
				{data.title}
			</Typography>

			<Typography
				variant="subtitle2"
				color="text.secondary"
			>
				{excerpt || '—'}
			</Typography>

			<Divider sx={{ my: 1.5 }} />

			<Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
				<Stack direction="row" alignItems="center" gap={1}>
					<Box
						className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
						sx={{ bgcolor: 'primary.light', color: 'primary.main' }}
					>
						{data.created_by?.charAt(0)?.toUpperCase() ?? '?'}
					</Box>
					{data.created_by && (
						<Typography variant="caption" fontWeight={500} color="text.primary">
							{data.created_by}
						</Typography>
					)}
					{data.created_at && (
						<>
							<Typography variant="caption" color="text.disabled">·</Typography>
							<Typography variant="caption" color="text.disabled">{date}</Typography>
						</>
					)}
				</Stack>

				<Stack direction="row" alignItems="center" gap={1.5} onClick={(e) => e.stopPropagation()}>
					<Stack direction="row" alignItems="center" gap={0.5}>
						<Eye size={16} />
						<Typography variant="caption" color="text.secondary">{data.views_count ?? 0}</Typography>
					</Stack>

					<Stack direction="row" alignItems="center" gap={0.5}>
						<Messages1 size={16} />
						<Typography variant="caption" color="text.secondary">{data.comments_count ?? 0}</Typography>
					</Stack>

					<Tooltip title="Like">
						<Stack direction="row" alignItems="center" gap={0.5}>
							<IconButton
								size="small"
								onClick={handleLike}
								sx={{ p: 0.25, color: isLiked ? 'primary.main' : 'text.secondary' }}
							>
								<Like1 size={16} />
							</IconButton>
							<Typography variant="caption" color={isLiked ? 'primary.main' : 'text.secondary'}>
								{data.likes_count ?? 0}
							</Typography>
						</Stack>
					</Tooltip>

					<Tooltip title="Dislike">
						<Stack direction="row" alignItems="center" gap={0.5}>
							<IconButton
								size="small"
								onClick={handleDislike}
								sx={{ p: 0.25, color: isDisliked ? 'error.main' : 'text.secondary' }}
							>
								<Dislike size={16} />
							</IconButton>
							<Typography variant="caption" color={isDisliked ? 'error.main' : 'text.secondary'}>
								{data.dislikes_count ?? 0}
							</Typography>
						</Stack>
					</Tooltip>
				</Stack>
			</Stack>
		</Box>
	);
}
