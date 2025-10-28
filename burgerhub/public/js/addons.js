// addons.js
const backBtn = document.getElementById("backBtn");
backBtn.addEventListener("click", () => {
  location.href = "/home.html";
});

const cart = JSON.parse(localStorage.getItem("bh_selected_cart") || "[]");
if (!cart.length) {
  alert("No burgers selected");
  location.href = "/home.html";
}

// define available add-ons (could be fetched from server later)
const availableAddons = [
  { id: "cheese", label: "Extra Cheese", price: 30 },
  { id: "patty", label: "Extra Patty", price: 80 },
  { id: "fries", label: "Fries", price: 60 },
  { id: "drink", label: "Soft Drink", price: 40 }
];

const list = document.getElementById("selectedBurgersList");
cart.forEach((item, idx) => {
  const wrapper = document.createElement("div");
  wrapper.className = "card";
  wrapper.style.marginBottom = "12px";
  wrapper.dataset.index = idx;
  let html = `<h4>${item.name} x ${item.qty} - ₹${item.price * item.qty}</h4><div class="muted">Choose add-ons</div>`;
  html += `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">`;
  availableAddons.forEach(a => {
    html += `
      <label style="border:1px solid #eee;padding:8px;border-radius:8px;display:flex;align-items:center;gap:8px">
        <input type="checkbox" data-addon-id="${a.id}" data-addon-price="${a.price}" />
        ${a.label} (+₹${a.price})
      </label>
    `;
  });
  html += `</div>`;
  wrapper.innerHTML = html;
  list.appendChild(wrapper);
});

// track selections
function computeTotal() {
  let total = 0;
  cart.forEach((item, idx) => {
    total += item.price * item.qty;
    const wrapper = document.querySelector(`[data-index="${idx}"]`);
    const checks = wrapper.querySelectorAll("input[type=checkbox]");
    item.addons = [];
    checks.forEach(ch => {
      if (ch.checked) {
        item.addons.push({ id: ch.dataset.addonId, price: Number(ch.dataset.addonPrice) });
        total += Number(ch.dataset.addonPrice);
      }
    });
  });
  document.getElementById("grandTotal").innerText = total;
}

document.querySelectorAll("input[type=checkbox]").forEach(ch => {
  ch.addEventListener("change", computeTotal);
});

computeTotal();

document.getElementById("toConfirmBtn").addEventListener("click", () => {
  // save cart with addons to a confirm key and go forward
  localStorage.setItem("bh_confirm_cart", JSON.stringify(cart));
  location.href = "/confirm.html";
});
