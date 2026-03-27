import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Spam from "./pages/Spam";
import Harm from "./pages/Harm";
import SpamDetection from "./pages/SpamDetection";
import VerifyOtp from "./pages/VerifyOtp";



export default function App() {
return (
  <>
<Navbar />
<Routes>
<Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
<Route path="/verify-otp" element={<VerifyOtp />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/spam" element={<Spam />} />
<Route path="/harm" element={<Harm />} />
<Route path="/spam-detection" element={<SpamDetection />} />
</Routes>
</>
);
}