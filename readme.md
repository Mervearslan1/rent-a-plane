# Rent a Plane

## Uygulama Mimarisi, Kurulum ve Test Otomasyonu Öğrenme Rehberi

**Proje türü:** Uçak kiralama uygulaması ve test otomasyonu eğitim projesi
**Backend:** Java 21 + Spring Boot
**Frontend:** React + Vite
**Veritabanı:** PostgreSQL
**Mock server:** WireMock
**API testleri:** Karate DSL
**Frontend testleri:** Vitest + React Testing Library
**Uçtan uca testler:** Playwright (ilerleyen aşama)
**Çalıştırma ortamı:** Docker Compose + yerel geliştirme ortamı

---

# 1. Projenin amacı

Rent a Plane, kullanıcıların uçakları inceleyebildiği, müsaitliklerini sorgulayabildiği ve örnek kiralama rezervasyonu oluşturabildiği bir web uygulamasıdır.

Bu proje iki amaçla geliştirilecektir:

1. Java backend, React frontend, veritabanı ve REST API mimarisini uygulamalı öğrenmek.
2. Mock server, API testleri, frontend testleri ve uçtan uca test otomasyonunu gerçek bir proje üzerinde öğrenmek.

Proje yalnızca çalışan bir uygulama olmayacaktır. Her aşamada neden belirli bir teknoloji kullandığımızı, bileşenlerin birbirleriyle nasıl iletişim kurduğunu ve testlerin hangi hataları yakaladığını açıklayan bir öğrenme kaynağı olacaktır.

## 1.1. Öğrenme yaklaşımı

Proje adım adım geliştirilecektir.

* Her aşamada küçük bir özellik tamamlanacaktır.
* Yeni bir teknoloji eklenmeden önce ne işe yaradığı açıklanacaktır.
* Kod yazıldıktan sonra ilgili testler çalıştırılacaktır.
* Bir aşama doğrulanmadan sonraki aşamaya geçilmeyecektir.
* Gereksiz mimari karmaşıklıktan kaçınılacaktır.
* Çalışan kodun yanında kurulum, test ve hata giderme adımları da belgelenecektir.

Temel hedef, yalnızca kodu çalıştırmak değil, kodun nasıl çalıştığını anlayabilmektir.

# 2. Uygulamanın kapsamı

İlk sürümde üç temel işlev bulunacaktır.

### 2.1. Uçak kataloğu

Kullanıcı uçakları listeler ve özelliklerini görüntüler.

Örnek uçaklar:

| Uçak                  | Kapasite | Günlük örnek fiyat |
| --------------------- | -------: | -----------------: |
| Boeing 787 Dreamliner |      296 |         250.000 TL |
| Airbus A350           |      300 |         220.000 TL |
| Cessna 172            |        4 |          15.000 TL |

Bu fiyatlar yalnızca test verileridir; gerçek kiralama fiyatları değildir.

### 2.2. Müsaitlik sorgulama

Kullanıcı bir uçağın kiralanabilir olup olmadığını görebilir. İlerleyen aşamada tarih aralığına göre müsaitlik kontrolü eklenecektir.

### 2.3. Rezervasyon oluşturma

Kullanıcı uçak ve tarih aralığı seçerek örnek rezervasyon oluşturabilir.

İlk sürümde gerçek ödeme, gerçek uçuş operasyonu veya gerçek kiralama sözleşmesi bulunmayacaktır.

# 3. Sistem mimarisi

Uygulama, React frontend ile Spring Boot backend'in ayrıldığı bir istemci-sunucu mimarisi kullanacaktır. Backend kendi içinde modüler monolit olarak tasarlanacaktır.

## 3.1. Mimari şema

```text
                     RENT A PLANE
                           |
                 +---------+---------+
                 |                   |
             Frontend             Testler
             React/Vite          Karate DSL
                 |                   |
                 | HTTP/JSON         | HTTP/JSON
                 +---------+---------+
                           |
                    Spring Boot API
                       :8080
                           |
                +----------+----------+
                |                     |
             Modules              PostgreSQL
          aircraft/booking            :5432
                |
         External integrations
                |
             WireMock
              :8089
```

Bu şema mantıksal bileşenleri gösterir. Karate testleri, test kapsamına göre backend'e veya doğrudan WireMock'a istek gönderebilir.

