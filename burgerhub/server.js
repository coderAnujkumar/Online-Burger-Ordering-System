// server.js
import express from "express";
import path from "path";
import fs from "fs-extra";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// ---------------------- FILE PATHS ----------------------
const DATA_DIR = path.join(__dirname, "public", "data");
const IMAGES_DIR = path.join(__dirname, "public", "images");
const BURGERS_FILE = path.join(DATA_DIR, "burgers.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");

// ---------------------- INITIAL SETUP ----------------------
fs.ensureDirSync(DATA_DIR);
fs.ensureDirSync(IMAGES_DIR);

if (!fs.existsSync(BURGERS_FILE)) {
  fs.writeJsonSync(
    BURGERS_FILE,
    [
      {
        id: 1,
        name: "Classic Burger",
        description: "Juicy beef patty, lettuce, tomato, special sauce.",
        price: 199,
        image: "/images/burger1.jpg",
      },
      {
        id: 2,
        name: "Cheese Lover",
        description: "Double cheese, pickles and house sauce.",
        price: 249,
        image: "/images/burger1.jpg",
      },
    ],
    { spaces: 2 }
  );
}

if (!fs.existsSync(ORDERS_FILE)) fs.writeJsonSync(ORDERS_FILE, [], { spaces: 2 });

if (!fs.existsSync(USERS_FILE)) {
  fs.writeJsonSync(
    USERS_FILE,
    [
      { email: "employee@burgerhub.com", password: "employee123", role: "employee", name: "Employee" },
      { email: "customer@burgerhub.com", password: "customer123", role: "customer", name: "Customer" },
    ],
    { spaces: 2 }
  );
}

// ---------------------- MULTER SETUP ----------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, IMAGES_DIR),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ---------------------- API ROUTES ----------------------

// 🧩 REGISTER NEW USER
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password || !role) {
      return res.status(400).json({ ok: false, message: "All fields are required" });
    }

    const users = await fs.readJson(USERS_FILE);
    if (users.find((u) => u.email === email)) {
      return res.status(400).json({ ok: false, message: "Email already registered" });
    }

    const newUser = { name, email, password, role };
    users.push(newUser);
    await fs.writeJson(USERS_FILE, users, { spaces: 2 });

    res.json({ ok: true, user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Failed to register user" });
  }
});

// 🔐 LOGIN USER
app.post("/api/login", async (req, res) => {
  try {
    const { email, password, role } = req.body || {};
    if (!email || !password || !role) {
      return res.status(400).json({ ok: false, message: "email, password and role required" });
    }

    const users = await fs.readJson(USERS_FILE);
    const found = users.find((u) => u.email === email && u.password === password && u.role === role);

    if (!found) return res.status(401).json({ ok: false, message: "Invalid credentials" });

    res.json({ ok: true, user: { email: found.email, role: found.role, name: found.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Login failed" });
  }
});

// 🍔 GET BURGERS
app.get("/api/burgers", async (req, res) => {
  try {
    const burgers = await fs.readJson(BURGERS_FILE);
    res.json({ ok: true, burgers });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Failed to read burgers" });
  }
});

// 🍔 ADD BURGER WITH IMAGE (EMPLOYEE)
app.post("/api/burgers", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name || !price)
      return res.status(400).json({ ok: false, message: "name and price required" });

    const burgers = await fs.readJson(BURGERS_FILE);
    const id = burgers.length ? Math.max(...burgers.map((b) => b.id)) + 1 : 1;

    const newBurger = {
      id,
      name,
      description: description || "",
      price: Number(price),
      image: req.file ? `/images/${req.file.filename}` : "/images/burger1.jpg",
    };

    burgers.push(newBurger);
    await fs.writeJson(BURGERS_FILE, burgers, { spaces: 2 });
    res.json({ ok: true, burger: newBurger });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Failed to add burger" });
  }
});

// 🧾 PLACE ORDER
app.post("/api/orders", async (req, res) => {
  try {
    const order = req.body;
    if (!order || !order.items || !Array.isArray(order.items) || order.items.length === 0) {
      return res.status(400).json({ ok: false, message: "Order items required" });
    }

    const orders = await fs.readJson(ORDERS_FILE);
    const id = orders.length ? Math.max(...orders.map((o) => o.id)) + 1 : 1;
    const timestamp = new Date().toISOString();

    const newOrder = { id, timestamp, ...order };
    orders.push(newOrder);
    await fs.writeJson(ORDERS_FILE, orders, { spaces: 2 });

    res.json({ ok: true, order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Failed to save order" });
  }
});

// 🧾 GET ALL ORDERS
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await fs.readJson(ORDERS_FILE);
    res.json({ ok: true, orders });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Failed to read orders" });
  }
});

// Serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// app.listen(PORT, () => {
//   console.log(`✅ Server running at http://localhost:${PORT}`);
// });

app.listen(3000, '0.0.0.0', () => console.log('listening on 3000'))
