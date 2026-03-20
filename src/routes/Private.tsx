import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hook';
import { PATH } from './PATH';

export default function Private() {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);
    React.useEffect(() => {
        if (!user) {
            navigate(PATH.AUTH.LOGIN.ROOT);
        }
    }, [user, navigate]);

    if (!user) return null;
    return (
        <Outlet />
    );
}
