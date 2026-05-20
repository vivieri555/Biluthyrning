document.getElementById("createAccountForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("createUsername").value;
    const password = document.getElementById("createPassword").value;
    const first_name = document.querySelector("input[name='first_name']").value;
    const last_name = document.querySelector("input[name='last_name']").value;
    const phone = document.querySelector("input[name='phone']").value;
    const email = document.querySelector("input[name='email']").value;
    const no_of_orders = 0;
    const role = document.querySelector("input[name='role']").value;
    const createMsg = document.getElementById("createMsg");
    createMsg.textContent = "";

    const newUser = {
        username: username,
        password: password,
        firstName: first_name,
        lastName: last_name,
        phone: phone,
        email: email,
        noOfOrders: no_of_orders,
        role: role
    }
    fetch("http://localhost:8080/api/v1/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
        credentials: "include"
})
.then(function(response) {
    if (response === 204 || response.headers.get("Content-Type") === "0") {
             return { status: response.ok, data: {} };
         }
    return response.json().then(function(data) {
        return  { status: response.ok, data: data };
    });
})
.then(function(result) {
    if (result.status) {
        alert("Konto sparat!");
        document.getElementById("createAccountForm").reset();
    } else {
        createMsg.textContent = result.data.message || "Misslyckades att spara konto.";
    }
})
.catch(function(error) {
    console.error("Error:", error);
    createMsg.textContent = "Ett fel inträffade. Försök igen senare.";
});
}
);