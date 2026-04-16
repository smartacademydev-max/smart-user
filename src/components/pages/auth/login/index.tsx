import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";
import AuthHeader from "../../../molecules/AuthHeader";
import LoginForm from "../../../organism/LoginForm";

export default function Login() {
    return (
        <>
            <AuthHeader
                title="Welcome to Udaan 👋🏻 "
                description="You're one step closer to exponential growth"
            />
            <LoginForm />
            <div className="mt-14 text-center">
                <Typography variant="subtitle2" color="text.light">Dont Have an Account ? <Link to={PATH.AUTH.REGISTER.ROOT} className="inline-block"><Typography color="primary" variant="subtitle2">Register</Typography></Link></Typography>
            </div>
        </>
    )
}
