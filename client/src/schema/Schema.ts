import * as yup from "yup";

export const schemaLogin = yup.object().shape({
    username: yup.string().required("Kullanıcı Adı Boş Geçilemez..."),
    password: yup.string().required("Şifre Boş Geçilemez...")
})

export const schemaAddNewEmployee = yup.object().shape({
    username: yup.string().required("Kullanıcı Adı Boş Geçilemez..."),
    password: yup.string().required("Şifre Boş Geçilemez..."),
    role: yup.string().required("Personel Rolü Boş Geçilemez...")
})

export const schemaProduct = yup.object().shape({
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

export const schemaCategory = yup.object().shape({
    name: yup.string().required("Kategori Adı Boş Geçilemez..."),
    image: yup.string().required("Kategori Fotoğrafı Boş Geçilemez...")
})

export const schemaTable = yup.object().shape({
    table_number: yup.string().required("Masa Numarası Boş Geçilemez..."),
})