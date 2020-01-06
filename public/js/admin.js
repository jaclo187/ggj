'use strict';
class Admin{
    constructor(){
        const wssURL = `ws://${location.host}`; 
        this.wss = new WebSocket(wssURL);
        this.promises = []; //contains promises send to the server
        this.wss.addEventListener('open', () => {
            await this.execute('getLocation', data, 'getLocation');
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
                    case "logout":
                        this.onLogout(data)
                        break;
                    case "getLocation":
                        this.fillSelect("ipt-select-location",data.locations);
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
    
    onLogout (data) {
        wsc.updateNav()
        window.location.reload()
    }
    
}