WireMock, uygulamanın kendi uçak kayıtlarını saklayan ana veritabanı değildir. Harici servislerin davranışlarını taklit etmek ve kontrollü yanıtlar üretmek için kullanılacaktır.

## 3.2. Bileşenlerin görevleri

**Frontend — React**

Kullanıcının gördüğü arayüzdür. Uçakları listeler, formları gösterir ve backend'e istek gönderir. İş kurallarının asıl sahibi frontend değildir.

**Backend — Java + Spring Boot**

HTTP isteklerini karşılar, doğrulama yapar, iş kurallarını uygular ve veritabanıyla iletişim kurar.

**Database — PostgreSQL**

Uçak ve rezervasyon kayıtlarını saklar. İlk test verileri SQL ile oluşturulur.

**Mock server — WireMock**

Harici servisleri taklit eder. Örneğin uçak kiralama sisteminin bir fiyatlandırma veya hava durumu servisine bağlandığını düşünelim. Gerçek servis hazır olmasa bile WireMock, testlerin ihtiyaç duyduğu yanıtları üretebilir.

**API testleri — Karate DSL**

Backend'in HTTP üzerinden doğru yanıt verdiğini doğrular. Durum kodları, JSON alanları, hata yanıtları ve iş kuralları test edilir.

**Frontend testleri — Vitest + React Testing Library**

React bileşenlerinin doğru görüntülendiğini ve kullanıcı etkileşimlerinin beklenen sonucu ürettiğini doğrular.

**Uçtan uca testler — Playwright**

İlerleyen aşamada tarayıcıyı gerçek kullanıcı gibi kontrol eder. Kullanıcının uçak listesini açması ve rezervasyon oluşturması gibi akışlar test edilir.

# 4. Mock data, mock server ve test verisi arasındaki fark

Bu proje için en önemli kavramlardan biri budur.

### 4.1. Mock data

Testlerde kullanılan örnek verilerdir.

Örneğin:

```json
{
  "id": 1,
  "model": "Boeing 787 Dreamliner",
  "capacity": 296,
  "dailyPrice": 250000,
  "available": true
}
```

Bu JSON tek başına bir API veya sunucu değildir. Yalnızca bir veri örneğidir.

### 4.2. Seed data

Uygulama başlarken veritabanına yüklenen başlangıç verileridir.

Bu projede `db/init/01-mock-data.sql` dosyası uçak kayıtlarını oluşturacaktır. Backend bu kayıtları PostgreSQL üzerinden okuyacaktır.

### 4.3. Mock server

HTTP isteklerine önceden tanımlanmış veya koşullara göre belirlenen yanıtları veren bir servistir.

Örneğin WireMock şu isteğe yanıt verebilir:

```http
GET http://localhost:8089/external/weather/airport
```

Örnek yanıt:

```json
{
  "airport": "IST",
  "condition": "CLEAR",
  "operational": true
}
```

Böylece gerçek bir hava durumu servisine bağlanmadan uygulamanın harici servis yanıtlarıyla nasıl çalıştığını test edebiliriz.

### 4.4. Test otomasyonu

Test otomasyonu, tanımlanan kontrollerin yazılım tarafından otomatik yürütülmesidir.

Örneğin Karate, `/api/aircraft` endpoint'ine istek gönderip `200 OK` yanıtı geldiğini ve sonuçta üç uçak bulunduğunu doğrulayabilir.

**Özet:** Mock data veridir, mock server yanıt üreten servistir, test otomasyonu ise sistemin beklenen şekilde çalışıp çalışmadığını doğrular.

# 5. Teknoloji seçimleri

| Teknoloji             | Kullanım amacı                                    |
| --------------------- | ------------------------------------------------- |
| Java 21               | Backend programlama dili                          |
| Spring Boot           | REST API ve uygulama altyapısı                    |
| Spring Web            | HTTP endpoint'leri                                |
| Spring Data JPA       | Veritabanı erişimi                                |
| PostgreSQL            | Kalıcı veri saklama                               |
| Maven                 | Backend bağımlılıkları ve build                   |
| React                 | Kullanıcı arayüzü                                 |
| Vite                  | Frontend geliştirme sunucusu ve build             |
| WireMock              | Harici servisleri taklit etme                     |
| Karate DSL            | API test otomasyonu                               |
| Vitest                | Frontend birim testleri                           |
| React Testing Library | React bileşeni testleri                           |
| Playwright            | Tarayıcı üzerinden uçtan uca testler              |
| Docker Compose        | PostgreSQL ve WireMock gibi servisleri çalıştırma |
| Git                   | Sürüm kontrolü                                    |

