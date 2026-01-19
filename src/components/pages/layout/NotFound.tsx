import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/PATH";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Box sx={{
      bgcolor: (theme) => theme.palette.background.sidebar,
      color: (theme) => theme.palette.primary.contrastText
    }} className="min-h-screen w-full flex justify-content-center items-center">
      <div className="container mx-auto">
        <div className="content text-center">
          <h1
            className="text-9xl lg:text-[200px] font-extrabold leading-none"
            style={{
              background: "linear-gradient(90deg, #1D82F5, #F59E0B)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404
          </h1>
          <h2 className="text-3xl mb-4">Page Not Found</h2>
          <Typography variant="subtitle1" className="mb-4!">The page you are looking is either deleted or moved to new route.</Typography>
          <Button variant="contained" color="primary" onClick={() => navigate(PATH.DASHBOARD.ROOT)} startIcon={<ArrowBack />}>Go To Dashboard</Button>
        </div>
      </div>
    </Box>
  )
}
