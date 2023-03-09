const SQLConnection_001=require('../Database/MySQL connector')
class Authentic{
    NewUser(request_001,response_001){
        if(request_001.method=='POST'){
            var Name,MobileNo,State,Gender,eMailID,Password,Address
            Name=request_001.body.name
            MobileNo=request_001.body.mobile
            State=request_001.body.state
            Gender=request_001.body.gender
            eMailID=request_001.body.email
            Password=request_001.body.password
            Address=request_001.body.address
            SQLConnection_001.getConnection((error_001,myConnection_001)=>{
                if(error_001){
                    response_001.send(error_001)
                    response_001.end()
                }else{
                    const Query_001=`insert into new_user(Name,Mobile_No,State,Gender,eMail_ID,Password,Address) values('${Name}','${MobileNo}','${State}','${Gender}','${eMailID}','${Password}','${Address}')`;
                    myConnection_001.query(Query_001,(error_001)=>{
                        if(error_001){
                            response_001.send(error_001)
                            response_001.end()
                        }else{
                            response_001.render('New user',{result_001:1,emailID:null,Username:null})
                            response_001.end()
                        }
                    })
                }
            })
        }else{
            response_001.render('New user',{result_001:0,emailID:null,Username:null})
            response_001.end()
        }
    }
    LoginCheck(request_002,response_002){
        var eMailID_002=request_002.body.email
        var Password_002=request_002.body.password
        SQLConnection_001.getConnection((error_002,myConnection_002)=>{
            if(error_002){
                response_002.send(error_002)
                response_002.end()
            }else{
                var Query_002=`select * from new_user where eMail_ID='${eMailID_002}' and Password='${Password_002}'`
                myConnection_002.query(Query_002,(error_002,myDatabase_002)=>{
                    if(error_002){
                        response_002.send(error_002)
                        response_002.end()
                    }else{
                        if(myDatabase_002.length>0){
                            request_002.session.AnyRandomValue=eMailID_002 //Assigns the value of the variable 'eMailID_002' to the 'secret' key in 'Start.js' which is also a variable basically
                            request_002.session.AnyRandomUserName=myDatabase_002[0].Name
                            response_002.redirect('/Welcome')
                            response_002.end()
                        }else{
                            response_002.render('Home',{message_002:'Invalid login details',emailID:null,Username:null})
                            response_002.end()
                        }
                    }
                })
            }
        })
    }
    ChangePassword(request_003,response_003){
        if(request_003.session.AnyRandomValue!=null && request_003.session.AnyRandomUserName!=null){
            if(request_003.method=='POST'){
                var eMailID_003=request_003.body.email
                var Password_003=request_003.body.password
                var New_Password_003=request_003.body.new_password
                var Confirm_New_Password_003=request_003.body.confirm_password
                SQLConnection_001.getConnection((error_003,myConnection_003)=>{
                    if(error_003){
                        response_003.send(error_003)
                        response_003.end()
                    }else{
                        var Query_002=`select * from new_user where eMail_ID='${eMailID_003}' and Password='${Password_003}'`
                        myConnection_003.query(Query_002,(error_003,myDatabase_003)=>{
                            if(error_003){
                                response_003.send(error_003)
                                response_003.end()
                            }else{
                                if(myDatabase_003.length>0){
                                    if(New_Password_003==Confirm_New_Password_003){
                                        var Password_change_query_003=`update new_user set Password='${New_Password_003}' where eMail_ID='${eMailID_003}'`
                                        myConnection_003.query(Password_change_query_003,(error_003)=>{
                                            if(error_003){
                                                response_003.send(error_003)
                                                response_003.end()
                                            }else{
                                                response_003.render('Password change',{message_002:'Password changed successfully!!!<br>Re-login now!!!',emailID:eMailID_003,Username:request_003.session.AnyRandomUserName})
                                                response_003.end();
                                            }
                                        })
                                    }else{
                                        response_003.render('Password change',{message_002:'Passwords mismatch!!!<br>Kindly enter same new password in both boxes after existing password box!!!',emailID:eMailID_003,Username:request_003.session.AnyRandomUserName})
                                        response_003.end()
                                    }
                                }else{
                                    response_003.render('Password change',{message_002:'Invalid details!!!<br>Kindly re-enter or check the details!!!',emailID:eMailID_003,Username:request_003.session.AnyRandomUserName})
                                    response_003.end()
                                }
                            }
                        })
                    }
                })
            }else{
                response_003.render('Password change',{message_002:0,emailID:eMailID_003,Username:request_003.session.AnyRandomUserName})
                response_003.end()
            }
        }else{
            response_003.render('Home',{message_002:'Kindly login here!!!',emailID:eMailID_003,Username:request_003.session.AnyRandomUserName})
        }
    }
}
const Authenticate=new Authentic()
module.exports=Authenticate
