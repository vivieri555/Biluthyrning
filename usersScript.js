document.getElementById("createAccountForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const createUsername = document.getElementById("createUsername").value;
    const createPassword = document.getElementById("createPassword").value;

    const newUser = {
        username: createUsername,
        password: createPassword
    }
    fetch("http://localhost:8080/api/v1/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser)
})
.then(function(response) {
    return response.json().then(function(data) {
        return  { status: response.ok, data: data };
    });
})
.then(function(result) {
    if (result.status) {
        alert("Konto sparat!");
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