İlk aşamada bütün teknolojiler aynı anda kurulmayacaktır. İhtiyaç duyuldukça projeye ekleneceklerdir.

# 6. Repository yapısı

Repo adı `rent-a-plane` olacaktır.

```text
rent-a-plane/
├── README.md
├── docker-compose.yml
├── .gitignore
├── .env.example
│
├── backend/
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   └── src/
│       ├── main/
│       │   ├── java/com/rentaplane/
│       │   │   ├── RentAPlaneApplication.java
│       │   │   ├── common/
│       │   │   │   ├── config/
│       │   │   │   ├── exception/
│       │   │   │   └── response/
│       │   │   └── module/
│       │   │       ├── aircraft/
│       │   │       │   ├── Aircraft.java
│       │   │       │   ├── AircraftRepository.java
│       │   │       │   ├── AircraftService.java
│       │   │       │   └── AircraftController.java
│       │   │       └── booking/
│       │   │           ├── Booking.java
│       │   │           ├── BookingRepository.java
│       │   │           ├── BookingService.java
│       │   │           └── BookingController.java
│       │   └── resources/
│       │       └── application.yml
│       └── test/
│           └── java/com/rentaplane/
│
├── frontend/
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
├── db/
│   └── init/
│       └── 01-mock-data.sql
│
├── mock-server/
│   └── mappings/
│       └── weather-success.json
│
├── tests/
│   └── api/
│       ├── pom.xml
│       ├── karate-config.js
│       └── features/
│           ├── aircraft-list.feature
│           ├── aircraft-detail.feature
│           └── booking-create.feature
│
└── docs/
    ├── architecture.md
    ├── setup-guide.md
    ├── backend-guide.md
    ├── frontend-guide.md
    ├── mock-server-guide.md
    ├── testing-guide.md
    └── troubleshooting.md
```

Bu yapı başlangıçta hedeflenen yapıdır. İlk aşamada yalnızca gerekli dosyalar oluşturulacaktır. Örneğin rezervasyon modülü, uçak listeleme özelliği çalıştıktan sonra eklenecektir.

# 7. Backend mimarisi

Backend, feature-based modular monolith yaklaşımını kullanacaktır.

Bu, tek bir Spring Boot uygulamasının birden fazla iş modülünü barındırması anlamına gelir. Her iş özelliği kendi kod alanına sahip olur; her modül için ayrı mikroservis kurulmaz.

## 7.1. `common/` klasörü

Birden fazla modül tarafından kullanılan ortak altyapı burada bulunur.

* `config/`: CORS ve uygulama yapılandırmaları.
* `exception/`: Ortak hata işleme.
* `response/`: Gerekirse ortak API yanıt modelleri.

Ortak klasör, her türlü kodun atıldığı bir yer olmamalıdır. Yalnızca gerçekten ortak olan bileşenler burada tutulmalıdır.

## 7.2. `module/aircraft/` klasörü

Uçaklarla ilgili işlevler burada bulunur.

**Aircraft.java**

Bir uçağın veri modelini ve JPA entity tanımını içerir.

**AircraftRepository.java**

Veritabanından uçak kayıtlarını okumak ve gerekli veri işlemlerini gerçekleştirmek için kullanılır.

**AircraftService.java**

Uçaklarla ilgili iş kurallarını uygular.

**AircraftController.java**

HTTP isteklerini karşılar ve uygun service metodunu çağırır.

## 7.3. Katmanlar nasıl iletişim kurar?

```text
HTTP Request
     |
     v
AircraftController
     |
     v
AircraftService
     |
     v
AircraftRepository
     |
     v
PostgreSQL
```

Controller doğrudan SQL yazmaz. Repository HTTP yanıtı oluşturmaz. Service ise iş kurallarını yönetir.

Bu ayrım kodun anlaşılmasını, test edilmesini ve ileride değiştirilmesini kolaylaştırır.

# 8. Backend API tasarımı

İlk aşamada aşağıdaki endpoint'ler hedeflenecektir.

| Metot | Endpoint                       | Beklenen görev              |
| ----- | ------------------------------ | --------------------------- |
| GET   | `/api/aircraft`                | Uçak listesini getirir      |
| GET   | `/api/aircraft/{id}`           | Bir uçağın detayını getirir |
| GET   | `/api/aircraft?available=true` | Müsait uçakları filtreler   |
| POST  | `/api/bookings`                | Rezervasyon oluşturur       |

