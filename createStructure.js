// createStructure.js
const fs = require("fs");
const path = require("path");

// ✅ Folder structure
const folders = [
  "burgerhub/public/css",
  "burgerhub/public/js",
];

// ✅ Files with basic content
const files = {
  "burgerhub/public/index.html": "<!-- index.html -->",
  "burgerhub/public/addons.html": "<!-- addons.html -->",
  "burgerhub/public/summary.html": "<!-- summary.html -->",
  "burgerhub/public/payment.html": "<!-- payment.html -->",
  "burgerhub/public/thankyou.html": "<!-- thankyou.html -->",

  "burgerhub/public/css/style.css": "/* style.css */",

  "burgerhub/public/js/main.js": "// main.js",
  "burgerhub/public/js/addons.js": "// addons.js",
  "burgerhub/public/js/summary.js": "// summary.js",
  "burgerhub/public/js/payment.js": "// payment.js",

  "burgerhub/server.js": "// Express server",
  "burgerhub/orders.json": "[]",
  "burgerhub/package.json": `{
  "name": "burgerhub",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}`,
  "burgerhub/README.md": "# BurgerHub Project\nAn online burger ordering website built with Node.js and Express."
};

// ✅ Create folders
folders.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log("📁 Created folder:", dir);
  }
});

// ✅ Create files
Object.entries(files).forEach(([filePath, content]) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log("📝 Created file:", filePath);
  }
});

console.log("\n✅ Project structure created successfully!");
