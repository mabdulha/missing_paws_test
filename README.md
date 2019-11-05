# Assignment 1 - Agile Software Practice.

# Missing Paws

Name: Mozeeb Abdulha

## Overview.

This project is a Web App which allows pet owners to report their missing pets in a hope for others to help find the pet.  For this part of the assignment it iis just a basic CRUD with search and some statistics eg. number of missing pets ect.

## API endpoints.

 -- Owners --

 + GET /owners - Get all Owners.
 + GET /owners/:id - Get all owners by their ID.
 + GET /owners/:id/pets - Get the pets which belong to the onwer based on the owner ID.
 + GET /owners/total - Get the total number of owners in the database (for statistics).
 + GET /owners/search - Get a search result of owners based on their firstname, lastname and email without typing full query (used fuzzy search from Fuse.js).
 + GET /owners/:id/pets/total - Get the total number of pets for the owner whose ID is passed in the params.
 + POST /owners - Add an owner.
 + PUT /owners/:id/update - Update the owner based on the ID passed.
 + DELETE /owners/:id - Delete the owner based on the ID passed.

 -- Pets --
 + GET /pets- Get all Pets.
 + GET /pets/:id - Get all petss by their ID.
 + GET /pets/views - Get the total amount of all the views from the pets in the Database.
 + GET /pets/total - Get the total number of pets in the database (for statistics).
 + GET /pets/search - Get a search result of pets based on their name, type and species without typing full query (used fuzzy search from Fuse.js).
 + GET /pets/missing - Get a list of all the missing pets.
 + GET /pets/found - Get a list of all the found pets.
 + GET /pets/totalmissing - Get the total amount of all missing pets (for statistics).
 + GET /pets/totalfound - Get the total amount of all found pets (for statistics).
 + POST /owners/:id/pets - Add a pet based on the owner.
 + PUT /pets/:id/view - Update the pet to increment a view onto the pets view field (Add +1 onto it, for statistics).
 + PUT /pets/:id/status - Update the pet's missing status eg. if the pet is found this route chhange the missing field from true to false.
 + Delete /pets/:id - Delete the pet based on the ID passed


## Data model.

 -- Owner Schema --

~~~

firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    phoneNum: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    }

~~~

 -- Sample output --

 ~~~
    {
          "_id": "5dbc702ea8fdae1870ce2137",
          "firstname": "Mozeeb",
          "lastname": "Abdulha",
          "phoneNum": "0897456321",
          "email": "ma@gmail.com",
          "__v": 0
     }
 ~~~

 -- Pet Schema --

~~~

name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    species: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    colour: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    lastSeenAddress: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0,
        required: true
    },
    missing: {
        type: Boolean,
        default: true
    },
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "owners"
    }

~~~

 -- Sample output --

 ~~~
    {
          "views": 0,
          "missing": true,
          "_id": "5dbc705ffe4a240b8ce14622",
          "name": "Charlie",
          "type": "Dog",
          "species": "Pitbull",
          "gender": "Male",
          "colour": "black",
          "size": "2 meters",
          "age": "5 years",
          "lastSeenAddress": "12 Walking Street, Waterford",
          "ownerID": "5db4bbff17b11a286ca06200",
          "__v": 0
    }
 ~~~

## Sample Test execution.

~~~
 Owners
    GET /owners
Successfully Connected to [ admin ]
GET /owners 200 13.698 ms - 430
      √ should GET all the owners (40ms)
    GET /owners/:id
      when the id is valid
GET /owners/5dc082021c030d4268d4e1e4 200 9.270 ms - 218
        √ should return the matching owner
      when the id is invalid
GET /owners/123 404 3.767 ms - 218
        √ should return the NOT found message
    Post /owners
POST /owners 200 33.607 ms - 172
      √ should return a confirm message and update the database (39ms)
GET /owners/5dc082021c030d4268d4e1ea 200 9.731 ms - 214
    Delete /owners/:id
      when the id is valid
DELETE /owners/5dc082021c030d4268d4e1eb 200 13.448 ms - 40
        √ should return a message when the owner is deleted
    when the id is invalid
      √ should return a message when owner can not be found
DELETE /owners/123456 404 0.440 ms - 229
    PUT /owners/:id/update
      when the id is valid
