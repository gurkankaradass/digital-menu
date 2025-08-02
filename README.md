# 🧾 Dijital Menü ve Sipariş Sistemi

Bu proje, restoran ve kafe işletmeleri için geliştirilmiş bir **dijital menü ve sipariş yönetimi** sistemidir. Müşteriler masalarına özel QR kodlar sayesinde menüye erişip ürünleri görüntüleyebilir ve sipariş verebilirler. İşletme yetkilileri ise admin panel üzerinden ürün, kategori, masa ve personel yönetimi gibi işlemleri kolayca gerçekleştirebilir.

## 🚀 Özellikler

- QR kod ile masaya özel dijital menüye erişim
- Kategori ve ürün listeleme
- Ürünleri sepete ekleyerek masa bazlı sipariş verme
- Siparişleri görüntüleme ve düzenleme
- Admin panel üzerinden:
  - Kafe bilgilerini güncelleme (isim, adres, açıklama)
  - Ürün CRUD işlemleri (oluşturma, güncelleme, silme)
  - Kategori CRUD işlemleri
  - Personel ekleme, listeleme ve silme
  - Masa ekleme, listeleme ve silme
- Sipariş sonrası ürün çıkarma ve ödeme sonrası sipariş temizleme
- Lokal ağ üzerinden erişim (tablet/telefon desteği)
- Kullanıcı dostu, sade ve responsive arayüz

## 🛠️ Kullanılan Teknolojiler

**Frontend:**
- React
- TypeScript
- TailwindCSS
- React Router
- Axios

**Backend:**
- Node.js (Express)
- MSSQL

**Diğer:**
- Custom Hook’lar: `useCafe`, `useCategories`, `useProducts`
- Context API ile global state yönetimi

✍️ Geliştirici

Gürkan Karadaş  
LinkedIn: https://www.linkedin.com/in/gurkankaradass/ 

![Ana Sayfa](/screenshots/1.jpg) </br>
![Garson Girişi](/screenshots/2.jpg) </br>
![Sipariş Oluşturma](/screenshots/3.jpg) </br>
![Masalara Ait Siparişleri Görüntüleme](/screenshots/4.jpg) </br>
![Yönetici Girişi](/screenshots/5.jpg) </br>
![Kategori Ekleme, Düzenleme ve Silme](/screenshots/6.jpg) </br>
![Ürün Ekleme, Düzenleme ve Silme](/screenshots/7.jpg) </br>
![İşletme Bilgilerini Düzenleme](/screenshots/8.jpg) </br>
![Personel Ekleme, Silme ve Yetkilendirme](/screenshots/9.jpg) </br>
![Masa Yönetimi](/screenshots/10.jpg) </br>