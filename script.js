const loggInForm = document.getElementById("loggInForm"); 
const usernameInput = document.getElementById("username"); 
const passwordInput = document.getElementById("password"); 
const validationLoggIn = document.getElementById("validationLoggIn"); 
let loggInAttempts = 0; 
const password = "user";
const username = "user";
const basicAuth = btoa('${username}:${password}'); //koda användarnamn och lösenord i Base64 

function hideAllSections() {
    const sections = ["loggInDiv", "createAccount", "createAccount2", "getAllUsers", "updatePutUser", 
        "deleteUser", "getUser", "getAllCars", "getACar", "deleteCar",
    "createCarDiv", "createBookingDiv", "bookBtn", "myBookings", "getACarUser", "getAllCarsUserLink"
, "updateCarDiv", "updateCar"];
    sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.classList.add("hidden");
    });
}
function logEvent(message) {
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] ${message}`);
}
//Skapa konto för vanlig user
document.getElementById("createAccountForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("createUsername").value;
    const password = document.getElementById("createPassword").value;
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const no_of_orders = 0;
    const role = "";
    const createMsg = document.getElementById("createMsg");
    createMsg.textContent = "";

    const newUser = {
        username: username,
        password: password,
        firstName: first_name,
        lastName: last_name,
        phone: phone,
        email: email,
        noOfOrders: 0,
        role: ""
    };

    sendUserToApi(newUser, "createAccountForm", createMsg);
});

function sendUserToApi(newUser, formId, messageElement) {
    const url = "http://localhost:8080/api/v1/users";
fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
        credentials: "include"
})
.then(function(response) {
    if (response.status === 204 || response.headers.get("Content-Type") === "0") {
             return { status: response.ok, data: {} };
         }
    return response.json().then(function(data) {
        return  { status: response.ok, data: data };
    });
})
.then(function(result) {
    if (result.status) {
        alert("Konto sparat!");
        document.getElementById(formId).reset();
    } else {
        messageElement.textContent = result.data.message || "Misslyckades att spara konto.";
    }
})
.catch(function(error) {
    console.error("Error:", error);
    messageElement.textContent = "Ett fel inträffade. Försök igen senare.";
});
}
    
const createAccount2Link = document.querySelector('a[href="#createAccount2"]');
if (createAccount2Link) {
    createAccount2Link.addEventListener("click", function(event) {
        event.preventDefault();
        hideAllSections();
        const targetDiv = document.getElementById("createAccount2");
        if (targetDiv) {
            targetDiv.classList.remove("hidden");
        }
        document.getElementById("myDropdown").classList.remove("show");
    });
}

//Skapa konto för admin
document.getElementById("createAccountForm2").addEventListener("submit", function(event) {
    event.preventDefault();

    const createMsg2 = document.getElementById("createMsg2");
    createMsg2.textContent = "";

    const newUser = {
        username: document.getElementById("createUsername2").value,
        password: document.getElementById("createPassword2").value,
        firstName: document.getElementById("first_name2").value,
        lastName: document.getElementById("last_name2").value,
        phone: document.getElementById("phone2").value,
        email: document.getElementById("email2").value,
        noOfOrders: 0,
        role: document.getElementById("role2").value
    };

    sendUserToApi(newUser, "createAccountForm2", createMsg2);
});

loggInForm.addEventListener("submit", function(event) {
    event.preventDefault();
    validationLoggIn.textContent = "";
    postLogIn();
});


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
    const username = usernameInput.value;
const password = passwordInput.value;
const basicAuthString = btoa(`${username}:${password}`);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("customerId", data.id);
    localStorage.setItem("basicAuth", basicAuthString);

const loggInForm = document.getElementById("loggInForm");
loggInForm.style.display = "none";
navContainer.style.display = "none";
const isAdmin = data.isAdmin;
if (isAdmin === true) {
    console.log(data);   //Kolla vad som kommer
    localStorage.setItem("isAdmin", "true");
    document.getElementById("adminNav").classList.remove("hidden");
    document.getElementById("header1").classList.add("hidden");
    document.getElementById("userHeader").classList.add("hidden");
}
else {
    localStorage.setItem("isAdmin", "false");
    document.getElementById("header1").classList.add("hidden");
    document.getElementById("adminNav").classList.add("hidden");
    document.getElementById("userHeader").classList.remove("hidden"); 
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

//Hämta alla användare
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
            document.querySelector(".getAllCars").classList.add("hidden");
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
            document.querySelector(".getAllCars").classList.add("hidden");
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

        createTableCars(cars);
    })
    .catch((error) => {
        console.error("Error:", error);
        const carTableBody = document.getElementById("carTableBody");
        if (carTableBody) {
            carTableBody.innerHTML = `<tr><td colspan="9" style="color: red;">Kunde inte hämta bilar.</td></tr>`;
        }
    });
}

function createTableCars (cars) {
    
        console.log("bilddata: ", cars[0]);
        const carTableBody = document.getElementById("carTableBody");
        carTableBody.innerHTML = "";

        if (cars.length === 0) {
            carTableBody.innerHTML = `<tr><td colspan="9">Inga bilar tillgängliga</td></tr>`;
            return;
        }

        cars.forEach((car) => { 
            let imageSrc = "";
            if (car.image) {
                imageSrc = `data:image/jpeg;base64,${car.image}`;
            }

            const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
            const isAdmin = localStorage.getItem("isAdmin") === "true";
            
            const row = document.createElement("tr"); 

            row.innerHTML = `
                <td>${car.id}</td>
                <td>${car.name}</td>
                <td>${car.model}</td>
                <td>${car.type}</td>
                <td>${car.feature1 || ""}, ${car.feature2 || ""}, ${car.feature3 || ""}</td>
                <td>${car.price} kr</td>
                <td>${car.booked ? "Ja" : "Nej"}</td>
                <td><img src="${imageSrc}" alt="${car.name}" class="table-car-img" width="50"></td>
                <td class="action-cell"></td>
            `;
            const actionCell = row.querySelector(".action-cell");

            if (!isLoggedIn) {
                actionCell.innerHTML = `<span class="login">Logga in för att boka</span>`;
            }
            else if (isAdmin === true) {
                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Ta bort";
                deleteBtn.style.backgroundColor = "rgb(160, 25, 16)";
                deleteBtn.className = "btn-delete";
                deleteBtn.addEventListener("click", (event) => {
                    event.preventDefault();
                    deleteCar(car.id);
                });

                const editButton = document.createElement("button");
                editButton.textContent = "Redigera bil";
                editButton.addEventListener("click", (event) => {
                    event.preventDefault();

                    hideAllSections();
                    document.getElementById("updateCarDiv").classList.remove("hidden");
                    document.getElementById("updateCarId1").value = car.id;
                    document.getElementById("updateCar1Btn").click();
                });

                actionCell.appendChild(deleteBtn);
                actionCell.appendChild(editButton);
            }
            else {
                const bookBtn = document.createElement("button");
                bookBtn.textContent = "Boka direkt";
                bookBtn.style.backgroundColor = "rgb(152, 207, 180)";
                bookBtn.className = "btn-book";

                bookBtn.addEventListener("click", (event) => {
                    event.preventDefault();
                    bookCar(car.id, `${car.name} ${car.model}`);
                });
                actionCell.appendChild(bookBtn);
            }
            carTableBody.appendChild(row);
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
function deleteCar(id) {
    if(!id) { console.error("Kom inte med bilens-ID ")
        return;
    }
    const basicAuth = localStorage.getItem("basicAuth");
    const deleteCarMsg = document.getElementById("deleteCarMsg");
    const url = `http://localhost:8080/api/v1/cars/${id}`;
      if (basicAuth) {
        headersDelCar.append("Authorization", `Basic ${basicAuth}`);
    }
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
       const form = document.getElementById("deleteCarForm");
        if(form) {
            form.reset();
        }
        getCars();
    })
    .catch((error) => {
        console.error("Error:", error);
        deleteCarMsg.textContent = "Gick inte att radera. Försök igen senare.";
        deleteCarMsg.style.color = "red";
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

const getACarUserLink = document.getElementById("getACarUserLink");
if (getACarUserLink) {
    getACarUserLink.addEventListener("click", function(event) {
        event.preventDefault();
        hideAllSections();
       const targetDiv = document.getElementById("getACarUser");
        if (targetDiv) {
            targetDiv.classList.remove("hidden");
        }
    });
}

const getAllCarsUserLink = document.getElementById("getAllCarsUserLink"); 

if (getAllCarsUserLink) { 
    getAllCarsUserLink.addEventListener("click", function(event) { 
        event.preventDefault();  
        hideAllSections(); 

        const targetDiv = document.querySelectorAll(".getAllCars"); 
        if (targetDiv) {  
            targetDiv.classList.remove("hidden");  
        } 
    }); 
} 

function getACar(carId, carForm, carMsg) { 
const url = `http://localhost:8080/api/v1/cars/${carId}`; 
 
fetch(url, { 
    method: "GET", 
    credentials: "include" 

}) 
.then((response) => { 
    if(!response.ok) throw new Error("Fel vid hämtning av bil"); 
    return response.json(); 
}) 
.then((car) => { 
    carMsg.textContent = `Bilen: ${car.name}, ${car.brand}, ${car.feature1}, ${car.feature2},  
            ${car.feature3}, ${car.type}, ${car.price}. ID: ${car.id}`; 
    const form = document.getElementById(carForm);
    if (form) form.reset();
}) 
.catch((error) => { 
    console.error("Kunde inte hitta bilen, fel: ", error); 
    const form = document.getElementById(carForm);
    if (form) form.reset();
}); 
} 

// hämta bil user meny
const getACarFormUser = document.getElementById("getACarFormUser");
if (getACarFormUser) { 
getACarFormUser.addEventListener("submit", function(event) { 
    event.preventDefault(); 

    const getACarMsg2 = document.getElementById("getACarMsg2"); 
    getACarMsg2.textContent = "";  
const id = document.getElementById("getACarId2").value; 
    getACar(id, "getACarFormUser", getACarMsg2); 
}); 
}
//hämta bil admin meny
const getACarForm = document.getElementById("getACarForm");
if(getACarForm) { 
getACarForm.addEventListener("submit", function(event) { 
    event.preventDefault(); 

    const getACarMsg = document.getElementById("getACarMsg"); 
    getACarMsg.textContent = ""; 
const id = document.getElementById("getACarId").value; 
    getACar(id, "getACarForm", getACarMsg); 
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

//toggla mellan att visa o ta bort menyn visuellt för bilmenyn i admin
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

//Bokningar Boka

function bookCar(carId, carName) {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (!isLoggedIn || isAdmin === true) {
        alert("Endast registrerade kunder kan boka bilar. Administratörer kan inte boka.");
        return;
}
const tableSection = document.querySelectorAll(".getAllCars");
    if (tableSection) tableSection.classList.add("hidden");

    const createBookingDiv = document.getElementById("createBookingDiv");
    if (createBookingDiv) createBookingDiv.classList.remove("hidden");

    document.getElementById("bookingCarName").textContent = carName;
    document.getElementById("bookingCarId").value = carId;
}
//klicka boka bil från bilarna
const bookBtn = document.getElementById("bookBtn");
 if (bookBtn) {
        bookBtn.addEventListener("click", (event) => {
            event.preventDefault();
            const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
            const isAdmin = localStorage.getItem("isAdmin") === "true";

            if (!isLoggedIn) {
                alert("Du måste logga in som kund för att kunna boka en bil.");
                return;
            }

            if (isAdmin === true) {
                alert("Administratörer kan inte boka bilar. Logga in med ett kundkonto.");
                return;
            }

            const tableSection = document.querySelector(".getAllCars");
            if (tableSection) {
                tableSection.classList.add("hidden");
            }
            const createBookingDiv = document.getElementById("createBookingDiv");
            if (createBookingDiv) {
                createBookingDiv.classList.remove("hidden");
            }
        });
    }

document.getElementById("createBookingForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    let headersPostBooking = new Headers();
headersPostBooking.append("Content-Type", "application/json");
headersPostBooking.append("Accept", "application/json");
    
    const bookingCarId = document.getElementById("bookingCarId").value; 
    const createFromDate = document.getElementById("createFromDate").value; 
    const createToDate = document.getElementById("createToDate").value; 
    const basicAuth = localStorage.getItem("basicAuth");
    const customerId = localStorage.getItem("customerId");

    if (new Date(createFromDate) > new Date(createToDate)) {
        alert("Slutdatum kan inte vara före startdatum.");
        return;
    }
    
    const formData = {
        carId: parseInt(bookingCarId),
        fromDate: createFromDate,
        toDate: createToDate,
        userId: parseInt(customerId)
    };
     if (basicAuth) {
        headersPostBooking.append("Authorization", `Basic ${basicAuth}`);
    }

    try {
        const url = "http://localhost:8080/api/v1/bookings";
        const response = await fetch(url, {
            method: "POST",
            headers: headersPostBooking,
            body: JSON.stringify(formData),
            mode: "cors"
        });

        if (response.ok) {
            alert("Bokning sparats!");
            document.getElementById("createBookingForm").reset();
            document.getElementById("createBookingDiv").classList.add("hidden");
            document.querySelector(".getAllCars").classList.remove("hidden");
        } else {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                alert(`Kunde inte boka: ${errorData.error || "Okänt fel"}`);
            }
                else {
                alert(`Kunde inte boka: Servern svarade med status ${response.status}`);
                }
            }
        }
    catch (error) {
        console.error("Fel med kommunikationen, försök igen senare", error);
    }
});

document.getElementById("cancelBookingBtn").addEventListener("click", () => {
    document.getElementById("createBookingDiv").classList.add("hidden");
    document.querySelector(".getAllCars").classList.remove("hidden");
});

//Hämta alla bokningar för inloggad användare
function myBookings() {

    const id = localStorage.getItem("customerId");
    const basicAuth = localStorage.getItem("basicAuth");
    const url = `http://localhost:8080/api/v1/bookings/me`;
     let headersMyBooking = new Headers();
    headersMyBooking.append("Content-Type", "application/json");
    headersMyBooking.append("Accept", "application/json");
    headersMyBooking.append("Authorization", `Basic ${basicAuth}`);
    
fetch(url, {
    method: "GET",
    mode: "cors",
    credentials: "include",
    headers: headersMyBooking
})
.then((response) => {   
    if (response.status === 404) {
            return [];
        }
    if (!response.ok) throw new Error("Något gick fel med att hämta bokning.");
    return response.json();
})
.then((bookings) => {
    const carTableBody = document.getElementById("carTableBody");

    if (carTableBody) {
            carTableBody.innerHTML = "";
            if (!bookings || bookings.length === 0) {
                carTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Du har inga bokningar ännu.</td></tr>`;
            return;
            }

    bookings.forEach((booking) => {

        const row = document.createElement("tr");
       const idCell = document.createElement("td");
            idCell.textContent = booking.id;

            const fromCell = document.createElement("td");
            fromCell.textContent = booking.fromDate;

            const toCell = document.createElement("td");
            toCell.textContent = booking.toDate;

            const carCell = document.createElement("td");
            carCell.textContent = booking.carId;

            const activeCell = document.createElement("td");
            activeCell.textContent = booking.active ? "Ja" : "Nej";

            // 3. Lägg till alla celler i raden
            row.appendChild(idCell);
            row.appendChild(fromCell);
            row.appendChild(toCell);
            row.appendChild(carCell);
            row.appendChild(activeCell);

            // 4. Tryck in den färdiga raden i tabellens tbody
            carTableBody.appendChild(row);
        });
    }
})
.catch((error) => {
    console.error("Gick inte att hämta bokningar:", error);
});
}

const myBookingsLink = document.getElementById("myBookingsLink");
if (myBookingsLink) {
myBookingsLink.addEventListener("click", function(event) {
    event.preventDefault();
    hideAllSections();
    const targetDiv = document.getElementById("myBookings");
    if (targetDiv) {
        targetDiv.classList.remove("hidden");
    }
myBookings();
});
}

//Uppdatera bil
let headPutCar = new Headers(); 
headPutCar.append("Content-Type", "application/json"); 
headPutCar.append("Accept", "application/json");

const updateCar1Btn = document.getElementById("updateCar1Btn");
if (updateCar1Btn) {
    updateCar1Btn.addEventListener("click", function(event) {
        event.preventDefault();
        const carId = document.getElementById("updateCarId1").value.trim();
        const updateMsg = document.getElementById("updateCar1Msg");
        const basicAuth = localStorage.getItem("basicAuth");

if (basicAuth) { 
        headPutCar.set("Authorization", `Basic ${basicAuth}`); 
    } 

        if (!carId) {
            updateMsg.innerText = "Mata in giltigt id.";
            return;
        }
        const url = `http://localhost:8080/api/v1/cars/${carId}`;
        fetch(url, {
            method: "GET",
            headers: headPutCar
        }
        )
        .then(response => {
            if (!response.ok) {
                throw new Error("Bilen hittades inte");
            }
            return response.json();
        })
        .then(car => {
            updateMsg.innerText = "";

            document.getElementById("updateCarId").value = car.id || carId;
                document.getElementById("updateCarId").disabled = true;
                document.getElementById("updateCarName").value = car.name || "";
                document.getElementById("updateModel").value = car.model || "";
                document.getElementById("updateCarPrice").value = car.price || "";
                document.getElementById("updateType").value = car.type || "";
                document.getElementById("updateFeature1").value = car.feature1 || "";
                document.getElementById("updateFeature2").value = car.feature2 || "";
                document.getElementById("updateFeature3").value = car.feature3 || "";
                document.getElementById("updateBooked").value = car.booked !== undefined ? car.booked : "";

                document.getElementById("updateCarDiv").classList.add("hidden");
                document.getElementById("updateCar").classList.remove("hidden");
        })
        .catch(error => {
                updateMsg.style.color = "red";
                updateMsg.innerText = "Kunde inte hämta bilen. Kontrollera att ID:t är rätt.";
                console.error(error);
      });
    });
}

const updateCarBtn = document.getElementById("updateCarBtn");

if (updateCarBtn) {
    updateCarBtn.addEventListener("click", function(event) {
        event.preventDefault();
        
        const carId = document.getElementById("updateCarId").value;
        const msgElement = document.getElementById("updateCarMsg");
         const basicAuth = localStorage.getItem("basicAuth");

        const updatedCar = {
            id: carId,
            name: document.getElementById("updateCarName").value,
            model: document.getElementById("updateModel").value,
            price: Number(document.getElementById("updateCarPrice").value),
            type: document.getElementById("updateType").value,
            feature1: document.getElementById("updateFeature1").value,
            feature2: document.getElementById("updateFeature2").value,
            feature3: document.getElementById("updateFeature3").value,
            booked: document.getElementById("updateBooked").value
        };

       const url = `http://localhost:8080/api/v1/cars/${carId}`;
       if (basicAuth) { 
        headPutCar.set("Authorization", `Basic ${basicAuth}`); 
    } 
        fetch(url, {
    method: "PUT",
    headers: headPutCar,
    body: JSON.stringify(updatedCar),
    mode: "cors",
    
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Kunde inte uppdatera bilen.");
            }
            return response.json();
        })
        .then(data => {
            msgElement.style.color = "green";
            msgElement.innerText = "Bilen har uppdaterats!";
            
            setTimeout(() => {
                hideAllSections();
                 document.getElementById("getAllCars").classList.remove("hidden");
                 getCars();
            }, 2000);
        })
        .catch(error => {
            msgElement.style.color = "red";
            msgElement.innerText = "Ett fel uppstod vid uppdateringen.";
            console.error(error);
        });
    });
}

const updateCarLink = document.querySelector(`a[href="#updateCarDiv"]`); 
if(updateCarLink) { 
    updateCarLink.addEventListener("click", (event) => { 
        event.preventDefault(); 
        hideAllSections(); 
        const targetDiv = document.getElementById("updateCarDiv"); 
        if (targetDiv) { 
            targetDiv.classList.remove("hidden"); 
        } 
        document.getElementById("CarAdminDivDrop").classList.remove("show"); 
    }); 
} 


document.addEventListener("DOMContentLoaded", () => {
const logoutLink = document.querySelectorAll(".logoutLink");

logoutLink.forEach(link => {
    link.addEventListener("click", function(event) {
        event.preventDefault();
localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("basicAuth");
        window.location.reload();
    });
});
})
