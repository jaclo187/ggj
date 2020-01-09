'use strict';

let wsc;

class WebSocketClient {

    constructor(){
        const wssURL = `ws://${location.host}`; 
        this.wss = new WebSocket(wssURL);
        this.promises = []; //contains promises send to the server
        this.wss.addEventListener('open', async () => {
            console.log("WSS Opened")

            document.querySelector('#submit-form').addEventListener('click', async e => {
                e.preventDefault();
                console.log("update trigger")
                let data = this.getFormData();
                console.log(data)
                await this.execute('updateUser', data, 'updateUser');
            });

            await this.execute('getUserData', {}, 'getUserData');
        });

        this.wss.addEventListener('message', e => {
            try {
                //parsing data from message event
                const data = JSON.parse(e.data);
                //if data is empty --> function ends
                if (!data.msg) return;
          
                //promise created earlyer will be removed
                for (const [index, promise] of this.promises.entries()) if (promise.msg === data.msg) {
                  promise.resolve(data);
                  this.promises.splice(index, 1);
                }
          
                //main websocket message structure
                switch (data.msg){  
                    case "userData":
                        this.passUserData(data);
                        break;
                    case "updateUser": 
                        this.onUpdate(data)
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

    getFormData () {

        let data = {
            size : document.querySelector('#size').value,
            food : document.querySelector('#food').value,
            allergies : document.querySelector('#allergies').value,
            team : document.querySelector('#team').value,
            hardware : document.querySelector('#hardware').value,
            wattage : document.querySelector('#watt').value,
            outlets : document.querySelector('#outlets').value
        };

        data.teamName = data.team == 'join' ? document.querySelector('#join-team').value : document.querySelector('#name-team').value;
        return data;
    };

    onUpdate () {
        window.location.reload()
    }

    passUserData(data) {
        data = data[0]

        document.querySelector('#size').value = data.dtTShirtSize;
        document.querySelector('#food').value = data.dtFood;
        document.querySelector('#allergies').value = data.dtAllergies;

        if(data.dtName === null){
            document.querySelector('#team').selectedIndex = 1
        } else {
            document.querySelector('#team').selectedIndex = 0
        }

        document.querySelector('#join-team').innerHTML += `<option selected>${data.dtName}</option>`;
        document.querySelector('#hardware').value = data.dtDescription;
        document.querySelector('#watt').value = data.dtPower;
        document.querySelector('#outlets').value = data.dtOutlets;
    }

    fillTeamSelect(data){
        let e = document.querySelector('#join-team'),
        html = "";
        for(let key in data){
            if(data.hasOwnProperty(key)){
                html += `<option value='${data[key]}'>${data[key]}</option>`;
            }
        }
        e.innerHTML += html;
    }
  
};
  
addEventListener('DOMContentLoaded', wsc = new WebSocketClient);