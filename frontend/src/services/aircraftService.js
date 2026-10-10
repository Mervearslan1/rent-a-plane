const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

// Geçici örnek veriler.
// Mock API erişilemezse arayüzü geliştirebilmek için kullanılır.
const mockAircraft = [
    {
        id: 1,
        name: "Cessna 172 Skyhawk",
        manufacturer: "Cessna",
        model: "172 Skyhawk",
        passengerCapacity: 3,
        available: true,
        hourlyRate: 4500,
        description:
            "Eğitim uçuşları ve kısa mesafeli seyahatler için ideal, tek motorlu uçak.",
    },
    {
        id: 2,
        name: "Cirrus SR22",
        manufacturer: "Cirrus",
        model: "SR22",
        passengerCapacity: 3,
        available: true,
        hourlyRate: 8500,
        description:
            "Modern kokpiti ve konforlu kabiniyle özel seyahatler için tasarlanmıştır.",
    },
    {
        id: 3,
        name: "Diamond DA42",
        manufacturer: "Diamond",
        model: "DA42",
        passengerCapacity: 3,
        available: false,
        hourlyRate: 7200,
        description:
            "Çift motorlu yapısıyla eğitim ve özel havacılık operasyonlarında kullanılan uçak.",
    },
    {
        id: 4,
        name: "Beechcraft Bonanza",
        manufacturer: "Beechcraft",
        model: "Bonanza",
        passengerCapacity: 5,
        available: true,
        hourlyRate: 11000,
        description:
            "Daha uzun mesafeli özel uçuşlar için konforlu bir genel havacılık uçağı.",
    },
];

async function request(path, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`API isteği başarısız: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.warn(
            "Mock API'ye ulaşılamadı. Geçici örnek veriler kullanılacak.",
            error.message
        );

        return null;
    }
}

function unwrapResponse(response) {
    // Hem doğrudan JSON hem de { success, message, data } yanıtını destekler.
    return response?.data ?? response;
}

export async function getAircraft() {
    const response = await request("/api/aircraft");
    const data = unwrapResponse(response);

    return Array.isArray(data) ? data : mockAircraft;
}

export async function getAircraftById(id) {
    const response = await request(`/api/aircraft/${id}`);
    const data = unwrapResponse(response);

    if (data && !Array.isArray(data)) {
        return data;
    }

    return mockAircraft.find((aircraft) => String(aircraft.id) === String(id)) ?? null;
}

export async function createBooking(bookingData) {
    const response = await request("/api/bookings", {
        method: "POST",
        body: JSON.stringify(bookingData),
    });

    if (response) {
        return unwrapResponse(response);
    }

    // Yalnızca arayüz demosu. Gerçek rezervasyon kaydedilmez.
    return {
        id: `DEMO-${Date.now()}`,
        ...bookingData,
        status: "PENDING",
        demo: true,
    };
}