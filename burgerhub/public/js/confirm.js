// confirm.js
const confirmCart = JSON.parse(localStorage.getItem("bh_confirm_cart") || "[]");
if (!confirmCart.length) {
  alert("Nothing to confirm");
  location.href = "/home.html";
}

const summary = document.getElementById("summary");
let total = 0;
confirmCart.forEach(it => {
  const div = document.createElement("div");
  div.style.borderBottom = "1px dashed #eee";
  div.style.padding = "8px 0";
  let addonsHtml = "";
  if (it.addons && it.addons.length) {
    addonsHtml = `<div class="muted">Add-ons: ${it.addons.map(a => `${a.id} (+₹${a.price})`).join(", ")}</div>`;
  }
  const itemTotal = it.price * it.qty + (it.addons ? it.addons.reduce((s,a)=>s+a.price,0) : 0);
  total += itemTotal;
  div.innerHTML = `<strong>${it.name}</strong> x ${it.qty} — ₹${itemTotal}<br/>${addonsHtml}`;
  summary.appendChild(div);
});

const totalsEl = document.createElement("div");
totalsEl.style.marginTop = "12px";
totalsEl.innerHTML = `<h3>Total: ₹${total}</h3>`;
summary.appendChild(totalsEl);

document.getElementById("addMoreBtn").addEventListener("click", () => {
  // go back to home; keep cart in localStorage main key if desired
  location.href = "/home.html";
});

document.getElementById("proceedPaymentBtn").addEventListener("click", () => {
  // store total & move to payment
  localStorage.setItem("bh_checkout", JSON.stringify({ items: confirmCart, total }));
  location.href = "/payment.html";
});
