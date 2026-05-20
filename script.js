const loggInForm = document.getElementById("loggInForm"); 
const usernameInput = document.getElementById("username"); 
const passwordInput = document.getElementById("password"); 
const validationLoggIn = document.getElementById("validationLoggIn"); 
let loggInAttempts = 0; 
const password = "user";
const username = "user";

function logEvent(message) {
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] ${message}`);
}

loggInForm.addEventListener("submit", function(event) {
    event.preventDefault();
    validationLoggIn.textContent = "";
    postLogIn();
});

const basicAuth = btoa('${username}:${password}'); //koda användarnamn och lösenord i Base64 

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
headersPost.append("Content-Type", "application/json");
headersPost.append("Accept", "application/json");

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

const loggInForm = document.getElementById("loggInForm");
loggInForm.style.display = "none";
navContainer.style.display = "none";
const isAdmin = data.isAdmin;
if (isAdmin === true) {
    console.log(data);   //Kolla vad som kommer
    document.getElementById("adminNav").classList.remove("hidden");
    document.getElementById("header1").classList.add("hidden");
    //document.getElementById("userMenu").classList.add("hidden");     //Ändra till användarmenyn
}
else {
    document.getElementById("adminNav").classList.add("hidden");
    //document.getElementById("userMenu").classList.remove("hidden");  
}
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

const getAllUsersLink = document.querySelector('a[href="#getAllUsers"]');
if (getAllUsersLink) {
    getAllUsersLink.addEventListener("click", function(event) {
        event.preventDefault();
        
        const targetDiv = document.getElementById("getAllUsers");
        if (targetDiv) {
            targetDiv.classList.remove("hidden");
        }
        document.getElementById("myDropdown").classList.remove("show");
    });
}

//Funktion för dropdownmenyn i adminpanelen
const dropAdminBtn = document.getElementById("dropAdminBtn");
if (dropAdminBtn) {
    dropAdminBtn.onclick = function(event) {
        document.getElementById("myDropdown").classList.toggle("show"); 
        event.stopPropagation();
    };
}
/* toggla mellan att visa o ta bort menyn visuellt */ 
window.onclick = function(event) { 

  if (!event.target.matches('.dropAdminBtn')) { 
    var dropdowns = document.getElementsByClassName("dropdown-content"); 
    var i; 
    for (i = 0; i < dropdowns.length; i++) { 
      var openDropdown = dropdowns[i]; 
      if (openDropdown.classList.contains('show')) { 
        openDropdown.classList.remove('show'); 
      } 
    } 
  } 
} 
//Anrop till hämtning av användare
const getAllUsersBtn = document.getElementById("getAllUsersBtn");
if (getAllUsersBtn) {
    getAllUsersBtn.addEventListener("click", function() {
        getAllUsers();
    });
}

//Hämta alla användare, ADMIN o user
function getAllUsers() {
    const url = "http://localhost:8080/api/v1/users";
fetch(url, {
    method: "GET",
    mode: "cors",
    credentials: "include"
})
.then((response) => {   
    if (!response.ok) throw new Error("Något gick fel med att hämta användare");
    return response.json();
})
.then((users) => {
    const userList = document.getElementById("userList");
    userList.innerHTML = "";
    users.forEach((user) => {
        const li = document.createElement("li");
        li.textContent = `${user.firstName} ${user.lastName} - ${user.email} - ${user.username} - ${user.no_of_orders}`;
        userList.appendChild(li);
    });
})
.catch((error) => {
    console.error("Error:", error);
});
}