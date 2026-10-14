import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ChatBot from "./Components/Chatbot";
import Home from "./Pages/Home";
import Events from "./Events";
import { links } from "./data";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/Navbar" element={<Navbar />} />{" "}
          <Route path="/" element={<Home />} />{" "}
          {/* <Route path="/Navbar" element={<Home />} />{" "} */}
          <Route path="/Footer" element={<Footer />} />{" "}
          <Route path="/ChatBot" element={<ChatBot />} />{" "}
          <Route path="/Events" element={<Events />} />{" "}
        </Routes>
      </BrowserRouter>

      {/* <Navbar/>
  <Home/><ChatBot/><Events/><Footer/> */}
    </>
  );
}
