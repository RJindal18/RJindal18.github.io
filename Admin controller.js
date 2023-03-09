const SQLConnection_002=require('../Database/MySQL connector')
class Administrator{
    CheckLogin(request_002,response_002){
        if(request_002.method=='POST'){
            var AdminemailID=request_002.body.Admin_eMail
            var AdminPassword=request_002.body.Admin_Password
            SQLConnection_002.getConnection((error_002,MyConnection_002)=>{
                if(error_002){
                    response_002.send(error_002)
                    response_002.end()
                }else{
                    var Query_002=`select * from admin_details where Admin_eMail='${AdminemailID}' and Admin_Password='${AdminPassword}'`
                    MyConnection_002.query(Query_002,(error_002,MyDatabase_002)=>{
                        if(error_002){
                            response_002.send(error_002)
                            response_002.end()
                        }else{
                            if(MyDatabase_002.length>0){
                                request_002.session.AdministratoreMailID=AdminemailID
                                request_002.session.AdministratorUserName=MyDatabase_002[0].Admin_Name
                                response_002.redirect('/Admin_Dashboard')
                                response_002.end()
                            }else{
                                response_002.render('Admin login',{Message_001:'Check your Login details'});
                                response_002.end()
                            }
                        }
                    })
                }
            })
        }else{
            response_002.render('Admin login',{Message_001:0});
            response_002.end()
        }
    }
    PasswordChange(request_002,response_002){
        var APC=0
        if(request_002.session.AdministratoreMailID!=null && request_002.session.AdministratorUserName!=null){
            if(request_002.method=='POST'){
                var eMailID_002=request_002.body.eMail
                var Password_002=request_002.body.Pass
                var New_Password_002=request_002.body.NewPass
                var Confirm_New_Password_002=request_002.body.ConPass
                SQLConnection_002.getConnection((error_003,myConnection_002)=>{
                    if(error_003){
                        response_002.send(error_003)
                        response_002.end()
                    }else{
                        var Query_002=`select * from admin_details where Admin_eMail='${eMailID_002}' and Admin_Password='${Password_002}'`
                        myConnection_002.query(Query_002,(error_002,myDatabase_002)=>{
                            if(error_002){
                                response_002.send(error_002)
                                response_002.end()
                            }else{
                                if(myDatabase_002.length>0){
                                    if(New_Password_002==Confirm_New_Password_002){
                                        var Password_change_query_002=`update admin_details set Admin_Password='${New_Password_002}' where Admin_eMail='${eMailID_002}'`
                                        myConnection_002.query(Password_change_query_002,(error_002)=>{
                                            if(error_002){
                                                response_002.send(error_002)
                                                response_002.end()
                                            }else{
                                                response_002.render('Admin login',{Message_001:'Password changed successfully!!!<br>Re-login now!!!',emailID:eMailID_002,Username:request_002.session.AdministratorUserName})
                                                response_002.end();
                                            }
                                        })
                                    }else{
                                        response_002.render('Admin welcome',{emailID:eMailID_002,Username:request_002.session.AdministratorUserName,message_101:1,message_102:0})
                                        response_002.end()
                                    }
                                }else{
                                    response_002.render('Admin welcome',{emailID:eMailID_002,Username:request_002.session.AdministratorUserName,message_101:0,message_102:1})
                                    response_002.end()
                                }
                            }
                        })
                    }
                })
            }else{
                response_002.render('Admin login',{Message_001:'Kindly login again!!!',emailID:request_002.session.AdministratoreMailID,Username:request_002.session.AdministratorUserName})
                response_002.end()
            }
        }else{
            response_002.render('Admin login',{Message_001:'Kindly login here!!!',emailID:request_002.session.AdministratoreMailID,Username:request_002.session.AdministratorUserName})
        }
    }
}
const MyObject=new Administrator()
module.exports=MyObject