

class User {
    constructor(username, password, userType) {
        this.username = username;
        this.password = password;
        this.userType = userType;
    }
}

class UI {
    showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `horizontal-center alert ${className}`;
        div.appendChild(document.createTextNode(message));
        const body = document.querySelector('body');
        const main = document.querySelector('#main');
        body.insertBefore(div, main);
        $('.alert').delay(3000).fadeOut();
        setTimeout(function () {
            div.remove();
        }, 4000);
    }

    showElement(element) {
        element.classList.remove("hidden");
    }

    hideElement(element) {
        element.classList.add("hidden");
    }

    navDisplay(userObject) {
        userTypeDisplayArea.textContent = userObject.userType;
        currentUserDisplayArea.textContent = userObject.username;
    }
}


//VARIABLES
const ui = new UI;
const newAccountForm = document.getElementById("new-account");
const signInForm = document.getElementById('existing-account');
const newUserName = document.getElementById('username-init');
const newPassword = document.getElementById('password-init');
const checkedPassword = document.getElementById('password-check');
const userNameTakenArea = document.getElementById('username-taken');
let userNamePass = false;
const passwordMatchArea = document.getElementById('password-match');
const userName = document.getElementById('username');
const password = document.getElementById('password');
let userIndex;
const signInHeader = document.getElementById('header');
const userTypeDisplayArea = document.getElementById('user-type-display');
const currentUserDisplayArea = document.getElementById('current-user-display');
const signOutBtn = document.getElementById('sign-out');
const createSignInBtn = document.getElementById("create-or-sign-in");
const adminRadioButton = document.getElementById("new-admin-radio");
const studentRadioButton = document.getElementById('new-student-radio');

const uploadButton = document.getElementById('upload-button');
const uploadListDiv = document.getElementById('upload-list-display');
let listObject;
const listDisplayArea = document.getElementById('display-list');
const listTable = document.getElementById('list-table');
const flashCardArea=document.getElementById('flashcard-big-div');
const getFlashCardsButton= document.getElementById('start-flashcards');
const termDisplayArea=document.getElementById('term-display');
const definitionDisplayArea=document.getElementById('definition-display');
const definitionDisplayText=document.getElementById('definition-display-text');
let currentDefinition;
const termFlashCard= document.getElementById('term-display');
const vocabFileButton=document.getElementById('vocab-file');
const testVersionBtn= document.getElementById('test-version-info');
const testInfo=document.getElementById('test-me-text');

//EVENT LISTENERS
createSignInBtn.addEventListener('click', newUserOrSignIn);
newAccountForm.addEventListener("submit", addNewUser);
newUserName.addEventListener('keyup', checkUserName);
checkedPassword.addEventListener('keyup', checkPassword);
signInForm.addEventListener('submit', signInUser);
signOutBtn.addEventListener('click', signOut);
adminRadioButton.addEventListener('click', displayAdminCode);
studentRadioButton.addEventListener('click', hideAdminCode);
uploadButton.addEventListener('click', uploadList);
getFlashCardsButton.addEventListener('click', getNewFlashCards);
termFlashCard.addEventListener('click' , revealDefinition);
vocabFileButton.addEventListener('change', revealUploadButton);
testVersionBtn.addEventListener('click', testInfoDisplay);
//FUNCTIONS

///DASHBOARDS
function testInfoDisplay(){
   
    $('#test-me-text').slideDown().delay(10000).slideUp();
    
}
function displayUserDashboard(userObject) {
    ui.hideElement(signInHeader);
    ui.navDisplay(userObject);
    if (userObject.userType === 'admin') {
        displayAdminDashboard();
    } else if (userObject.userType === 'student') {
        displayStudentDashboard();
    }
}

function displayAdminDashboard() {
    
    ui.showElement(uploadListDiv);
}

function displayStudentDashboard() {
    
    ui.showElement(flashCardArea);
}

//STUDENT FUNCTIONS

function getNewFlashCards(){
    let listObject= JSON.parse(localStorage.getItem('list-Object'));
    if(listObject === null){
        ui.showAlert("An admin must upload a list of terms first!", "fail");
    } else{
        let randomIndex= getRandomInt(listObject.length);
        termDisplayArea.textContent= listObject[randomIndex][0];
        definitionDisplayText.textContent='';
        $("#definition-display-text").fadeOut("slow");
        currentDefinition=listObject[randomIndex][1];
    }
    
}

function getRandomInt(arrayLength){
    return Math.floor(Math.random() * arrayLength);
}

function revealDefinition(){
    definitionDisplayText.textContent=currentDefinition;
    $("#term-display").animate({left: "210px"}, "fast");
    $("#term-display").animate({left: "0px"}, "slow");
    $("#definition-display-text").delay(200).fadeIn("slow");
    
}


//ADMIN FUNCTIONS
function revealUploadButton(){
    ui.hideElement(listTable);
    uploadButton.classList.remove("disabled");
}
function uploadList() {
    
    const listFileObject = document.getElementById('vocab-file');
    
        Papa.parse(listFileObject.files[0], {
            complete: function (results) {
                for(let i=0; i <results.data.length; i++){
                    if(results.data[i][0] === ''){
                        results.data.splice(i, 1);
                        i=i -1;
                    }
                }
                console.log(results.data);
                localStorage.setItem('list-Object', JSON.stringify(results.data));
                displayList(results.data);
            }
        })
        ui.showElement(listTable);
        ui.showAlert("List uploaded successfully.", "success");
        uploadButton.classList.add('disabled');
    
}

