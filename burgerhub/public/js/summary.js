const summaryContainer = document.getElementById("summaryContainer");
let burgers = JSON.parse(localStorage.getItem("burgers")) || [];
let addons = JSON.parse(localStorage.getItem("addons")) || [];
let total = 0;

summaryContainer.innerHTML = "<h2>Burgers:</h2>";
burgers.forEach(b => {
    const subtotal = b.price * b.quantity;
    total += subtotal;
    const p = document.createElement("p");
    p.textContent = `${b.name} × ${b.quantity} = ₹${subtotal}`;
    summaryContainer.appendChild(p);
});

summaryContainer.innerHTML += "<h2>Add-ons:</h2>";
addons.forEach(a => {
    const subtotal = a.price * a.quantity;
    total += subtotal;
    const p = document.createElement("p");
    p.textContent = `${a.name} × ${a.quantity} = ₹${subtotal}`;
    summaryContainer.appendChild(p);
});

const totalLine = document.createElement("h2");
totalLine.textContent = `Total: ₹${total}`;
summaryContainer.appendChild(totalLine);

localStorage.setItem("total", total);

document.getElementById("proceedPayment").addEventListener("click", () => {
    window.location.href = "payment.html";
});


