package com.example.rentaplane.module.aircraft;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "aircraft")
public class Aircraft {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String manufacturer;

    @Column(nullable = false)
    private String model;

    @Column(name = "passenger_capacity", nullable = false)
    private Integer passengerCapacity;

    @Column(nullable = false)
    private Boolean available = true;

    @Column(name = "hourly_rate", nullable = false, precision = 12, scale = 2)
    private BigDecimal hourlyRate;

    protected Aircraft() {
    }

    public Aircraft(
            Long id,
            String name,
            String manufacturer,
            String model,
            Integer passengerCapacity,
            Boolean available,
            BigDecimal hourlyRate
    ) {
        this.id = id;
        this.name = name;
        this.manufacturer = manufacturer;
        this.model = model;
        this.passengerCapacity = passengerCapacity;
        this.available = available;
        this.hourlyRate = hourlyRate;
    }
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public String getModel() {
        return model;
    }

    public Integer getPassengerCapacity() {
        return passengerCapacity;
    }

    public Boolean getAvailable() {
        return available;
    }

    public BigDecimal getHourlyRate() {
        return hourlyRate;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public void setPassengerCapacity(Integer passengerCapacity) {
        this.passengerCapacity = passengerCapacity;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public void setHourlyRate(BigDecimal hourlyRate) {
        this.hourlyRate = hourlyRate;
    }
}