// home.js
const userHome = JSON.parse(localStorage.getItem("bh_user") || "null");
if (!userHome || userHome.role !== "customer") {
  // allow guest? but per design ask to login as customer
  alert("Please login as customer");
  location.href = "/";
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("bh_user");
  location.href = "/";
});

const cartKey = "bh_cart";
function getCart() { return JSON.parse(localStorage.getItem(cartKey) || "[]"); }
function setCart(c) { localStorage.setItem(cartKey, JSON.stringify(c)); updateCartUI(); }

async function loadBurgers() {
  const res = await fetch("/api/burgers");
  const data = await res.json();
  if (!data.ok) return;
  const grid = document.getElementById("burgerGrid");
  grid.innerHTML = "";
  data.burgers.forEach(b => {
    const card = document.createElement("div");
    card.className = "card burger";
    card.innerHTML = `
      <img src="${b.image}" alt="${b.name}">
      <h4>${b.name} — ₹${b.price}</h4>
      <p class="muted">${b.description || ""}</p>
      <div style="display:flex;gap:8px;justify-content:space-between;align-items:center">
        <input type="number" min="1" value="1" id="qty-${b.id}" style="width:70px;padding:6px;border-radius:6px;border:1px solid #eee">
        <button data-id="${b.id}" data-name="${b.name}" data-price="${b.price}" data-image="${b.image}" class="addBtn">Add to Cart</button>
      </div>
    `;
    grid.appendChild(card);
  });

  document.querySelectorAll(".addBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const name = btn.dataset.name;
      const price = Number(btn.dataset.price);
      const image = btn.dataset.image;
      const qtyInput = document.getElementById(`qty-${id}`);
      const qty = Math.max(1, Number(qtyInput.value) || 1);
      const cart = getCart();
      // check if already present -> increment qty
      const existing = cart.find(c => c.id === id);
      if (existing) existing.qty += qty;
      else cart.push({ id, name, price, image, qty, addons: [] });
      setCart(cart);
    });
  });
}

function updateCartUI() {
  const cart = getCart();
  document.getElementById("cartCount").innerText = cart.reduce((s, i) => s + i.qty, 0);
  const panel = document.getElementById("cartItems");
  panel.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const el = document.createElement("div");
    el.style.borderBottom = "1px dashed #eee";
    el.style.padding = "8px 0";
    el.innerHTML = `
      <strong>${item.name}</strong> x ${item.qty}<br/>
      ₹${item.price} each
      <div style="margin-top:6px;">
        <button class="inc" data-id="${item.id}">+</button>
        <button class="dec" data-id="${item.id}">-</button>
        <button class="rm" data-id="${item.id}">Remove</button>
      </div>
    `;
    panel.appendChild(el);
    total += item.price * item.qty;
    if (item.addons && item.addons.length) {
      item.addons.forEach(a => {
        total += (a.price || 0) * (a.qty || 1);
      });
    }
  });
  document.getElementById("cartTotal").innerText = total;
  // attach buttons
  panel.querySelectorAll(".inc").forEach(b => b.addEventListener("click", () => {
    const id = Number(b.dataset.id);
    const cart = getCart();
    const it = cart.find(c => c.id === id); if (!it) return;
    it.qty++; setCart(cart);
  }));
  panel.querySelectorAll(".dec").forEach(b => b.addEventListener("click", () => {
    const id = Number(b.dataset.id);
    const cart = getCart();
    const it = cart.find(c => c.id === id); if (!it) return;
    it.qty = Math.max(1, it.qty - 1); setCart(cart);
  }));
  panel.querySelectorAll(".rm").forEach(b => b.addEventListener("click", () => {
    const id = Number(b.dataset.id);
    let cart = getCart();
    cart = cart.filter(c => c.id !== id);
    setCart(cart);
  }));
}

document.getElementById("cartBtn").addEventListener("click", () => {
  const panel = document.getElementById("cartPanel");
  panel.classList.toggle("open");
});

document.getElementById("continueAddonsBtn").addEventListener("click", () => {
  const cart = getCart();
  if (!cart.length) return alert("Cart is empty");
  // save selected cart to localStorage for addons page
  localStorage.setItem("bh_selected_cart", JSON.stringify(cart));
  location.href = "/addons.html";
});

loadBurgers();
updateCartUI();
