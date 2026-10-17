import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ChatBot from "./Components/Chatbot";
import Home from "./Pages/Home";
import Events from "./Pages/Events";
import { links } from "./data";
import Vendors from "./Pages/Vendors";
import Venues from "./Pages/Venues";
import Guestlist from "./pages/Guestlist";
import Packages from "./Pages/Packages";
import Budgetplanner from "./Pages/Budgetplanner";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/Navbar" element={<Navbar />} />{" "}
          <Route path="/" element={<Home />} />{" "}
          <Route path="/Budgetplanner" element={<Budgetplanner />} />{" "}
          <Route path="/guestlist/:eventId" element={<Guestlist />} />
          <Route path="/Footer" element={<Footer />} />{" "}
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
