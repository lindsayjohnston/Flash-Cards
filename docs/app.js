

class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
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
        userTypeDisplayArea.textContent='FIX THIS';
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

//EVENT LISTENERS
document.getElementById("create-btn").addEventListener('click', createNewUserForm);
newAccountForm.addEventListener("submit", addNewUser);
newUserName.addEventListener('keyup', checkUserName);
checkedPassword.addEventListener('keyup', checkPassword);
signInForm.addEventListener('submit', signInUser);

//FUNCTIONS
function displayUserDashboard(userObject){
    console.log(userObject);
    ui.hideElement(signInHeader);
    ui.navDisplay(userObject);
}

function signInUser(event){
    let userNameExists= false;
    let passwordMatches= false;
    let users=JSON.parse(localStorage.getItem('users'));
    users.forEach(function(user, index){
        if(username.value === user.username){
            userNameExists= true;
            userIndex=index;
        }
    })
    if(userNameExists){
        if(password.value === users[userIndex].password){
            ui.hideElement(signInForm);
            ui.showAlert("You have signed in!" , 'success');
            displayUserDashboard(users[userIndex]);
        } else{
            ui.showAlert("Incorrect password", 'fail');
        }
    } else{
        ui.showAlert("Username does not exist", 'fail');
    }
    event.preventDefault();
}

function createNewUserForm(){
    ui.showElement(newAccountForm);
    ui.hideElement(signInForm);
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

function addNewUser(event) {
    if (newUserName.value === '' || newPassword.value === '' || checkedPassword.value === '') {
        alert('Enter all fields');
    } else {
        if (checkUserName() && checkPassword()) {
            let user = new User(newUserName.value, newPassword.value);
            storeNewUser(user);
            newUserName.value = '';
            newPassword.value = '';
            checkedPassword.value = '';
            ui.hideElement(newAccountForm);
            ui.showAlert('New User Created!', "success");
            ui.showElement(signInForm);
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
