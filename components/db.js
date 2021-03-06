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

        this.admin = async person => {
            if(!conn) await connect();
            return conn.execute('SELECT dtIsGranted FROM tblAdmin WHERE fiPerson = ?', [`${person}`]);
        }

        this.register = async (firstname, lastname, password, email, skill, newsLetter) =>
        {
            if (!conn) await connect();
            let hash = await bcrypt.hash(password, 10);

            let stmt = 'INSERT INTO tblPerson (dtFirstName, dtLastName, dtPassword, dtEmail) VALUES (?,?,?,?);' ;
            let inserts = [`${firstname}`, `${lastname}`, `${hash}`, `${email}`];

            const result = await conn.execute(stmt, inserts).catch(e => {return e});

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

        this.getLocation = async () => {
            let query = 'SELECT dtName FROM tblLocation;';
            return conn.query(query);
        }

        /* should fill the selector id = select from participant.html with the groups name */
        this.teams = async () => {
            if (!conn) await connect();
            return conn.execute('Select dtName FROM tblGroup');
        }

        this.participants = async () => {
            if(!conn) await connect();
            //wellt group
            let stmt = 'INSERT INTO tblParticipant (dtAllergies, dtTShirtSize) VALUES (?,?);' ;
            let inserts = [`${allergies}`, `${tshirtSize}`];

            return conn.execute(stmt, inserts);
        }

        this.getUserData = async userID => {
            if(!conn) await connect();
            let query = `SELECT * FROM tblPerson
                        LEFT JOIN tblHardware ON tblHardware.fiPerson = tblPerson.idPerson
                        LEFT JOIN tblParticipant ON tblParticipant.fiPerson = tblPerson.idPerson
                        LEFT JOIN tblGroup ON tblGroup.idGroup = tblParticipant.fiGroup
                        WHERE idPerson = ${userID};`;
            return conn.query(query);
        }

        this.updateUser = async (data, userID) => {

            if(data.team !== 'join'){
               let createTeamQuery = `INERT INTO tblGroup(dtName) VALUES (?)`;
               await conn.execute(createTeamQuery, [`${data.teamName}`]).catch(e => {console.log(e)});
            }

            let joinTeamQuery = `UPDATE tblParticipant
                                SET fiGroup =  (SELECT idGroup 
                                                FROM tblGroup 
                                                WHERE dtName = ?)
                                WHERE fiPerson = ?;`
            await conn.execute(joinTeamQuery, [`${data.teamName}`, userID]).catch(e => {console.log(e)});

            let pariticipantStmt = `UPDATE tblParticipant SET dtFood = ?, dtAllergies = ?, dtTShirtSize = ? WHERE fiPerson = ?`;
            await conn.execute(pariticipantStmt, [`${data.food}`, `${data.allergies}`, `${data.size}`, userID] ).catch(e => {console.log(e)});

            let hardwareStmt = `INSERT INTO tblHardware (dtDescription, dtPower, dtOutlets, fiPerson) VALUES (?,?,?,?)`;
            await conn.execute(hardwareStmt, [`${data.hardware}`, data.wattage, data.outlets, userID] ).catch(e => {console.log(e)});

            return true;

        }

        this.updateTeams = async () => {
            if (!conn) await connect();
            return conn.query('SELECT dtName FROM tblGroup;').catch(e => {console.log(e)});
        }

        this.getUsers = async () => {
            if (!conn) await connect();
            return conn.query('SELECT * FROM tblPerson LEFT JOIN tblParticipant ON tblPerson.idPerson = tblParticipant.fiPerson LEFT JOIN tblGroup ON tblParticipant.fiGroup = tblGroup.idGroup;').catch(e => {console.log(e)});
        }

        this.deleteUser = async userID => {
            if (!conn) await connect();
            return conn.query(`DELETE FROM tblPerson WHERE idPerson = ${userID};`);
        }
    }
}


module.exports = new MySQLConnection()