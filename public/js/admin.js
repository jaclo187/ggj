'use strict';

let wsc;

class Admin{

    constructor(){
        const wssURL = `ws://${location.host}`; 
        this.wss = new WebSocket(wssURL);
        this.promises = []; //contains promises send to the server
        this.wss.addEventListener('open', async () => {
            console.log("WSS Opened")

            document.querySelector('#users-container-button').addEventListener('click', async e => {
                e.preventDefault()
                await this.execute('getUsers',{},'getUsers');
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
                    case "logout" :
                        this.onLogout(data);
                        break;
                    case "getLocation" :
                        this.fillSelect("ipt-select-location",data.locations);
                        break;
                    case "getUsers" :
                        this.fillUsers(data);
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
        console.log(command);
            return new Promise((resolve, reject) => {
                this.promises.push({msg: msg, resolve: resolve});
                let obj = {};
                Object.assign(obj, {command: command}, options);
                this.wss.send(JSON.stringify(obj)); 
            });
        };

    fillSelect (id,data) {

        let select = document.querySelector(id),
        node,
        text;

        for(let item in data){
            node = document.createElement('option');
            text = document.createTextNode(item);
            node.appendChild(text)
            select.appendChild(node)
        }

    }

    fillUsers (data) {
        data
        let element = document.querySelector('#users-container-body'),
        node;
        element.innerHTML = "";
        if(data){
            for(let key in data){
                if(data.hasOwnProperty(key)){
                    node = 
                    `<div class='card card-body'>
                        <p>Email: ${data[key].dtEmail}</p>
                        <p>First Name: ${data[key].dtFirstName}</p>
                        <p>Last Name: ${data[key].dtLastName}</p>
                        <p>Food preferences: ${data[key].dtFood}</p>
                        <p>Allergies: ${data[key].dtAllergies}</p>
                        <p>Payment Status: ${data[key].dtHasPaied}</p>
                        <p>Skill Set: ${data[key].dtSkillSet}</p>
                        <p>T-Shirt Size: ${data[key].dtTShirtSize}</p>
                        <p>Group: ${data[key].dtName}</p>
                        <button type="button" class="btn btn-danger" onclick="wsc.onUserDelete(${data[key].idPerson});">Delete</button>
                    </div>`;
                    element.innerHTML += node;
                }
            }
        }
    }

    onUserDelete(user){
        this.execute('deleteUser',{userID : user},'deleteUser');
        window.location.reload();
    }
    
    onLogout (data) {
        wsc.updateNav()
        window.location.reload()
    }
    
};

addEventListener('DOMContentLoaded', wsc = new Admin);