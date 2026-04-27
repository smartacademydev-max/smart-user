import { Box, Typography } from '@mui/material';
import { useThemeSettings } from './hooks/useThemeSettings';
import { useAppSelector } from './store/hook';

export default function Loading() {
    const { mode } = useAppSelector((state) => state.smart_theme);
    const { brandName, logoUrl, logoDarkUrl } = useThemeSettings();
    const logo = mode === "light" ? logoDarkUrl : logoUrl;

    return (
        <Box className="min-h-screen w-full flex flex-col items-center justify-between">
            <Box className="content h-full flex flex-col justify-center items-center text-center" sx={{
                minHeight: "calc(100vh - 40px)"
            }}>
                <img src={logo} alt="" className='h-auto max-w-[210px] mx-auto' />
                {brandName && (
                    <div className="mt-6">
                        <Typography variant='h4' color='primary'>Welcome to {brandName}</Typography>
                        <Typography variant='h4' color='primary'>हजुरलाई स्वागत छ|</Typography>
                    </div>
                )}
            </Box>
            <Typography variant='body2' color='text.middle' className='pb-4'>V 1.0</Typography>
        </Box>
    );
}