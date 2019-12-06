'use strict';


class MySQLConnection{
    
    async constructor() {
        const mysql = require('mysql2/promise');
        const DBConnectOpts = require(__dirname + '/mysql_options').DBConnectOpts;
        let conn = undefined;
        const bcrypt = require('bcryptjs');

        this.connect = async () => {
            if (!conn) conn = mysql.createConnection(DBConnectOpts);
        };

        this.destroy = async () => {
            if (conn) conn.destroy;
        };

        this.login = async email => {
            if (!conn) await connect();
            return conn.execute('SELECT idPerson, dtPassword FROM tblPerson WHERE dtEmail = ?', [`${email}`])
        }

        this.register = async (firstname, lastname, password1, password2, email, skill, newsLetter ) =>
        {
            if (!conn) await connect();
            let stmt = 'INSERT INTO tblPerson (dtFirstName,dtLastName,dtPassword,dtEmail) VALUES (?,?,?,?);' +
                'Insert INTO tblParticipant (dtSkillsSet,dtNewsletter) VALUES (?,?)';
            if (`${password1}` == `${password2}`) {
                let insert = [`${firstname}`, `${lastname}`, `${password1}`, `${email}`,`${skill}`,`${newsLetter}`];
                return conn.execute(stmt, insert);
            }else {
                return "Error: You must insert two times the same password!";
            }
    }


    }
    

}


module.exports = new MySQLConnection()