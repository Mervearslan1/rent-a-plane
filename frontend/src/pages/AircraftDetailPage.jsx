import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { getAircraftById } from "../services/aircraftService";

export default function AircraftDetailPage() {
    const { id } = useParams();
    const [aircraft, setAircraft] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        async function loadAircraft() {
            const data = await getAircraftById(id);

            if (active) {
                setAircraft(data);
                setLoading(false);
            }
        }

        loadAircraft();

        return () => {
            active = false;
        };
    }, [id]);

    if (loading) {
        return <Loading />;
    }

    if (!aircraft) {
        return (
            <section className="page-container">
                <h1>Uçak bulunamadı.</h1>
                <Link className="button" to="/">
                    Uçak listesine dön
                </Link>
            </section>
        );
    }

    return (
        <section className="page-container">
            <Link to="/" className="back-link">
                ← Uçak listesine dön
            </Link>

            <div className="detail-layout">
                <div className="detail-visual">
                    <span aria-hidden="true">✈</span>
                </div>

                <div className="detail-content">
                    <p className="eyebrow">{aircraft.manufacturer}</p>
                    <h1>{aircraft.name || aircraft.model}</h1>
                    <p className="muted">{aircraft.description || "Uçak hakkında ek açıklama bulunmuyor."}</p>

                    <div className="detail-stats">
                        <div>
                            <span>Model</span>
                            <strong>{aircraft.model || "Belirtilmemiş"}</strong>
                        </div>
                        <div>
                            <span>Yolcu kapasitesi</span>
                            <strong>{aircraft.passengerCapacity ?? "Belirtilmemiş"}</strong>
                        </div>
                        <div>
                            <span>Durum</span>
                            <strong>{aircraft.available ? "Müsait" : "Müsait değil"}</strong>
                        </div>
                    </div>

                    <p className="detail-price">
                        {Number(aircraft.hourlyRate).toLocaleString("tr-TR")} ₺
                        <span> / saat</span>
                    </p>

                    {aircraft.available ? (
                        <Link className="button" to={`/book/${aircraft.id}`}>
                            Rezervasyon oluştur
                        </Link>
                    ) : (
                        <p className="message">Bu uçak şu anda rezervasyona açık değil.</p>
                    )}
                </div>
            </div>
        </section>
    );
}