function displayList(listArrays) {
    while (listTable.childNodes[2]) {
        listTable.childNodes[2].remove();
    }
    ui.showElement(listDisplayArea);

    if (listArrays === undefined) {
        listArrays = JSON.parse(localStorage.getItem('list-Object'));
    }

    listArrays.forEach(function (array) {
        if (array[0] !== '') {
            let tr = document.createElement('tr');
            tr.className = 'list-row';
            let tdTerm = document.createElement('td');
            tdTerm.textContent = array[0];
            tdTerm.className="term";
            let tdDefinition = document.createElement('td');
            tdDefinition.textContent = array[1];
            tdDefinition.className='definition';
            tr.appendChild(tdTerm);
            tr.appendChild(tdDefinition);
            listTable.appendChild(tr);

        }

    })

}



//SIGN IN FUNCTIONS

function displayAdminCode() {
    ui.showElement(document.getElementById('admin-code-area'));
}

function hideAdminCode() {
    ui.hideElement(document.getElementById('admin-code-area'));
}

function signOut() {
    if (localStorage.getItem('current-user') !== 'none') {
        localStorage.setItem('current-user', 'none');
        currentUserDisplayArea.textContent = '';
        userTypeDisplayArea.textContent = '';
        ui.showElement(signInHeader);
        ui.showElement(signInForm);
        ui.showAlert("You have signed out.", "success");
        ui.hideElement(uploadListDiv);
        ui.hideElement(flashCardArea);
    }
}

function signInUser(event) {
    let userNameExists = false;
    let passwordMatches = false;
    if (JSON.parse(localStorage.getItem('users')) === null) {
        ui.showAlert("Create an account!", 'fail');
    } else {
        let users = JSON.parse(localStorage.getItem('users'));
        users.forEach(function (user, index) {
            if (username.value === user.username) {
                userNameExists = true;
                userIndex = index;
            }
        })
        if (userNameExists) {
            if (password.value === users[userIndex].password) {
                localStorage.setItem('current-user', JSON.stringify(users[userIndex]));
                ui.hideElement(signInForm);
                ui.showAlert("You have signed in!", 'success');
                displayUserDashboard(users[userIndex]);
            } else {
                ui.showAlert("Incorrect password", 'fail');
            }
        } else {
            ui.showAlert("Username does not exist.", 'fail');
        }
    }
    userName.value = '';
    password.value = '';

    event.preventDefault();
}

function newUserOrSignIn(e) {
    if (e.target.textContent === "Create an account") {
        ui.showElement(newAccountForm);
        ui.hideElement(signInForm);
        e.target.textContent = "Sign in to existing account";
    } else if (e.target.textContent === "Sign in to existing account") {
        ui.showElement(signInForm);
        ui.hideElement(newAccountForm);
        e.target.textContent = "Create an account";
    };
}

function checkUserName() {
    if (localStorage.getItem('users')) {
        let taken = false;
        let users = JSON.parse(localStorage.getItem('users'));
        users.forEach(function (user) {
            if (user.username=== newUserName.value) {
                taken = true;
            }
        })
        if (taken) {
            userNameTakenArea.textContent = "Username not available."
            return false;
        } else {
            userNameTakenArea.textContent = "Username available."
            return true;
        }
    } else {
        userNameTakenArea.textContent = "Username available."
        return true;
    }
}

function checkPassword() {
    if (newPassword.value === checkedPassword.value) {
        passwordMatchArea.textContent = "Passwords match.";
        return (true);
    } else {
        passwordMatchArea.textContent = "Passwords don't match.";
        return (false);
    }
}

function checkAdminCode() {
    let userInput = document.getElementById('admin-code-input').value;
    if (userInput === "snorlax") {
        return true;
    } else {
        return false;
    }
}

function addNewUser(event) {
    //RADIO BUTTONS
    let userType;
    let studentRadio = document.getElementById('new-student-radio');
    let adminRadio = document.getElementById('new-admin-radio')
    if (studentRadio.checked) {
        userType = 'student';
    } else if (adminRadio.checked) {
        userType = 'admin';
    }
    if (newUserName.value === '' || newPassword.value === '' || checkedPassword.value === '' || (!adminRadio.checked && !studentRadio.checked)) {
        ui.showAlert('Enter all fields.', 'fail');
    } else {
        if (adminRadio.checked && !checkAdminCode()) {
            ui.showAlert('Incorrect admin code', "fail");
        } else {
            if (checkUserName() && checkPassword()) {
                let user = new User(newUserName.value, newPassword.value, userType);
                storeNewUser(user);
                newUserName.value = '';
                newPassword.value = '';
                checkedPassword.value = '';
                passwordMatchArea.textContent ='';
                userNameTakenArea.textContent = '';
                document.getElementById('admin-code-input').value = '';
                createSignInBtn.textContent = "Create an account";
                ui.hideElement(newAccountForm);
                ui.showAlert('New user created!', "success");
                ui.showElement(signInForm);
            }
        }
    }
    event.preventDefault();
}

function storeNewUser(user) {
    let users;
    if (localStorage.getItem('users') === null) {
        users = [];
    } else {
        users = JSON.parse(localStorage.getItem('users'));
    }
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

