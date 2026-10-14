import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ChatBot from "./Components/Chatbot";
import Home from "./Pages/Home";
import Events from "./Events";
export default function App() {
  return (
    <>
      <Navbar />
      <Home />
      <Footer />
      <ChatBot />
        <Events />
    </>
  );
}