app.post("/users/transfer", async (req, res) =>{
    
    const userID = req.user.id;
    const Emaill= req.user.email;

    let {TitleBank, payId, Amount, PaymentPin}= req.body;
    console.log(TitleBank);
    let errors;
    if (!TitleBank||!payId||!Amount||!PaymentPin){
        //errors.push('Please enter all fields');ejs
        //res.render("transfer", {errors});ejs
        message='Please enter all fields';
        res.json({message: message})

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
                res.json({failure_msg: "Your transaction pin is incorrect"})
                res.redirect('/users/banking');
            } else {
                poolbutton.query('SELECT * FROM financialassets WHERE Email_new = ?',[Emaill], (err, result, fields)=>{
                    console.log(result[0].Reserve);
                    if (Amount > result[0].Reserve){
                        
                        console.log('your money not too big yet');
                        req.flash('failure_msg',"You have insufficient balance in your reserve");
                        res.redirect('/users/transfer');
                    } else {
                        if(TitleBank != 'Button'){
                            //other bank route function here
                        } else {
                            if (Emaill == payId){
                                req.flash('failure_msg',"You cant transfer to your own account.");
                                res.redirect('/users/transfer');
                            } else {

                           //res.redirect('users/finalconfirmation');
                           
                            /*let Transferitnow = Document.querySelector('.transferitnow');
                            let Trxtocon = Document.querySelector('.trxtoconn');
                            let Wrappertrxtocon = document.querySelector('.wrappertrxtocon');
                            let Final = document.querySelector('.final');
                            
                            Transferitnow.addEventListener('click', ()=>{
                                Trxtocon.classList.add('active')
                            })
                            Transferitnow.addEventListener('click',()=>{
                                Wrappertrxtocon.classList.add('active')
                            })*/

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

                            

                            /*if (Final){
                                Final.addEventListener('click', (req, res)=>{
                                    poolbutton.query('UPDATE identity SET Reserve = Reserve + (?) WHERE Email = ?',[Amount, payId],(err,results=>{
                                        if (err) throw err;
                                        let sql ='UPDATE identity SET Reserve = Reserve - (?) - (?) WHERE Email = ?'
                                        poolbutton.query(sql,[Amount, trxcost, Emaill],(err, results, fields)=>{
                                            if (err) throw err;
                                            console.log('congratulations on your first successful transfer');
                                            
                                        })
                                    }))
                                })
                            }*/
                            let sql= 'SELECT * FROM identity WHERE email = ?';
                            poolbutton.query(sql, [payId],
                                function (err, results){
                                    if(results.length>0){
                                        let sql='SELECT * FROM identity WHERE email = ?'
                                poolbutton.query(sql, [payId],(err, result, fields)=>{
                                    if(result[0].accountnumber>0){

                                        poolbutton.query('UPDATE financialassets SET Reserve = Reserve + (?) WHERE Email_new = ?',[Amount, payId],(err,results)=>{
                                            if (err) throw err;
                                            trxcost = trxcosting(Amount);
                                            console.log(trxcost);
                                            let sql ='UPDATE financialassets SET Reserve = Reserve - (?) - (?) WHERE Email_new = ?'
                                            poolbutton.query(sql,[Amount, trxcost, Emaill],(err, results, fields)=>{
                                                if (err) throw err;
                                                console.log('congratulations on your first successful transfer');
                                                req.flash('failure_msg',"Congratulations, your transfer is successful.");
                                                res.redirect('/users/transfer');
                                                let sql='UPDATE buttonsrevenue SET Transactionfees = Transactionfees + (?) WHERE country = "nigerianaccounts"';
                                                poolbutton.query(sql,[trxcost],(err,results, fields)=>{
                                                    if (err) throw err;
                                                    console.log('thank God button don collect theeir own share')
                                                })
                                                
                                            })
                                        });

                                    } else {
                                        req.flash('failure_msg',"The user does not have a transaction profile");
                                        res.redirect('/users/transfer');
                                    }
                                })
                                    }else{
                                        req.flash('failure_msg',"The user is not yet registered on button, please do invite the user");
                                        res.redirect('/users/transfer');
                                    }
                                }
                            )

                                
                                /*poolbutton.query('UPDATE financialassets SET Reserve = Reserve + (?) WHERE Email_new = ?',[Amount, payId],(err,results=>{
                                    if (err) throw err;
                                    trxcost = trxcosting(Amount);
                                    console.log(trxcost);
                                    let sql ='UPDATE financialassets SET Reserve = Reserve - (?) - (?) WHERE Email_new = ?'
                                    poolbutton.query(sql,[Amount, trxcost, Emaill],(err, results, fields)=>{
                                        if (err) throw err;
                                        console.log('congratulations on your first successful transfer');
                                        req.flash('failure_msg',"Congratulations, your transfer is successful.");
                                        res.redirect('/users/transfer');
                                        let sql='UPDATE buttonsrevenue SET Transactionfees = Transactionfees + (?) WHERE country = "nigerianaccounts"';
                                        poolbutton.query(sql,[trxcost],(err,results, fields)=>{
                                            if (err) throw err;
                                            console.log('thank God button don collect theeir own share')
                                        })
                                        
                                    })
                                }));*/
                           /*poolbutton.query('UPDATE identity SET Reserve = Reserve + (?) WHERE Email = ?',[Amount, payId],(err,results=>{
                            if (err) throw err;
                            let sql ='UPDATE identity SET Reserve = Reserve - (?) - (?) WHERE Email = ?'
                            poolbutton.query(sql,[Amount, trxcost, Emaill],(err, results, fields)=>{
                                if (err) throw err;
                                
                            })
                        }))*/
                        }}
                    }
                })
            }
        });
    }
} );



poolbutton.query('UPDATE financialassets SET Tacv =Tacv +(?), Reserve = Reserve + (?) WHERE Email_new = ?',[Amount,Amount, payId],(err,results)=>{
    if (err) throw err;
    trxcost = trxcosting(Amount);
    console.log(trxcost);
    let sql ='UPDATE financialassets SET Tacv =Tacv -(?)-(?), Reserve = Reserve - (?) - (?) WHERE Email_new = ?'
    poolbutton.query(sql,[Amount, trxcost, Amount, trxcost, Emaill],(err, results, fields)=>{
        if (err) throw err;
        console.log('congratulations on your first successful transfer');
        res.json({message:'Congratulations, your transfer is successful.'});
        //res.redirect('/users/transfer');
        let sql='UPDATE buttonsrevenue SET Transactionfees = Transactionfees + (?) WHERE country = "nigerianaccounts"';
        poolbutton.query(sql,[trxcost],(err,results, fields)=>{
            if (err) throw err;
            console.log('thank God button don collect theeir own share')
        })
        
    })
});