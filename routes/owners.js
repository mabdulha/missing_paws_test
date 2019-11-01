let Owner = require('../models/owners');
let Pet = require('../models/pets');
let express = require('express');
let router = express.Router();
var Fuse = require('fuse.js');

router.findAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Owner.find(function (err, owners) {
        if (err) {
            res.send(err);
        } else if (owners.length === 0) {
            res.json({
                message: "Owner doesnt exist"
            });
        } else {
            res.send(JSON.stringify(owners, null, 5));
        }
    });
};

router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Owner.find({
        "_id": req.params.id
    }, function (err, owners) {
        if (err) {
            res.status(404).send({
                message: 'Owner not found',
                errmsg: err
            });
        } else if (owners.length === 0) {
            res.json({
                message: "Owner doesnt exist"
            });
        } else {
            res.send(JSON.stringify(owners, null, 5));
        }
    })
};

router.addOwner = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let owner = new Owner();

    owner.firstname = req.body.firstname;
    owner.lastname = req.body.lastname;
    owner.phoneNum = req.body.phoneNum;
    owner.email = req.body.email;

    owner.save(function (err) {
        if (err) {
            res.json({
                message: 'Owner not added',
                errmsg: err
            });
        } else {
            res.json({
                message: 'Owner added to database',
                data: owner
            })
        }
    })
};

router.updateOwner = (req, res) => {
    Owner.findById(req.params.id, function (err, owners) {
        if (err) {
            res.status(404).send({
                message: 'Cannot find owner associated with that id',
                //errmsg: err
            })
        } else {
            if (req.body.firstname) {
                owners.firstname = req.body.firstname;
            }
            if (req.body.lastname) {
                owners.lastname = req.body.lastname;
            }
            if (req.body.phoneNum) {
                owners.phoneNum = req.body.phoneNum;
            }
            if (req.body.email) {
                owners.email = req.body.email;
            }

            owners.save(function (err) {
                if (err) {
                    res.json({
                        message: 'Owner not updated',
                        errmsg: err
                    });
                } else {
                    res.json({
                        message: 'Owner updated successfully',
                        data: owners
                    });
                }
            });
        }
    });
};

router.deleteOwner = (req, res) => {
    Owner.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.status(404).json({
                message: 'Owner not deleted',
                errmsg: err
            });
        } else {
            Pet.deleteMany({
                ownerID: req.params.id
            }, function (err) {
                if (err) {
                    res.json(err);
                }
            });
            res.json({
                message: 'Owner successfully deleted'
            });
        }
    })
};

router.findPetsAssociatedWithOwner = (req, res) => {
    Owner.findById(req.params.id, function (err) {
        if (err) {
            res.status(404).json({
                message: 'Owner not found by id',
                errmsg: err
            });
        } else {
            Pet.find({
                ownerID: req.params.id
            }, function (err, pets) {
                if (err) {
                    res.json(err);
                } else if (pets.length > 0) {
                    res.json(pets)
                } else {
                    res.json({
                        message: 'No pets associated with this owner'
                    })
                }
            })
        }
    });
};

router.findNumberOfPetsPerOwner = (req, res) => {
    Owner.findById(req.params.id, function (err) {
        if (err) {
            res.status(404).json({
                message: 'Owner not found by id',
                errmsg: err
            });
        } else {
            Pet.find({
                ownerID: req.params.id
            }, function (err, pets) {
                if (err) {
                    res.json(err);
                } else if (pets.length > 0) {
                    res.json({
                        total: pets.length
                    })
                } else {
                    res.json({
                        message: 'No pets associated with this owner'
                    })
                }
            })
        }
    });
};

router.findTotalNumberOfOwners = (req, res) => {
    Owner.find(function (err, owners) {
        if (err) {
            res.send(err);
        } else {
            if (owners.length > 0) {
                res.json({
                    totalOwners: owners.length
                });
            } else {
                res.json({
                    message: 'No owners in database'
                })
            }
        }
    })
};

router.searchOwner = (req, res) => {
    Owner.find(function (err, owners) {
        if (err) {
            res.send(err);
        } else {
            var options = {
                keys: ['firstname', 'lastname', 'email'],
                threshold: 0.3
            };

            var fuse = new Fuse(owners, options);
            var query = req.body.query;
            var results = fuse.search(query);

            if (query.length === 0) {
                res.json({
                    message: 'Please enter a query to search'
                });
            } else if (results.length === 0) {
                res.json({
                    message: 'No results found for this search term'
                });
            } else {
                res.json(results);
            }
        }
    });
};

module.exports = router;