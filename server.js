const express = require("express");
const app = express();
const path = require('path');
const {poolbutton} = require("./dbConfig");
const { authenticate } = require("passport");


const bcrypt = require("bcrypt");
const { message } = require("statuses");
const { has, results } = require("lodash");
const session = require("express-session");
const flash = require("express-flash");

const passport = require("passport");

const bodyParser = require("body-parser");
const cors = require("cors");





const initializePassport = require("./passportConfig");
const { is } = require("type-is");
initializePassport(passport);

const PORT= process.env.PORT || 4000;





app.set("view engine", "ejs");

//app.use(express.static(path.join(__dirname, 'public')));

let initialPath = path.join(__dirname, 'public');
app.use(express.static(initialPath));

app.use(express.urlencoded({extended: true}))
app.use(session({
    secret:"secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next)=>{
    res.locals.user = req.user;
    next();
});


app.get("/", checkAuthenticated, (req, res)=>{
    //res.render("button");
    res.sendFile(path.join(initialPath, "button.html"))
});
app.get("/users/channels", checkIfAuthenticated, (req, res)=>{
    
    res.sendFile(path.join(initialPath, "channels.html"))
});

app.get("/users/banking", checkIfAuthenticated, (req, res)=>{
    
    res.sendFile(path.join(initialPath, "banking.html"))
});


app.get("/users/register", checkAuthenticated, (req, res)=>{
    res.render("register");
});


app.get("/users/login", checkAuthenticated, (req, res)=>{
    res.render("login");
});

app.get("/users/createPayID", checkIfAuthenticated, (req, res)=>{
    res.render("createPayID");
});

app.get("/users/transfer", checkIfAuthenticated, (req, res)=>{
    res.render("transfer");
});



app.get("/users/landingbutton", checkNotAuthenticated, async (req, res)=>{

    console.log('i love Jesus Christ');
    //let reserve = await getReservefromdb(req.user.email);
    console.log(req.user.email);
    
    console.log('this is it');

    let sql = 'SELECT * FROM financialassets where Email_new = ?';
    poolbutton.query(sql,[req.user.email], (err, result, fields)=>{
        //console.log(result[0].Reserve);
        if(req.user.accountnumber>0){
            console.log(result[0].Reserve);
            res.sendFile(path.join(initialPath, "landingbutton.html"));
            //res.render("landingbutton",{person: req.user.user_name, Reserve: result[0].Reserve, Rodeo: req.session.passport.user});
        } else {
            /*let sql = 'SELECT * FROM financialassets where Email_new = ?';
            poolbutton.query(sql,[req.user.email],(err,result,field)=>{
                if(result[0].user_id){
                    res.render("landingbutton",{person: req.user.user_name, Reserve: result[0].Reserve, Rodeo: req.session.passport.user});
                }else{
                    res.render("landingbutton",{person: req.user.user_name, Reserve: 0, Rodeo: req.session.passport.user});
                }
            });*/
            res.sendFile(path.join(initialPath, "landingbutton.html"))
            //res.render("landingbutton",{person: req.user.user_name, Reserve: 0, Rodeo: req.session.passport.user});
        }
        
        //res.render("landingbutton",{person: req.user.user_name, Reserve: result[0].Reserve, Rodeo: req.session.passport.user});
    });
    //res.render("landingbutton",{person: req.user.user_name, Reserve: reserve, Rodeo: req.session.passport.user});
    
    
});

//api get calls.
app.get('/api/data/:key', (req, res)=>{
    const key = req.params.key;
    console.log('down is key');
    console.log(key);
    console.log(req.user.id);
    console.log('up is key');

    
    let queryy = 'SELECT * FROM identity where id = ?';
    //query mysql with provided key
    poolbutton.query(queryy, [req.user.id], (err, result)=>{
        if (err){
            console.error('error querying mysql:', err);
            return res.status(500).json({error:'database query error'});
        }
        //if result is found
        if(result.length>0){
            console.log(result[0].user_name + result[0].id )
            res.json({
                data1: result[0].user_name, 
                data2:result[0].id});
            console.log(result[0].user_name + result[0].id )
        }else{
            res.json({
                data1:'no data found',
                data2:'no data for the given column'
            })
        }
    });
});

app.get('/api/tacvthings', (req, res)=>{
    const key = req.params.key;
    console.log(key);
    let queryy = 'SELECT * FROM financialassets WHERE Email_new = ?';
    poolbutton.query(queryy, [req.user.email], (err, result)=>{
        if(err){
            return res.status(500).json({error:'database query error'});

        }
        //if result found
        if(result.length>0){
            res.json({tacv:result[0].Tacv});
        }else{
            res.json({
                tacv:'0'
            })
        }
    })
})

app.get('/api/:fetchfinance', (req, res)=>{
    const key= req.params.fetchfinance;
    console.log(key);
    console.log(req.user.email);
    const queryy= 'SELECT * FROM financialassets WHERE Email_new = ?';
    //query mysql with provided key
    poolbutton.query(queryy, [req.user.email], (err, result)=>{
        console.log(req.user.email);
        console.log(result);
        if (err){
            return res.status(500).json({error:'database query error'});
        }
        //if result is found
        if(result.length>0){
            let sql = 'SELECT * FROM financialassets where Email_new = ?';
            poolbutton.query(sql,[req.user.email],(err,result,field)=>{
                if(result[0].user_id){
                console.log(result[0].Reserve);
                res.json({fetchfinancevalue1: result[0].Reserve})
                }else{
                    res.json({
                        fetchfinancevalue1: '0'
                    })
                }
            });
            
        } else{
            res.json({
                fetchfinancevalue1:'0'
            })
        }
    });
});



app.get("/users/logout", (req, res)=>{
    req.logOut(function(err){
        if (err){
            return next(err);
        }
        req.flash("success_msg", "you have logged out");
        res.redirect("/users/login");
    });
    
});


/*app.post('/users/landingbuton', (req, res)=>{
    
})*/


app.post('/users/register', async (req, res)=>{
    let {firstname, lastname, Email, title, jobtitle, company, country, password, password2, opt1, opt2} = req.body;
    console.log({
        firstname, lastname, Email, title, jobtitle, company, country, password, password2, opt1, opt2
    });

    let errors=[];
    if (!firstname || !Email || !lastname || !jobtitle || !company || !country || !password || !password2) {
        errors.push({message:"Please enter all fields"});
    }

    if (password.length<7){
        errors.push({message:"Password must be at least 7 characters"});
    }

    if(password != password2){
        errors.push({ message: "Passwords do not match"});
    }

    if (errors.length>0){
        res.render("register", {errors});
        console.log(errors);
    } else {
        //form validation has passed
        let hashedpassword = await bcrypt.hash(password, 11);
        console.log(hashedpassword);

       var sql = "SELECT * FROM identity where email = ?";
       poolbutton.query(sql, [Email],
        function(err,results){
            if (err) throw err;
            console.log(results);

            if(results.length>0) {
                errors.push({message:"This email already has an existing user"});
                
                res.render("register", {errors});
            }else {
                
                poolbutton.query("INSERT INTO identity (email, user_name, title, password) VALUES (?,?,?,?)",[Email, firstname + " " + lastname, jobtitle, hashedpassword], function (err, results){
                    if (err) throw err;
                    console.log(results);
                    req.flash('success_msg',"You have already been registered, proceed to log in");
                    res.redirect('/users/login'); 
                });
                    
                
            }
            
        }
       );
        
    }

});



app.post("/users/login", passport.authenticate('local', {
    successRedirect:"/users/landingbutton",
    failureRedirect: "/users/login",
    
    failureFlash: true
}));







function checkAuthenticated(req,res,next){
    if (req.isAuthenticated()){
        return res.redirect("/users/landingbutton");
    }
    
    next();

}

function checkNotAuthenticated(req,res,next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/users/login");
}

function checkIfAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/users/login");
}



