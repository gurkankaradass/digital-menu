const { sql, poolPromise } = require("../config/db")

const getAllEmployees = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT id, username, role FROM Employees");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Personel Bulunamadı..." });
        }

        res.json(result.recordset);
    } catch (error) {
        console.error("API Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("username", sql.NVarChar, username)
            .query("SELECT * FROM Employees WHERE username = @username");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Kullanıcı Adı Hatalı..." });
        }

        const employee = result.recordset[0];

        if (password !== employee.password) {
            return res.status(404).json({ message: "Şifre Hatalı..." })
        }

        return res.json({
            message: "Giriş Başarılı!",
            employee: {
                id: employee.id,
                username: employee.username,
                password: employee.password,
                role: employee.role
            }
        })

    } catch (error) {
        console.error("API Hatası: ", error);
        return res.status(500).json({ message: "Sunucu Hatası, Lütfen Daha Sonra Tekrar Deneyin..." });
    }
};

const addNewEmployee = async (req, res) => {
    const { username, password, role } = req.body

    if (!username || !password || !role) {
        return res.status(400).json({ message: "Gerekli Alanlar Doldurulmalıdır..." })
    }

    try {
        const pool = await poolPromise;

        const checkEmployee = await pool.request()
            .input("username", sql.NVarChar, username)
            .query("SELECT id FROM Employees WHERE username = @username");

        if (checkEmployee.recordset.length > 0) {
            return res.status(400).json({ message: "Personel Zaten Mevcut" });;
        }

        await pool.request()
            .input("username", sql.NVarChar, username)
            .input("password", sql.NVarChar, password)
            .input("role", sql.NVarChar, role)
            .query(`INSERT INTO Employees (username, password, role) VALUES (@username, @password, @role)`)

        const newEmployees = await pool.request()
            .query("SELECT * FROM Employees");

        res.status(200).json({
            message: "Personel Eklendi...",
            newEmployees: newEmployees.recordset
        })

    } catch (error) {
        console.error("Personel Ekleme Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" })
    }
}

const deleteEmployee = async (req, res) => {
    const { id } = req.params;

    try {

        const pool = await poolPromise;
        const checkEmployee = await pool.request()
            .input("id", sql.Int, id)
            .query("SELECT id FROM Employees WHERE id = @id");

        if (checkEmployee.length === 0) {
            return res.status(404).json({ message: "Personel Bulunamadı..." });
        }

        await pool.request()
            .input("id", sql.Int, id)
            .query("DELETE FROM Employees WHERE id = @id");

        const newEmployees = await pool.request()
            .query("SELECT * FROM Employees");

        res.status(200).json({
            message: "Personel Başarıyla Silindi...",
            newEmployees: newEmployees.recordset
        })
    } catch (error) {
        console.error("API Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" })
    }
}

module.exports = {
    getAllEmployees,
    login,
    addNewEmployee,
    deleteEmployee
}