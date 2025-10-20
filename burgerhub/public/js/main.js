// Logout functionality
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user"); // Remove logged-in user
    window.location.href = "login.html"; // Redirect to login page
});

// Redirect to login if user is not logged in
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
    window.location.href = "login.html";
}
const burgersData = [
  { name: "Classic Burger", price: 120, img: "images/image2.jpg" },
  { name: "Cheese Burger", price: 150, img: "images/image3.jpg" },
  { name: "Veg Burger", price: 100, img: "images/image2.jpg" },
  { name: "Double Patty Burger", price: 180, img: "images/image3.jpg" },
];

const burgerList = document.getElementById("burgerList");
let burgers = JSON.parse(localStorage.getItem("burgers")) || [];

burgersData.forEach((b, i) => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
      <img src="${b.img}" alt="${b.name}">
      <h3>${b.name}</h3>
      <p>₹${b.price}</p>
      <button id="btn${i}">Add</button>
      <span id="count${i}">0</span>
  `;
  burgerList.appendChild(card);

  let count = 0;
  document.getElementById(`btn${i}`).addEventListener("click", () => {
      count++;
      document.getElementById(`count${i}`).textContent = count;
      const existing = burgers.find(x => x.name === b.name);
      if (existing) existing.quantity = count;
      else burgers.push({ name: b.name, price: b.price, quantity: count });
      localStorage.setItem("burgers", JSON.stringify(burgers));
  });
});

document.getElementById("continueBtn").addEventListener("click", () => {
  window.location.href = "addons.html";
});


