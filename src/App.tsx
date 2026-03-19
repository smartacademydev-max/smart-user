import { Box } from "@mui/material";
import DashboardAnalytics from "./components/pages/Dashboard/DashboardAnalytics";
import DashboardGorkhapatraListing from "./components/pages/Dashboard/DashboardGorkhapatraListing";
import DashboardNoticeListing from "./components/pages/Dashboard/DashboardNoticeListing";
import DashboardPurchasedCourseListing from "./components/pages/Dashboard/DashboardPurchasedCourseListing";
import LiveClassAndTestFilter from "./components/pages/Dashboard/LiveClassAndTestFilter";

export default function App() {
  return (
    <div className="h-full overflow-auto pr-2">
      <DashboardAnalytics />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1fr 298px" },
          gap: "18px",
          alignItems: "start",
          mt: "18px",
          pb: 4,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <DashboardPurchasedCourseListing />
          <DashboardGorkhapatraListing />
          <DashboardNoticeListing />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <LiveClassAndTestFilter />
        </Box>
      </Box>
    </div>
  );
}