PUT /owners/5dc082021c030d4268d4e1ef/update 200 21.415 ms - 177
        √ should return a message and update owner details
GET /owners/5dc082021c030d4268d4e1ef 200 6.896 ms - 216
      when the id is invalid
PUT /owners/9999999/update 404 0.517 ms - 55
        √ should return a 404 and a message for invalid owner id
    GET /owners/search
GET /owners/search 200 13.321 ms - 133
      √ should return the queried owner
GET /owners/search 200 8.390 ms - 51
      √ should return error message if nothing is found
GET /owners/search 200 8.090 ms - 44
      √ should return an error message if the query is blank
    GET /owners/total
GET /owners/total 200 8.904 ms - 17
      √ should return total amount of all the owners

  Pets
    GET /pets
GET /pets 200 8.113 ms - 881
      √ should GET all the pets
    GET /pets/:id
      when the id is valid
GET /pets/5dc082031c030d4268d4e1fe 200 11.085 ms - 442
        √ should return the matching pet
      when the id is invalid
GET /pets/123 404 0.749 ms - 214
        √ should return the NOT found message
    PUT /pets/:id/view
      when the id is valid
PUT /pets/5dc082041c030d4268d4e202/view 200 18.839 ms - 322
        √ should return a message and the view should increase by 1
GET /pets/5dc082041c030d4268d4e202 200 7.911 ms - 442
    when the id is invalid
PUT /pets/123654/view 404 0.342 ms - 249
      √ should returnn a 404 as id does not exist
    Delete /pets/:id
      when the id is valid
DELETE /pets/5dc082041c030d4268d4e206 200 9.967 ms - 38
        √ should return a message when the pet is deleted
    when the id is invalid
      √ should return a message when pet can not be found
DELETE /pets/123456 404 0.445 ms - 225
    Put /pets/:id/status
      when the id is invalid
PUT /pets/5dc082041c030d4268d4e20a/status 200 17.581 ms - 319
        √ should update the missing status
GET /pets/5dc082041c030d4268d4e20a 200 15.114 ms - 441
    when the id is invalid
PUT /pets/123654/view 404 0.566 ms - 249
      √ should returnn a 404 as id does not exist
    GET /pets/views
      √ should return the total number of views across all pets
    GET /pets/total
GET /pets/views 200 10.745 ms - 16
GET /pets/total 200 8.091 ms - 15
      √ should return total amount of all the pets
    GET /pets/totalmissing
GET /pets/totalmissing 200 11.957 ms - 18
      √ should return total amount of all the missing pets
    GET /pets/totalfound
GET /pets/totalfound 200 7.691 ms - 16
      √ should return total amount of all the found pets
    GET '/pets/missing
GET /pets/missing 200 8.984 ms - 272
      √ should return all the missing pets
    GET '/pets/found
GET /pets/found 200 8.013 ms - 273
      √ should return all the found pets
    GET /pets/search
GET /pets/search 200 9.210 ms - 272
      √ should return the queried pet
GET /pets/search 200 10.431 ms - 51
      √ should return error message if nothing is found
GET /pets/search 200 7.752 ms - 44
      √ should return an error message if the query is blank

  Relationship
    GET /owners/:id/pets
      when the id is valid
GET /owners/5dc082051c030d4268d4e21f/pets 200 14.858 ms - 544
        √ should return the owners pets
      when the id is invalid
PUT /owners/9999999/update 404 0.370 ms - 55
        √ should return a 404 and a message for invalid owner id
    GET /owners/:id/pets/total
GET /owners/5dc082051c030d4268d4e227/pets/total 200 15.791 ms - 11
      √ should return total number of pets foor the owner passed in params
    when the id is invalid
PUT /owners/9999999/update 404 0.545 ms - 55
      √ should return a 404 and a message for invalid owner id
    POST /owners/:id/pets
POST /owners/5dc082061c030d4268d4e22f/pets 200 11.635 ms - 317
      √ should return a confirm message and update the database
GET /pets/5dc082061c030d4268d4e233 200 7.286 ms - 445
    when the id is invalid
PUT /owners/9999999/update 404 0.341 ms - 55
      √ should return a 404 and a message for invalid owner id


  36 passing (5s)
~~~

![datamodel](https://github.com/mabdulha/missing_paws_test/tree/master/img/missing-paws-data-model.jpg)