Örnek başarılı liste yanıtı:

```json
[
  {
    "id": 1,
    "model": "Boeing 787 Dreamliner",
    "capacity": 296,
    "dailyPrice": 250000,
    "available": true
  }
]
```

Olmayan bir uçak için:

```http
GET /api/aircraft/9999
```

Beklenen durum:

```http
404 Not Found
```

Hata yanıtının JSON formatı da tutarlı olmalıdır. Gerçek yanıt modeli uygulama aşamasında belirlenecek ve testlerde doğrulanacaktır.

# 9. Veritabanı ve başlangıç verileri

PostgreSQL, Docker Compose üzerinden çalıştırılacaktır.

`db/init/01-mock-data.sql` dosyası başlangıç verilerini oluşturmak için kullanılacaktır.

Bu dosyada ilerleyen aşamada:

* Uçak tablosu,
* Uçakların örnek kayıtları,
* Gerekirse rezervasyon tablosu

tanımlanacaktır.

Başlangıç SQL dosyalarının Docker tarafından hangi koşullarda çalıştırıldığı unutulmamalıdır. Birçok PostgreSQL container kurulumunda init betikleri yalnızca boş veri dizini ilk kez oluşturulurken çalışır. Dosyayı sonradan değiştirmek, daha önce oluşturulmuş veritabanını kendiliğinden güncellemez.

Şema değişiklikleri için uygulama ilerlediğinde Flyway gibi bir migration aracı kullanılabilir.

# 10. Frontend mimarisi

React uygulaması backend'den bağımsız olarak çalışacaktır.

Frontend'in görevi kullanıcı arayüzünü oluşturmak ve API ile iletişim kurmaktır.

## 10.1. Klasörlerin görevleri

`components/`: Tekrar kullanılabilen bileşenler. Örneğin `AircraftCard`.

`pages/`: Sayfalar. Örneğin `AircraftListPage`.

`services/`: API çağrıları. Örneğin `aircraftService.js`.

`App.jsx`: Uygulamanın ana bileşeni.

`main.jsx`: React uygulamasını başlatan giriş noktası.

API adresi kodun farklı yerlerine sabit olarak yazılmamalıdır. Geliştirme ortamında `VITE_API_BASE_URL` gibi bir ortam değişkeni kullanılabilir.

Örneğin:

```text
VITE_API_BASE_URL=http://localhost:8080
```

Vite ile oluşturulan `VITE_` değişkenlerinin frontend koduna aktarılabileceği unutulmamalıdır. Bu nedenle bu değişkenlerde parola veya gizli anahtar tutulmamalıdır.

## 10.2. Frontend veri akışı

```text
Kullanıcı sayfayı açar
          |
          v
React bileşeni yüklenir
          |
          v
aircraftService API isteği gönderir
          |
          v
Spring Boot backend yanıt verir
          |
          v
React JSON verisini işler
          |
          v
Uçak kartları ekranda gösterilir
```

Frontend başlangıçta kendi içinde sabit uçak listesi tutmayacaktır. Gerçek API entegrasyonunu görebilmek için veriler backend üzerinden alınacaktır.

# 11. Mock server mimarisi

WireMock, test ortamında kontrollü HTTP yanıtları oluşturmak için kullanılacaktır.

Örneğin ileride uygulama bir harici servis üzerinden hava durumu bilgisi alıyor olsun. Gerçek servise erişim olmasa bile WireMock şu senaryoları sağlayabilir:

* Başarılı yanıt: `200 OK`
* Servis hatası: `500 Internal Server Error`
* Kaynak bulunamaması: `404 Not Found`
* Yavaş yanıt
* Boş veya beklenmeyen yanıt

Örnek WireMock eşleştirmesi:

```json
{
  "request": {
    "method": "GET",
    "urlPath": "/external/weather/airport"
  },
  "response": {
    "status": 200,
    "headers": {
      "Content-Type": "application/json"
    },
    "jsonBody": {
      "airport": "IST",
      "condition": "CLEAR",
      "operational": true
    }
  }
}
```

Bu dosya `mock-server/mappings/weather-success.json` konumunda tutulabilir.

WireMock, Docker Compose üzerinden `localhost:8089` adresinde çalıştırılabilir.

