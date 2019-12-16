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

            const result = await conn.execute(stmt, inserts).catch(e => {return e});

            console.log("------------")

            console.log(result);

            console.log("------------")

            if (result.errno) {
                return result;
            }
            else{
                let userID = result[0].insertId;
                newsLetter = newsLetter == true ? 1 : 0;

                stmt = 'INSERT INTO tblParticipant (dtSkillSet, dtNewsLetter, fiPerson, fiEvent) VALUES (?,?,?,?);';
                inserts = [`${skill}`,`${newsLetter}`,`${userID}`,1];

                return conn.execute(stmt, inserts);
            } 
        }

        /* should fill the selector id = select from participant.html with the groups name */
        this.teams = async () => {
            if (!conn) await connect();
            return conn.execute('Select dtName FROM tblGroup');
        }
    }
}


module.exports = new MySQLConnection()