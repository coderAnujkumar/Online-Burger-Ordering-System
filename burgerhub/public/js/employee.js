

// fetchMenu();
const user = JSON.parse(localStorage.getItem("bh_user") || "null");
if (!user || user.role !== "employee") {
  alert("Please login as employee");
  location.href = "/";
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("bh_user");
  location.href = "/";
});

async function fetchMenu() {
  const res = await fetch("/api/burgers");
  const data = await res.json();
  if (!data.ok) return;
  const list = document.getElementById("menuList");
  list.innerHTML = "";
  data.burgers.forEach((b) => {
    const el = document.createElement("div");
    el.className = "burger";
    el.innerHTML = `
      <img src="${b.image}" alt="${b.name}" />
      <h4>${b.name} — ₹${b.price}</h4>
      <p class="muted">${b.description || ""}</p>
    `;
    list.appendChild(el);
  });
}

document.getElementById("addBurgerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  try {
    const res = await fetch("/api/burgers", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.message || "Failed");
    alert("Burger added successfully!");
    e.target.reset();
    fetchMenu();
  } catch (err) {
    alert("Error: " + err.message);
  }
});

fetchMenu();
