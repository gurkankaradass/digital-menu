import * as yup from "yup";

export const schemaLogin = yup.object().shape({
    username: yup.string().required("Kullanıcı Adı Boş Geçilemez..."),
    password: yup.string().required("Şifre Boş Geçilemez...")
})