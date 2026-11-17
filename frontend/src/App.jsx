import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ChatBot from "./Components/Chatbot";
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";
import Home from "./Pages/Home";
import Events from "./Pages/Events";
import Vendors from "./Pages/Vendors";
import Venues from "./Pages/Venues";
import Guestlist from "./Pages/Guestlist";
import Vendorsid from "./Pages/Vendorsid";
import Venuesid from "./Pages/Venuesid";
import Eventsid from "./Pages/Eventsid";
import Solver from "./Pages/Solver";
import Profile from "./Pages/Profile";
import CreateInvitation from "./Pages/CreateInvitation";
import InvitePage from "./Pages/InvitePage";
import Packages from "./Pages/Packages";
import Budgetplanner from "./Pages/Budgetplanner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FeatureStudio from "./Components/Featurestudio";
import Auth from "./Pages/Auth";import MyBookings from "./Pages/MyBookings";
import Login from "./Pages/Login";
import Feedback from "./Pages/Feedback";import Bookingbtn from "./Components/Bookingbtn";
import Signup from "./Pages/Signup";
import Unauthorized from "./Pages/Unauthorized";
import VendorDashboard from "./Pages/VendorDashboard";
import AdminDashboard from "./Pages/AdminDashboard";
import ComingSoon from "./Pages/ComingSoon";
import Wishlist from "./Pages/Wishlist";
import { AuthProvider } from "./context/AuthContext";
import { ROLES } from "./utils/roles";

// Kaun-kaun se roles kis group me aate hain
const ANY_LOGGED_IN = [ROLES.USER, ROLES.VENDOR, ROLES.ADMIN];
const CUSTOMER_AREA = [ROLES.USER, ROLES.ADMIN];
const VENDOR_AREA = [ROLES.VENDOR, ROLES.ADMIN];

export default function App() {
  return (
    <>
      {/* AuthProvider poore app ko wrap karta hai, taaki kisi bhi page/navbar me useAuth() chale */}
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* ---------- Auth pages (sabke liye khule, sirf EK baar likhna hai) ---------- */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/Auth" element={<Auth />} />

            {/* Invite link guests ko bhejte ho, isliye ye sabke liye PUBLIC hai */}
            <Route path="/invite" element={<InvitePage />} />

            {/* ---------- Browse pages: guest + customer + admin (VENDOR BLOCKED) ----------
                Vendor in pages ko kholega to seedha /vendor-dashboard par chala jayega */}
            <Route element={<PublicRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/Navbar" element={<Navbar />} />
              <Route path="/Footer" element={<Footer />} />
              <Route path="/ChatBot" element={<ChatBot />} />
              <Route path="/events" element={<Events />} />
              <Route path="/Eventsid/:id" element={<Eventsid />} />
              <Route path="/Vendors" element={<Vendors />} />
              <Route path="/Vendorsid/:id" element={<Vendorsid />} />
              <Route path="/Venues" element={<Venues />} />
              <Route path="/Venuesid/:id" element={<Venuesid />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/Guestlist" element={<Guestlist />} />
              <Route path="/Feedback" element={<Feedback />} />
            </Route>

            {/* ---------- Profile: koi bhi logged-in user ---------- */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute roles={ANY_LOGGED_IN}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* ---------- AI features: customer + vendor + admin (login chahiye) ---------- */}
            <Route
              path="/solver"
              element={
                <ProtectedRoute roles={ANY_LOGGED_IN}>
                  <Solver />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Featurestudio"
              element={
                <ProtectedRoute roles={ANY_LOGGED_IN}>
                  <FeatureStudio />
                </ProtectedRoute>
              }
            />

            {/* ---------- Bookings: customer + vendor + admin ---------- */}
            <Route
              path="/MyBookings"
              element={
                <ProtectedRoute roles={ANY_LOGGED_IN}>
<MyBookings/>                </ProtectedRoute>
              }
            />

            {/* ---------- Sirf CUSTOMER (+ admin) ---------- */}
            <Route
              path="/Budgetplanner"
              element={
                <ProtectedRoute roles={CUSTOMER_AREA}>
                  <Budgetplanner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-invitation"
              element={
                <ProtectedRoute roles={CUSTOMER_AREA}>
                  <CreateInvitation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/guestlist/:eventId"
              element={
                <ProtectedRoute roles={CUSTOMER_AREA}>
                  <Guestlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-events"
              element={
                <ProtectedRoute roles={CUSTOMER_AREA}>
                  <ComingSoon title="My Events" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute roles={CUSTOMER_AREA}>
                  <Wishlist />
                </ProtectedRoute>
              }
            />

            {/* ---------- VENDOR + ADMIN ---------- */}
            <Route
              path="/vendor-dashboard"
              element={
                <ProtectedRoute roles={VENDOR_AREA}>
                  <VendorDashboard />
                </ProtectedRoute>
              }
            />

            {/* ---------- sirf ADMIN ---------- */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={[ROLES.ADMIN]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}
