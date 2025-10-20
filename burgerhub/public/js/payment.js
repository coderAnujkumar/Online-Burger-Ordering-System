document.getElementById("paymentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;
  const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || "Not selected";

  const burgers = JSON.parse(localStorage.getItem("burgers")) || [];
  const addons = JSON.parse(localStorage.getItem("addons")) || [];
  const total = localStorage.getItem("total") || 0;

  if(burgers.length === 0 && addons.length === 0){
      return alert("Your cart is empty!");
  }

  const order = {
      user: { name, email, address },
      items: burgers,
      addons,
      total,
      paymentMethod
  };

  try {
      const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order)
      });

      const data = await res.json();
      if(res.ok){
          alert("Order placed successfully!");
          localStorage.clear();
          window.location.href = "thankyou.html";
      } else {
          alert("Failed to place order: " + data.message);
      }
  } catch(err){
      console.error(err);
      alert("Error placing order!");
  }
});
