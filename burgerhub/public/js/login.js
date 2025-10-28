// login.js
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password, role })
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.message || "Login failed");
    localStorage.setItem("bh_user", JSON.stringify(data.user));
    if (data.user.role === "employee") {
      location.href = "/employee.html";
    } else {
      location.href = "/home.html";
    }
  } catch (err) {
    alert("Login failed: " + err.message);
  }
});
