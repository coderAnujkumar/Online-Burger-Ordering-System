const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 5500;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// File paths
const ordersFile = path.join(__dirname, "orders.json");
const usersFile = path.join(__dirname, "users.json");

// Utility function to read JSON
function readJSON(file){
    if(!fs.existsSync(file)) return [];
    const data = fs.readFileSync(file, "utf8");
    try { return JSON.parse(data); } 
    catch(err){ return []; }
}

// Utility function to save JSON
function saveJSON(file, data){
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ------------------- LOGIN & REGISTER -------------------
app.post("/api/register", (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({ message: "Email and password required" });

    let users = readJSON(usersFile);
    if(users.find(u => u.email === email)) return res.status(400).json({ message: "User already exists" });

    const hashed = bcrypt.hashSync(password, 8);
    users.push({ email, password: hashed });
    saveJSON(usersFile, users);

    res.json({ message: "Registered successfully" });
});

app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({ message: "Email and password required" });

    let users = readJSON(usersFile);
    const user = users.find(u => u.email === email);
    if(!user) return res.status(400).json({ message: "User not found" });

    if(!bcrypt.compareSync(password, user.password)) return res.status(400).json({ message: "Invalid password" });

    res.json({ message: "Login successful" });
});

// ------------------- ORDERS -------------------
app.post("/api/orders", (req, res) => {
    const order = req.body;
    if(!order || !order.user) return res.status(400).json({ message: "Invalid order data" });

    const orders = readJSON(ordersFile);
    order.id = Date.now();
    orders.push(order);
    saveJSON(ordersFile, orders);

    console.log("✅ Order saved:", order.id);
    res.json({ message: "Order placed successfully!" });
});

app.get("/api/orders", (req, res) => {
    const orders = readJSON(ordersFile);
    res.json(orders);
});

// ------------------- START SERVER -------------------
// app.listen(PORT, () => {
//     console.log(`✅ Server running on http://localhost:${PORT}`);
// });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});
