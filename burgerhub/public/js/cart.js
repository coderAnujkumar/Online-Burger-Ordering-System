const cartContainer = document.getElementById("cartContainer");
const proceedBtn = document.getElementById("proceedCheckout");

let burgers = JSON.parse(localStorage.getItem("burgers")) || [];
let addons = JSON.parse(localStorage.getItem("addons")) || [];
let total = 0;

function renderCart() {
    cartContainer.innerHTML = "";
    total = 0;

    if(burgers.length === 0 && addons.length === 0){
        cartContainer.innerHTML = "<p>Your cart is empty!</p>";
        document.getElementById("cartTotal").textContent = "Total: ₹0";
        return;
    }

    if(burgers.length > 0){
        cartContainer.innerHTML += "<h2>Burgers:</h2>";
        burgers.forEach((b, i) => {
            const subtotal = b.price * b.quantity;
            total += subtotal;
            const div = document.createElement("div");
            div.innerHTML = `
                <p>${b.name} × ${b.quantity} = ₹${subtotal}</p>
                <button onclick="updateQuantity('burger', ${i}, -1)">-</button>
                <button onclick="updateQuantity('burger', ${i}, 1)">+</button>
            `;
            cartContainer.appendChild(div);
        });
    }

    if(addons.length > 0){
        cartContainer.innerHTML += "<h2>Add-ons:</h2>";
        addons.forEach((a, i) => {
            const subtotal = a.price * a.quantity;
            total += subtotal;
            const div = document.createElement("div");
            div.innerHTML = `
                <p>${a.name} × ${a.quantity} = ₹${subtotal}</p>
                <button onclick="updateQuantity('addon', ${i}, -1)">-</button>
                <button onclick="updateQuantity('addon', ${i}, 1)">+</button>
            `;
            cartContainer.appendChild(div);
        });
    }

    document.getElementById("cartTotal").textContent = `Total: ₹${total}`;
}

function updateQuantity(type, index, change){
    if(type === 'burger'){
        burgers[index].quantity += change;
        if(burgers[index].quantity <= 0) burgers.splice(index, 1);
        localStorage.setItem("burgers", JSON.stringify(burgers));
    } else {
        addons[index].quantity += change;
        if(addons[index].quantity <= 0) addons.splice(index, 1);
        localStorage.setItem("addons", JSON.stringify(addons));
    }
    renderCart();
}

renderCart();

proceedBtn.addEventListener("click", () => {
    localStorage.setItem("total", total);
    window.location.href = "summary.html";
});
