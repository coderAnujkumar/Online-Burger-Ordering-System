// const addons = [
//     { name: "Cheese", price: 40 },
//     { name: "French Fries", price: 60 },
//     { name: "Cold Drink", price: 50 },
//   ];
  
//   const addonList = document.getElementById("addonList");
//   let selectedAddons = [];
  
//   addons.forEach((a, index) => {
//     const card = document.createElement("div");
//     card.classList.add("card");
//     card.innerHTML = `
//       <h3>${a.name}</h3>
//       <p>₹${a.price}</p>
//       <button id="addon${index}">Add</button>
//       <span id="addonCount${index}">0</span>
//     `;
//     addonList.appendChild(card);
  
//     let count = 0;
//     document.getElementById(`addon${index}`).addEventListener("click", () => {
//       count++;
//       document.getElementById(`addonCount${index}`).textContent = count;
//       const existing = selectedAddons.find((x) => x.name === a.name);
//       if (existing) existing.quantity = count;
//       else selectedAddons.push({ name: a.name, price: a.price, quantity: count });
//       localStorage.setItem("addons", JSON.stringify(selectedAddons));
//     });
//   });
  
//   document.getElementById("continueAddons").addEventListener("click", () => {
//     window.location.href = "summary.html";
//   });
  

const addonsData = [
  { name: "Cheese", price: 40 },
  { name: "French Fries", price: 60 },
  { name: "Cold Drink", price: 50 },
];

const addonList = document.getElementById("addonList");
let addons = JSON.parse(localStorage.getItem("addons")) || [];

addonsData.forEach((a, i) => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
      <h3>${a.name}</h3>
      <p>₹${a.price}</p>
      <button id="addon${i}">Add</button>
      <span id="addonCount${i}">0</span>
  `;
  addonList.appendChild(card);

  let count = 0;
  document.getElementById(`addon${i}`).addEventListener("click", () => {
      count++;
      document.getElementById(`addonCount${i}`).textContent = count;
      const existing = addons.find(x => x.name === a.name);
      if (existing) existing.quantity = count;
      else addons.push({ name: a.name, price: a.price, quantity: count });
      localStorage.setItem("addons", JSON.stringify(addons));
  });
});

document.getElementById("continueAddons").addEventListener("click", () => {
  window.location.href = "cart.html";
});
