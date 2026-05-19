const loggInForm = document.getElementById("loggInForm"); 
const usernameInput = document.getElementById("username"); 
const passwordInput = document.getElementById("password"); 
const validationLoggIn = document.getElementById("validationLoggIn"); 
let loggInAttempts = 0; 
const password = "user";
const username = "user";



loggInForm.addEventListener("submit", function(event) {
    event.preventDefault();
    validationLoggIn.textContent = "";
    postLogIn();
});

function logEvent(message) {
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] ${message}`);
}

//Måste hämta data från backend för att kunna logga in, så denna funktion är inte klar än.
const basicAuth = btoa('${username}:${password}'); //koda användarnamn och lösenord i Base64 

console.log("basicAuth: " + basicAuth); 

function getLogIn() {
    const url = "http://localhost:8080/api/v1/auth/login";
    fetch(url,
        {
            method: "GET",
            headers: headers
        }
    ) .then((response) => {
        console.log(response.status);
        if (!response.ok) throw new Error("Något gick fel med valideringen");
        return response.json();
    })
    .then(data => {
        validationLoggIn.textContent = data[0].firstName;
    })
    .catch((error) => {
        console.error("Error:", error);
    })
}

let headersPost = new Headers(); 
//headersPost.append('Access-Control-Allow-Origin', 'http://localhost:8080'); 
//headersPost.append('Access-Control-Allow-Methods', 'POST'); 
//headersPost.append('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type'); 
headersPost.append("Content-Type", "application/json");
headersPost.append("Accept", "application/json");
//headersPost.append("Authorization", `Basic ${basicAuth}`); 

function postLogIn() {
const data = {
    username: usernameInput.value,
    password: passwordInput.value
}
const url = "http://localhost:8080/api/v1/auth/login";
fetch(url, {
    method: "POST",
    headers: headersPost,
    body: JSON.stringify(data),
    mode: "cors",
    credentials: "include"
})
.then((response) => {
    if (!response.ok) throw new Error("Felaktiga inloggningsuppgifter");
    return response.json();
})
.then(data => {
    validationLoggIn.textContent = "Inloggning lyckades!";
    validationLoggIn.style.color = "green";
    validationLoggIn.innerHTML = JSON.stringify(data);
    loggInAttempts = 0;
    logEvent("Användaren har loggat in.");
    //Ska man skicka användaren till en annan sida efter inloggning?
})
.catch((error) => {
    loggInAttempts++;
    if (loggInAttempts <3) {
    validationLoggIn.textContent = `Felaktigt användarnamn eller lösenord. Försök igen. (${loggInAttempts} av 3 försök)`;
    validationLoggIn.style.color = "red";
    logEvent(`Misslyckat inloggningsförsök ${loggInAttempts}.`);
    passwordInput.value = "";
    }
    else {
        validationLoggIn.textContent = "För många misslyckade försök. Försök igen senare.";
        logEvent("Användaren har låsts ute efter 3 misslyckade inloggningsförsök.");
    }
    console.error("Error:", error);
})
}