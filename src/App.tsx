import DashboardAnalytics from "./components/pages/Dashboard/DashboardAnalytics";
import DashboardGorkhapatraListing from "./components/pages/Dashboard/DashboardGorkhapatraListing";
import DashboardPurchasedCourseListing from "./components/pages/Dashboard/DashboardPurchasedCourseListing";

export default function App() {



  return (
    <div className="h-full overflow-auto pr-2">
      <DashboardAnalytics />
      <DashboardPurchasedCourseListing />
      <DashboardGorkhapatraListing />
    </div>
  )
}
