import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hook';
import { PATH } from './PATH';

export default function Private() {
    const user = useAppSelector((state) => state.auth.user);

    if (!user) {
        return <Navigate to={PATH.AUTH.LOGIN.ROOT} replace />;
    }

    return <Outlet />;
}
