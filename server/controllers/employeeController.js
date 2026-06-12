const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const getAllEmployees = async (req, res) => {
    try {
        const result = await pool.query("SELECT id, username, role FROM Employees");

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Personel Bulunamadı..." });
        }

        res.json(result.rows);
    } catch (error) {
        console.error("API Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM Employees WHERE username = $1",
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Kullanıcı Adı Hatalı..." });
        }

        const employee = result.rows[0];

        let isMatch = false;
        if (employee.password.startsWith("$2a$") || employee.password.startsWith("$2b$") || employee.password.startsWith("$2y$")) {
            isMatch = await bcrypt.compare(password, employee.password);
        } else {
            isMatch = (password === employee.password);
        }

        if (!isMatch) {
            return res.status(404).json({ message: "Şifre Hatalı..." })
        }

        return res.json({
            message: "Giriş Başarılı!",
            employee: {
                id: employee.id,
                username: employee.username,
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
        const checkEmployee = await pool.query(
            "SELECT id FROM Employees WHERE username = $1",
            [username]
        );

        if (checkEmployee.rows.length > 0) {
            return res.status(400).json({ message: "Personel Zaten Mevcut" });;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO Employees (username, password, role) VALUES ($1, $2, $3)`,
            [username, hashedPassword, role]
        );

        const newEmployees = await pool.query("SELECT id, username, role FROM Employees");

        res.status(200).json({
            message: "Personel Eklendi...",
            newEmployees: newEmployees.rows
        })

    } catch (error) {
        console.error("Personel Ekleme Hatası: ", error);
        res.status(500).json({ message: "Sunucu Hatası" })
    }
}

const deleteEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        const checkEmployee = await pool.query(
            "SELECT id FROM Employees WHERE id = $1",
            [id]
        );

        if (checkEmployee.rows.length === 0) {
            return res.status(404).json({ message: "Personel Bulunamadı..." });
        }

        await pool.query(
            "DELETE FROM Employees WHERE id = $1",
            [id]
        );

        const newEmployees = await pool.query("SELECT * FROM Employees");

        res.status(200).json({
            message: "Personel Başarıyla Silindi...",
            newEmployees: newEmployees.rows
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