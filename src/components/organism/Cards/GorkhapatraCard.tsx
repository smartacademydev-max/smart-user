import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { t } from 'i18next';
import { Calendar, Eye } from 'iconsax-reactjs';
import { Link, useNavigate } from 'react-router-dom';
import { PATH } from '../../../routes/PATH';
import type { GorkhapatraProps, GorkhapatraTypes } from '../../../types/gorkhapatra';
import { formatDateForDisplay } from '../../../utils/dateFormat';
import { getGorkhapatraStatus } from '../../../utils/statusMap';
import StatusPill from '../../atom/StatusPill';


export default function GorkhapatraCard({ data }: { data: GorkhapatraProps; }) {
    const navigate = useNavigate();
    const variant = getGorkhapatraStatus(data.type || "descriptive" as GorkhapatraTypes);
    const date = formatDateForDisplay(data?.created_at);
    return (
        <Box className="px-1.5 pt-1.5 pb-3 rounded-md h-full flex flex-col justify-between" sx={{
            border: (theme) => `1px solid ${theme.palette.textField.border}`
        }}>
            <div className="top__wrapper">
                <Box className="image__wrapper aspect-316/132 rounded-md overflow-hidden relative flex flex-col justify-center items-center" sx={{
                    background: (theme) => theme.palette.primary.dark
                }}>
                    {data?.thumbnail_url ? <img src={data?.thumbnail_url} alt={data?.title} className='w-full h-full object-cover' /> : <>

                        <Typography variant='h3' color='primary.contrastText' fontWeight={700}>{t("messages.gorkhapatra")}</Typography>
                        <Typography variant='body2' color='info.main' className='text-center px-4'>{data?.title}</Typography>
                    </>}
                    {data.type ? <div className="absolute top-2 left-2">
                        <StatusPill variant={variant} status={data?.type} />
                    </div> : ""}
                </Box>
                <div className="content__box pt-2 px-2">
                    <Link to={PATH.GORKHAPATRA.VIEW_GORKHAPATRA.ROOT(Number(data.id))}>
                        <Typography variant='body2' className='mb-2!' fontWeight={600} sx={{
                            "&:hover": {
                                color: (theme) => theme.palette.primary.dark
                            }
                        }}>{data.title}</Typography>
                    </Link>
                    <Typography variant='subtitle2' >{data.title}</Typography>
                </div>
            </div>
            <div className="bottom px-2">
                <Divider className='my-4!' />
                <Stack className='justify-between mb-4'>
                    <Stack className='items-center! gap-1!'>
                        <Calendar />
                        <Typography variant='caption' color='text.middle'>{date}</Typography>
                    </Stack>
                    <Stack className='items-center! gap-1!'>
                        <Eye />
                        <Typography variant='caption' color='text.middle'>{data?.views} {t("messages.views")}</Typography>
                    </Stack>
                </Stack>
                <Button variant='contained' color='primary' fullWidth onClick={() => navigate(PATH.GORKHAPATRA.VIEW_GORKHAPATRA.ROOT(Number(data.id)))}>
                    {t("messages.view_details")}
                </Button>
            </div>
        </Box>
    )
}
