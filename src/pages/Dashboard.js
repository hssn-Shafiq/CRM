
import ConversionRateCard from "../components/DashboardCards/ConversionRate";
import StageDistributionCard from "../components/DashboardCards/DistributionStatus";
import FacebookAdsReport from "../components/DashboardCards/FbAdsreport";
import SalesFunnelDashboard from "../components/DashboardCards/funneldata";
import GoogleAdsReport from "../components/DashboardCards/Googleads";
import GoogleAnalyticsChart from "../components/DashboardCards/Googleanalyticschart";
import GoogleAnalyticsReport from "../components/DashboardCards/GoogleAnalyticsReport";
import GoogleBusinessProfileDashboard from "../components/DashboardCards/googlebusinesscard";
import LeadSourceReport from "../components/DashboardCards/LaedSourceReport";
import ManualActionsComponent from "../components/DashboardCards/ManualActioncard";
import OpportunityValueDashboard from "../components/DashboardCards/opportunity-value";
import OpportunityStatusCard from "../components/DashboardCards/OpportunityStatus";
import TaskList from "../components/DashboardCards/taskcard";
import DashboardNavbar from "../components/DashboardNavbar";


const Dashboard = () => {
  return (
    <>
      <div
        className="bg-main font-sans hl-wrapper-container bg-gray-50 h-auto min-h-full location-dashboard-wrapper flex flex-col relative snipcss0-0-0-1 snipcss-EB6C6"
        id="dashboard-wrapper"
        user="[object Object]"
      >
        <div className="Parent-Dashboard-main-content">
            {/* Dashboard Navbar */}
            <div className="parent-Dashboard-Navbar mt-4 ">
        <DashboardNavbar />
        </div>
          <div className="container mt-4 px-4 px-lg-4   ">
          <div className="row g-4 g-lg-2">
        <div className="col-lg-5 col-md-6 col-sm-12 h-100 ">
          <OpportunityStatusCard  />
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 h-100">
        <OpportunityValueDashboard />
        </div>
        <div className="col-lg-3 col-md-12 col-sm-12 h-100 overflow-hidden">
        <ConversionRateCard />
        </div>
       </div>
       </div>
       {/* ====second container */}
       <div className="container mt-4 px-4">
       <div className="row g-4 g-lg-2
       ">

        <div className="col-lg-6 col-md-12 col-sm-12 h-100">
          <SalesFunnelDashboard  />
        </div>
        <div className="col-lg-6 col-md-12 col-sm-12 h-100">
        <StageDistributionCard />
        </div>
        
       </div>
       </div>
       {/* ===end second container */}
         {/* ====third container */}
         <div className="container mt-4 px-4">
         <div className="row g-4 g-lg-2">

        <div className="col-lg-6 col-md-6 col-sm-12 h-100">
          <TaskList  />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 h-100">
        <ManualActionsComponent />
        </div>
        
       </div>
       </div>
       {/* ===end third container */}
        {/* ====Fourth container */}
        <div className="container mt-4 px-4">
        <div className="row g-4 g-lg-2">

      
        <div className="col-lg-12 col-md-12 col-sm-12 h-100">
        <LeadSourceReport />
        </div>
        
       </div>
       </div>
       {/* ===end Fourth container */}
        {/* ====Fifth container */}
        <div className="container mt-4 px-4">
        <div className="row g-4 g-lg-2
        ">

      
        <div className="col-lg-12 col-md-12 col-sm-12 h-100">
        <GoogleAnalyticsReport />
        </div>
        
       </div>
       </div>
       {/* ===end Fifth container */}
            {/* ====six container */}
            <div className="container mt-4 px-4">
            <div className="row g-4 g-lg-2">

      
        <div className="col-lg-12 col-md-12 col-sm-12 h-100">
        <GoogleAnalyticsChart />
        </div>
        
       </div>
       </div>
       {/* ===end six container */}
         {/* ====six container */}
         <div className="container mt-4 px-4">
         <div className="row g-4 g-lg-2
         ">

      
        <div className="col-lg-12 col-md-12 col-sm-12 h-100">
        <GoogleBusinessProfileDashboard />
        </div>
        
       </div>
       </div>
       {/* ===end six container */}
         {/* ====six container */}
         <div className="container mt-4 px-4 mb-4">
         <div className="row g-4 g-lg-2">

      
        <div className="col-lg-6 col-md-6 col-sm-12 h-100">
        <FacebookAdsReport />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 h-100">
        <GoogleAdsReport />
        </div>
        
       </div>
       </div>
       {/* ===end six container */}
       </div>
      </div>
    </>
  );
};

export default Dashboard;
