'use strict';

class MySQLConnection{
    
    constructor() {
        const mysql = require('mysql2/promise');
        const DBConnectOpts = require(__dirname + '/mysql_options').DBConnectOpts;
        let conn = undefined;
        const bcrypt = require('bcryptjs');

        const connect = async () => {
            if (!conn) conn = await mysql.createConnection(DBConnectOpts);
        };

        this.destroy = async () => {
            if (conn) conn.destroy;
        };

        this.login = async email => {
            if (!conn) await connect();
            return conn.execute('SELECT idPerson, dtPassword FROM tblPerson WHERE dtEmail = ?', [`${email}`])
        }

        this.register = async (firstname, lastname, password, email, skill, newsLetter ) =>
        {
            if (!conn) await connect();
            let stmt = 'INSERT INTO tblPerson (dtFirstName, dtLastName, dtPassword, dtEmail) VALUES (?,?,?,?);' ;
                //'Insert INTO tblParticipant (dtSkillsSet,dtNewsletter) VALUES (?,?)';

            let hash = await bcrypt.hash(password, 10);
            let inserts = [`${firstname}`, `${lastname}`, `${hash}`, `${email}`];

            let result = await conn.execute(stmt, inserts);

            console.dir(result[0].insertId);

            stmt = 'INSERT INTO tblParticipant (dtSkillSet, dtNewsLetter, fiPerson, fiEvent, fiGroup)'
            /* if (`${password}` == `${password2}`) {
                
                return conn.execute(stmt, insert);
            }else {
                return "Error: You must insert two times the same password!";
            } */
        }

    }

}


module.exports = new MySQLConnection()