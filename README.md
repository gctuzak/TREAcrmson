# Proje Ana Planı: Full-Stack MyBasicCRM Uygulaması

**Temel Amaç:** Bu klasördeki `requirements.md`, `design.md` ve `database_schema.sql` dosyalarını ana bağlam olarak kullanarak, sıfırdan, modüler bir CRM uygulaması oluşturmak.

**Geliştirme Metodolojisi:** Projeyi aşağıdaki sıralı fazlara göre inşa edeceğiz. Her adımda senden istediğim kodları oluşturmanı ve bana çalıştırmam gereken komutları söylemeni bekliyorum. Bir faz tamamlanmadan ve test edilmeden diğerine geçmeyeceğiz.

---

### **Faz 1: Proje Kurulumu ve Backend Temelleri**
1.  Bu ana klasör içinde `backend` adında yeni bir klasör oluştur.
2.  `backend` klasöründe bir Node.js projesi başlat (`npm init -y`) ve `design.md` dosyasında belirtilen paketleri (`express`, `sequelize`, `mariadb2`, `cors`, `dotenv`) kur.
3.  `backend` içinde bir `server.js` dosyası oluşturarak `localhost:3001` portunda çalışan temel bir Express sunucusu kur.
4.  `backend/config/database.js` dosyasında, `design.md`'deki bilgilere göre Sequelize veritabanı bağlantısını yapılandır ve bağlantıyı test et.

### **Faz 2: Veritabanı Modelleri ve İlişkilerinin Tanımlanması**
1.  `database_schema.sql` dosyasını dikkatlice analiz et.
2.  `backend/models` adında bir klasör oluştur.
3.  Bu klasörün içine, şemadaki her bir tablo için ayrı bir Sequelize model dosyası oluştur. (Örn: `contact.js`, `contactPhone.js`, `user.js`, `task.js` vb.).
4.  **En Önemli Adım:** Modeller arasında `database_schema.sql`'deki mantıksal ilişkilere göre Sequelize Associations (`hasMany`, `belongsTo`, `belongsToMany`) tanımlamalarını yap. Örneğin:
    -   `Contact.hasMany(ContactPhone, { foreignKey: 'CONTACTID' })`
    -   `ContactPhone.belongsTo(Contact, { foreignKey: 'CONTACTID' })`
    -   `User.hasMany(Task, { foreignKey: 'USERID' })`
    -   `Task.belongsTo(Contact, { foreignKey: 'CONTACTID' })`
5.  Tüm modelleri ve ilişkileri birleştiren bir `index.js` dosyası (`models/index.js`) oluştur.

### **Faz 3: Temel API Endpoints (İletişim Yönetimi)**
1.  `backend/routes` klasörü oluştur ve içine `contactRoutes.js` dosyası ekle.
2.  `CONTACT` tablosu için temel CRUD (Create, Read, Update, Delete) işlemlerini yapacak API uç noktalarını ve bu işlemleri yürütecek `backend/controllers/contactController.js` dosyasını oluştur.
3.  API'leri test etmek için `server.js` dosyasına bu rotaları dahil et.

### **Faz 4: Frontend Kurulumu ve Veri Görüntüleme**
1.  Ana klasörde `frontend` adında yeni bir klasör oluştur.
2.  Vite kullanarak `frontend` klasörü içinde yeni bir React projesi başlat.
3.  `axios` ve `react-router-dom` paketlerini kur.
4.  `frontend/src/pages/ContactListPage.jsx` adında bir sayfa oluştur. Bu sayfa, yüklendiğinde backend'deki `GET /api/contacts` API'sine istek atarak tüm kişileri çekmeli ve basit bir tabloda listelemelidir.

---

**Lütfen ilk görevinle başla: Faz 1, Adım 1'i gerçekleştir ve bana ilgili komutları ver.**