app.post('/users/createPayID', async(req, res) =>{
    const userID = req.user.id;
    const Emaill= req.user.email;
    console.log(Emaill);
    let {PayID, newPayID} = req.body;
    console.log("i am a vig boy");
    let errors=[];
    if(!PayID||!newPayID){
        console.log("i am a big boy");
        errors.push({message:'please enter all fields'});
    }else{
        if (PayID != newPayID){
            console.log("i am a very big boy");
            errors.push({message: 'Payment pin  does not match'});
            res.render("createPayID", {errors});
            
        } else{ 
            var sql = "SELECT * FROM financialassets where Email_new = (?)";
            poolbutton.query(sql, [Emaill],
            function(err, results){
                if (err) throw err;
                console.log(results);

                if (results.length>0) {
                    console.log('ompa');
                    errors.push({message:"This account has already created transaction pin"});
                
                    res.render("createPayID", {errors});
                } else {
                
                if (errors.length>0){
                    res.render("createPayID", {errors});
                    console.log(errors);
                } else {
                    
                    console.log(Emaill);
                    
                    let sql="INSERT INTO financialassets (PayID, Email_new) VALUES (?,?)";
                    poolbutton.query(sql, [PayID, Emaill ], (err, field, results)=>{
                        if (err) throw err;
                        console.log(PayID);
                        console.log(userID);
                        console.log(Emaill);
                        
                        //select the new ID and make it into a variable account number.
                        let actnum = "";
                        poolbutton.query('SELECT user_id FROM financialassets WHERE Email_new = (?)',[Emaill], (err, rows, fields)=>{
                            if (err){
                                throw err;
                            }else {
                                setname(rows[0].user_id);
                            }
                        });

                        function setname(value){
                            actnum = value;
                            console.log('get here')
                            console.log(actnum);
                            console.log('im here')
                        
                        //the next step is to put the acct number inside identity table
                       
                        let sql3="UPDATE identity SET accountnumber = ? WHERE email = ?";
                        
                        poolbutton.query(sql3, [actnum, Emaill],(err, field, results)=>{
                            if (err) throw err;
                            //console.log(results);
                                })}
                            });
                            req.flash('success_msg',"Your pin and transactioin profile has been created, you can transact now");
                            res.redirect('/users/createPayID'); 
                        }
                    }
})}}   
});


