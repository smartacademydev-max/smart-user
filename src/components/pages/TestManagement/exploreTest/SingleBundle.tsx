import { Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";

export default function SingleBundle() {
    const { id } = useParams();
    const navigate = useNavigate();
    return (
        <div className="mt-4 single__bundle__root">
            <Button variant="contained" color="primary" onClick={() => navigate(PATH.COURSE_MANAGEMENT.COURSES.PURCHASE.ROOT(Number(id), "bundle"))}>Purchase Bundle</Button>
        </div>
    )
}
