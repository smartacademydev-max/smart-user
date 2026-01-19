import { Outlet } from 'react-router-dom';
import ResponsiveDrawer from '../components/pages/layout/sidebar';

export default function RootLayout() {
    return (
        <div className='udaan__root'>
            <ResponsiveDrawer >
                <Outlet />
            </ResponsiveDrawer>
        </div>
    )
}
