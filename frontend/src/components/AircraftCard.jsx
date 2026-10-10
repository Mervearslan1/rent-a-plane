import { Link } from "react-router-dom";

export default function AircraftCard({ aircraft }) {
    const {
        id,
        name,
        manufacturer,
        model,
        passengerCapacity,
        available,
        hourlyRate,
    } = aircraft;

    return (
        <article className="aircraft-card">
            <div className="aircraft-visual">
                <span className="aircraft-symbol">✈</span>
                <span className={`availability ${available ? "available" : "unavailable"}`}>
          {available ? "Müsait" : "Müsait değil"}
        </span>
            </div>

            <div className="aircraft-card-content">
                <p className="eyebrow">{manufacturer}</p>
                <h3>{name || model}</h3>
                <p className="muted">{model}</p>

                <div className="aircraft-meta">
                    <span>Yolcu kapasitesi: {passengerCapacity ?? "Belirtilmemiş"}</span>
                </div>

                <div className="card-bottom">
                    <div>
                        <strong className="price">
                            {Number(hourlyRate).toLocaleString("tr-TR")} ₺
                        </strong>
                        <span className="muted"> / saat</span>
                    </div>

                    <Link className="button button-small" to={`/aircraft/${id}`}>
                        Detayları gör
                    </Link>
                </div>
            </div>
        </article>
    );
}