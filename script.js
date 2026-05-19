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