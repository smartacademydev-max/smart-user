import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

interface InfoCardProps {
    title: string;
    description: string;
    icon: React.ReactElement;
    cta: {
        url: string;
        label: string;
    }
}
export default function InfoCard({ title, description, icon, cta }: InfoCardProps) {
    return (
        <Box className="info-card flex flex-col justify-between h-full p-4 lg:p-8 rounded-lg  " sx={{
            bgcolor: (theme) => theme.palette.primary.contrastText,
            border: (theme) => `1px solid ${theme.palette.separator.dark}`
        }}>
            <div className="top">
                {icon &&
                    <Box className="icon mb-4 lg:mb-5 w-15 min-h-15 aspect-square rounded-full flex items-center justify-center" sx={{
                        bgcolor: (theme) => theme.palette.separator.dark
                    }}>
                        {icon}
                    </Box>
                }
                <div className="content__wrapper mb-5 lg:mb-6">
                    {title && <Typography variant='h5' fontWeight={600} className='mb-1.5!'>{title}</Typography>}
                    {description && <Typography variant='subtitle2' color="text.secondary">{description}</Typography>}
                </div>
            </div>

            {cta && <Box className="cta">
                <Button variant='contained' color='primary' component={Link}
                    to={cta.url}>{cta.label}</Button>
            </Box>}
        </Box>
    )
}
