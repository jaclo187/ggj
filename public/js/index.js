'use strict';

let ggj;

class GlobalGameJam {

  constructor () {
    document.querySelector('#ipt-password-register-repeat').addEventListener('keyup', this.verifyPasswords);
    document.querySelector('#ipt-password-register').addEventListener('keyup', this.checkStrongPassword);
    document.querySelector('#ipt-email-register').addEventListener('keyup', this.checkEmail);
    document.querySelector('#ipt-first-name-register').addEventListener('keyup', this.checkFirstName);
    document.querySelector('#ipt-last-name-register').addEventListener('keyup', this.checkLastName);
  };

  verifyPasswords () {
    let pwd = document.querySelector('#ipt-password-register');
    let pwd2 = document.querySelector('#ipt-password-register-repeat');

    if(pwd.value == pwd2.value && pwd2.value != ""){
      ggj.makeValid(pwd2);
      return true;
    } else {
      ggj.makeInValid(pwd2);
      return false;
    }
  };

  checkStrongPassword () {
    let passwordRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    let pwd = document.querySelector('#ipt-password-register');

    if(passwordRegex.test(pwd.value)){
      ggj.makeValid(pwd);
      return true;
    } else{
      ggj.makeInValid(pwd);
      return false;
    }
  };

  checkEmail () {
    let email = document.querySelector('#ipt-email-register');
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if(emailRegex.test(email.value) && email.value != "") {
      ggj.makeValid(email);
      return true;
    } else {
      ggj.makeInValid(email);
      return false;
    }
  };

  checkFirstName () {
    let name = document.querySelector('#ipt-first-name-register');
    if(name.value !== ""){
      ggj.makeValid(name)
      return true
    } else {
      ggj.makeInValid(name)
      return false
    }
  }

  checkLastName () {
    let name = document.querySelector('#ipt-last-name-register');
    if(name.value !== ""){
      ggj.makeValid(name)
      return true
    } else {
      ggj.makeInValid(name)
      return false
    }
  }

  makeValid (element) {
    element.classList.remove('is-invalid');
    element.classList.add('is-valid');
  };

  makeInValid (element) {
    element.classList.add('is-invalid');
    element.classList.remove('is-valid');
  };

}

addEventListener('DOMContentLoaded', () => {
  ggj = new GlobalGameJam;
});