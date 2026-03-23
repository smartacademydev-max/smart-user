import { Box, Typography } from '@mui/material'
import type { StatusVariant } from '../../utils/statusMap'

export default function StatusPill({ status, variant }: { variant: StatusVariant, status: string }) {
    return (
        <Box className="rounded-md max-w-fit"
            sx={{
                color: (theme) => theme.palette[variant].main,
                background: (theme) => theme.palette[variant].light,
            }}
        >
            <Typography className=" py-1! px-2! rounded-md! text-xs! max-w-fit font-medium! text-center w-full uppercase text-nowrap">{status}</Typography>
        </Box>
    )
}
