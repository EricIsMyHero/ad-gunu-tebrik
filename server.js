import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // frontend fayllar üçün

// MongoDB qoşulması
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB-ə qoşuldu"))
  .catch(err => console.error("❌ MongoDB xətası:", err));

// Mongoose Schema
const birthdaySchema = new mongoose.Schema({
    userId: String,   // Hər istifadəçi üçün
    name: String,
    date: String
});

const Birthday = mongoose.model("Birthday", birthdaySchema);

// GET /api/birthdays – yalnız istifadəçinin ad günləri
app.get("/api/birthdays", async (req, res) => {
    try {
        const { userId } = req.query;
        const birthdays = await Birthday.find({ userId });
        res.json(birthdays);
    } catch (err) {
        res.status(500).json({ error: "Server xətası" });
    }
});

// POST /api/birthdays – yeni ad günü əlavə et
app.post("/api/birthdays", async (req, res) => {
    try {
        const { name, date, userId } = req.body;
        if (!name || !date || !userId) return res.status(400).json({ error: "Ad, tarix və istifadəçi tələb olunur" });

        const newBirthday = new Birthday({ name, date, userId });
        await newBirthday.save();
        res.status(201).json({ success: true, birthday: newBirthday });
    } catch (err) {
        res.status(500).json({ error: "Server xətası" });
    }
});

// Mongoose Schema dəyişir
const birthdaySchema = new mongoose.Schema({
    name: String,
    date: String,
    userId: String
});
