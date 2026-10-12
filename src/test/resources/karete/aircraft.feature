
Feature: Aircraft API

  Scenario: Tum ucaklari listele
    Given url 'http://localhost:8080'
    And path 'api/aircraft'
    When method get
    Then status 200
    And match response == '#[3]'
    And match response[0].name == 'Cessna 172 Skyhawk'

  Scenario: Musait ucaklari listele
    Given url 'http://localhost:8080'
    And path 'api/aircraft'
    And param available = true
    When method get
    Then status 200
    And match response == '#[2]'
    And match each response[*].available == true

  Scenario: ID ile ucak detayini getir
    Given url 'http://localhost:8080'
    And path 'api/aircraft', 1
    When method get
    Then status 200
    And match response.id == 1
    And match response.name == 'Cessna 172 Skyhawk'
    And match response.available == true

  Scenario: Olmayan ucak ID icin 404 donmeli
    Given url 'http://localhost:8080'
    And path 'api/aircraft', 999
    When method get
    Then status 404

  Scenario: Basarili rezervasyon olustur
    Given url 'http://localhost:8080'
    And path 'api/bookings'
    And request
    """
    {
      "aircraftId": 1,
      "customerName": "Merve Test",
      "startDate": "2026-11-01",
      "endDate": "2026-11-03"
    }
    """
    When method post
    Then status 201
    And match response.aircraft.id == 1
    And match response.customerName == 'Merve Test'

  Scenario: Bos musteri adi ile rezervasyon reddedilmeli
    Given url 'http://localhost:8080'
    And path 'api/bookings'
    And request
    """
    {
      "aircraftId": 1,
      "customerName": "",
      "startDate": "2026-11-01",
      "endDate": "2026-11-03"
    }
    """
    When method post
    Then status 400