app.post("/submittransfer", async (req, res) =>{
    
    const userID = req.user.id;
    const Emaill= req.user.email;

    let {TitleBank, payId, Amount, PaymentPin}= req.body;
    console.log(TitleBank);
    let message;
    if (!TitleBank||!payId||!Amount||!PaymentPin){
        //errors.push('Please enter all fields');ejs
        //res.render("transfer", {errors});ejs
        message ='Please enter all fields';
        res.json({failuremessage: message})

    } else {
        console.log(Emaill)
        let sql = 'SELECT * FROM financialassets WHERE Email_new = ?';
        poolbutton.query(sql,[Emaill], (err, result, fields)=>{
            //reference for future codes.
            console.log(result[0]);
            console.log(result[0].PayID);
            if (PaymentPin != result[0].PayID){
                if (err) throw err;
                console.log(result[0].PayID);
                //req.flash('failure_msg',"Your transaction pin is incorrect");
                res.json({message: 'Your transaction pin is incorrect'})
                //res.redirect('/users/banking');
            } else {
                poolbutton.query('SELECT * FROM financialassets WHERE Email_new = ?',[Emaill], (err, result, fields)=>{
                    console.log(result[0].Reserve);
                    if (Amount > result[0].Reserve){
                        
                        console.log('your money not too big yet');
                        res.json({message:'You have insufficient balance in your reserve'});
                        //res.redirect('/users/transfer');
                    } else {
                        if(TitleBank != 'Button'){
                            //other bank route function here
                        } else {
                            if (Emaill == payId){
                                res.json({message:'You cant transfer to your own account.'});
                                //res.redirect('/users/transfer');
                            } else {

                           //res.redirect('users/finalconfirmation');
                           
                           
                            let trxcost = '';

                            function trxcosting(value){
                                if(value>=0 && value <100){
                                    return 30;
                                }else if(value>=100 && value <1000){
                                    return 87;
                                }else if(value>=1000 && value <10000){
                                    return 96;
                                }else{
                                    return 300
                                }

                            }

                           
                            let sql= 'SELECT * FROM identity WHERE email = ?';
                            poolbutton.query(sql, [payId],
                                function (err, results){
                                    if(results.length>0){
                                        let sql='SELECT * FROM identity WHERE email = ?'
                                poolbutton.query(sql, [payId],(err, result, fields)=>{
                                    if(result[0].accountnumber>0){
                                        let sql='SELECT * FROM identity WHERE email = ?';
                                        poolbutton.query(sql, [payId], (err, result, fields)=>{
                                            if (err) throw err;
                                            console.log(result[0].user_name);
                                            res.json({
                                                success: true,
                                                price: Amount,
                                                person:result[0].user_name,
                                                remail:result[0].email
                                            })
                                        })
                                        

                                    } else {
                                        res.json({message:'The user does not have a transaction profile'});
                                        //res.redirect('/users/transfer');
                                    }
                                })
                                    }else{
                                        res.json({message:'The user is not yet registered on button, please do invite the user'});
                                        //res.redirect('/users/transfer');
                                    }
                                }
                            )

                                
                                
                        }}
                    }
                })
            }
        });
    }
} );

