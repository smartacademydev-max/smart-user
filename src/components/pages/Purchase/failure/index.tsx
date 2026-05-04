import { Button } from '@mui/material';
import { CloseCircle } from 'iconsax-reactjs';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRestorePointsMutation } from '../../../../services/referralApi';
import { POINTS_SESSION_KEY } from '../PurchaseLayout';

export default function PurchaseFailure() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [restorePoints] = useRestorePointsMutation();

    useEffect(() => {
        if (sessionStorage.getItem(POINTS_SESSION_KEY)) {
            restorePoints().finally(() => {
                sessionStorage.removeItem(POINTS_SESSION_KEY);
            });
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <CloseCircle size={80} variant="Bold" className="text-red-500" />
            <h1 className="text-3xl font-bold">Payment Failed</h1>
            <p className="text-gray-600">
                Your payment could not be processed. Please try again.
            </p>
            <div className="flex gap-4 mt-4">
                <Button
                    variant="contained"
                    onClick={() => navigate(`/courses/${id}/purchase`)}
                >
                    Try Again
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => navigate(`/courses/${id}`)}
                >
                    Back to Course
                </Button>
            </div>
        </div>
    );
}
