package com.example.rentaplane.module.booking;



import com.example.rentaplane.module.aircraft.Aircraft;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "booking")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "aircraft_id", nullable = false)
    private Aircraft aircraft;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected Booking() {
    }

    public Booking(
            Aircraft aircraft,
            String customerName,
            LocalDate startDate,
            LocalDate endDate
    ) {
        this.aircraft = aircraft;
        this.customerName = customerName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = BookingStatus.PENDING;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Aircraft getAircraft() {
        return aircraft;
    }

    public String getCustomerName() {
        return customerName;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }
}