**Önemli:** İlk aşamada uçak listesini PostgreSQL'den alacağız. WireMock ise ayrı bir örnek HTTP servisini taklit edecek. Daha sonra backend'in WireMock ile iletişim kurmasını ekleyerek gerçek bir entegrasyon testi yapacağız.

# 12. Test otomasyonu stratejisi

Testler farklı seviyelerde yazılacaktır. Her test aracının farklı bir sorumluluğu olacaktır.

## 12.1. Backend birim testleri

Spring Boot backend içinde JUnit 5 ve Mockito kullanılabilir.

Örnek: Bir uçağın günlük fiyatı sıfır veya negatif olamaz gibi bir iş kuralı test edilir.

Bu testlerde mümkün olduğunca veritabanı ve gerçek HTTP sunucusu çalıştırılmaz.

## 12.2. Backend entegrasyon testleri

Repository, service ve PostgreSQL arasındaki bağlantı test edilir.

Örneğin veritabanına kaydedilen bir uçağın doğru okunabildiği doğrulanır.

İlerleyen aşamada gerçek PostgreSQL kullanan entegrasyon testleri için Testcontainers değerlendirilebilir.

## 12.3. Karate API testleri

Karate, HTTP isteklerini ve yanıtlarını okunabilir `.feature` dosyalarıyla test etmemizi sağlar.

Örnek:

```gherkin
Feature: Aircraft API

  Background:
    * url baseUrl

  Scenario: Uçak listesi başarılı şekilde getirilir
    Given path 'api', 'aircraft'
    When method get
    Then status 200
    And match response == '#[]'
    And match each response contains
      { id: '#number', model: '#string' }
```

Bu örnek, yanıtın bir JSON listesi olduğunu, her kayıtta sayısal `id` ve metin türünde `model` bulunduğunu kontrol eder.

Testin gerçekten üç belirli uçak döndürdüğünü doğrulamak için veri hazırlama ve test izolasyonu da tasarlanmalıdır. Yalnızca liste tipini doğrulamak, işlevin bütünüyle doğru olduğunu kanıtlamaz.

Karate testleri çalıştırıldığında backend'in erişilebilir olması gerekir. Backend başlamamışsa testin başarısız olması uygulama hatasıyla aynı anlama gelmez; önce test ortamının hazır olup olmadığı kontrol edilmelidir.

## 12.4. Frontend birim testleri

Vitest ve React Testing Library ile:

* Uçak kartının doğru bilgileri gösterdiği,
* Yükleniyor durumunun görüntülendiği,
* API hatasında hata mesajı gösterildiği,
* Boş listede uygun mesaj gösterildiği

test edilebilir.

Bu testlerde gerçek backend'i çalıştırmak zorunlu değildir. API çağrıları kontrollü yanıtlarla taklit edilebilir.

## 12.5. Uçtan uca testler

İlerleyen aşamada Playwright ile tarayıcı üzerinden şu akış test edilir:

1. Kullanıcı uygulamayı açar.
2. Uçak listesinin yüklenmesini bekler.
3. Bir uçağın detayını açar.
4. Kiralama formunu doldurur.
5. Rezervasyon isteği gönderir.
6. Başarı mesajının gösterildiğini doğrular.

Bu test, birden fazla bileşenin birlikte çalışmasını kontrol eder. Başarılı bir frontend testi tek başına backend'in veya veritabanının doğru çalıştığını kanıtlamaz.

# 13. Öğrenme aşamaları ve kabul kriterleri

Her aşama tamamlandığında aşağıdaki kontroller yapılacaktır.

### Aşama 1 — Repository ve geliştirme ortamı

* [ ] Git deposu oluşturuldu.
* [ ] Java 21 ve Node.js sürümleri kontrol edildi.
* [ ] Proje klasörleri oluşturuldu.
* [ ] README ve mimari dokümanı eklendi.

**Başarı ölçütü:** Proje yapısı anlaşılır ve başka bir geliştirici için takip edilebilir olmalıdır.

### Aşama 2 — PostgreSQL

* [ ] Docker Compose yapılandırıldı.
* [ ] PostgreSQL container'ı başlatıldı.
* [ ] Veritabanı bağlantısı doğrulandı.
* [ ] Örnek uçak verileri yüklendi.

**Başarı ölçütü:** Veritabanında örnek uçak kayıtları görülebilmelidir.

