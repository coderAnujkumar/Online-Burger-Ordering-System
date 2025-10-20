let isRegister = false;

document.getElementById("toggleForm").addEventListener("click", e => {
    e.preventDefault();
    isRegister = !isRegister;
    document.getElementById("formTitle").textContent = isRegister ? "Register" : "Login";
    document.getElementById("loginBtn").textContent = isRegister ? "Register" : "Login";
});

document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!email || !password) return alert("Please fill in all fields!");

    const url = isRegister ? "/api/register" : "/api/login";

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        alert(data.message);

        if (res.ok && !isRegister) {
            // Successful login
            localStorage.setItem("user", JSON.stringify({ email }));
            window.location.href = "index.html";
        } else if (res.ok && isRegister) {
            // Successful registration
            isRegister = false;
            document.getElementById("formTitle").textContent = "Login";
            document.getElementById("loginBtn").textContent = "Login";
        }
    } catch (err) {
        console.error(err);
        alert("Server error. Try again.");
    }
});
