'use strict';


class MySQLConnection{
    
    constructor(){
        const mysql = require('mysql2/promise');
        const DBConnectOpts = require(__dirname + '/mysql_options').DBConnectOpts;
        let conn = undefined;
        const bcrypt = require('bcryptjs');

        this.connect = async () => {
            if(!conn) conn = mysql.createConnection(DBConnectOpts);
        };

        this.destroy = async () => {
            if(conn) conn.destroy;
        };

        this.login = async email =>  {
            if(!conn) await connect();
            return conn.execute('SELECT idPerson, dtPassword FROM tblPerson WHERE dtEmail = ?', [`${email}`])
        }

    }
    

}


module.exports = new MySQLConnection()