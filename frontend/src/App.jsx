import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ChatBot from "./Components/Chatbot";
import Home from "./Pages/Home";
import Events from "./Pages/Events";
import { links } from "./data";
import Vendors from "./Pages/Vendors";
import Venues from "./Pages/Venues";
import Guestlist from "./Pages/Guestlist";
import Vendorsid from "./Pages/Vendorsid";
import Venuesid from "./Pages/Venuesid";

import Eventsid from "./Pages/Eventsid";
import Solver from "./Pages/Solver";

import CreateInvitation from "./Pages/CreateInvitation";
import InvitePage from "./Pages/InvitePage";
import Packages from "./Pages/Packages";
import Budgetplanner from "./Pages/Budgetplanner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FeatureStudio from "./Components/Featurestudio";import Auth from "./Pages/Auth";
export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/solver" element={<Solver />} />
          <Route path="/Navbar" element={<Navbar />} />{" "}
          <Route path="/" element={<Home />} />{" "}
                    <Route path="/Auth" element={<Auth />} />{" "}

          <Route path="/Vendorsid/:id" element={<Vendorsid />} />{" "}
          <Route path="/Eventsid/:id" element={<Eventsid />} />{" "}
          <Route path="/Venuesid/:id" element={<Venuesid />} />{" "}
          {/* <Route path="/Doctorid/:id" element={<Doctorid />} /> */}
          <Route path="/Featurestudio" element={<FeatureStudio />} />{" "}
          <Route path="/Budgetplanner" element={<Budgetplanner />} />{" "}
          <Route path="/guestlist/:eventId" element={<Guestlist />} />
          <Route path="/Footer" element={<Footer />} />{" "}
          <Route path="/create-invitation" element={<CreateInvitation />} />
          <Route path="/invite" element={<InvitePage />} />
          <Route path="/Vendors" element={<Vendors />} />{" "}
          <Route path="/Venues" element={<Venues />} />{" "}
          <Route path="/packages" element={<Packages />} />
          <Route path="/ChatBot" element={<ChatBot />} />{" "}
          <Route path="/events" element={<Events />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
