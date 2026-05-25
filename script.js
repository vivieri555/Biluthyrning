const loggInForm = document.getElementById("loggInForm"); 
const usernameInput = document.getElementById("username"); 
const passwordInput = document.getElementById("password"); 
const validationLoggIn = document.getElementById("validationLoggIn"); 
let loggInAttempts = 0; 
const password = "user";
const username = "user";

function hideAllSections() {
    const sections = ["loggInDiv", "createAccount", "getAllUsers", "updatePutUser", 
        "deleteUser", "getUser", "getAllCars", "getACar", "deleteCar",
    "createCarDiv"];
    sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.classList.add("hidden");
    });
}

function logEvent(message) {
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] ${message}`);
}
//Skapa konto
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

loggInForm.addEventListener("submit", function(event) {
    event.preventDefault();
    validationLoggIn.textContent = "";
    postLogIn();
});

const basicAuth = btoa('${username}:${password}'); //koda användarnamn och lösenord i Base64 


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
//toggla mellan att visa o ta bort menyn visuellt
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
            loggInDiv.classList.remove("hidden");
            document.getElementById("startPage").classList.add("hidden");
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
            document.getElementById("startPage").classList.add("hidden");
        }
    });
}

//Länk för att komma tillbaka till startsidan, funkar inte än
//KOLLA SEN
const logoLink = document.querySelector('a[href="#logoLogIn"]');

if (logoLink) {
    logoLink.addEventListener("click", function(event) {
        event.preventDefault();
        hideAllSections();
        
        const startPage = document.getElementById("startPage");
        if (startPage) {
            startPage.classList.remove("hidden");
        }
    });
}
//skapa ny bil länk i admin
const createCarDivLink = document.querySelector(`a[href="#createCarDiv"]`);
if (createCarDivLink) {
    createCarDivLink.addEventListener("click", function(event) {
        event.preventDefault();
        hideAllSections();
        const targetDiv = document.getElementById("createCarDiv");
        if (targetDiv) {
            targetDiv.classList.remove("hidden");
        }
        document.getElementById("CarAdminDivDrop").classList.remove("show");
    });
}

//Skapa ny bil

document.getElementById("createCarForm").addEventListener("submit", function(event) { 
    event.preventDefault(); 

const carName = document.getElementById("carName").value;
const model = document.getElementById("model").value;
const feature1 = document.getElementById("feature1").value;
const feature2 = document.getElementById("feature2").value;
const feature3 = document.getElementById("feature3").value;
const type = document.getElementById("type").value;
const price = document.getElementById("price").value;
const booked = document.getElementById("booked").checked;

    const formData = new FormData();
    const priceValue = parseFloat(price) || 0.0;
     const bookedValue = (booked === true || booked === "true");
    formData.append("name", carName);
    formData.append("model", model);
    formData.append("feature1", feature1);
    formData.append("feature2", feature2);
    formData.append("feature3", feature3);
    formData.append("type", type);
    formData.append("price", price);
    formData.append("booked", booked);
    
    const imageInput = document.getElementById("carImage");

    if (imageInput.files.length > 0) {
    formData.append("image", imageInput.files[0]); 
}

    const createCarMsg = document.getElementById("createCarMsg");
    createCarMsg.textContent = "";

    const url = "http://localhost:8080/api/v1/cars";
    
    fetch(url, {
        method: "POST",
        body: formData,
        credentials: "include"
    })
    .then((response) => {
if (response === 204 || response.headers.get("Content-Type") === "0") {
    return { status: response.ok, data: {} };
}
return response.json().then((data) => {
    return { status: response.ok, data: data };
});
    })
    .then((result) => {
        if (result.status) {
            alert("Bilen har lagts till i systemet!");
            document.getElementById("createCarForm").reset();
        } else {
            createCarMsg.textContent = result.data.message || "Misslyckades att lägga till bilen.";
        }
    })
    .catch((error) => {
        console.error("Error:", error);
        createCarMsg.textContent = "Ett fel inträffade. Försök igen senare.";
    })
    });

    //Hämta bil för alla
    let headersCarGet = new Headers();
     headersCarGet.append("Content-Type", "application/json");
     headersCarGet.append("Accept", "application/json");

    function getCars() {
        const url = "http://localhost:8080/api/v1/cars";

        fetch(url, {
        method: "GET",
        headers: headersCarGet
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Serverfel: ${response.status}`);
        }
        return response.json();
    })
    .then((cars) => {
        const carList = document.getElementById("carList");
        carList.innerHTML = "";

        cars.forEach((car) => { 
            const li = document.createElement("li"); 
            li.textContent = `${car.name}, ${car.model}, ${car.feature1}, ${car.feature2}, 
            ${car.feature3}, ${car.type}, ${car.price}. ID: ${car.id}`;
            carList.appendChild(li);
        });
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}

const getAllCarsLink = document.querySelectorAll('a[href=".getAllCars"]');

getAllCarsLink.forEach(function(link) {
    link.addEventListener("click", function(event) {
        event.preventDefault(); 
        hideAllSections();
        
        const targetDiv = document.querySelector(".getAllCars");
        if (targetDiv) { 
            targetDiv.classList.remove("hidden"); 
        }
        
        const dropdown = document.getElementById("myDropdown");
        if (dropdown) {
            dropdown.classList.remove("show");
        }
       
        getCars(); 
    });
});
const deleteCarLink = document.querySelector(`a[href="#deleteCar"]`);
if(deleteCarLink) {
    deleteCarLink.addEventListener("click", (event) => {
        event.preventDefault();
        hideAllSections();
        const targetDiv = document.getElementById("deleteCar");
        if (targetDiv) {
            targetDiv.classList.remove("hidden");
        }
        document.getElementById("CarAdminDivDrop").classList.remove("show");
    });
}

const deleteCarBtn = document.getElementById("deleteCarBtn"); 

if (deleteCarBtn) { 
    deleteCarBtn.addEventListener("click", function(event) { 
        event.preventDefault();
        deleteCar(); 
    }); 
} 

let headersDelCar = new Headers();
headersDelCar.append("Content-Type", "application/json");
headersDelCar.append("Accept", "application/json");

//Radera bil metod
function deleteCar() {
    let id = document.getElementById("deleteCarId").value;
    const deleteCarMsg = document.getElementById("deleteCarMsg");
    const url = `http://localhost:8080/api/v1/cars/${id}`;
    fetch( url, {
        method: "DELETE",
        headers: headersDelCar,
        credentials: "include"
    })
    .then((response) => {
        if(!response.ok) throw new Error("Gick inte att ta bort bil");
        const data = response.text();
        if(data === null) throw new Error("Inget returneras");
        deleteCarMsg.textContent = "Bilen har tagits bort!"
        deleteCarMsg.style.color = "green";
        document.getElementById("deleteCarForm");
    })
    .catch((error) => {
        console.error("Error:", error);
        deleteCarMsg.textContent = "Gick inte att radera. Försök igen senare.";
        deleteCarMsg.style.color = "red";
         document.getElementById("deleteCarForm");
    });
}


//Hämta enskild bil
const getACarLink = document.querySelector(`a[href="#getACar"]`);
if (getACarLink) {
    getACarLink.addEventListener("click", function(event) {
        event.preventDefault();
        hideAllSections();
        const targetDiv = document.getElementById("getACar");
        if (targetDiv) {
            targetDiv.classList.remove("hidden");
        }
        document.getElementById("CarAdminDivDrop").classList.remove("show");
    });
}

const getACarBtn = document.getElementById("getACarBtn");
if(getACarBtn) {
    getACarBtn.addEventListener("click", (event) => {
        event.preventDefault();
        getACar();
});
}

function getACar() {
    const carId = document.getElementById("getACarId").value;
const getACarMsg = document.getElementById("getACarMsg");
const url = `http://localhost:8080/api/v1/cars/${carId}`;
const data = {
    id: carId
}

fetch(url, {
    method: "GET",
    credentials: "include"
})
.then((response) => {
    if(!response.ok) throw new Error("Fel vid hämtning av bil");
    return response.json();
})
.then((car) => {
    getACarMsg.textContent = `Bilen: ${car.name}, ${car.brand}, ${car.feature1}, ${car.feature2}, 
            ${car.feature3}, ${car.type}, ${car.price}. ID: ${car.id}`;
            document.getElementById("getACarForm").reset();
})
.catch((error) => {
    console.error("Fel:", error);
    document.getElementById("getACarForm").reset();
});
}

//Funktion för bil dropdownmenyn i adminpanelen 
const carAdminBtn = document.getElementById("carAdminBtn"); 
if (carAdminBtn) { 
    carAdminBtn.onclick = function(event) { 
        document.getElementById("CarAdminDivDrop").classList.toggle("show");  
        event.stopPropagation(); 
    }; 
}  

//toggla mellan att visa o ta bort menyn visuellt 
window.onclick = function(event) {  
  if (!event.target.matches('#carAdminBtn')) {  
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