# MyBasicCRM - Teknik Tasarım Dokümanı

## 1. Teknoloji Yığını (Tech Stack)
-   **Backend:** Node.js, Express.js, Sequelize (MariaDB için ORM)
-   **Frontend:** React.js (Vite ile oluşturulacak), Tailwind CSS (Modern ve esnek stil altyapısı için)
-   **Veritabanı:** Docker üzerinde çalışan `mariadb:10.11` imajı.

## 2. Mimari
-   **Backend (API Sunucusu):** Veritabanı ile iletişim kuran, iş mantığını yürüten ve verileri JSON formatında sunan bir REST API olacaktır. `localhost:3001` portunda çalışacaktır.
-   **Frontend (İstemci):** Backend API'sine HTTP istekleri göndererek verileri alan ve kullanıcıya sunan bir Tek Sayfa Uygulaması (Single Page Application - SPA) olacaktır. `localhost:5173` (Vite'ın varsayılan portu) üzerinde çalışacaktır.

## 3. Veritabanı Bağlantı Bilgileri
Backend uygulaması, Docker üzerinde çalışan MariaDB konteynerine aşağıdaki bilgilerle bağlanacaktır:
-   **Host:** `localhost`
-   **Port:** `3308`
-   **Kullanıcı Adı:** `root`
-   **Şifre:** `g13c11t73`
-   **Veritabanı Adı:** `mybasiccrm_yedek`

## 4. Veritabanı Şeması ve Modeller
-   Uygulamanın tüm veritabanı yapısı, tabloları, sütunları, indeksleri ve ilişkileri **`database_schema.sql`** dosyasında detaylı olarak belirtilmiştir.
-   Backend'deki Sequelize modelleri, bu şema dosyasındaki her bir tabloya karşılık gelecek şekilde oluşturulacaktır. Özellikle tablolar arasındaki ilişkiler (Foreign Keys) Sequelize Associations (örn: `hasMany`, `belongsTo`) kullanılarak doğru bir şekilde tanımlanmalıdır.

## 5. Önemli Teknik Notlar
-   **Generated Columns:** `CONTACT.CONTROLNAME` ve `CONTACTPHONE.CONTROLNUMBER` gibi `GENERATED ALWAYS AS` ile tanımlanmış sütunlara backend tarafından veri yazılmamalıdır. Veritabanı bu değerleri kendi kendine üretecektir.
-   **Karakter Seti:** Veritabanı `utf8mb3` kullandığı için, Sequelize bağlantısı ve modelleri bu karakter setini destekleyecek şekilde ayarlanmalıdır.
-   **İlişkiler:** Tablolar arasındaki mantıksal ilişkiler (örn. `TASK.CONTACTID` -> `CONTACT.ID`) Sequelize'de `foreignKey` olarak tanımlanmalıdır.