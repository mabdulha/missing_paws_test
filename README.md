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

## Sample Test execution.

. . . . . In this section include a listing of the output from running your tests. Simply copy the output from your terminal and past it into a fenced block, as shown below. Do not use a screenshot.

~~~
  Catalogue
    findProductByName
      ✓ should find a valid product name
      ✓ should return null for invalid product name
    removeProductByName
      ✓ should remove product with a valid name
      ✓ should return -1 when asked to remove invalid product
    checkReorder
      ✓ should return an empty array when no products need reordering
      ✓ should report those products that need reordering when present
      ✓ should include products just on their reorder level
      ✓ should handle an empty catalogue
    updateStock
      ✓ should update catalogue when invoice is fully valid
      ✓ should return invalid product lines, while still applying the valid ones
      ✓ should throw an error when a line is missing a product name
      ✓ should throw an error when a line is missing a quantity
    search
      ✓ should return products whose name contains the substring
      ✓ should return products whose price is below the limit
      ✓ should throw an error when criteria is not valid option
      boundry cases
        ✓ should return empty array for no name matches
        ✓ should return empty array for no products below the limit
        ✓ should return products whose price is below or on the limit


  18 passing (18ms)
~~~


[datamodel]: ./img/missing-paws-data-model