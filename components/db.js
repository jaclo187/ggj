'use strict';

class MySQLConnection{
    
    constructor() {
        const mysql = require('mysql2/promise');
        const DBConnectOpts = require(__dirname + '/mysql_options').DBConnectOpts;
        const bcrypt = require('bcryptjs');
        let conn = undefined;

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

        this.register = async (firstname, lastname, password, email, skill, newsLetter) =>
        {
            if (!conn) await connect();
            let hash = await bcrypt.hash(password, 10);

            let stmt = 'INSERT INTO tblPerson (dtFirstName, dtLastName, dtPassword, dtEmail) VALUES (?,?,?,?);' ;
            let inserts = [`${firstname}`, `${lastname}`, `${hash}`, `${email}`];

            let result = await conn.execute(stmt, inserts);
            let userID = result[0].insertId;    //return value of LAST_INSERT_ID()
            newsLetter = newsLetter == true ? 1 : 0;

            stmt = 'INSERT INTO tblParticipant (dtSkillSet, dtNewsLetter, fiPerson, fiEvent) VALUES (?,?,?,?);';
            inserts = [`${skill}`,`${newsLetter}`,`${userID}`,1];

            return conn.execute(stmt, inserts);
        }
    }
}


module.exports = new MySQLConnection()