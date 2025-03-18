import * as yup from "yup";

export const schemaLogin = yup.object().shape({
    username: yup.string().required("Kullanıcı Adı Boş Geçilemez..."),
    password: yup.string().required("Şifre Boş Geçilemez...")
})

export const schemaUpdateProduct = yup.object().shape({
    name: yup.string().required("Ürün Adı Boş Geçilemez..."),
    image: yup.string().required("FotoğrafBoş Geçilemez..."),
    price: yup.string().required("Fiyat Boş Geçilemez..."),
    categoryName: yup.string().required("Kategori İsmi Boş Geçilemez...")
})