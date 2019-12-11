let Pet = require("../models/pets")
let express = require("express")
let router = express.Router()
let Fuse = require("fuse.js")

router.findAll = (req, res) => {
    res.setHeader("Content-Type", "application/json")

    Pet.find(function (err, pets) {
        if (err) {
            res.send(err)
        } else if (pets.length === 0) {
            res.json({
                message: "No pets on database"
            })
        } else {
            res.send(JSON.stringify(pets, null, 5))
        }
    })
}

router.findOne = (req, res) => {
    res.setHeader("Content-Type", "application/json")
    Pet.find({
        "_id": req.params.id
    }, function (err, pets) {
        if (err) {
            res.status(404).send({
                message: "Pet not found",
                errmsg: err
            })
        } else if (pets.length === 0) {
            res.json({
                message: "Pet doesnt exist"
            })
        } else {
            res.send(JSON.stringify(pets, null, 5))
        }
    })
}

router.addPet = (req, res) => {
    res.setHeader("Content-Type", "application/json")

    let pet = new Pet()
    pet.name = req.body.name
    pet.type = req.body.type
    pet.species = req.body.species
    pet.gender = req.body.gender
    pet.colour = req.body.colour
    pet.size = req.body.size
    pet.age = req.body.age
    pet.lastSeenAddress = req.body.lastSeenAddress
    pet.lastSeenDate = req.body.lastSeenDate
    pet.ownerID = req.body.ownerID

    pet.save(function (err) {
        if (err) {
            res.json({
                message: "Pet not added",
                errmsg: err
            })
        } else {
            res.json({
                message: "Pet Added to database",
                data: pet
            })
        }
    })
}

router.updatePet = (req, res) => {
    Pet.findById(req.params.id, function (err, pets) {
        if (err) {
            res.status(404).send({
                message: "Cannot find pet associated with that id",
                errmsg: err
            })
        } else {
            if (req.body.name) {
                pets.name = req.body.name
            }
            if (req.body.type) {
                pets.type = req.body.type
            }
            if (req.body.species) {
                pets.species = req.body.species
            }
            if (req.body.gender) {
                pets.gender = req.body.gender
            }
            if (req.body.colour) {
                pets.colour = req.body.colour
            }
            if (req.body.size) {
                pets.size = req.body.size
            }
            if (req.body.age) {
                pets.age = req.body.age
            }
            if (req.body.lastSeenAddress) {
                pets.lastSeenAddress = req.body.lastSeenAddress
            }

            pets.save(function (err) {
                if (err) {
                    res.json({
                        message: "Pet not updated",
                        errmsg: err
                    })
                } else {
                    res.json({
                        message: "Pet updated successfully",
                        data: pets
                    })
                }
            })
        }
    })
}

router.incrementViews = (req, res) => {
    Pet.findById(req.params.id, function (err, pet) {
        if (err) {
            res.status(404).send({
                message: "Cannot find pet associated with that id",
                errmsg: err
            })
        } else {
            pet.views += 1
            pet.save(function (err) {
                if (err) {
                    res.json({
                        message: "View could not be incremented",
                        errmsg: err
                    })
                } else {
                    res.json({
                        message: "View incremented successfully",
                        data: pet
                    })
                }
            })
        }
    })
}

router.updateMissingStatus = (req, res) => {
    Pet.findById(req.params.id, function (err, pet) {
        if (err) {
            res.send({
                message: "Cannot find pet associated with that id",
                errmsg: err
            })
        } else if (pet.missing === false) {
            pet.missing = true
            pet.save(function (err) {
                if (err) {
                    res.json({
                        message: "Status could not be updated",
                        errmsg: err
                    })
                } else {
                    res.json({
                        message: "Status updated successfully ",
                        data: pet
                    })
                }
            })
        } else if (pet.missing === true) {
            pet.missing = false
            pet.save(function (err) {
                if (err) {
                    res.json({
                        message: "Status could not be updated",
                        errmsg: err
                    })
                } else {
                    res.json({
                        message: "Status updated successfully ",
                        data: pet
                    })
                }
            })
        } else {
            res.send({
                message: "Could not update status"
            })
        }
    })
}

router.deletePet = (req, res) => {
    Pet.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.status(404).json({
                message: "Pet not deleted",
                errmsg: err
            })
        } else {
            res.json({
                message: "Pet successfully deleted"
            })
        }
    })
}

function getTotalViews(array) {
    let totalViews = 0
    array.forEach(function (obj) {
        totalViews += obj.views
    })
    return totalViews
}

router.findTotalViews = (req, res) => {
    Pet.find(function (err, pets) {
        if (err) {
            res.send(err)
        } else {
            res.json({
                totalViews: getTotalViews(pets)
            })
        }
    })
}

router.findTotalNumberOfPets = (req, res) => {
    Pet.find(function (err, pets) {
        if (err) {
            res.send(err)
        } else {
            if (pets.length > 0) {
                res.json({
                    totalPets: pets.length
                })
            } else {
                res.json({
                    message: "No pets in database"
                })
            }
        }
    })
}

router.findAllMissingPets = (req, res) => {
    Pet.find({
        missing: true
    }, function (err, pets) {
        if (err) {
            res.json({
                errmsg: err
            })
        } else if (pets.length > 0) {
            res.json(pets)
        } else {
            res.json({
                message: "No lost pets"
            })
        }
    })
}

router.findAllFoundPets = (req, res) => {
    Pet.find({
        missing: false
    }, function (err, pets) {
        if (err) {
            res.json({
                errmsg: err
            })
        } else if (pets.length > 0) {
            res.json(pets)
        } else {
            res.json({
                message: "No pets have been found"
            })
        }
    })
}

router.searchPet = (req, res) => {
    Pet.find(function (err, pets) {
        if (err) {
            res.send(err)
        } else {
            let options = {
                keys: ["name", "type", "species"],
                threshold: 0.3
            }

            let fuse = new Fuse(pets, options)
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

router.findTotalNumberOfMissingPets = (req, res) => {
    Pet.countDocuments({
        missing: true
    }).exec((err, count) => {
        if (err) {
            res.send(err)
        } else {
            res.send({
                totalMissing: count
            })
        }
    })
}

router.findTotalNumberOfFoundPets = (req, res) => {
    Pet.countDocuments({
        missing: false
    }).exec((err, count) => {
        if (err) {
            res.send(err)
        } else {
            res.send({
                totalFound: count
            })
        }
    })
}

module.exports = router
