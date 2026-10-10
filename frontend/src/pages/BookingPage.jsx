import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import {
    createBooking,
    getAircraftById,
} from "../services/aircraftService";

export default function BookingPage() {
    const { id } = useParams();

    const [aircraft, setAircraft] = useState(null);
    const [loading, setLoading] = useState(true);
    const [customerName, setCustomerName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        let active = true;

        getAircraftById(id).then((data) => {
            if (active) {
                setAircraft(data);
                setLoading(false);
            }
        });

        return () => {
            active = false;
        };
    }, [id]);

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage("");
        setSuccess(false);

        if (!aircraft) {
            setMessage("Uçak bilgisi bulunamadı.");
            return;
        }

        if (endDate < startDate) {
            setMessage("Bitiş tarihi başlangıç tarihinden önce olamaz.");
            return;
        }

        setSubmitting(true);

        try {
            const result = await createBooking({
                aircraftId: Number(aircraft.id),
                customerName: customerName.trim(),
                startDate,
                endDate,
            });

            setSuccess(true);
            setMessage(
                result.demo
                    ? `Demo rezervasyon isteği oluşturuldu (${result.id}). Henüz kaydedilmedi.`
                    : "Rezervasyon isteğin başarıyla gönderildi."
            );
        } catch {
            setMessage("Rezervasyon isteği gönderilemedi. Lütfen tekrar deneyin.");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return <Loading />;
    }

    if (!aircraft) {
        return (
            <section className="page-container">
                <h1>Uçak bulunamadı.</h1>
                <Link to="/">Ana sayfaya dön</Link>
            </section>
        );
    }

    return (
        <section className="booking-section">
            <Link to={`/aircraft/${aircraft.id}`} className="back-link">
                ← Uçak detaylarına dön
            </Link>

            <div className="booking-panel">
                <p className="eyebrow">UÇUŞUNU PLANLA</p>
                <h1>Rezervasyon isteği</h1>
                <p className="muted">
                    {aircraft.name || aircraft.model} için bilgilerini gir.
                </p>

                {!aircraft.available && (
                    <p className="message error-message">
                        Bu uçak şu anda müsait görünmüyor.
                    </p>
                )}

                <form className="booking-form" onSubmit={handleSubmit}>
                    <label>
                        Ad soyad
                        <input
                            type="text"
                            value={customerName}
                            onChange={(event) => setCustomerName(event.target.value)}
                            minLength={2}
                            maxLength={100}
                            autoComplete="name"
                            placeholder="Adını ve soyadını gir"
                            required
                        />
                    </label>

                    <label>
                        Başlangıç tarihi
                        <input
                            type="date"
                            value={startDate}
                            onChange={(event) => setStartDate(event.target.value)}
                            min={new Date().toLocaleDateString("en-CA")}
                            required
                        />
                    </label>

                    <label>
                        Bitiş tarihi
                        <input
                            type="date"
                            value={endDate}
                            onChange={(event) => setEndDate(event.target.value)}
                            min={startDate || new Date().toLocaleDateString("en-CA")}
                            required
                        />
                    </label>

                    <button
                        className="button"
                        type="submit"
                        disabled={submitting || !aircraft.available}
                    >
                        {submitting ? "Gönderiliyor..." : "Rezervasyon isteği gönder"}
                    </button>
                </form>

                {message && (
                    <p
                        className={`message ${success ? "success-message" : "error-message"}`}
                        role="status"
                    >
                        {message}
                    </p>
                )}

                <p className="form-note">
                    Demo modu: Bu form henüz gerçek bir rezervasyon veya ödeme oluşturmaz.
                </p>
            </div>
        </section>
    );
}