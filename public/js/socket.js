'use strict';

let wsc;

class WebSocketClient {

    constructor(){
        const wssURL = `ws://${location.host}`; 
        this.wss = new WebSocket(wssURL);
        this.promises = []; //contains promises send to the server
        this.wss.addEventListener('open', () => {
            console.log("WSS Opened")
            document.querySelector('#btn-modal-register').addEventListener('click', async e => {
                e.preventDefault();
                let data = this.getRegisterData();
                if( ggj.checkLastName() && ggj.checkFirstName() && ggj.checkEmail() && ggj.checkStrongPassword() && ggj.verifyPasswords() )
                {
                    e.target.classList.remove('is-invalid');
                    await this.execute('register', data, 'register');
                } 
                else e.target.classList.add('is-invalid');
            });

            document.querySelector('#btn-modal-login').addEventListener('click', async e => {
                e.preventDefault();
                let data = this.getLoginData();
                console.log("login being send")
                await this.execute('login', data, 'login');
            });

            document.querySelector('#btn-logout').addEventListener('click', async e => {
                e.preventDefault();
                await this.execute('logout', {}, 'logout');
            });
        });

        this.wss.addEventListener('message', e => {
            try {
                //parsing data from message event
                const data = JSON.parse(e.data);
                //if data is empty --> function ends
                if (!data.msg) return;

                console.log(data)
          
                //promise created earlyer will be removed
                for (const [index, promise] of this.promises.entries()) if (promise.msg === data.msg) {
                  promise.resolve(data);
                  this.promises.splice(index, 1);
                }
          
                //main websocket message structure
                switch (data.msg){  
                    case "login": 
                        this.onLogin(data)
                        break;
                    case "registration":
                        this.onRegister(data)
                        break;
                    case "logout":
                        this.onLogout(data)
                        break;
                    default:
                        break;
                }

            }
            catch(error){
                console.log(error)
            }
        });
    }
    
    execute (command, options, msg) {
    /**
     * Sends an object to the websocket server
     * @param {String} command the message send to the websocket server
     * @param {Object} options an object containing the actual infromation
     * @param {String} msg Message for the promise object
     */
        return new Promise((resolve, reject) => {
            this.promises.push({msg: msg, resolve: resolve});
            let obj = {};
            Object.assign(obj, {command: command}, options);
            this.wss.send(JSON.stringify(obj)); 
        });
    };

    getRegisterData () {
        return {
            email : document.querySelector('#ipt-email-register').value,
            firstName : document.querySelector('#ipt-first-name-register').value,
            lastName : document.querySelector('#ipt-last-name-register').value,
            password : document.querySelector('#ipt-password-register').value,
            skill : document.querySelector('#ipt-skills-register').value,
            newsletter : document.querySelector('#ipt-newsletter-register').checked
        };
    };

    getLoginData () {
        return {
            email : document.querySelector('#ipt-email-login').value,
            password : document.querySelector('#ipt-pwd-login').value,
            remember : document.querySelector('#ipt-remember-me-login').checked
        };
    };

    onLogin (data) {
        if(data.success){
            $('#modal-login').modal("hide");
            wsc.updateNav();
        } else {
            $(`<div class="alert alert-danger alert-login" role="alert">${data.message}!</div>`).insertAfter('#form-login');
            setTimeout(() => {
                $(".alert-login").fadeOut("slow");
            }, 2500);
        }
    }

    onRegister (data) {
        if(data.success){
            $('#modal-register').modal("toggle");
            wsc.updateNav();
        } else {
            $(`<div class="alert alert-danger alert-register" role="alert">${data.message}!</div>`).insertAfter('#form-register');
            setTimeout(() => {
                $(".alert-register").fadeOut("slow");
            }, 2500);
        }
    }

    onLogout (data) {
        wsc.updateNav()
        window.location.reload()
    }

    updateNav () {
        document.querySelectorAll(".hide-on-login").forEach( e => e.classList.toggle("d-none") );
        document.querySelectorAll(".show-on-login").forEach( e => e.classList.toggle("d-none") );
    }
  
};
  
addEventListener('DOMContentLoaded', wsc = new WebSocketClient);