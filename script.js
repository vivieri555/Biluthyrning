const loggInForm = document.getElementById("loggInForm"); 
const usernameInput = document.getElementById("username"); 
const passwordInput = document.getElementById("password"); 
const validationLoggIn = document.getElementById("validationLoggIn"); 
let loggInAttempts = 0; 
const password = "user";
const username = "user";

function hideAllSections() {
    const sections = ["loggInDiv", "createAccount", "getAllUsers", "updatePutUser", "deleteUser", "getUser"];
    sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.classList.add("hidden");
    });
}

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
        hideAllSections();
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

const updateUserBtn = document.getElementById("updateUserBtn");
updateUserBtn.addEventListener("click", function(event) {
    event.preventDefault();
    putUser();
});

let headPut = new Headers();
headPut.append("Content-Type", "application/json");
headPut.append("Accept", "application/json");


function putUser() {
const fields = {
        "updateUserId": "Användar-ID",
        "updateFirstName": "Förnamn",
        "updateLastName": "Efternamn",
        "updatePhone": "Telefonnummer",
        "updateEmail": "E-post",
        "updateRole": "Roll",
        "updatePassword": "Lösenord",
        "updateUsername": "Användarnamn",
        "updateMsg": "Meddelande"
    };

    // Loopa igenom och varna om något saknas i HTML
    for (let id in fields) {
        if (!document.getElementById(id)) {
            console.error(`FELSÖKNING: Elementet med id="${id}" (${fields[id]}) saknas helt i din HTML-kod!`);
        }
    }

    // Om något saknas använder vi ?.value så att koden inte kraschar med rött fel
    const userId = document.getElementById("updateUserId")?.value || "";
    const first_name = document.getElementById("updateFirstName")?.value || "";
    const last_name = document.getElementById("updateLastName")?.value || "";
    const phone = document.getElementById("updatePhone")?.value || "";
    const email = document.getElementById("updateEmail")?.value || "";
    const role = document.getElementById("updateRole")?.value || "";
    const updatePassword = document.getElementById("updatePassword")?.value || "";
    const updateUsername = document.getElementById("updateUsername")?.value || "";
    const updateMsg = document.getElementById("updateMsg");

    if (updateMsg) updateMsg.textContent = "";


 if (!userId) {
    if (updateMsg) {
        updateMsg.textContent = "Ange ett giltigt användar-ID.";
        updateMsg.style.color = "red";
        }
        return;
}
const updateData = {
    firstName: first_name,
    lastName: last_name,
    phone: phone,
    email: email,
    role: role,
    username: updateUsername,
    password: updatePassword
};
   
     const url = `http://localhost:8080/api/v1/users/${userId}`;
fetch(url, {
    method: "PUT",
    headers: headPut,
    body: JSON.stringify(updateData),
    mode: "cors",
    credentials: "include"
})
.then((response) => {
    if (!response.ok) throw new Error("Gick inte att uppdatera");
    return response.json();
})
.then((data) => {
    if (updateMsg) {
        updateMsg.style.color = "green";
        updateMsg.textContent = "Användaren har uppdaterats i databasen!";
        document.getElementById("updatePutUserForm").reset();
    }
    console.log("Uppdatering lyckades:", data);
})
.catch((error) => {
    console.error("Error:", error);
    updateMsg.textContent = "Ett fel inträffade. Försök igen senare.";
    updateMsg.style.color = "red";
});
}

const updateUser = document.querySelector('a[href="#updatePutUser"]');
if (updateUser) {
    updateUser.addEventListener("click", function(event) {
        event.preventDefault();
        hideAllSections();
        const targetDiv = document.getElementById("updatePutUser");
        if (targetDiv) {
            targetDiv.classList.remove("hidden");
        }
        document.getElementById("myDropdown").classList.remove("show");
    });
}

const deleteUserLink = document.querySelector('a[href="#deleteUser"]');
const deleteMsg = document.getElementById("deleteMsg");

if(deleteUserLink) {
    deleteUserLink.addEventListener("click", function(event) {
        event.preventDefault();
        hideAllSections();
        const targetDiv = document.getElementById("deleteUser");
        if (targetDiv) {
            targetDiv.classList.remove("hidden");
        }
        document.getElementById("myDropdown").classList.remove("show");
    });
}

let headDeleteUser = new Headers();
headDeleteUser.append("Content-Type", "application/json");
headDeleteUser.append("Accept", "application/json");

const deleteUserBtn = document.getElementById("deleteUserBtn");
if (deleteUserBtn){
    deleteUserBtn.addEventListener("click", function(event) {
event.preventDefault();
deleteUser();
    })
}


function deleteUser() {
let id = document.getElementById("deleteUserId").value;
const url = `http://localhost:8080/api/v1/users/${id}`;
fetch(url, {
    method: "DELETE",
    headers: headDeleteUser,
    credentials: "include"
})
.then((response) => {
    if (!response.ok) throw new Error("Gick inte att ta bort användare");
    const data = response.text();
    if (data === null) throw new Error("Inget returnerades");
    deleteMsg.innerHTML = JSON.stringify(data);
    deleteMsg.style.color = "green";
    deleteMsg.textContent = "Användaren har tagits bort!";
    document.getElementById("deleteUserForm").reset();
    
})
.catch((error) => {
    console.error("Error:", error);
    deleteMsg.textContent = "Gick inte att radera. Försök igen senare.";
    deleteMsg.style.color = "red";
});
}


//Hämta en specifik användare
const getUserLink = document.querySelector('a[href="#getUser"]'); 

if (getUserLink) { 
    getUserLink.addEventListener("click", function(event) { 
        event.preventDefault(); 
        hideAllSections(); 

        const targetDiv = document.getElementById("getUser"); 
        if (targetDiv) { 
            targetDiv.classList.remove("hidden"); 
        } 
        document.getElementById("myDropdown").classList.remove("show"); 
    }); 
} 

const getUserBtn = document.getElementById("getUserBtn"); 

if (getUserBtn) { 
    getUserBtn.addEventListener("click", function(event) { 
        event.preventDefault();
        getUser(); 
    }); 
} 

 
function getUser() { 
const getUserId = document.getElementById("getUserId").value;
const getUserMsg = document.getElementById("getUserMsg");
const url = `http://localhost:8080/api/v1/users/${getUserId}`; 
const userData = {
    id: getUserId
}

fetch(url, { 
    method: "GET", 
    mode: "cors", 
    credentials: "include"
}) 
.then((response) => {    
    if (!response.ok) throw new Error("Något gick fel med att hämta användare"); 
    return response.json(); 
}) 
.then((user) => { 
   getUserMsg.textContent = `Användare: ${user.username} - ${user.firstName} ${user.lastName} - 
   ${user.email} - ${user.phone} - ${user.role}`;
   document.getElementById("getUserForm").reset();
}) 
.catch((error) => { 
    console.error("Error:", error); 
}); 
} 

const loginLink = document.querySelector('a[href="#loggInDiv"]');
if (loginLink) {
    loginLink.addEventListener("click", function(event) {
        event.preventDefault();
        hideAllSections();
        
        const loggInDiv = document.getElementById("loggInDiv");
        if (loggInDiv) {
            loggInDiv.classList.remove("hidden"); // Visa inloggningen
        }
    });
}

const createAccountLink = document.querySelector('a[href="#createAccount"]');
if (createAccountLink) {
    createAccountLink.addEventListener("click", function(event) {
        event.preventDefault();
        hideAllSections();
        const createDiv = document.getElementById("createAccount");
        if(createDiv) {
            createDiv.classList.remove("hidden");
        }
    });
}