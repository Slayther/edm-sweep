//require middleware
const db = require('./../database/db');
const crypto = require('crypto');

//create class
class User{
    //constructors
    constructor(data,needHashPassword=false){   //second parameter should be true only when we need to hash a password
        if(data.id){
            this.id = data.id;                  //if data has an ID, store it
        }
        this.email = data.email;                //store email from data
        if(needHashPassword){                                       //if we need to hash password
            data.password = crypto.createHmac('sha256','8e2db78163353ba362')     //use sha256 method, and the string '12345' as salt
                .update(data.password)
                .digest('hex');
        }
        this.password = data.password;          //store password
        this.role = data.role;
    }

    isPasswordValid(password) {
        password = crypto.createHmac('sha256', '8e2db78163353ba362')
            .update(password)
            .digest('hex');

        return this.password === password;
    }

    static getUserById(id){                         //obtains users informtaion by the user's id
        return db('Users')                          //in 'Users' table
            .where('id',id)                         //where their id matches requested id
            .then( (usersData) => {                 //new anonymous function with usersData as parameter (returned from previous sql query)
                const userData = usersData[0];      //store the user's data in a new array (index 0)
                let user = new User(userData);      //create new user object
                return user;                        //IMPORTANT!! always remember to return
            });
    }

    static getUserByEmail(email) {
        return db('Users')
            .where('email', email)
            .then((usersData) => {
                const userData = usersData[0];
                let user = new User(userData);
                return user;

            });
    }
}
module.exports = User;