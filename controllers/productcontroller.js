var userService = require("../services/services");
var bcrypt = require('bcrypt');
var mysql = require("mysql");
var db = require("../configuration/sequelize");
const { response } = require("express");
const user = require("../models/user");
const { NUMBER } = require("sequelize");




// Validate Name
const validateString = (name) => {
    const namepattern = /^[a-zA-Z\s]+$/;
    if (name.match(namepattern)) {
        return (true)
    }

    return (false)
}

// Validate Email
const validateEmail = (email) => {
    const emailpattern = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$/;
    if (email.match(emailpattern)) {
        return (true)
    }

    return (false)
}


exports.createProduct = async function (req, res) {

    const auth = req.headers.authorization;
    if (!auth || auth.indexOf('Basic ') === -1) return res.status(403).json("Forbidden Request")
    const base64Credentials = auth.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [usernamegetting, passwordgetting] = credentials.split(':');
    if (!usernamegetting || !passwordgetting) {
        return res.status(403).json("Invalid Authentication Details");
    }
    const usr = await db.user.findOne({ where: { username: usernamegetting } })
    if (usr === null) {
        return res.status(400).json('Invalid Authentication Details');
    }
    else {
        let passcheck = false;
        const passwordstoreduser = usr.password;
        // var hashedPassword = await bcrypt.hash(passwordstoreduser, 10);
        if (await bcrypt.compare(passwordgetting, passwordstoreduser)) {
            passcheck = true;
        }
        if (passcheck == false) {
            return res.status(401).json('Invalid Credentials');
        }

        const p1 = await db.product.findOne({ where: { sku: req.body.sku } });
        if (p1 === null) {

            var name1 = req.body.name;
            var description1 = req.body.description;
            var sku1 = req.body.sku;
            var manufacturer1 = req.body.manufacturer;
            var quantity1 = req.body.quantity;

            if (!req.body.name || !req.body.description || !req.body.manufacturer || !req.body.quantity || !req.body.sku) {
                return res.status(206).send({ message: "data is incomplete please provide value for name,manufacturer, description ,sku and quantity" })
            }
            if (Object.keys(req.body).length > 5) {
                return res.status(403).json("Extra field value provided ,please provide value for first_name,last_name,password and username");
            }
            if ((typeof req.body.quantity) != "number") {
                return res.status(400).json('Product Quantity must be number');
            }
            if (quantity1 > 100 || quantity1 < 1) {
                return res.status(400).json('Product Quantity is greater than 100 or less than 1 please keep between 0-100 or equal');
            }
            var owner_user_id1 = usr.id;
            const product1 = await db.product.build(
                {
                    name: name1,
                    description: description1,
                    sku: sku1,
                    manufacturer: manufacturer1,
                    quantity: quantity1,
                    owner_user_id: owner_user_id1
                }

            );
            await product1.save();
            return res.status(201).json(product1);
        }
        else {
            return res.status(400).json("already present its a bad request");
        }

    }
};

exports.updateProduct = async function (req, res) {

    const auth = req.headers.authorization;
    if (!auth || auth.indexOf('Basic ') === -1) return res.status(403).json("Forbidden Request")
    const base64Credentials = auth.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [usernamegetting, passwordgetting] = credentials.split(':');
    if (!usernamegetting || !passwordgetting) {
        return res.status(403).json("Invalid Authentication Details");
    }
    const usr = await db.user.findOne({ where: { username: usernamegetting } });
    const product1= await db.product.findOne({where:{id:req.params.productid}});
    if(product1===null)
    {
        return res.status(404).json("Product Not Found");
    }
    const productownerid=product1.owner_user_id;
    
    if (usr === null) {
        return res.status(400).json('Invalid Authentication Details');
    }
    if(productownerid!=usr.id)
    {
        return res.status(403).json('Forbidden request');
    }
    else {
        if (!req.body.name || !req.body.description || !req.body.manufacturer || !req.body.quantity || !req.body.sku) {
            return res.status(206).send({ message: "data is incomplete please provide value for name,manufacturer, description, sku and quantity" })
        }
        let passcheck = false;
        const passwordstoreduser = usr.password;
        // var hashedPassword = await bcrypt.hash(passwordstoreduser, 10);
        if (await bcrypt.compare(passwordgetting, passwordstoreduser)) {
            passcheck = true;
        }
        if (passcheck == false) {
            return res.status(401).json('Invalid Credentials');
        }

        const p1 = await db.product.findOne({ where: { sku: req.body.sku } });
        const p2 = await db.product.findOne({ where: { id: req.params.productid } });
        if (p2 === null) {
            return res.status(404).json('Product not Found Unable to Update');
        }
        if (p1 != null && p1.sku!= p2.sku) {
            return res.status(404).json('Product cant be updated because of same sku value already present in database');
        }
        else {

            
            if (Object.keys(req.body).length > 5) {
                return res.status(403).json("Extra field value provided ,please provide value for first_name,last_name,password ,sku and username");
            }

            // if(req.body.quantity)
            // console.log(typeof (req.body.quantity));
            if ((typeof req.body.quantity) != "number") {
                return res.status(400).json('Product Quantity must be number');
            }
            if (req.body.quantity > 100 || req.body.quantity < 0) {
                return res.status(400).json('Product Quantity is greater than 100 or less than 0 please keep between 0-100 or equal');
            }
            await p2.update({
                name: req.body.name,
                description: req.body.description,
                manufacturer: req.body.manufacturer,
                date_last_updated: db.sequelize.literal('CURRENT_TIMESTAMP'),
                sku: req.body.sku,
                quantity: req.body.quantity
            })

            return res.status(201).json('product got updated successfully');
        }

    }
};

