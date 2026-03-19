import { Box, Typography } from '@mui/material';
export default function Loading() {
    return (
        <Box className="min-h-screen w-full flex flex-col items-center justify-between">
            <Box className="content h-full flex flex-col justify-center items-center text-center" sx={{
                minHeight: "calc(100vh - 40px)"
            }}>
                <img src="/udaan-welcome.png" alt="" className='h-auto max-w-[210px] mx-auto' />
                <div className="mt-6">
                    <Typography variant='h4' color='primary'>Welcome to Smart</Typography>
                    <Typography variant='h4' color='primary'>उडानमा हजुरलाई स्वागत छ|</Typography>
                </div>
            </Box>
            <Typography variant='body2' color='text.middle' className='pb-4'>V 2.0</Typography>
        </Box>
    );
}