package com.example.rentaplane;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.http.MediaType;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("mock")
class BookingControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldCreateBookingSuccessfully() throws Exception {
        String requestBody = """
                {
                    "aircraftId": 1,
                    "customerName": "Merve Arslan",
                    "startDate": "2026-11-01",
                    "endDate": "2026-11-05"
                }
                """;

        mockMvc.perform(post("/api/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.customerName").value("Merve Arslan"))
                .andExpect(jsonPath("$.startDate").value("2026-11-01"))
                .andExpect(jsonPath("$.endDate").value("2026-11-05"))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void shouldReturnNotFoundWhenAircraftDoesNotExist() throws Exception {
        String requestBody = """
                {
                    "aircraftId": 9999,
                    "customerName": "Test Customer",
                    "startDate": "2026-11-01",
                    "endDate": "2026-11-05"
                }
                """;

        mockMvc.perform(post("/api/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value(
                        "Aircraft not found with id: 9999"));
    }

    @Test
    void shouldRejectBookingForUnavailableAircraft() throws Exception {
        String requestBody = """
                {
                    "aircraftId": 3,
                    "customerName": "Test Customer",
                    "startDate": "2026-11-01",
                    "endDate": "2026-11-05"
                }
                """;

        mockMvc.perform(post("/api/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message")
                        .value("Aircraft is not available"));
    }

    @Test
    void shouldRejectBookingWhenCustomerNameIsBlank() throws Exception {
        String requestBody = """
                {
                    "aircraftId": 1,
                    "customerName": "   ",
                    "startDate": "2026-11-01",
                    "endDate": "2026-11-05"
                }
                """;

        mockMvc.perform(post("/api/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message")
                        .value("Customer name must not be empty"));
    }

    @Test
    void shouldRejectBookingWhenEndDateIsNotAfterStartDate()
            throws Exception {
        String requestBody = """
                {
                    "aircraftId": 1,
                    "customerName": "Test Customer",
                    "startDate": "2026-11-05",
                    "endDate": "2026-11-05"
                }
                """;

        mockMvc.perform(post("/api/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message")
                        .value("End date must be after start date"));
    }
}
