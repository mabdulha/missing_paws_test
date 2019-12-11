/* eslint-disable no-undef */
let Owner = require("../models/owners")
let Pet = require("../models/pets")
let express = require("express")
let router = express.Router()
let Fuse = require("fuse.js")
let bcrypt = require("bcryptjs")
let jwt = require("jsonwebtoken")
let dotenv = require("dotenv")
dotenv.config()

router.findAll = (req, res) => {
    res.setHeader("Content-Type", "application/json")

    Owner.find(function (err, owners) {
        if (err) {
            res.send(err)
        } else if (owners.length === 0) {
            res.json({
                message: "Owner doesnt exist"
            })
        } else {
            res.send(JSON.stringify(owners, null, 5))
        }
    })
}

router.findOne = (req, res) => {
    res.setHeader("Content-Type", "application/json")

    Owner.find({
        "_id": req.params.id
    }, function (err, owners) {
        if (err) {
            res.status(404).send({
                message: "Owner not found",
                errmsg: err
            })
        } else if (owners.length === 0) {
            res.json({
                message: "Owner doesnt exist"
            })
        } else {
            res.send(JSON.stringify(owners, null, 5))
        }
    })
}

router.addOwner = (req, res) => {
    res.setHeader("Content-Type", "application/json")

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            })
        } else {
            let owner = new Owner({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                phoneNum: req.body.phoneNum,
                email: req.body.email,
                password: hash
            })
            owner.save(function (err) {
                if (err) {
                    res.json({
                        message: "Owner not added",
                        errmsg: err
                    })
                } else {
                    res.json({
                        message: "Owner added to database",
                        data: owner
                    })
                }
            })
        }
    })
}

router.login = (req, res) => {
    Owner.findOne({email: req.body.email}).then(owner => {
        if (owner.length < 1) {
            // Error 401: Unauthorised
            return res.status(401).send({
                message: "Authentification failed, Please ensure the email and password are correct",
                errmsg: err
            })
        }
        bcrypt.compare(req.body.password, owner.password, (err, result) => {
            if (err) {
                return res.status(401).send({
                    message: "Authentification failed, Please ensure the email and password are correct",
                    errmsg: err
                })
            }
            /*if (owner) {
                return res.status(401).send({
                    message: 'Already logged in',
                    errmsg: err
                })
            }*/
            if (result) {
                const payload = {
                    _id: owner._id,
                    firstname: owner.firstname,
                    lastname: owner.lastname,
                    phoneNum: owner.phoneNum,
                    email: owner.email
                }

                const token = jwt.sign(payload, process.env.JWT_KEY, {
                    expiresIn: "1d"
                })

                return res.status(200).send({
                    message: "Successfully Authenticated",
                    token: token,
                    owner: payload
                })
            }
            res.status(401).send({
                message: "Authentification failed, Please ensure the email and password are correct",
                errmsg: err
            })
        })
    })
        .catch(err => {
            res.status(500).send({
                error: err
            })
        })
}

router.updateOwner = (req, res) => {
    Owner.findById(req.params.id, function (err, owners) {
        if (err) {
            res.status(404).send({
                message: "Cannot find owner associated with that id",
                errmsg: err
            })
        } else {
            if (req.body.firstname) {
                owners.firstname = req.body.firstname
            }
            if (req.body.lastname) {
                owners.lastname = req.body.lastname
            }
            if (req.body.phoneNum) {
                owners.phoneNum = req.body.phoneNum
            }
            if (req.body.email) {
                owners.email = req.body.email
            }

            owners.save(function (err) {
                if (err) {
                    res.json({
                        message: "Owner not updated",
                        errmsg: err
                    })
                } else {
                    res.json({
                        message: "Owner updated successfully",
                        data: owners
                    })
                }
            })
        }
    })
}

router.deleteOwner = (req, res) => {
    Owner.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.status(404).json({
                message: "Owner not deleted",
                errmsg: err
            })
        } else {
            Pet.deleteMany({
                ownerID: req.params.id
            }, function (err) {
                if (err) {
                    res.json(err)
                }
            })
            res.json({
                message: "Owner successfully deleted"
            })
        }
    })
}

router.findPetsAssociatedWithOwner = (req, res) => {
    Owner.findById(req.params.id, function (err) {
        if (err) {
            res.status(404).json({
                message: "Owner not found by id",
                errmsg: err
            })
        } else {
            Pet.find({
                ownerID: req.params.id
            }, function (err, pets) {
                if (err) {
                    res.json(err)
                } else if (pets.length > 0) {
                    res.json(pets)
                } else {
                    res.json({
                        message: "No pets associated with this owner"
                    })
                }
            })
        }
    })
}

router.findNumberOfPetsPerOwner = (req, res) => {
    Owner.findById(req.params.id, function (err) {
        if (err) {
            res.status(404).json({
                message: "Owner not found by id",
                errmsg: err
            })
        } else {
            Pet.find({
                ownerID: req.params.id
            }, function (err, pets) {
                if (err) {
                    res.json(err)
                } else if (pets.length > 0) {
                    res.json({
                        total: pets.length
                    })
                } else {
                    res.json({
                        message: "No pets associated with this owner"
                    })
                }
            })
        }
    })
}

router.findTotalNumberOfOwners = (req, res) => {
    Owner.find(function (err, owners) {
        if (err) {
            res.send(err)
        } else {
            if (owners.length > 0) {
                res.json({
                    totalOwners: owners.length
                })
            } else {
                res.json({
                    message: "No owners in database"
                })
            }
        }
    })
}

router.searchOwner = (req, res) => {
    Owner.find(function (err, owners) {
        if (err) {
            res.send(err)
        } else {
            let options = {
                keys: ["firstname", "lastname", "email"],
                threshold: 0.3
            }

            let fuse = new Fuse(owners, options)
            let query = req.body.query
            let results = fuse.search(query)

            if (query.length === 0) {
                res.json({
                    message: "Please enter a query to search"
                })
            } else if (results.length === 0) {
                res.json({
                    message: "No results found for this search term"
                })
            } else {
                res.json(results)
            }
        }
    })
}

module.exports = router