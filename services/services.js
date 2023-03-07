const e = require("express");
//var User = require("../models/model");

var mysql = require("mysql");
const { response } = require("express");


exports.createUser = async function (firstname, lastname, email, password) {
    try {

        console.log("inside the create function serviced");

        config.query('insert into users values(null,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)', [email, firstname, lastname, password], (err, result) => {
            if (err) {
                if (err.code == "ER_DUP_ENTRY") {
                    console.log("duplicates values for the email");
                }
                else {
                    console.log(err);
                }
            }
            else {
                response.send("VALUES INSERTED into the table");
            }
            //return user;
        })
    }
    catch (e) {
        throw e;
    }
};
/*
exports.UpdateUser = async function (password, email, updatedfirstNamestr, updatedlastnamestr) {

    console.log("iside the services and doing update");
    try {

        let connection = mysql.createConnection(config);
        console.log("pointed reached to update function");
        connection.query('UPDATE users SET firstname = ?,lastname = ?,password = ?,updated_on  = CURRENT_TIMESTAMP WHERE email = ?', [updatedfirstNamestr, updatedlastnamestr, password, email], (error, result) => {
            if (error) {
                console.log(error);
                return result.status(400).json("Error updating user in Database.");
            }
            else {
                return result.status(204).json('User successfully updated');

            }
        });
    }
    catch (e) {
        console.log("error is here in update Catch error value");
        throw e;
    }
};
*/