const LocalStrategy = require("passport-local").Strategy;
const { authenticate } = require("passport");
const {poolbutton} = require("./dbConfig");
const bcrypt = require("bcrypt");
const { isMatch, identity } = require("lodash");
const passport = require("passport");
/*const {createPool} = require('mysql');
const poolbutton = createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"buttonledger",
    connectionLimit:100
});*/



function initialize(passport){
    const authenticateUser = (email, password, done)=>{
        
        var sql2= 'SELECT * FROM identity WHERE email = ?';
        poolbutton.query(sql2, [email], function (err, results){

            let user = [];
            if (err) throw err;
            console.log(results);
           

            if(results.length>0){
                console.log('i am a man');
                let user = results[0];
                console.log(user);
                console.log('i am stuck');
                bcrypt.compare(password, user.password, (err, isMatch)=>{
                    if (err){
                         throw err;
                    }

                    if (isMatch){
                        console.log(user.user_name);
                        return done(null, user);
                    }else{
                        return done(null, false, {message: "password is not correct"});
                    }
                });
            } else {
                return done(null, false, {message:"User does not exist, please proceed to register"});
            }
    
        
        });

        
    }

    passport.use(
        new LocalStrategy({
            usernameField: "email",
            passwordField: "password"
        }, authenticateUser
    )
    );

    passport.serializeUser((user, done)=> done(null, user.id));
    
    passport.deserializeUser((id, done)=>{
        poolbutton.query(
            "SELECT * FROM identity WHERE id = ?", [id], (err, results)=>{
                if (err) {
                    throw err;
                }

                console.log('i love Jesus Christ');
                console.log(results[0]);
                return done(null, results[0]);
                
                
            }
        );
        
    });
}

module.exports = initialize