const express = require("express");
const dotenv = require("dotenv");
const { initBot } = require("./config/bot");
const path = require("path");
const whatsappRoutes = require("./routes/whatsapp.routes");
const cors = require("cors"); // 👈 Importar cors

dotenv.config();

const app = express();
const port = process.env.HOST_PUERTO || 7000;

// Habilitar CORS para permitir peticiones desde el frontend (localhost:3000)
app.use(cors({
  origin: "http://localhost:5173", // solo tu frontend
  methods: ["GET", "POST"], // los métodos que vas a usar
  allowedHeaders: ["Content-Type"] // cabeceras permitidas
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use("/whatsapp", whatsappRoutes);

app.listen(port, async () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  await initBot();
});
