// payment.js
const checkout = JSON.parse(localStorage.getItem("bh_checkout") || "null");
if (!checkout) {
  alert("No checkout data");
  location.href = "/home.html";
}

document.querySelectorAll(".payBtn").forEach(b => {
  b.addEventListener("click", async () => {
    const method = b.dataset.method;
    // simulate payment step then save order
    document.getElementById("status").innerText = "Processing payment...";
    try {
      const orderPayload = {
        items: checkout.items,
        total: checkout.total,
        paymentMethod: method,
        customer: JSON.parse(localStorage.getItem("bh_user") || "null")
      };
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.message || "Failed");
      document.getElementById("status").innerHTML = `<strong>Order placed ✅</strong> — Order ID: ${data.order.id}`;
      // clear cart storage
      localStorage.removeItem("bh_cart");
      localStorage.removeItem("bh_selected_cart");
      localStorage.removeItem("bh_confirm_cart");
      localStorage.removeItem("bh_checkout");
    } catch (err) {
      document.getElementById("status").innerText = "Payment failed: " + err.message;
    }
  });
});
