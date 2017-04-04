var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
require('../index').toContext(global);


//------------------------
// ADD SEEDS BELOW
//------------------------


// suggested module for generating fake contextual data
var Faker = require('faker');


// For Example

user.create([{
    firstName: 'Aryo',
    email: 'prasetyo.mailbox@gmail.com',
    password: 'merdeka123',
    lastName: '-'
}])

.then(() => {
    // console.log('Seed complete!');
    mongoose.connection.close();
});

// be sure to close the connection once the queries are done
