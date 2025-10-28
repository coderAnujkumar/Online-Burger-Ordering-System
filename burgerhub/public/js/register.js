// public/js/register.js
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value.trim();
  
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      });
  
      // ⛔ if route fails, we might get HTML (like DOCTYPE)
      const text = await res.text();
  
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server returned HTML instead of JSON. Check API route!");
      }
  
      if (data.ok) {
        alert("✅ Registration successful! You can now log in.");
        window.location.href = "index.html"; // redirect to login page
      } else {
        alert("⚠️ " + data.message);
      }
  
    } catch (err) {
      alert("❌ " + err.message);
      console.error(err);
    }
  });
  