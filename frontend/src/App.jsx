import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AircraftDetailPage from "./pages/AircraftDetailPage";
import BookingPage from "./pages/BookingPage";

export default function App() {
    return (
        <>
            <Navbar />

            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/aircraft/:id" element={<AircraftDetailPage />} />
                    <Route path="/book/:id" element={<BookingPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>

            <footer className="footer">
                <p>Rent a Plane · Uçuşunu özgürce planla.</p>
            </footer>
        </>
    );
}