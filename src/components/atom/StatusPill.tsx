import { Box, Typography } from '@mui/material'
import type { StatusVariant } from '../../utils/statusMap'

export default function StatusPill({ status, variant }: { variant: StatusVariant, status: string }) {
    return (
        <Box className="py-1 px-2! rounded-full max-w-fit"
            sx={{
                color: (theme) => theme.palette[variant].main,
                background: (theme) => theme.palette[variant].light,
            }}
        >
            <Typography variant='subtitle2' className='text-center w-full capitalize'>{status}</Typography>
        </Box>
    )
}
