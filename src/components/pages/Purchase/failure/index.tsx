import { Button } from '@mui/material';
import { CloseCircle } from 'iconsax-reactjs';
import { useNavigate, useParams } from 'react-router-dom';

export default function PurchaseFailure() {
    const navigate = useNavigate();
    const { id, type } = useParams();

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
                    onClick={() => navigate(`/${type}/${id}/purchase`)}
                >
                    Try Again
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => navigate(`/${type}/${id}`)}
                >
                    Go Back
                </Button>
            </div>
        </div>
    );
}
