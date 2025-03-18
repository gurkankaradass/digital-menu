import * as yup from "yup";

export const schemaLogin = yup.object().shape({
    username: yup.string().required("Kullanıcı Adı Boş Geçilemez..."),
    password: yup.string().required("Şifre Boş Geçilemez...")
})

export const schemaUpdateProduct = yup.object().shape({
    name: yup.string().required("Ürün Adı Boş Geçilemez..."),
    image: yup.string().required("Fotoğraf Boş Geçilemez..."),
    price: yup.string().required("Fiyat Boş Geçilemez..."),
    categoryName: yup.string().required("Kategori İsmi Boş Geçilemez...")
})

export const schemaEditCafe = yup.object().shape({
    name: yup.string().required("Cafe Adı Boş Geçilemez..."),
    logo: yup.string().required("Logo Boş Geçilemez..."),
    phone: yup.string().required("Telefon Boş Geçilemez..."),
    location: yup.string().required("Mekan İsmi Boş Geçilemez..."),
    address: yup.string().required("Adres Boş Geçilemez..."),
    map: yup.string().required("Harita URL Boş Geçilemez..."),
    instagram: yup.string().required("İnstagram İsmi Boş Geçilemez...")
})