exports.patchProduct = async function (req, res) {

    const auth = req.headers.authorization;
    if (!auth || auth.indexOf('Basic ') === -1) return res.status(403).json("Forbidden Request")
    const base64Credentials = auth.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [usernamegetting, passwordgetting] = credentials.split(':');
    if (!usernamegetting || !passwordgetting) {
        return res.status(403).json("Invalid Authentication Details");
    }
    const usr = await db.user.findOne({ where: { username: usernamegetting } });
    const product1= await db.product.findOne({where:{id:req.params.productid}});
    if(product1===null)
    {
        return res.status(404).json("Product Not Found");
    }
    const productownerid=product1.owner_user_id;
    
    if (usr === null) {
        return res.status(400).json('Invalid Authentication Details');
    }
    if(productownerid!=usr.id)
    {
        return res.status(403).json('Forbidden request');
    }
    else {
        let passcheck = false;
        const passwordstoreduser = usr.password;
        // var hashedPassword = await bcrypt.hash(passwordstoreduser, 10);
        if (await bcrypt.compare(passwordgetting, passwordstoreduser)) {
            passcheck = true;
        }
        if (passcheck == false) {
            return res.status(401).json('Invalid Credentials');
        }
        var p1 = null;
        if (req.body.sku) {
            p1 = await db.product.findOne({ where: { sku: req.body.sku } });
        }
        const p2 = await db.product.findOne({ where: { id: req.params.productid } });
        if (p2 === null) {
            return res.status(404).json('Product not Found Unable to Update');
        }
        if (p1 != null && p1.sku != p2.sku ) {
            return res.status(404).json('Product cant be updated because of same sku value');
        }

        else {


            if (p1 == null && req.body.sku) {
                await p2.update({
                    sku: req.body.sku,
                    date_last_updated: db.sequelize.literal('CURRENT_TIMESTAMP')
                })
            }

            if (req.body.name) {
                await p2.update({
                    name: req.body.name,
                    date_last_updated: db.sequelize.literal('CURRENT_TIMESTAMP')
                })
            }
            if (req.body.description) {
                await p2.update({
                    description: req.body.description,
                    date_last_updated: db.sequelize.literal('CURRENT_TIMESTAMP')
                })
            }
            if (req.body.manufacturer) {
                await p2.update({
                    manufacturer: req.body.manufacturer,
                    date_last_updated: db.sequelize.literal('CURRENT_TIMESTAMP')
                })
            }
            if (req.body.quantity) {
                if ((typeof req.body.quantity) != "number") {
                    return res.status(400).json('Product Quantity must be number');
                }
                if (req.body.quantity > 100 || req.body.quantity < 1) {
                    return res.status(400).json('Product Quantity is greater than 100 or less than 1 please keep between 0-100 or equal');
                }
                await p2.update({
                    quantity: req.body.quantity,
                    date_last_updated: db.sequelize.literal('CURRENT_TIMESTAMP')
                })
            }

            // if (!req.body.quantity || !req.body.name || !req.body.sku || !req.body.manufacturer || !req.body.description) {
            //    return res.status(400).json('bad request you are trying to patch some value that is not present in table. ');
            // }
            console.log(req.body);
            for (const key in req.body)
            {
                if(key!=="name" && key!="description" && key!="sku" && key!="manufacturer" && key!="quantity")
                {
                    return res.status(400).send({message:"bad request: invalid field in the body"})
                }
            }
            return res.status(201).json('product got updated successfully');
        }

    }
};


exports.getProduct = async function (req, res) {
    const usr = await db.product.findOne({ where: { id: req.params.productid } })
    if (usr === null) {
        return res.status(404).json('Product not Found');
    }
    else {
            return res.status(200).json(usr);
    }
};

exports.deleteProduct = async function (req, res) {
    const auth = req.headers.authorization;
    if (!auth || auth.indexOf('Basic ') === -1) return res.status(403).json("Forbidden Request")
    const base64Credentials = auth.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [usernamegetting, passwordgetting] = credentials.split(':');
    if (!usernamegetting || !passwordgetting) {
        return res.status(403).json("Invalid Authentication Details");
    }


    const usr = await db.user.findOne({ where: { username: usernamegetting } })
    // console.log(usr);
    if (usr === null) {
        return res.status(400).json('Invalid Authentication Details');
    }
    else {
        let passcheck = false;
        const passwordstoreduser = usr.password;
        // var hashedPassword = await bcrypt.hash(passwordstoreduser, 10);
        if (await bcrypt.compare(passwordgetting, passwordstoreduser)) {
            passcheck = true;
        }
        const p11 = await db.product.findOne({ where: { id: req.params.productid } })
        if (p11 === null) {
            return res.status(404).json("Product Not Found");
        }
        if (passcheck == false) {
            return res.status(401).json('Invalid Credentials');
        }
        if (p11.owner_user_id == usr.id && passcheck == true) {
            db.product.destroy({
                where: {
                    id: req.params.productid
                }
            })
            return res.status(200).json("product got deleted successfully");
        }
        else {
            return res.status(401).json("The entered userid and product created do not match please enter the correct value for the user id")
        }

    }
};


exports.health = async function (req, res) {
    return res.status(200).json("server is healthy ");
}