app.post("/finaltransfer", async (req,res)=>{
    const userID = req.user.id;
    const Emaill= req.user.email;
    let {TitleBank, payId, Amount, PaymentPin}= req.body;
    let trxcost = '';

    function trxcosting(value){
         if(value>=0 && value <100){
            return 30;
        }else if(value>=100 && value <1000){
            return 87;
        }else if(value>=1000 && value <10000){
            return 96;
        }else{
            return 300
            }

        }
        console.log(Amount);
        console.log()
    poolbutton.query('UPDATE financialassets SET Tacv =Tacv +(?), Reserve = Reserve + (?) WHERE Email_new = ?',[Amount, Amount, payId],(err,results)=>{
        if (err) throw err;
        trxcost = trxcosting(Amount);
        console.log(trxcost);
        console.log('up is trscost');
        let sql ='UPDATE financialassets SET Tacv =Tacv -(?)-(?), Reserve = Reserve - (?) - (?) WHERE Email_new = ?'
        poolbutton.query(sql,[Amount, trxcost, Amount, trxcost, Emaill],(err, results, fields)=>{
            if (err) throw err;
            console.log('congratulations on your first successful transfer');
            res.json({success: true});
            //res.redirect('/users/transfer');
            let sql='UPDATE buttonsrevenue SET Transactionfees = Transactionfees + (?) WHERE country = "nigerianaccounts"';
            poolbutton.query(sql,[trxcost],(err,results, fields)=>{
                if (err) throw err;
                console.log('thank God button don collect theeir own share')
            })
            
        })
    });

})

app.post('/perform-transfer', (req, res)=>{
    const {price, remail}= req.body;
    console.log(price);
    console.log(remail);
    console.log('God please');
    const Emaill= req.user.email;
        function trxcosting(value){
        if(value>=0 && value <100){
           return 30;
       }else if(value>=100 && value <1000){
           return 87;
       }else if(value>=1000 && value <10000){
           return 96;
       }else{
           return 300
           }

       }

       poolbutton.query('UPDATE financialassets SET Tacv =Tacv +(?), Reserve = Reserve + (?) WHERE Email_new = ?',[price, price, remail],(err,results)=>{
        if (err) throw err;
        trxcost = trxcosting(price);
        console.log(trxcost);
        console.log('up is trscost');
        let sql ='UPDATE financialassets SET Tacv =Tacv -(?)-(?), Reserve = Reserve - (?) - (?) WHERE Email_new = ?'
        poolbutton.query(sql,[price, trxcost, price, trxcost, Emaill],(err, results, fields)=>{
            if (err) throw err;
            console.log('congratulations on your first successful transfer');
            //res.json({success: true});
            //res.redirect('/users/transfer');
            let sql='UPDATE buttonsrevenue SET Transactionfees = Transactionfees + (?) WHERE country = "nigerianaccounts"';
            poolbutton.query(sql,[trxcost],(err,results, fields)=>{
                if (err) throw err;
                console.log('thank God button don collect theeir own share')
                res.json({success:true, message:'update successful'})
            })
            
        })
    });


})





//async function
async function getReservefromdb(value){
    //const userID = req.user.id;
    //const Emaill= req.user.email;
    console.log(value);
    let sql = 'SELECT * FROM financialassets where Email_new = ?'
    poolbutton.query(sql,[value], (err, result, fields)=>{
        console.log(result[0].Reserve);
        return result[0].Reserve;
    });
}



app.listen(PORT, ()=>{
    console.log(`server is running on port  ${PORT}`);
});


//Registration







/*poolbutton.query('SELECT * FROM identity', (err, result, fields)=>{
    if(err){
        return console.log(err);
    }
    return console.log(result);
})
poolbutton.query('ALTER TABLE identity ADD password VARCHAR(20)')

poolbutton.getConnection(function(err){
    if (err) throw err;
    console.log('connected');

    var sql="CREATE TABLE FinancialAssets (user_id INT(10) NOT NULL PRIMARY KEY, Reserve INT(100))";
    
    poolbutton.query(sql, function(err, result){
        if (err) throw err;
        console.log("table created")
    });
});
poolbutton.query('INSERT INTO FinancialAssets (user_id, Reserve) VALUES (3000, "5000")', (err, result, fields)=>{
    if(err){
        return console.log(err);
    }
    return console.log(result);});

poolbutton.query('INSERT INTO FinancialAssets (Reserve) VALUES ("55000")')

poolbutton.getConnection(function(err){
    if (err) throw err;
    var sql = "SELECT identity.user_name AS user, financialassets.Reserve AS Reserved FROM identity JOIN financialassets ON identity.accountnumber = financialassets.user_id ";
    poolbutton.query(sql, function(err,result){
        if (err) throw err;
        console.log(result);
    });

       
    });*/

    


