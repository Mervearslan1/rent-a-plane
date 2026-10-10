import { useEffect, useState } from "react";
import AircraftCard from "../components/AircraftCard";
import Loading from "../components/Loading";
import { getAircraft } from "../services/aircraftService";

export default function HomePage() {
    const [aircraft, setAircraft] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [availableOnly, setAvailableOnly] = useState(false);

    useEffect(() => {
        let active = true;

        async function loadAircraft() {
            try {
                const data = await getAircraft();

                if (active) {
                    setAircraft(data);
                }
            } catch {
                if (active) {
                    setError("Uçak listesi yüklenemedi. Lütfen tekrar deneyin.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadAircraft();

        return () => {
            active = false;
        };
    }, []);

    const filteredAircraft = aircraft.filter((item) => {
        const searchText = search.toLocaleLowerCase("tr-TR");

        const matchesSearch = [
            item.name,
            item.manufacturer,
            item.model,
        ].some((value) =>
            String(value ?? "").toLocaleLowerCase("tr-TR").includes(searchText)
        );

        return matchesSearch && (!availableOnly || item.available);
    });

    return (
        <div>
            <section className="hero">
                <div className="hero-content">
                    <p className="eyebrow hero-eyebrow">ÖZGÜRLÜK GÖKYÜZÜNDE BAŞLAR</p>
                    <h1>Bir sonraki uçuşun seni bekliyor.</h1>
                    <p>
                        Uçakları keşfet, özelliklerini incele ve bir sonraki uçuş planını
                        oluştur.
                    </p>
                    <a className="button hero-button" href="#aircraft">
                        Uçakları keşfet
                    </a>
                </div>

                <div className="hero-decoration" aria-hidden="true">
                    <span>✈</span>
                </div>
            </section>

            <section className="aircraft-section" id="aircraft">
                <div className="section-heading">
                    <div>
                        <p className="eyebrow">FİLOMUZ</p>
                        <h2>Uçakları keşfet</h2>
                        <p className="muted">
                            İhtiyacına uygun uçağı bul ve özelliklerini incele.
                        </p>
                    </div>

                    <span className="result-count">
            {filteredAircraft.length} uçak
          </span>
                </div>

                <div className="filters">
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Uçak veya üretici ara..."
                        aria-label="Uçak ara"
                    />

                    <label className="filter-checkbox">
                        <input
                            type="checkbox"
                            checked={availableOnly}
                            onChange={(event) => setAvailableOnly(event.target.checked)}
                        />
                        Yalnızca müsait uçaklar
                    </label>
                </div>

                {loading ? (
                    <Loading />
                ) : error ? (
                    <p className="message error-message">{error}</p>
                ) : filteredAircraft.length === 0 ? (
                    <p className="message">Aramana uygun uçak bulunamadı.</p>
                ) : (
                    <div className="aircraft-grid">
                        {filteredAircraft.map((item) => (
                            <AircraftCard key={item.id} aircraft={item} />
                        ))}
                    </div>
                )}
            </section>

            <section className="about-section" id="about">
                <p className="eyebrow">RENT A PLANE</p>
                <h2>Uçuş planını kolaylaştır.</h2>
                <p>
                    Uçakları tek bir yerde incele, kapasite ve saatlik ücretlerini
                    karşılaştır, sana uygun uçuşu planla.
                </p>
            </section>
        </div>
    );
}