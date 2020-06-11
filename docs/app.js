/////////////////TEST
const doSomethingButton=document.getElementById('do-something');
doSomethingButton.addEventListener('click', doSomething);
var vocabFileObject=document.getElementById('vocab-file');

function doSomething(){
    
    console.log(vocabFileObject.files[0]);
}



///////////////////////////

class User {
    constructor(username, password, userType) {
        this.username = username;
        this.password = password;
        this.userType= userType;
    }
}

class UI {
    showAlert(message, className){
        const div= document.createElement('div');
        div.className=`alert ${className}`;
        div.appendChild(document.createTextNode(message));
        const body= document.querySelector('body');
        const main= document.querySelector('#main');
        body.insertBefore(div , main);
        $('.alert').delay(3000).fadeOut(); 
        setTimeout(function(){
            div.remove();
        }, 4000);
    }

    showElement(element) {
        element.classList.remove("hidden");
    }

    hideElement(element){
        element.classList.add("hidden");
    }

    navDisplay(userObject){
        userTypeDisplayArea.textContent=userObject.userType;
        currentUserDisplayArea.textContent= userObject.username;
    }
}


class Storage {

}
//VARIABLES
const ui= new UI;
const newAccountForm = document.getElementById("new-account");
const signInForm = document.getElementById('existing-account');
const newUserName = document.getElementById('username-init');
const newPassword = document.getElementById('password-init');
const checkedPassword = document.getElementById('password-check');
const userNameTakenArea = document.getElementById('username-taken');
let userNamePass = false;
const passwordMatchArea = document.getElementById('password-match');
const userName=document.getElementById('username');
const password=document.getElementById('password');
let userIndex;
const signInHeader=document.getElementById('header');
const userTypeDisplayArea= document.getElementById('user-type-display');
const currentUserDisplayArea=document.getElementById('current-user-display');
const signOutBtn=document.getElementById('sign-out');
const createSignInBtn=document.getElementById("create-or-sign-in");
const adminRadioButton=document.getElementById("new-admin-radio");
const studentRadioButton=document.getElementById('new-student-radio');
const characterDiv=document.getElementById('character');
const activityDiv=document.getElementById('activity');
//EVENT LISTENERS
createSignInBtn.addEventListener('click', newUserOrSignIn);
newAccountForm.addEventListener("submit", addNewUser);
newUserName.addEventListener('keyup', checkUserName);
checkedPassword.addEventListener('keyup', checkPassword);
signInForm.addEventListener('submit', signInUser);
signOutBtn.addEventListener('click', signOut);
adminRadioButton.addEventListener('click', displayAdminCode);
studentRadioButton.addEventListener('click', hideAdminCode);


//FUNCTIONS
function displayAdminCode(){
    ui.showElement(document.getElementById('admin-code-area'));
}

function hideAdminCode(){
    ui.hideElement(document.getElementById('admin-code-area'));
}

function signOut(){
    if(localStorage.getItem('current-user') !== 'none'){
        localStorage.setItem('current-user', 'none');
    currentUserDisplayArea.textContent='';
    userTypeDisplayArea.textContent='';
    ui.showElement(signInHeader);
    ui.showElement(signInForm);
    ui.showAlert("You have signed out", "success");
    ui.hideElement(activityDiv);
    ui.hideElement(characterDiv);
    }
}

function displayUserDashboard(userObject){
    ui.hideElement(signInHeader);
    ui.navDisplay(userObject);
    if(userObject.userType==='admin'){
        displayAdminDashboard();
    } else if(userObject.userType === 'student'){
        displayStudentDashboard();
    }
}

function displayAdminDashboard(){
    ui.showElement(activityDiv);
    $("#activity").load("add-this.txt #vocab-list");
}

function displayStudentDashboard(){
    ui.showElement(characterDiv);
    ui.showElement(activityDiv);
}

function signInUser(event){
    let userNameExists= false;
    let passwordMatches= false;
    if (JSON.parse(localStorage.getItem('users')) === null){
        ui.showAlert("Create an account!", 'fail');
    } else {
        let users=JSON.parse(localStorage.getItem('users'));
        users.forEach(function(user, index){
            if(username.value === user.username){
                userNameExists= true;
                userIndex=index;
            }
        })
        if(userNameExists){
            if(password.value === users[userIndex].password){
                localStorage.setItem('current-user', JSON.stringify(users[userIndex]));
                ui.hideElement(signInForm);
                ui.showAlert("You have signed in!" , 'success');
                displayUserDashboard(users[userIndex]);
            } else{
                ui.showAlert("Incorrect password", 'fail');
            }
        } else{
            ui.showAlert("Username does not exist", 'fail');
        }
    }
    userName.value='';
    password.value='';

    event.preventDefault();
}

function newUserOrSignIn(e){
    if(e.target.textContent=== "Create an account"){
        ui.showElement(newAccountForm);
        ui.hideElement(signInForm);
        e.target.textContent= "Sign in to existing account";
    } else if(e.target.textContent=== "Sign in to existing account"){
        ui.showElement(signInForm);
        ui.hideElement(newAccountForm);
        e.target.textContent= "Create an account";
    };
}

function checkUserName() {
    if (localStorage.getItem('users')) {
        let taken = false;
        let users = JSON.parse(localStorage.getItem('users'));
        users.forEach(function (user) {
            if (user.username.indexOf(newUserName.value) !== -1) {
                taken = true;
            }
        })
        if (taken) {
            userNameTakenArea.textContent = "Username taken."
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
        passwordMatchArea.textContent = "Passwords Match";
        return (true);
    } else {
        passwordMatchArea.textContent = "Passwords Don't Match";
        return (false);
    }
}

function checkAdminCode(){
    let userInput=document.getElementById('admin-code-input').value;
    if(userInput === "snorlax"){
        return true;
    } else {
        return false;
    }
}

function addNewUser(event) {
    //RADIO BUTTONS
    let userType;
    let studentRadio=document.getElementById('new-student-radio');
    let adminRadio=document.getElementById('new-admin-radio')
    if(studentRadio.checked){
        userType= 'student';
    } else if(adminRadio.checked){
        userType= 'admin';
    }
    if (newUserName.value === '' || newPassword.value === '' || checkedPassword.value === '' || (!adminRadio.checked && !studentRadio.checked)) {
        ui.showAlert('Enter all fields', 'fail');
    } else {
        if(adminRadio.checked && !checkAdminCode()){
            ui.showAlert('Incorrect admin code', "fail");
        } else{
            if (checkUserName() && checkPassword()) {
                let user = new User(newUserName.value, newPassword.value, userType);
                storeNewUser(user);
                newUserName.value = '';
                newPassword.value = '';
                checkedPassword.value = '';
                document.getElementById('admin-code-input').value='';
                createSignInBtn.textContent= "Create an account";
                ui.hideElement(newAccountForm);
                ui.showAlert('New User Created!', "success");
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

