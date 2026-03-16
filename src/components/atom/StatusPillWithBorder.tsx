import { Box, Typography } from '@mui/material'
import { Lock, PlayCircle, TickCircle } from 'iconsax-reactjs'
import type { StatusVariant } from '../../utils/statusMap'

export default function StatusPillWithBorder({ status, variant, showIcon = false }: { variant: StatusVariant, status: string, showIcon?: boolean }) {
    return (
        <Box className="py-1 px-2! rounded-md max-w-fit flex items-center "
            sx={{
                color: (theme) => theme.palette[variant].main,
                background: (theme) => theme.palette[variant].light,
                border: (theme) => `1px solid ${showIcon ? theme.palette.gray.gray2 : theme.palette[variant].main}`,
            }}
        >
            {showIcon && (
                variant === "error" ? (
                    <Lock variant="Bold" />
                ) : variant === "warning" ? (
                    <PlayCircle variant="Bold" />
                ) : variant === "success" ? (
                    <TickCircle variant="Bold" />
                ) : null
            )}
            <Typography variant='caption' className='text-center w-full text-nowrap capitalize'>{status}</Typography>
        </Box>
    )
}
