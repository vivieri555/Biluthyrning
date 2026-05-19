const loggInForm = document.getElementById("loggInForm"); 
const usernameInput = document.getElementById("username"); 
const passwordInput = document.getElementById("password"); 
const validationLoggIn = document.getElementById("validationLoggIn"); 
let loggInAttempts = 0; 
const password = "user";
const username = "user";

const basicAuth = btoa(`${username}:${password}`);

let headers = new Headers(); 
headers.append('Access-Control-Allow-Origin', 'http://localhost:8080'); 
headers.append('Access-Control-Allow-Methods', 'GET'); 
headers.append('Access-Control-Allow-Headers', 'Authorization'); 
headers.append('Authorization', `Basic ${basicAuth}`); 

loggInForm.addEventListener("submit", function(event) {
    event.preventDefault();
    validationLoggIn.textContent = "";

    if (usernameInput.value === username && passwordInput.value === password) {
        validationLoggIn.textContent = "Inloggning lyckades!";
        validationLoggIn.style.color = "green";
        loggInAttempts = 0;
        logEvent("Användaren har loggat in.");
    } else {
        loggInAttempts++;
        if (loggInAttempts < 3) {
    validationLoggIn.textContent = `Felaktigt användarnamn eller lösenord. Försök igen. (${loggInAttempts} av 3 försök)`;
        validationLoggIn.style.color = "red";
         logEvent(`Misslyckat inloggningsförsök ${loggInAttempts}.`);
        passwordInput.value = "";
        }
        else {
            validationLoggIn.textContent = "För många misslyckade försök. Försök igen senare.";
            logEvent("Användaren har låsts ute efter 3 misslyckade inloggningsförsök.");
        }
        
    }
});

function logEvent(message) {
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] ${message}`);
}

//Måste hämta data från backend för att kunna logga in, så denna funktion är inte klar än.

function getLogIn() {
    const url = "http://127.0.0.1:5500/v1/auth/login";
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