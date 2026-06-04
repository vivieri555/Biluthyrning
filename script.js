const loggInForm = document.getElementById("loggInForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const validationLoggIn = document.getElementById("validationLoggIn");
let loggInAttempts = 0;

function getHeaders(auth) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");

    if (auth) {
        headers.set("Authorization", `Basic ${auth}`);
    }

    return headers;
}
let currentCars = [];
let currentBookings = [];
let currentUsers = [];
let sortDirections = {
    name: "asc",
    type: "asc"
};

function hideAllSections() {
    const sections = ["loggInDiv", "createAccount", "createAccount2", "getAllUsers", "updatePutUser", "updateUser", "getUserForUpdate",
        "deleteUser", "getUser", "getAllCarsList", "getACar", "deleteCar", "returnCarDiv",
        "createCarDiv", "createBookingDiv", "bookBtn", "myBookings", "getACarUser", "updateCarDiv", "updateCar", "getBookings", "updateBooking"
    ];
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
            headers: getHeaders(),
            body: JSON.stringify(newUser),
            credentials: "include"
        })
        .then(function(response) {
            if (response.status === 204 || response.headers.get("Content-Type") === "0") {
                return {
                    status: response.ok,
                    data: {}
                };
            }
            return response.json().then(function(data) {
                return {
                    status: response.ok,
                    data: data
                };
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

function postLogIn() {
    const username = usernameInput.value;
    const password = passwordInput.value;
    const basicAuthString = btoa(`${username}:${password}`);
    const data = {
        username: usernameInput.value,
        password: passwordInput.value
    }
    const url = "http://localhost:8080/api/v1/auth/login";
    fetch(url, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data),
            mode: "cors",
            credentials: "include"
        })
        .then((response) => {
            if (!response.ok) throw new Error("Felaktiga inloggningsuppgifter");
            return response.json();
        })
        .then(data => {
            console.log(data);
            validationLoggIn.textContent = "Inloggning lyckades!";
            validationLoggIn.style.color = "green";
            validationLoggIn.innerHTML = JSON.stringify(data);
            loggInAttempts = 0;
            logEvent("Användaren har loggat in.");

            localStorage.setItem("customerId", data.userId);
            localStorage.setItem("basicAuth", basicAuthString);
            localStorage.setItem("isAdmin", data.isAdmin);

            const loggInForm = document.getElementById("loggInForm");
            loggInForm.style.display = "none";
            navContainer.style.display = "none";
            const isAdmin = data.isAdmin;
            if (isAdmin === true) {
                console.log(data); //Kolla vad som kommer
                localStorage.setItem("isAdmin", data.isAdmin);
                localStorage.setItem("isLoggedIn", "true");
                document.getElementById("adminNav").classList.remove("hidden");
                document.getElementById("header1").classList.add("hidden");
                document.getElementById("userHeader").classList.add("hidden");
            } else {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("isAdmin", "false");
                document.getElementById("header1").classList.add("hidden");
                document.getElementById("adminNav").classList.add("hidden");
                document.getElementById("userHeader").classList.remove("hidden");
            }
        })

        .catch((error) => {
            loggInAttempts++;
            if (loggInAttempts < 3) {
                validationLoggIn.textContent = `Felaktigt användarnamn eller lösenord. Försök igen. (${loggInAttempts} av 3 försök)`;
                validationLoggIn.style.color = "red";
                logEvent(`Misslyckat inloggningsförsök ${loggInAttempts}.`);
                passwordInput.value = "";
            } else {
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
        getAllUsers();
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

//Hämta alla användare
function getAllUsers() {
    const url = "http://localhost:8080/api/v1/users";
    const basicAuth = localStorage.getItem("basicAuth");

    fetch(url, {
            method: "GET",
            headers: getHeaders(basicAuth),
            mode: "cors",
            credentials: "include"
        })
        .then((response) => {
            if (!response.ok) throw new Error("Något gick fel med att hämta användare");
            return response.json();
        })
        .then((users) => {
            currentUsers = users;
            createTableAllUsers(users);
            sortUsers();
            })
        .catch((error) => {
            console.error("Error:", error);
            const userTable = document.getElementById("usersTable");
            userTable.innerHTML = `<tr><td colspan="8" style="color: red;"> Kan inte hämta användare
            </td></tr>`;
        });
}
//skapa tabell för alla användare i admin menyn
function createTableAllUsers(users){
    const userTable = document.getElementById("usersTable");
    userTable.innerHTML = "";

    if (users.length === 0) {
        userTable.innerHTML = `<tr><td colspan="8">Inga användare tillgängliga</td></tr>`;
        return;
    }

    users.forEach((user) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.firstName}</td>
        <td>${user.lastName}</td>
        <td>${user.username}</td> 
        <td>${user.phone}</td> 
        <td>${user.email}</td>
        <td>${user.noOfOrders}</td>
        <td>${user.role}</td> `

        userTable.appendChild(row);
    });
}

function sortUsersByField(field) {
    if (currentUsers === 0) return;

    const direction = sortDirections[field] === "asc" ? "desc" : "asc";
    sortDirections[field] = direction;

    currentUsers.sort((a, b) => {
        const valueA = (a[field] || "").toString();
        const valueB = (b[field] || "").toString();

        const strA = (valueA || "").toString(); 
        const strB = (valueB || "").toString(); 

        if (!isNaN(strA) && !isNaN(strB) && strA !== "" && strB !== "") { 
            return direction === "asc" ? valueA - valueB : valueB - valueA; 
        } 

        const comparison = strA.localeCompare(strB, "sv");
        return direction === "asc" ? comparison : -comparison;
    });
    createTableAllUsers(currentUsers);
}

const updateUserBtn = document.getElementById("updateUserBtn");
updateUserBtn.addEventListener("click", function(event) {
    event.preventDefault();
    putUser();
});

const getUserUpdateBtn = document.getElementById("getUserUpdateBtn");

if (getUserUpdateBtn) {
    getUserUpdateBtn.addEventListener("click", function(event) {
        event.preventDefault();
        getUserAdmin();
    });
}

function putUser() {
    const basicAuth = localStorage.getItem("basicAuth");
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const customerId = localStorage.getItem("customerId");

    const userId = document.getElementById("updateUserId")?.value || "";
    const first_name = document.getElementById("updateFirstName")?.value || "";
    const last_name = document.getElementById("updateLastName")?.value || "";
    const phone = document.getElementById("updatePhone")?.value || "";
    const email = document.getElementById("updateEmail")?.value || "";
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
    let updateData = {
        firstName: first_name,
        lastName: last_name,
        phone: phone,
        email: email,
        username: updateUsername,
        password: updatePassword
    };
   
    const url = `http://localhost:8080/api/v1/users/${userId}`;
    fetch(url, {
            method: "PUT",
            headers: getHeaders(basicAuth),
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
                updateMsg.textContent = "Ändringarna har sparats!";
            }
            console.log("Uppdatering lyckades:", data);
        })
        .catch((error) => {
            console.error("Error:", error);
            updateMsg.textContent = "Ett fel inträffade. Försök igen senare.";
            updateMsg.style.color = "red";
        });
}

const updateUser = document.querySelectorAll('a[href="#getUserForUpdate"]');
updateUser.forEach(function(updateUser) {
    updateUser.addEventListener("click", function(event) {
        event.preventDefault();
        hideAllSections();
        
        const dropdown = document.getElementById("myDropdown");
        if (dropdown) {
            dropdown.classList.remove("show");
        }

        const userIdInput = document.getElementById("updateUserId");
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        const isAdmin = localStorage.getItem("isAdmin") === "true";
        const userId = localStorage.getItem("customerId");
            console.log("hej2", isAdmin);
        if (isAdmin) {
            const updateDiv = document.getElementById("getUserForUpdate");
            if (updateDiv) {
                updateDiv.classList.remove("hidden");

            } 
        } else {
                console.log("hej");
                const targetDiv = document.getElementById("updateUser");
                if (targetDiv) {
                    targetDiv.classList.remove("hidden");
                    if(userId) {
                        userIdInput.disabled = true;
                        autofillProfile(userId);
                    }
            }
        }
    });
});

    function autofillProfile(userId) {
    const basicAuth = localStorage.getItem("basicAuth");
    const url = `http://localhost:8080/api/v1/users/${userId}`;
    const updateMsg = document.getElementById("updateMsg");
    fetch(url, {
        method: "GET",
        headers: getHeaders(basicAuth),
        mode: "cors",
        credentials: "include"
    })
    .then((response) => {
        if (!response.ok) throw new Error("Fel hämtning");
        return response.json();
    })
    .then((user) => {
  
        document.getElementById("updateUserId").value = user.id || "";
        document.getElementById("updateFirstName").value = user.firstName || "";
        document.getElementById("updateLastName").value = user.lastName || "";
        document.getElementById("updatePhone").value = user.phone || "";
        document.getElementById("updateEmail").value = user.email || "";
        document.getElementById("updateUsername").value = user.username || "";
        document.getElementById("updatePassword").value = "";
    });
}


const deleteUserLink = document.querySelector('a[href="#deleteUser"]');
const deleteMsg = document.getElementById("deleteMsg");

if (deleteUserLink) {
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

const deleteUserBtn = document.getElementById("deleteUserBtn");
if (deleteUserBtn) {
    deleteUserBtn.addEventListener("click", function(event) {
        event.preventDefault();
        deleteUser();
    })
}

 

function sortUsers() { 

    const sortUserId = document.getElementById("thGetAllUserId"); 
    const sortUserFirstName = document.getElementById("thFirstName"); 
    const sortUserLastName = document.getElementById("thLastName"); 
    const sortUserUsername = document.getElementById("thUsername"); 
    const sortPhone = document.getElementById("thPhone"); 
    const sortEmail = document.getElementById("thEmail"); 
    const sortNoOfOrders = document.getElementById("thNoOfOrders"); 
    const sortRole = document.getElementById("thRole"); 

    const sortColumn = [
        { 
            id: "thGetAllUserId", 
            field: "id" 
        }, 
        { 
            id: "thFirstName", 
            field: "firstName" 
        }, 
        { 
            id: "thLastName", 
            field: "lastName" 
        }, 
        {
            id: "thUsername",
            field: "username"
        },
        { 
            id: "thPhone", 
            field: "phone" 
        }, 
        { 
            id: "thEmail", 
            field: "email" 
        }, 
        { 
            id: "thNoOfOrders", 
            field: "noOfOrders" 
        }, 
        { 
        id: "thRole", 
        field: "role" 
        } 
    ]; 
    sortColumn.forEach(col => 
        { const column = document.getElementById(col.id); 

        if (column)
            { column.addEventListener("click", () => 
                {  sortUsersByField(col.field);
                }); 
            } 
        }); 
}

function deleteUser() {
    let id = document.getElementById("deleteUserId").value;
    const basicAuth = localStorage.getItem("basicAuth");
    const url = `http://localhost:8080/api/v1/users/${id}`;
    fetch(url, {
            method: "DELETE",
            headers: getHeaders(basicAuth),
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
        getUserAdmin();
    });
}

function getUserAdmin(userId) {
    
    const getUserMsg = document.getElementById("getUserMsg");
    const userData = {
        id: document.getElementById("getUserUpdateId").value || ""
    }
    const url = `http://localhost:8080/api/v1/users/${userData.id}`;
    const basicAuth = localStorage.getItem("basicAuth");

    fetch(url, {
            method: "GET",
            mode: "cors",
            headers: getHeaders(basicAuth),
            credentials: "include"
        })
        .then((response) => {
            if (!response.ok) throw new Error("Något gick fel med att hämta användare");
            return response.json();
        })
        .then((user) => {
            hideAllSections();
            document.getElementById("updateUser").classList.remove("hidden");
           const updateUserId = document.getElementById("updateUserId").value = user.id || "";
            document.getElementById("updateFirstName").value = user.firstName || "";
            document.getElementById("updateLastName").value = user.lastName || "";
            document.getElementById("updatePhone").value = user.phone || "";
            document.getElementById("updateEmail").value = user.email || "";
            document.getElementById("updateUsername").value = user.username || "";
            document.getElementById("updatePassword").value = "";
            document.getElementById("getUserForUpdateForm").reset();
            getUserMsg.textContent = "";
            updateUserId.disabled = true;
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
        if (createDiv) {
            createDiv.classList.remove("hidden");
            document.getElementById("startPage").classList.add("hidden");
            document.querySelector(".getAllCars").classList.add("hidden");
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

    const basicAuth = localStorage.getItem("basicAuth");
    let headers = new Headers();
    headers.append("Authorization", `Basic ${basicAuth}`);
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
            headers: headers,
            credentials: "include"
        })
        .then((response) => {
            if (response === 204 || response.headers.get("Content-Type") === "0") {
                return {
                    status: response.ok,
                    data: {}
                };
            }
            return response.json().then((data) => {
                return {
                    status: response.ok,
                    data: data
                };
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
function getCars() {

    const url = "http://localhost:8080/api/v1/cars";

    fetch(url, {
            method: "GET",
            headers: getHeaders()
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Serverfel: ${response.status}`);
            }
            return response.json();
        })
        .then((cars) => {

            currentCars = cars;
            createTableCars(cars);
            sortCars();
        })
        .catch((error) => {
            console.error("Error:", error);
            const carTableBody = document.getElementById("carTableBody");
            if (carTableBody) {
                carTableBody.innerHTML = `<tr><td colspan="9" style="color: red;">Kunde inte hämta bilar.</td></tr>`;
            }
        });
}

function sortIcons(field, direction) {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const columns = document.querySelectorAll("#main th[]");

}

function createTableCars(cars) {

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
                <td>${car.feature1}</td>
                <td>${car.feature2}</td>
                <td>${car.feature3}</td>
                <td>${car.price} kr</td>
                <td>${car.booked ? "Ja" : "Nej"}</td>
                <td><img src="${imageSrc}" alt="${car.name}" class="table-car-img" width="50"></td>
                <td class="action-cell"></td>
            `;
        const actionCell = row.querySelector(".action-cell");

        if (!isLoggedIn) {
            actionCell.innerHTML = `<span class="login">Logga in för att boka</span>`;
        } else if (isAdmin) {
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Ta bort";
            deleteBtn.className = "btn-delete";
            deleteBtn.classList.add("negativeBtn");
            deleteBtn.addEventListener("click", (event) => {
                event.preventDefault();
                if (confirm("Vill du verkligen radera bilen " + car.id + "?")) {
                    deleteCar(car.id);
                }

            });

            const editButton = document.createElement("button");
            editButton.textContent = "Redigera bil";
            editButton.classList.add("standardBtn");
            editButton.addEventListener("click", (event) => {
                event.preventDefault();

                hideAllSections();
                document.getElementById("updateCarDiv").classList.remove("hidden");
                document.getElementById("updateCarId1").value = car.id;
                document.getElementById("updateCar1Btn").click();
            });

            actionCell.appendChild(deleteBtn);
            actionCell.appendChild(editButton);
        } else {
            const bookBtn = document.createElement("button");
            bookBtn.textContent = "Boka direkt";
            bookBtn.className = "btn-book";
            bookBtn.classList.add("positiveBtn");

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

function sortCars() {
            console.log("name");
    
    const sortName = document.getElementById("thName");
    const sortType = document.getElementById("thType");
    const sortCarsId = document.getElementById("thId"); 
    const sortModel = document.getElementById("thModel"); 
    const sortFeature1 = document.getElementById("thFeature1"); 
    const sortFeature2 = document.getElementById("thFeature2"); 
    const sortFeature3 = document.getElementById("thFeature3"); 
    const sortPrice = document.getElementById("thPrice"); 
    const sortBooked = document.getElementById("thBooked"); 
    
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const isAdmin = localStorage.getItem("isAdmin") === "true";
   
    if (isAdmin) {
        const sortColumn = [
            { id: "thId", field: "id" },
            { id: "thName", field: "name" },
            { id: "thType", field: "type" },
            { id: "thModel", field: "model" },
            { id: "thFeature1", field: "feature1" },
            { id: "thFeature2", field: "feature2" },
            { id: "thFeature3", field: "feature3" },
            { id: "thPrice", field: "price" },
            { id: "thBooked", field: "booked" },
        ];
        sortColumn.forEach(col => {
            const column = document.getElementById(col.id);
            console.log(column);
            if (column) {
                column.addEventListener("click", () => {
                    sortCarsByField(col.field);
                });
            }
        });
    } else if (isLoggedIn) {
    sortName.addEventListener("click", () => {
            console.log("name");

            sortCarsByField("name");
        });
        sortType.addEventListener("click", () => {
            sortCarsByField("type");
        });
    }
    //Behöver man lägga in någon mer sök funktion här?
}


function sortCarsByField(field) {
    if (currentCars.length === 0) return;

    const direction = sortDirections[field] === "asc" ? "desc" : "asc";
    sortDirections[field] = direction;

    currentCars.sort((a, b) => {
        const valueA = (a[field] || "").toString();
        const valueB = (b[field] || "").toString();

        if (typeof valueA === "boolean" && typeof valueB === "boolean") { 
            return direction === "asc" ? (valueA === valueB ? 0 : valueA ? -1 : 1) : (valueA === valueB ? 0 : valueA ? 1 : -1); 
        } 

        const strA = (valueA || "").toString(); 
        const strB = (valueB || "").toString(); 

        if (!isNaN(strA) && !isNaN(strB) && strA !== "" && strB !== "") { 
            return direction === "asc" ? valueA - valueB : valueB - valueA; 
        } 

        const comparison = strA.localeCompare(strB, "sv");
        return direction === "asc" ? comparison : -comparison;
    });

    createTableCars(currentCars);
}

const deleteCarLink = document.querySelector(`a[href="#deleteCar"]`);
if (deleteCarLink) {
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

//Radera bil metod
function deleteCar(id) {
    if (!id) {
        console.error("Kom inte med bilens-ID ")
        return;
    }
    const basicAuth = localStorage.getItem("basicAuth");
    const deleteCarMsg = document.getElementById("deleteCarMsg");
    const url = `http://localhost:8080/api/v1/cars/${id}`;
   
    fetch(url, {
            method: "DELETE",
            headers: getHeaders(basicAuth),
            credentials: "include"
        })
        .then((response) => {
            if (!response.ok) throw new Error("Gick inte att ta bort bil");
            const data = response.text();
            if (data === null) throw new Error("Inget returneras");
            deleteCarMsg.textContent = "Bilen har tagits bort!"
            deleteCarMsg.style.color = "green";
            const form = document.getElementById("deleteCarForm");
            if (form) {
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
//Uppdatera bokning med id
const updateBookingBtn = document.getElementById("updateBookingBtn");

if (updateBookingBtn) {
    updateBookingBtn.addEventListener("click", function(event) {
        event.preventDefault();
        putBooking();
    });
}

function putBooking() {
    const id = document.getElementById("updateBookingId")?.value || "";
    const updateFromDate = document.getElementById("updateFromDate")?.value || "";
    const updateToDate = document.getElementById("updateToDate")?.value || "";
    const updateUserId = document.getElementById("userId")?.value || "";
    const updateCarId = document.getElementById("updateCarId")?.value || "";
    const active = false;
    const updateBookingMsg = document.getElementById("updateBookingMsg");
    if (updateBookingMsg) {
        updateBookingMsg.textContent = "";
    }

    if (!id) {
        if (updateBookingMsg) {
            updateBookingMsg.textContent = "Ange ett giltigt boknings-ID.";
            updateBookingMsg.style.color = "red";
        }
        return;
    }

    const updateData = {
        id: id,
        fromDate: updateFromDate,
        toDate: updateToDate,
        userId: updateUserId,
        carId: updateCarId,
        active: active
    };

    const url = `http://localhost:8080/api/v1/bookings/${id}`;

    fetch(url, {
            method: "PUT",
            headers: getHeaders(basicAuth),
            body: JSON.stringify(updateData),
            mode: "cors",
            credentials: "include"
        })
        .then((response) => {
            if (!response.ok) throw new Error("Gick inte att uppdatera bokningen");
            return response.json();
        })
        .then((data) => {
            if (updateBookingMsg) {
                updateBookingMsg.style.color = "green";
                updateBookingMsg.textContent = "Bokningen har uppdaterats i databasen!";

                const form = document.getElementById("updatePutBookingForm");
                if (form) form.reset();
            }
            console.log("Uppdatering av bokning lyckades:", data);
        })
        .catch((error) => {
            console.error("Error:", error);
            if (updateBookingMsg) {
                updateBookingMsg.textContent = "Ett fel inträffade. Försök igen senare.";
                updateBookingMsg.style.color = "red";
            }
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

        const targetDiv = document.getElementById("getAllCarsList");
        if (targetDiv) {
            targetDiv.classList.remove("hidden");
        }
        getCars();
    });
}

function getACar(carId, carForm, carMsg, carList) {
    const url = `http://localhost:8080/api/v1/cars/${carId}`;
    const basicAuth = localStorage.getItem("basicAuth");

    fetch(url, {
            method: "GET",
            headers: getHeaders(basicAuth),
            credentials: "include"

        })
        .then((response) => {
            if (!response.ok) throw new Error("Fel vid hämtning av bil");
            return response.json();
        })
        .then((car) => {
            carMsg.textContent = "";

            const ul = document.createElement("ul");
            const carData = [
                `Id: ${car.id}`,
                `Namn: ${car.name}`,
                `Modell: ${car.model}`,
                `Feature: ${car.feature1}`,
                `Feature 2: ${car.feature2}`,
                `Feature 3: ${car.feature3}`,
                `Typ: ${car.type}`,
                `Pris: ${car.price}`,
                `Bokad: ${car.booked ? "Ja" : "Nej"}`
            ]

            carData.forEach(detail => {
                const li = document.createElement("li");
                li.textContent = detail;
                ul.appendChild(li);
            });
            carList.appendChild(ul);

            if (car.image) {
                const img = document.createElement("img");
                img.src = `data:image/jpeg;base64,${car.image}`;
                img.alt = `Bild på ${car.name}`;
                 carList.appendChild(img);
            }

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
        const carList = document.getElementById("carUserList");
        const id = document.getElementById("getACarId2").value;
        getACar(id, "getACarFormUser", getACarMsg2, carList);
    });
}
//hämta bil admin meny
const getACarForm = document.getElementById("getACarForm");
if (getACarForm) {
    getACarForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const getACarMsg = document.getElementById("getACarMsg");
        getACarMsg.textContent = "";
        const carList = document.getElementById("carAdminList");
        const id = document.getElementById("getACarId").value;
        getACar(id, "getACarForm", getACarMsg, carList);
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
    const tableSection = document.querySelector(".getAllCars");
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

        const tableSection = document.querySelectorAll(".getAllCars");
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
        headersPostBooking.set("Authorization", `Basic ${basicAuth}`);
    }

    try {
        const url = "http://localhost:8080/api/v1/bookings";
        const response = await fetch(url, {
            method: "POST",
            headers: headersPostBooking,
            body: JSON.stringify(formData),
            mode: "cors",
            credentials: "include"
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
            } else {
                alert(`Kunde inte boka: Servern svarade med status ${response.status}`);
            }
        }
    } catch (error) {
        console.error("Fel med kommunikationen, försök igen senare", error);
    }
});

document.getElementById("cancelBookingBtn").addEventListener("click", () => {
    document.getElementById("createBookingDiv").classList.add("hidden");
    document.querySelector(".getAllCars").classList.remove("hidden");
});

//Länk hämta alla bokningar
const getBookingsLink = document.querySelector('a[href="#getBookings"]');
const getAllBookingsMsg = document.getElementById("getAllBookingsMsg");

if (getBookingsLink) {
    getBookingsLink.addEventListener("click", function(event) {
        event.preventDefault();
        hideAllSections();
        const targetDiv = document.getElementById("getBookings");
        if (targetDiv) {
            targetDiv.classList.remove("hidden");
        }
        document.getElementById("adminMenuCenter").classList.remove("show");
        getAllBookings();
    });
}

//Hämta alla bokningar admin
function getAllBookings() {
    const basicAuth = localStorage.getItem("basicAuth");
    const url = `http://localhost:8080/api/v1/bookings`;
    let headersgetAllBookings = new Headers();
    headersgetAllBookings.append("Content-Type", "application/json");
    headersgetAllBookings.append("Accept", "application/json");
    headersgetAllBookings.append("Authorization", `Basic ${basicAuth}`);

    fetch(url, {
            method: "GET",
            mode: "cors",
            credentials: "include",
            headers: headersgetAllBookings
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Serverfel: `, response.json);
            }
            return response.json();
        })
        .then((bookings) => {
            currentBookings = bookings;
            createTableAllBookings(bookings);
            sortBookings();
        })
        .catch((error) => {
            console.error("Fel: ", error);
            const bookingTable = document.getElementById("bookingTableBody");
            if (bookingTable) {
                bookingTable.innerHTML = `<tr><td colspan="7" style="color: red;">Kunde inte hämta bokningar.</td></tr>`;
            }
        });
}

function createTableAllBookings(bookings) {
    const bookingTable = document.getElementById("bookingTableBody");
    bookingTable.innerHTML = "";

    if (bookings.length === 0) {
        bookingTable.innerHTML = `<tr><td colspan="7">Inga bokningar tillgängliga</td></tr>`;
        return;
    }

    bookings.forEach((booking) => {
        const isAdmin = localStorage.getItem("isAdmin") === "true";
        const row = document.createElement("tr");
        row.innerHTML = `
    <td>${booking.id}</td>
    <td>${booking.fromDate}</td>
    <td>${booking.toDate}</td>
    <td>${booking.userId}</td>
    <td>${booking.carId}</td>
    <td>${booking.active ? "Ja" : "Nej"}</td>
    <td class="actions"></td>
    `;
        const actionsBook = row.querySelector(".actions");

        const deleteBookingBtn = document.createElement("button");
        deleteBookingBtn.textContent = "Radera bokning";
        deleteBookingBtn.className = "deleteBookingBtn";
        deleteBookingBtn.classList.add("negativeBtn");
        deleteBookingBtn.addEventListener("click", (event) => {
            event.preventDefault();
            if (confirm("Vill du verkligen radera bokning " + booking.id + "?")) {

                deleteBooking(booking.id)
            }
        });
        const updateBtn = document.createElement("button");
        updateBtn.textContent = "Uppdatera";
        updateBtn.classList.add("standardBtn");
        updateBtn.addEventListener("click", (event) => {
            event.preventDefault();
            hideAllSections();
            const updateSection = document.getElementById("updateBooking");
            if (updateSection) {
                updateSection.classList.remove("hidden");
            }
            const updateBookingId = document.getElementById("updateBookingId");
            updateBookingId.value = booking.id;
            updateBookingId.readOnly = true;
            document.getElementById("updateBookingFromDate").value = booking.fromDate;
            document.getElementById("updateBookingToDate").value = booking.toDate;
            document.getElementById("updateBookingUserId").value = booking.userId;
            document.getElementById("updateBookingCarId").value = booking.carId;
            document.getElementById("updateBookingActive").value = booking.booked ? "Ja" : "Nej";
        });

        actionsBook.appendChild(updateBtn);
        actionsBook.appendChild(deleteBookingBtn);
        bookingTable.appendChild(row);
    });

}

document.addEventListener("DOMContentLoaded", () => {
    closeCommercial("closeBtn1", "c1");
    closeCommercial("closeBtn2", "commercialBoxCandyz");
});

function sortBookings() {
    const sortId = document.getElementById("thBookingId");
    const sortFromDate = document.getElementById("thFromDate");
    const sortToDate = document.getElementById("thToDate");
    const sortUserId = document.getElementById("thUserId");
    const sortCarId = document.getElementById("thCarId");
    const sortActive = document.getElementById("thActive");

    const sortColumn = [{
            id: "thBookingId",
            field: "id"
        },
        {
            id: "thFromDate",
            field: "fromDate"
        },
        {
            id: "thToDate",
            field: "toDate"
        },
        {
            id: "thUserId",
            field: "userId"
        },
        {
            id: "thCarId",
            field: "carId"
        },
        {
            id: "thActive",
            field: "active"
        },
    ];
    sortColumn.forEach(col => {
        const column = document.getElementById(col.id);
        if (column) {
            column.addEventListener("click", () => {
                sortBookingsByField(col.field);
            });
        }
    });
    searchBooking();

    const activeBookingBtn = document.getElementById("activeBookingBtn");
    if (activeBookingBtn) {
        activeBookingBtn.addEventListener("click", () => {
            searchActiveBooking();
        });
    }
    const searchUsersBookingBtn = document.getElementById("searchUsersBookingBtn");
    if (searchUsersBookingBtn) {
        searchUsersBookingBtn.addEventListener("click", () => {
            searchUsersBooking();
        });
    }
}

function searchBooking() {
    const searchBookingForm = document.getElementById("searchBookingForm");
    const getBookingId = document.getElementById("getBookingId");
    const searchBookingMsg = document.getElementById("searchBookingMsg");
    const clearSearchBtn = document.getElementById("clearSearchBtn");

    if (searchBookingForm) {
        searchBookingForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const searchValue = getBookingId.value.trim();
            if (searchBookingMsg) searchBookingMsg.textContent = "";

            if (searchValue === "") {
                createTableAllBookings(currentBookings);
                return;
            }
            const filteredBookings = currentBookings.filter(booking =>
                booking.id && booking.id.toString() === searchValue
            );
            createTableAllBookings(filteredBookings);

            if (filteredBookings.length === 0 && searchBookingMsg) {
                searchBookingMsg.textContent = "Ingen bokning matchade det ID:t.";
                searchBookingMsg.style.color = "red";
            }
        });
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener("click", () => {
            if (getBookingId) getBookingId.value = "";
            if (searchBookingMsg) searchBookingMsg.textContent = "";
            createTableAllBookings(currentBookings);
        });
    }
}
//sök användares alla bokningar
function searchUsersBooking() {
    const basicAuth = localStorage.getItem("basicAuth");
    const searchMsg = document.getElementById("searchUsersBookingMsg");
    const userId = document.getElementById("searchUsersBooking").value.trim();
    if (!userId) {
        searchMsg.textContent = "Ange ett giltigt användar-id";
        return;
    }

    const url = `http://localhost:8080/api/v1/bookings/user/${userId}`;

    if (searchMsg) {
        searchMsg.textContent = "Hämtar alla aktiva bokningar..";
    }

    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    if (basicAuth) {
        headers.set("Authorization", `Basic ${basicAuth}`);
    }

    fetch(url, {
            headers: headers,
            mode: "cors",
            credentials: "include",
            method: "GET"
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Fel med server: ${response.status}`);
            }
            return response.json();
        })
        .then((bookings) => {
            if (searchMsg) searchMsg.textContent = "";
            createTableAllBookings(bookings);
        })
        .catch((error) => {
            console.error("Fel vid hämtning av bokningar", error);
            if (searchMsg) {
                searchMsg.textContent = "Kunde inte hämta bokningar.";
                searchMsg.style.color = "red";
            }
        });
}
//Sök aktiva bokningar
function searchActiveBooking() {
    const basicAuth = localStorage.getItem("basicAuth");
    const url = `http://localhost:8080/api/v1/bookings/active`;
    const searchMsg = document.getElementById("searchBookingMsg");
    if (searchMsg) {
        searchMsg.textContent = "Hämtar alla aktiva bokningar..";
    }

    let headersActive = new Headers();
    headersActive.append("Content-Type", "application/json");
    headersActive.append("Accept", "application/json");
    if (basicAuth) {
        headersActive.set("Authorization", `Basic ${basicAuth}`);
    }

    fetch(url, {
            headers: headersActive,
            mode: "cors",
            credentials: "include",
            method: "GET"
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Fel med server: ${response.status}`);
            }
            return response.json();
        })
        .then((activeBookings) => {
            if (searchMsg) searchMsg.textContent = "";
            createTableAllBookings(activeBookings);
        })
        .catch((error) => {
            console.error("Fel vid hämtning av aktiva bokningar", error);
            if (searchMsg) {
                searchMsg.textContent = "Kunde inte hämta aktiva bokningar.";
                searchMsg.style.color = "red";
            }
        });
}

//Sortera bokningar
function sortBookingsByField(field) {
    if (currentBookings.length === 0) return;

    const direction = sortDirections[field] === "asc" ? "desc" : "asc";
    sortDirections[field] = direction;

    currentBookings.sort((a, b) => {
        const valueA = (a[field] || "").toString();
        const valueB = (b[field] || "").toString();

        if (typeof valueA === "boolean" && typeof valueB === "boolean") {
            return direction === "asc" ? (valueA === valueB ? 0 : valueA ? -1 : 1) : (valueA === valueB ? 0 : valueA ? 1 : -1);
        }

        const strA = (valueA || "").toString();
        const strB = (valueB || "").toString();

        if (!isNaN(strA) && !isNaN(strB) && strA !== "" && strB !== "") {
            return direction === "asc" ? valueA - valueB : valueB - valueA;
        }

        const comparison = strA.localeCompare(strB, "sv");
        return direction === "asc" ? comparison : -comparison;
    });

    createTableAllBookings(currentBookings);
}
//Sök på enskild bokning med angivet id
function searchBookingForUser() {
    const id = document.getElementById()
    const basicAuth = localStorage.getItem("basicAuth");
    const searchMsg = document.getElementById("searchBookingForUserMsg");
    const url = `http://localhost:8080/api/v1/bookings/${id}`;

    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    if (basicAuth) {
        headers.set("Authorization", `BasicAuth ${basicAuth}`);
    }

    fetch(url, {
            headers: headers,
            mode: "cors",
            credentials: "include",
            method: "GET"
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Serverfel: ${response.status}`);
            }
            return response.json();
        })
        .then((boookings) => {
            if (searchMsg) searchMsg.textContent = "";
            //Skapa tabbell för bokningarna funktion
        })
        .catch((error) => {
            console.error("Fel vid hämtning av bokning", error);
            if (searchMsg) {
                searchMsg.textContent = "Kunde inte hämta bokning.";
                searchMsg.style.color = "red";
            }
        });
}


//Hämta alla bokningar för inloggad användare
function myBookings() {

    const id = localStorage.getItem("customerId");
    const basicAuth = localStorage.getItem("basicAuth");
    const url = `http://localhost:8080/api/v1/bookings/me`;

    fetch(url, {
            method: "GET",
            mode: "cors",
            credentials: "include",
            headers: getHeaders(basicAuth)
        })
        .then((response) => {
            if (response.status === 404) {
                return [];
            }
            if (!response.ok) {
                throw new Error("Något gick fel med att hämta bokning.");
            }
            return response.json();
        })
        .then((bookings) => {
            currentBookings = bookings;
            createTableUsers(bookings);
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
        searchBookingUsers();
    });
}

function createTableUsers(bookings) {
    const bookingsTableBody = document.getElementById("userBookingsTableBody");

    if (bookingsTableBody) {
        bookingsTableBody.innerHTML = "";
        if (!bookings || bookings.length === 0) {
            bookingsTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Du har inga bokningar ännu.</td></tr>`;
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
            const isActive = booking.active !== undefined ? booking.active : booking.active;
            activeCell.textContent = isActive ? "Ja" : "Nej";

            row.appendChild(idCell);
            row.appendChild(fromCell);
            row.appendChild(toCell);
            row.appendChild(carCell);
            row.appendChild(activeCell);

            bookingsTableBody.appendChild(row);
        });
    }
}

function searchBookingUsers() {
    const searchForm = document.getElementById("searchBookingForUserForm");
    const bookingId = document.getElementById("searchBookingForUser");
    const searchMsg = document.getElementById("searchBookingForUserMsg");
    const clearBtn = document.getElementById("searchBookingForUserClearBtn");

    if (searchForm) {
        if (searchForm.getAttribute("data-listener") === "true") {
            return;
        }
    }

    searchForm.setAttribute("data-listener", "true");

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const searchValue = bookingId.value.trim();
        if (searchMsg) searchMsg.textContent = "";

        if (searchValue === "") {
            createTableUsers(currentBookings);
            return;
        }
        const filteredBookings = currentBookings.filter(booking =>
            booking.id && booking.id.toString() === searchValue
        );
        createTableUsers(filteredBookings);

        if (filteredBookings.length === 0 && searchMsg) {
            searchMsg.textContent = "Ingen bokning matchade det ID:t.";
            searchMsg.style.color = "red";
        }
    });
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            if (bookingId) bookingId.value = "";
            if (searchMsg) searchMsg.textContent = "";
            createTableUsers(currentBookings);
        });
    }
}

//Uppdatera bil
const updateCar1Btn = document.getElementById("updateCar1Btn");
if (updateCar1Btn) {
    updateCar1Btn.addEventListener("click", function(event) {
        event.preventDefault();
        const carId = document.getElementById("updateCarId1").value.trim();
        const updateMsg = document.getElementById("updateCar1Msg");
        const basicAuth = localStorage.getItem("basicAuth");

        if (!carId) {
            updateMsg.innerText = "Mata in giltigt id.";
            return;
        }
        const url = `http://localhost:8080/api/v1/cars/${carId}`;
        fetch(url, {
                method: "GET",
                headers: getHeaders(basicAuth),
                credentials: "include"
            })
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
                    document.getElementById("getAllCarsList").classList.remove("hidden");
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
if (updateCarLink) {
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

//Radera bokning metod
function deleteBooking(id) {
    if (!id) {
        console.error("Kom inte med bokningens-ID ")
        return;
    }
    const basicAuth = localStorage.getItem("basicAuth");
    const deleteBookingMsg = document.getElementById("deleteBookingMsg");
    const url = `http://localhost:8080/api/v1/bookings/${id}`;
    if (basicAuth) {
        headersDelBooking.set("Authorization", `Basic ${basicAuth}`);
    }
    fetch(url, {
            method: "DELETE",
            mode: "cors",
            headers: getHeaders(basicAuth),
            credentials: "include"
        })
        .then((response) => {
            if (response.ok) {
                deleteBookingMsg.textContent = "Bokningen har tagits bort!"
                deleteBookingMsg.style.color = "green";
                getAllBookings();
                const form = document.getElementById("deleteBookingForm");
                if (form) {
                    form.reset();
                }
                return;
            }

            throw new Error("Gick inte att ta bort bokning");
        })
        .catch((error) => {
            console.error("Error:", error);
            deleteBookingMsg.textContent = "Gick inte att radera. Försök igen senare.";
            deleteBookingMsg.style.color = "red";
        });
}
const returnBtn = document.getElementById("returnBtn");
if(returnBtn) {
    returnBtn.addEventListener("click", function(event) {
        event.preventDefault();
        returnCar();
    })
}

function returnCar() {
    const basicAuth = localStorage.getItem("basicAuth");
    const id = document.getElementById("returnId").value.trim();
    const returnMsg = document.getElementById("returnMsg");
    const url = `http://localhost:8080/api/v1/bookings/return/${id}`;
    fetch(url, {
        method: "PUT",
        mode: "cors",
        credentials: "include",
        headers: getHeaders(basicAuth)
    })
    .then((response) => {
        if(!response.ok) { throw new Error("Problem med att returnera bil"); }
        if(response.ok) {
            returnMsg.textContent = "Returen gick bra!";
            returnMsg.style.color = "green";
        }
    })
    .catch((error) => {
        console.error("Fel: ", error);
        returnMsg.textContent = "Gick inte att returnera";
    });
                    }

const returnCarDiv = document.querySelector(`a[href="#returnCarDiv"]`);
    if (returnCarDiv) {
    returnCarDiv.addEventListener("click", (event) => {
        event.preventDefault();
        hideAllSections();
        const targetDiv = document.getElementById("returnCarDiv");
        if (targetDiv) {
            targetDiv.classList.remove("hidden");
        }
        document.getElementById("CarAdminDivDrop").classList.remove("show");
    });
}

function closeCommercial(btn, box) {
    const closeBtn = document.getElementById(btn);
    const commercialBox = document.getElementById(box);

    closeBtn.addEventListener("click", () => {
        commercialBox.style.display = "none";
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
            localStorage.clear();
            window.location.reload();
        });
    });
})