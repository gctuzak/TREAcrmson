# Proje: Full-Stack CRM Uygulaması - Gereksinimler

## 1. Genel Bakış
Bu proje, `database_schema.sql` dosyasında tanımlanan mevcut veritabanı yapısını kullanarak, modern ve kapsamlı bir Müşteri İlişkileri Yönetimi (CRM) uygulaması oluşturmayı hedefler. Uygulama, satış ve müşteri yönetimi süreçlerini web tabanlı bir arayüz üzerinden sunacaktır.

## 2. Ana Modüller ve Özellikler

### 2.1. Kimlik Doğrulama ve Kullanıcı Yönetimi (`USER` tablosu)
-   Kullanıcılar sisteme e-posta ve şifre ile güvenli bir şekilde giriş yapabilmelidir.
-   Kullanıcı oturumları güvenli bir şekilde yönetilmelidir.
-   Kullanıcılar sistemden çıkış yapabilmelidir.
-   (Admin Yetkisi) Yeni kullanıcılar oluşturulabilmeli ve mevcut kullanıcıların bilgileri (departman, yetkiler vb.) düzenlenebilmelidir.

### 2.2. İletişim Yönetimi (Contact Management - `CONTACT`, `CONTACTPHONE`, `CONTACTEMAIL` tabloları)
-   Tüm "Kişiler" (Person) ve "Organizasyonlar" (Organization) aranabilir, filtrelenebilir bir listede görüntülenebilmelidir.
-   Yeni kişi veya organizasyon oluşturulabilmelidir.
-   Mevcut kayıtlar düzenlenebilmeli ve silinebilmelidir.
-   Bir kişinin detay sayfasında, ona ait tüm telefon numaraları ve e-posta adresleri listelenmelidir.
-   Kişiler ve organizasyonlar arasında hiyerarşik bir ilişki (`PARENTCONTACTID`) kurulabilmelidir (örn. bir çalışanın bir şirkete bağlanması).

### 2.3. Satış Süreci Yönetimi (Sales Pipeline - `LEAD`, `OPPORTUNITY`, `JOB` tabloları)
-   **Potansiyel Müşteriler (Leads):**
    -   Yeni potansiyel müşteriler (`LEAD`) sisteme kaydedilebilmelidir.
    -   Potansiyel müşteriler listelenmeli ve durumları (`STATUSTYPEID`) güncellenebilmelidir.
-   **Fırsatlar (Opportunities):**
    -   Bir potansiyel müşteri, bir "Fırsat"a (`OPPORTUNITY`) dönüştürülebilmelidir.
    -   Fırsatlara ürünler (`OPPORTUNITYPRODUCT`) eklenebilmeli, fiyatlandırma ve indirimler yönetilebilmelidir.
-   **İşler (Jobs):**
    -   Kazanılan bir fırsat, bir "İş"e (`JOB`) dönüştürülebilmelidir.
    -   İşlerin durumu takip edilebilmelidir.

### 2.4. Aktivite Yönetimi (`TASK`, `EVENT` tabloları)
-   Kullanıcılar kendilerine veya başka kullanıcılara görevler (`TASK`) atayabilmelidir.
-   Görevlerin son teslim tarihleri (`DATETIMEDUE`) ve durumları (`STATUS`) olmalıdır.
-   Takvim üzerinde toplantı veya randevu gibi etkinlikler (`EVENT`) oluşturulabilmelidir.
-   Etkinliklere kişiler veya kullanıcılar davet edilebilmelidir (`EVENTGUEST`).

### 2.5. Ürün ve Fiyatlandırma Yönetimi (`PRICELIST`, `PRICELISTDETAIL` tabloları)
-   Sisteme ürün ve hizmetler kaydedilebilmelidir.
-   Farklı müşteriler veya durumlar için fiyat listeleri (`PRICELIST`) oluşturulabilmelidir.
-   Her ürünün farklı fiyat listelerindeki fiyatları (`PRICELISTDETAIL`) yönetilebilmelidir.

## 3. Teknik Olmayan Gereksinimler
-   **Arayüz:** Temiz, anlaşılır ve modern bir tasarıma sahip olmalıdır.
-   **Kullanılabilirlik:** Mobil cihazlarla uyumlu (responsive) olmalıdır.
-   **Performans:** Veri listeleme ve arama işlemleri hızlı olmalıdır.