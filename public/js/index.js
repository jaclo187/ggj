'use strict';

class GlobalGameJam {

  constructor () {
    this.boundVerifyPasswords = this.verifyPasswords.bind(this);
    this.boundCheckStrongPassword = this.checkStrongPassword.bind(this);
    this.boundCheckEmail = this.checkEmail.bind(this);

    document.querySelector('#ipt-password-register-repeat').addEventListener('keyup', this.boundVerifyPasswords);
    document.querySelector('#ipt-password-register').addEventListener('keyup', this.boundCheckStrongPassword);
    document.querySelector('#ipt-email-register').addEventListener('keyup', this.boundCheckEmail);
  };

  verifyPasswords () {
    let pwd = document.querySelector('#ipt-password-register');
    let pwd2 = document.querySelector('#ipt-password-register-repeat');

    if(pwd.value == pwd2.value){
      this.makeValid(pwd2);
      return true;
    } else {
      this.makeInValid(pwd2);
      return false;
    }
  };

  checkStrongPassword () {
    let passwordRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    let pwd = document.querySelector('#ipt-password-register');

    if(passwordRegex.test(pwd.value)){
      this.makeValid(pwd);
      return true;
    } else{
      this.makeInValid(pwd);
      return false;
    }
  };

  checkEmail () {
    let email = document.querySelector('#ipt-email-register');
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if(emailRegex.test(email.value)) {
      this.makeValid(email);
      return true;
    } else {
      this.makeInValid(email);
      return false;
    }
  };

  makeValid (element) {
    element.classList.remove('is-invalid');
    element.classList.add('is-valid');
  }

  makeInValid (element) {
    element.classList.add('is-invalid');
    element.classList.remove('is-valid');
  }

}

addEventListener('DOMContentLoaded', () => {
  new GlobalGameJam;
});