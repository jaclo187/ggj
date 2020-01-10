'use strict';

let wsc;

class WebSocketClient {

    constructor(){
        const wssURL = `ws://${location.host}`; 
        this.wss = new WebSocket(wssURL);
        this.promises = []; //contains promises send to the server
        this.wss.addEventListener('open', async () => {
            console.log("WSS Opened")

            document.querySelector('#team').addEventListener('change', async e => {
                e.preventDefault();
                if(e.target.value === "create"){
                    document.querySelector('#form-create-team').classList.remove('d-none');
                    document.querySelector('#form-join-team').classList.add('d-none');
                } else {
                    document.querySelector('#form-create-team').classList.add('d-none');
                    document.querySelector('#form-join-team').classList.remove('d-none');
                }
            });

            document.querySelector('#submit-form').addEventListener('click', async e => {
                e.preventDefault();
                let data = this.getFormData();
                await this.execute('updateUser', data, 'updateUser');
            });

            await this.execute('updateTeams', {}, 'updateTeams');
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
                        this.onUpdate(data);
                        break;
                    case "updateTeams":
                        this.fillTeamSelect(data);
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

        if(data.dtTShirtSize !== null)
            {document.querySelector('#size').value = data.dtTShirtSize;}
        if(data.dtFood !== null)
            {document.querySelector('#food').value = data.dtFood;}
        if(data.dtAllergies !== null)
            {document.querySelector('#allergies').value = data.dtAllergies;}

        if(data.dtName === null){
            document.querySelector('#team').selectedIndex = 1
        } else {
            document.querySelector('#team').selectedIndex = 0
            document.querySelector('#join-team').innerHTML += `<option selected>${data.dtName}</option>`;
        }
        if(data.dtDescription !== null)
            {document.querySelector('#hardware').value = data.dtDescription;}
        if(data.dtPower !== null)
            {document.querySelector('#watt').value = data.dtPower;}
        if(data.dtOutlets !== null)
            {document.querySelector('#outlets').value = data.dtOutlets;}
        
    }

    fillTeamSelect(data){
        let e = document.querySelector('#join-team'),
        html = "";

        for(let key in data){
            
            if(data.hasOwnProperty(key) && data[key].dtName !== undefined){
                html += `<option value='${data[key].dtName}'>${data[key].dtName}</option>`;
            }
        }
        e.innerHTML += html;
        this.execute('getUserData', {}, 'getUserData');
    }
  
};
  
addEventListener('DOMContentLoaded', wsc = new WebSocketClient);