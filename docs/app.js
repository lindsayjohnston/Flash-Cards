
class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

class UI {

}

class Storage {

}
//VARIABLES
const newAccountForm = document.getElementById("new-account");
const signInForm = document.getElementById('existing-account');
const newUserName = document.getElementById('username-init');
const newPassword = document.getElementById('password-init');
const checkedPassword = document.getElementById('password-check');
const userNameTakenArea = document.getElementById('username-taken');
let userNamePass = false;
// let passwordPass = false;
const passwordMatchArea = document.getElementById('password-match');

//EVENT LISTENERS
document.getElementById("create-btn").addEventListener('click', showSignUp)
newAccountForm.addEventListener("submit", addNewUser);
newUserName.addEventListener('keyup', checkUserName);
checkedPassword.addEventListener('keyup', checkPassword);

//FUNCTIONS

function showSignUp() {
    signInForm.classList.add("hidden");
    newAccountForm.classList.remove("hidden");
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