### Aşama 3 — Spring Boot backend

* [ ] Java 21 ile uygulama oluşturuldu.
* [ ] `common/` ve `module/` yapısı kuruldu.
* [ ] Aircraft entity ve repository yazıldı.
* [ ] Service ve controller eklendi.
* [ ] `GET /api/aircraft` çalıştırıldı.

**Başarı ölçütü:** API, PostgreSQL'deki örnek verileri JSON olarak döndürmelidir.

### Aşama 4 — API testleri

* [ ] Karate test projesi oluşturuldu.
* [ ] Başarılı listeleme senaryosu yazıldı.
* [ ] Uçak detay senaryosu yazıldı.
* [ ] Bulunamayan uçak senaryosu yazıldı.
* [ ] Testler komut satırından çalıştırıldı.

**Başarı ölçütü:** Testler yalnızca HTTP durum kodlarını değil, önemli yanıt alanlarını da doğrulamalıdır.

### Aşama 5 — React frontend

* [ ] React + Vite uygulaması oluşturuldu.
* [ ] Uçak listeleme sayfası hazırlandı.
* [ ] API service yazıldı.
* [ ] Backend bağlantısı kuruldu.
* [ ] Yükleniyor, hata ve boş liste durumları eklendi.

**Başarı ölçütü:** Uçaklar React ekranında backend'den alınan verilerle gösterilmelidir.

### Aşama 6 — WireMock

* [ ] WireMock servisi başlatıldı.
* [ ] Başarılı örnek yanıt tanımlandı.
* [ ] HTTP istek eşleştirmesi doğrulandı.
* [ ] Hata yanıtı senaryosu oluşturuldu.
* [ ] Karate ile mock server yanıtları test edildi.

**Başarı ölçütü:** Gerçek harici servise ihtiyaç olmadan tanımlanan yanıtlar üretilebilmelidir.

### Aşama 7 — Entegrasyon ve hata senaryoları

* [ ] Backend'in WireMock'a istek göndermesi eklendi.
* [ ] Başarılı harici servis yanıtı test edildi.
* [ ] Harici servis hatası test edildi.
* [ ] Frontend API hata durumu test edildi.
* [ ] İlgili loglar incelendi.

**Başarı ölçütü:** Kontrollü hata senaryolarında sistemin beklenen davranışı doğrulanmalıdır.

### Aşama 8 — Rezervasyon özelliği

* [ ] Rezervasyon modeli oluşturuldu.
* [ ] Tarih ve fiyat doğrulamaları eklendi.
* [ ] Rezervasyon endpoint'i yazıldı.
* [ ] Karate testleri eklendi.
* [ ] React rezervasyon formu hazırlandı.
* [ ] Uçtan uca test yazıldı.

**Başarı ölçütü:** Geçerli bir rezervasyon oluşturulabilmeli ve geçersiz istekler reddedilmelidir.

# 14. Projenin çalıştırılması

Tam uygulama hazır olduğunda geliştirme ortamı aşağıdaki sırayla başlatılacaktır.

Önce altyapı servisleri:

```powershell
docker compose up -d postgres wiremock
```

Servis isimleri `docker-compose.yml` dosyasındaki tanımlarla aynı olmalıdır.

Ardından backend:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

API testleri:

```powershell
cd tests/api
mvn test
```

Buradaki komutlar hedeflenen çalışma düzenini gösterir. `postgres` ve `wiremock` servisleri, test klasörü ve Maven wrapper dosyaları ilgili aşamalar tamamlandıktan sonra kullanılabilir olacaktır.

# 15. Güvenlik ve geliştirme kuralları

* Gerçek parolalar veya API anahtarları Git deposuna eklenmemelidir.
* `.env.example` örnek değişkenleri göstermeli, gerçek sırları içermemelidir.
* Veritabanı portu ve kimlik bilgileri geliştirme ortamına uygun şekilde yapılandırılmalıdır.
* Test verileri gerçek müşteri veya kişisel verilerden oluşmamalıdır.
* Mock server yalnızca gerekli test ortamında erişilebilir olmalıdır.
* Testler birbirlerinin verilerini değiştirmemeli; tekrarlanabilir olmalıdır.
* Her özellik için başarılı durumun yanında ilgili hata durumları da düşünülmelidir.
* Bir test başarısız olduğunda önce test ortamı, sonra uygulama davranışı ve en son test beklentisi incelenmelidir.
