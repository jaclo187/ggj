'use strict';


class MySQLConnection{
    
    constructor(){
        const mysql = require('mysql2');
        const DBConnectOpts = require(__dirname + '/mysql_options').DBConnectOpts;
        let conn = undefined;
        const bcrypt = require('bcryptjs');

        this.connect = async () => {
            if(!conn) conn = mysql.createConnection(DBConnectOpts);
        };

        this.destroy = async () => {
            if(conn) conn.destroy;
        }

    }
    

}


module.exports = new MySQLConnection()