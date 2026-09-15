import { Navigate, Outlet } from 'react-router-dom';
import TestRunner from '../components/pages/TestManagement/singleTest';
import { useAppSelector } from '../store/hook';
import { PATH } from './PATH';

export default function Private() {
    const user = useAppSelector((state) => state.auth.user);

    if (!user) {
        return <Navigate to={PATH.AUTH.LOGIN.ROOT} replace />;
    }

    /**
     * The test runner is mounted here rather than on a route of its own: it is a
     * mode the app enters, not a page it goes to. Sitting above every layout, it
     * covers the sidebar and app header without any of them having to know; and
     * being inside the router, it can still send a finished attempt on to its
     * review page.
     */
    return (
        <>
            <Outlet />
            <TestRunner />
        </>
    );
}
