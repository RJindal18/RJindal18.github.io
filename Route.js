const express=require('express')
const Router_001=express.Router()
const bodyParser=require('body-parser')
const urlEncoded=bodyParser.urlencoded({extended:true})
const SQLConnection=require('./Database/MySQL connector')
const Authenticate=require('./Controller/Authentication')
const Administer=require('./Controller/Admin controller')
const Products=require('./Controller/Product controller')
const Multer=require('multer')
const Crypto=require('crypto')
const Path=require('path')
const Checksum=require('./Paytm/checksum')
const Config=require('./Paytm/config')
const QS=require('querystring') //Required to run query on URL
const HTTPS=require('https') //Required to run HTTPS URL
var Storage=Multer.diskStorage({
    destination:"./Assets/My uploads",
    filename:(request,file,status)=>{
        Crypto.pseudoRandomBytes(16,(error,raw)=>{
            if(error){
                return status(error)
            }else{
                status(null,raw.toString('hex')+Path.extname(file.originalname))
            }
        })
    }
})
var Upload=Multer({storage:Storage})
Router_001.get('/',(request_001,response_001)=>{
    response_001.render('Home',{message_002:0,emailID:null,Username:null})
    response_001.end()
})
Router_001.use('/New_user',urlEncoded,(request_001,response_001)=>{
    Authenticate.NewUser(request_001,response_001)
})
Router_001.use('/Login_check',urlEncoded,(request_001,response_001)=>{
    Authenticate.LoginCheck(request_001,response_001)
})
Router_001.use('/Welcome',urlEncoded,(request_001,response_001)=>{
    if(request_001.session.AnyRandomValue!=null && request_001.session.AnyRandomUserName!=null){
        SQLConnection.getConnection((error_001,MyDBase_001)=>{
            if(error_001){
                response_001.send(error_001)
                response_001.end()
            }else{
                var query_001='select * from product_details'
                MyDBase_001.query(query_001,(error_001,MyDataB_001)=>{
                    if(error_001){
                        response_001.send(error_001)
                        response_001.end()
                    }else{
                        response_001.render('Welcome',{emailID:request_001.session.AnyRandomValue,Username:request_001.session.AnyRandomUserName,Record:MyDataB_001})
                        response_001.end()
                    }
                })
            }
        })
    }else{
        response_001.render('Home',{message_002:'Please login here!!!',emailID:null,Username:null})
        response_001.end()
    }
})
Router_001.use('/Password_change',(request_001,response_001)=>{
    response_001.render('Password change',{message_002:0,emailID:request_001.session.AnyRandomValue,Username:request_001.session.AnyRandomUserName})
    response_001.end()
})
Router_001.use('/Change_password',urlEncoded,(request_001,response_001)=>{
    Authenticate.ChangePassword(request_001,response_001)
})
Router_001.use('/Logout',(request_001,response_001)=>{
    request_001.session.AnyRandomValue=null
    request_001.session.AnyRandomUserName=null
    request_001.session.destroy()
    response_001.render('Home',{message_002: 'Thanks! Logout successful',emailID:null,Username:null})
    response_001.end()
})
Router_001.use('/LS-Admin/ControlPanel',urlEncoded,(request_001,response_001)=>{
    Administer.CheckLogin(request_001,response_001)
})
Router_001.use('/Admin_Dashboard',urlEncoded,(request_001,response_001)=>{
    if(request_001.session.AdministratoreMailID!=null&&request_001.session.AdministratorUserName!=null){
    response_001.render('Admin welcome',{emailID: request_001.session.AdministratoreMailID,Username: request_001.session.AdministratorUserName,message_101:0,message_102:0})
    response_001.end()
    }else{
        response_001.render('Admin login',{Message_001: 'Login here!!!'})
        response_001.end()
    }
})
Router_001.use('/Admin_Logout',urlEncoded,(request_001,response_001)=>{
    request_001.session.AdministratoreMailID=null
    request_001.session.AdministratorUserName=null
    request_001.session.destroy()
    response_001.render('Admin login',{Message_001:'Admin logged out successfully!!!'})
    response_001.end()
})
Router_001.use('/Add_product',urlEncoded,Upload.single('Products_Image'),(request_003,response_003)=>{
    Products.AddProduct(request_003,response_003)
})
Router_001.use('/Manage_product',(request_001,response_001)=>{
    if(request_001.session.AdministratoreMailID!=null&&request_001.session.AdministratorUserName!=null){
        SQLConnection.getConnection((error_001,DB_010)=>{
            if(error_001){
                response_001.send(error_001)
                response_001.end()
            }else{
                var Query_020=`select * from product_details`
                DB_010.query(Query_020,(error_001,DB_020)=>{
                    if(error_001){
                        response_001.send(error_001)
                        response_001.end()
                    }else{
                        if(response_001.location('/Add_product')){
                            response_001.render('Manage products',{PrDB:DB_020,emailID:request_001.session.AdministratoreMailID,Username:request_001.session.AdministratorUserName,message_003:'Item added successfully!!!',message_101:0,message_102:0})
                            response_001.end()
                        }else{
                        response_001.render('Manage products',{PrDB:DB_020,emailID:request_001.session.AdministratoreMailID,Username:request_001.session.AdministratorUserName,message_003:0,message_101:0,message_102:0})
                        response_001.end()
                        }
                    }
                })
            }
        })
    }else{
        response_001.render('Admin login',{Message_001: 'Login here!!!'})
        response_001.end()
    }
})
Router_001.use('/Delete_item/:ProID',(request_001,response_001)=>{
    if(request_001.session.AdministratoreMailID!=null&&request_001.session.AdministratorUserName!=null){
        var ProduID=request_001.params.ProID
        SQLConnection.getConnection((error_001,DB_010)=>{
            if(error_001){
                response_001.send(error_001)
                response_001.end()
            }else{
                var Query_020=`delete from product_details where Product_ID='${ProduID}'`
                DB_010.query(Query_020,(error_001,DB_020)=>{
                    if(error_001){
                        response_001.send(error_001)
                        response_001.end()
                    }else{
                        if(response_001.location('back'=='/Add_product')){
                            response_001.render('Manage products',{PrDB:DB_020,emailID:request_001.session.AdministratoreMailID,Username:request_001.session.AdministratorUserName,message_003:'Item added successfully!!!',message_101:0,message_102:0})
                            response_001.end()
                        }else if(response_001.location('back'=='/Delete_item/:ProID')){
                            response_001.render('Manage products',{PrDB:DB_020,emailID:request_001.session.AdministratoreMailID,Username:request_001.session.AdministratorUserName,message_003:'Item deleted successfully!!!',message_101:0,message_102:0})
                            response_001.end()
                        }else{
                        response_001.render('Manage products',{PrDB:DB_020,emailID:request_001.session.AdministratoreMailID,Username:request_001.session.AdministratorUserName,message_003:0,message_101:0,message_102:0})
                        response_001.end()
                        }
                    }
                })
            }
        })
    }else{
        response_001.render('Admin login',{Message_001: 'Login here!!!'})
        response_001.end()
    }
})
Router_001.use('/My_product/:ProductID',(request_001,response_001)=>{
    if(request_001.session.AnyRandomValue!=null && request_001.session.AnyRandomUserName!=null){
        var ProductsID=request_001.params.ProductID
        // var ProductsName=request_001.params.ProductName
        // var ProductsPrice=request_001.params.ProductPrice
        // var ProductsImage=request_001.params.ProductImage
        SQLConnection.getConnection((error_001,MyDataBase_010)=>{
            if(error_001){
                response_001.send(error_001)
                response_001.end()
            }else{
                var Query_010=`select * from product_details where Product_ID=${ProductsID}`
                MyDataBase_010.query(Query_010,(error_001,MyDataBase_020)=>{
                    if(error_001){
                        response_001.send(error_001)
                        response_001.end()
                    }else{
                        response_001.render('My products',{/* ProdID:ProductsID,ProdName:ProductsName,ProdPrice:ProductsPrice,ProdImage:ProductsImage, */Record:MyDataBase_020,emailID:request_001.session.AnyRandomValue,Username:request_001.session.AnyRandomUserName})
                        response_001.end()
                    }
                })
            }
        })
    }else{
        response_001.render('Home',{message_002:'Please login here!!!',emailID:null,Username:null})
    }
})
Router_001.use('/Calculate',urlEncoded,(request_001,response_001)=>{
    if(request_001.session.AnyRandomValue!=null && request_001.session.AnyRandomUserName!=null){
        var ProdsID=request_001.body.ProdID
        var ProdsName=request_001.body.ProdName
        var ProdsPrice=request_001.body.ProdPrice
        var ProdsType=request_001.body.ProdType
        var ProdsImage=request_001.body.ProdImage
        var ProdsQuantity=request_001.body.ProdQuantity
        var FinalPrice=parseInt(ProdsPrice)*parseInt(ProdsQuantity)
        SQLConnection.getConnection((error_001,MyDB_010)=>{
            if(error_001){
                response_001.send(error_001)
                response_001.end()
            }else{
                var Q_010=`select * from new_user where eMail_ID='${request_001.session.AnyRandomValue}'`
                MyDB_010.query(Q_010,(error_001,MyDB_020)=>{
                    if(error_001){
                        response_001.send(error_001)
                        response_001.end()
                    }else{
                        response_001.render('Calculate product',{CustomerData:MyDB_020,PID:ProdsID,PName:ProdsName,PPrice:ProdsPrice,PType:ProdsType,PImage:ProdsImage,PQty:ProdsQuantity,PFinalPrice:FinalPrice,emailID:request_001.session.AnyRandomValue,Username:request_001.session.AnyRandomUserName})
                        response_001.end()
                    }
                })
            }
        })
    }else{
        response_001.render('Home',{message_002:'Kindly login before taking any further action!!!',emailID:null,Username:null})
    }
})
Router_001.use('/Pay_now',urlEncoded,(request_001,response_001)=>{
    if(request_001.session.AnyRandomValue!=null && request_001.session.AnyRandomUserName!=null){
        var PayerID=request_001.body.PayingID
        var PayerName=request_001.body.PayingName
        var PayerPrice=request_001.body.PayingPrice
        var PayerType=request_001.body.PayingType
        var PayerQty=request_001.body.PayingQty
        var PayerAddress=request_001.body.PayingAddress
        var PayerMobile=request_001.body.PayingMobile
        var PayerEMailID=request_001.session.AnyRandomValue
        var PayersUsername=request_001.session.AnyRandomUserName
        var PayerUsername=PayersUsername.replace(' ','_')
        var PaymentDetails={
            PayAmount: PayerPrice,
            PayID:'@'+PayerUsername, //Used nowadays to identify the user
            PayEMail:PayerEMailID,
            PayPhone:PayerMobile
            }
        request_001.session.OrderPID=PayerID
        request_001.session.OrderPName=PayerName
        request_001.session.OrderPMobile=PayerMobile
        request_001.session.OrderPAddress=PayerAddress
        if(!PaymentDetails.PayAmount || !PaymentDetails.PayID || !PaymentDetails.PayEMail || !PaymentDetails.PayPhone){
            response_001.status(400).send('Payment failed!!!')
            response_001.end()
        }else{
            var params={}
            params['MID']=Config.PaytmConfig.mid
            params['WEBSITE']=Config.PaytmConfig.website
            params['CHANNEL_ID']='WEB'
            params['INDUSTRY_TYPE_ID']='Retail'
            params['ORDER_ID']='TEST_'+new Date().getTime()
            params['CUST_ID']=PaymentDetails.PayID
            params['TXN_AMOUNT']=PaymentDetails.PayAmount
            params['CALLBACK_URL']='http://localhost:1234/Callback'
            params['EMAIL']=PaymentDetails.PayEMail
            params['MOBILE_NO'] = PaymentDetails.PayPhone
            Checksum.genchecksum(params,Config.PaytmConfig.key,function (err,checksum){
                var txn_url="https://securegw-stage.paytm.in/theia/processTransaction" //For staging
                // var txn_url="https://securegw.paytm.in/theia/processTransaction" //For production
                var form_fields=""
                for(var x in params){
                    form_fields+="<input type='hidden' name='" + x + "' value='" + params[x] + "' >"
                }
                form_fields+="<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >"
                response_001.writeHead(200,{'Content-Type':'text/html'})
                response_001.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>')
                response_001.end()
            })
        }
    }else{
        response_001.render('Home',{message_002:'Kindly login here first!!!',emailID:null,Username:null})
    }
})
Router_001.use('/Callback',(request_001,response_001)=>{
    // Route for verifiying payment
    var body=''
    request_001.on('data',function (data){
        body+=data
    })
    request_001.on('end',function (){
        var html=""
        var post_data=QS.parse(body)
        // Received params in callback
        console.log('Callback Response: ',post_data,"\n")
        // Verify the checksum
        var checksumhash=post_data.CHECKSUMHASH
        // Delete post_data.CHECKSUMHASH
        var result=Checksum.verifychecksum(post_data,Config.PaytmConfig.key,checksumhash)
        console.log("Checksum Result => ",result,"\n")
        // Send Server-to-Server request to verify Order Status
        var params={"MID":Config.PaytmConfig.mid,"ORDERID":post_data.ORDERID}
        Checksum.genchecksum(params,Config.PaytmConfig.key,function (err,checksum){
            params.CHECKSUMHASH=checksum
            var Currency=post_data.CURRENCY //Adds value of 'CURRENCY' from 'post_data' to variable 'Currency'
            post_data='JsonData='+JSON.stringify(params)
            var options={
                hostname:'securegw-stage.paytm.in', //For staging
                // hostname:'securegw.paytm.in', //For production
                port:443,
                path:'/merchant-status/getTxnStatus',
                method:'POST',
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded',
                    'Content-Length':post_data.length
                    }
                }
            // Set up the request
            var response=""
            var post_req=HTTPS.request(options,function (post_res){
                post_res.on('data',function (chunk){
                    response+=chunk
                })
                post_res.on('end',function (){
                    console.log('S2S Response: ',response,"\n")
                    var _result=JSON.parse(response)
                    if(_result.STATUS=='TXN_SUCCESS'){
                        SQLConnection.getConnection((err,OrderDetails)=>{
                            if(err){
                                response_001.send(err)
                                response_001.end()
                            }else{
                                var q=`BEGIN NOT ATOMIC
                                    insert into payment_table values('${_result.ORDERID}','${_result.MID}','${_result.TXNID}','${_result.TXNAMOUNT}','${_result.PAYMENTMODE}','${Currency}','${_result.TXNDATE}','${_result.STATUS}','${_result.RESPCODE}','${_result.RESPMSG}','${_result.GATEWAYNAME}','${_result.BANKTXNID}','${_result.BANKNAME}','${params.CHECKSUMHASH}');
                                    insert into shipping_table values('${_result.ORDERID}','${request_001.session.OrderPID}','${request_001.session.OrderPName}','${request_001.session.AnyRandomUserName}','${request_001.session.AnyRandomValue}','${request_001.session.OrderPMobile}','${request_001.session.OrderPAddress}','Processing','Processing','Processing');
                                    insert into my_order_list(Order_ID,Order_PID,Order_PName,Order_PAmount) values('${_result.ORDERID}','${request_001.session.OrderPID}','${request_001.session.OrderPName}','${_result.TXNAMOUNT}');
                                    END;`
                                OrderDetails.query(q,(err)=>{
                                    if(err){
                                        console.log(err)
                                        response_001.send(err)
                                        response_001.end()
                                    }else{
                                        OrderDetails.release()
                                        response_001.redirect('/Payment_success')
                                        response_001.end()
                                    }
                                }) 
                            }
                        })
                    }else{
                        SQLConnection.getConnection((err,OrderDetails)=>{
                            if(err){
                                response_001.send(err)
                                response_001.end()
                            }else{
                                var q=`BEGIN NOT ATOMIC
                                    insert into payment_table values('${_result.ORDERID}','${_result.MID}','${_result.TXNID}','${_result.TXNAMOUNT}','${_result.PAYMENTMODE}','${Currency}','${_result.TXNDATE}','${_result.STATUS}','${_result.RESPCODE}','${_result.RESPMSG}','${_result.GATEWAYNAME}','${_result.BANKTXNID}','${_result.BANKNAME}','${params.CHECKSUMHASH}');
                                    insert into shipping_table values('${_result.ORDERID}','${request_001.session.OrderPID}','${request_001.session.OrderPName}','${request_001.session.AnyRandomUserName}','${request_001.session.AnyRandomValue}','${request_001.session.OrderPMobile}','${request_001.session.OrderPAddress}','Processing','Processing','Processing');
                                    insert into my_order_list(Order_ID,Order_PID,Order_PName,Order_PAmount) values('${_result.ORDERID}','${request_001.session.OrderPID}','${request_001.session.OrderPName}','${_result.TXNAMOUNT}');
                                    END;`
                                OrderDetails.query(q,(err)=>{
                                    if(err){
                                        console.log(err)
                                        response_001.send(err)
                                        response_001.end()
                                    }else{
                                        OrderDetails.release()
                                        response_001.redirect('/Payment_failure')
                                        response_001.end()
                                    }
                                }) 
                            }
                        })
                        response_001.redirect('/Payment_failure')
                        response_001.end()
                    }
                })
            })
            // Post the data
            post_req.write(post_data)
            post_req.end()
        })
    })
})
Router_001.use('/Payram_now',urlEncoded,(request_001,response_001)=>{
    if(request_001.session.AnyRandomValue!=null && request_001.session.AnyRandomUserName!=null){
        var PayerID=request_001.body.PayingID
        var PayersName=request_001.body.PayingName
        var PayerName=PayersName.replace(/[\s]/g,'_').replace(/[,]/g,'@').replace(/[/]/g,'|')
        var PayerPrice=request_001.body.PayingPrice
        var PayerType=request_001.body.PayingType
        var PayerQty=request_001.body.PayingQty
        var PayersAddress=request_001.body.PayingAddress
        var PayerAddress=PayersAddress.replace(/[\s]/g,'_').replace(/[,]/g,'@').replace(/[/]/g,'|')
        var PayerState=request_001.body.PayingState
        var PayerMobile=request_001.body.PayingMobile
        var PayerEMailID=request_001.session.AnyRandomValue
        var PayersUsername=request_001.session.AnyRandomUserName
        var PayerUsername=PayersUsername.replace(/[\s]/g,'_').replace(/[,]/g,'@').replace(/[/]/g,'|')
        var PaymentDetails={
            PayAmount: PayerPrice,
            PayID:'@'+PayerUsername, //Used nowadays to identify the user
            PayEMail:PayerEMailID,
            PayPhone:PayerMobile
            }
        if(!PaymentDetails.PayAmount || !PaymentDetails.PayID || !PaymentDetails.PayEMail || !PaymentDetails.PayPhone){
            response_001.status(400).send('Payment failed!!!')
            response_001.end()
        }else{
            var params={}
            params['MID']=Config.PaytmConfig.mid
            params['WEBSITE']=Config.PaytmConfig.website
            params['CHANNEL_ID']='WEB'
            params['INDUSTRY_TYPE_ID']='Retail'
            params['ORDER_ID']='TEST_'+new Date().getTime()
            params['CUST_ID']=PaymentDetails.PayID
            params['TXN_AMOUNT']=PaymentDetails.PayAmount
            params['CALLBACK_URL']='http://localhost:1234/Callback/'+PayerID+'/'+PayerName+'/'+PayerPrice+'/'+PayerType+'/'+PayerQty+'/'+PayerMobile+'/'+PayerAddress+'/'+PayerState
            params['EMAIL']=PaymentDetails.PayEMail
            params['MOBILE_NO'] = PaymentDetails.PayPhone
            Checksum.genchecksum(params,Config.PaytmConfig.key,function (err,checksum){
                var txn_url="https://securegw-stage.paytm.in/theia/processTransaction" //For staging
                // var txn_url="https://securegw.paytm.in/theia/processTransaction" //For production
                var form_fields=""
                for(var x in params){
                    form_fields+="<input type='hidden' name='" + x + "' value='" + params[x] + "' >"
                }
                form_fields+="<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >"
                response_001.writeHead(200,{'Content-Type':'text/html'})
                response_001.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>')
                response_001.end()
            })
        }
    }else{
        response_001.render('Home',{message_002:'Kindly login here first!!!',emailID:null,Username:null})
    }
})
Router_001.use('/Callback/:Payer_ID/:Payer_Name/:Payer_Price/:Payer_Type/:Payer_Qty/:Payer_Mobile/:Payer_Address/:Payer_State',(request_001,response_001)=>{
    // Route for verifiying payment
    var body=''
    request_001.on('data',function (data){
        body+=data
    })
    request_001.on('end',function (){
        var html=""
        var post_data=QS.parse(body)
        // Received params in callback
        console.log('Callback Response: ',post_data,"\n")
        // Verify the checksum
        var checksumhash=post_data.CHECKSUMHASH
        // Delete post_data.CHECKSUMHASH
        var result=Checksum.verifychecksum(post_data,Config.PaytmConfig.key,checksumhash)
        console.log("Checksum Result => ",result,"\n")
        // Send Server-to-Server request to verify Order Status
        var params={"MID":Config.PaytmConfig.mid,"ORDERID":post_data.ORDERID}
        Checksum.genchecksum(params,Config.PaytmConfig.key,function (err,checksum){
            params.CHECKSUMHASH=checksum
            var Currency=post_data.CURRENCY //Adds value of 'CURRENCY' from 'post_data' to variable 'Currency'
            post_data='JsonData='+JSON.stringify(params)
            var options={
                hostname:'securegw-stage.paytm.in', //For staging
                // hostname:'securegw.paytm.in', //For production
                port:443,
                path:'/merchant-status/getTxnStatus',
                method:'POST',
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded',
                    'Content-Length':post_data.length
                    }
                }
            // Set up the request
            var response=""
            var post_req=HTTPS.request(options,function (post_res){
                post_res.on('data',function (chunk){
                    response+=chunk
                })
                post_res.on('end',function (){
                    console.log('S2S Response: ',response,"\n")
                    var _result=JSON.parse(response)
                    if(_result.STATUS=='TXN_SUCCESS'){
                        var PaidID=request_001.params.Payer_ID
                        var PaidsName=request_001.params.Payer_Name
                        var PaidName=PaidsName.replace(/[_]/g,' ').replace(/[@]/g,',').replace(/[\|]/g,'/')
                        var PaidPrice=request_001.params.Payer_Price
                        var PaidType=request_001.params.Payer_Type
                        var PaidQty=request_001.params.Payer_Qty
                        var PaidMobile=request_001.params.Payer_Mobile
                        var PaidsAddress=request_001.params.Payer_Address
                        var PaidAddress=PaidsAddress.replace(/[_]/g,' ').replace(/[@]/g,',').replace(/[\|]/g,'/')
                        var PaidState=request_001.params.Payer_State
                        SQLConnection.getConnection((Error_101,OrderedDetails)=>{
                            if(Error_101){
                                response_001.send(Error_101)
                                response_001.end()
                            }else{
                                var Query_101=`insert into payment_table values('${_result.ORDERID}','${_result.MID}','${_result.TXNID}','${_result.TXNAMOUNT}','${_result.PAYMENTMODE}','${Currency}','${_result.TXNDATE}','${_result.STATUS}','${_result.RESPCODE}','${_result.RESPMSG}','${_result.GATEWAYNAME}','${_result.BANKTXNID}','${_result.BANKNAME}','${params.CHECKSUMHASH}')`
                                var Query_102=`insert into shipping_table values('${_result.ORDERID}','${PaidID}','${PaidName}','${request_001.session.AnyRandomUserName}','${request_001.session.AnyRandomValue}','${PaidMobile}','${PaidAddress} (${PaidState})','Processing','Processing','Processing')`
                                var Query_103=`insert into my_order_list(Order_ID,Order_PID,Order_PName,Order_PAmount) values('${_result.ORDERID}','${PaidID}','${PaidName}','${_result.TXNAMOUNT}')`
                                try{
                                    OrderedDetails.query(Query_101)
                                    OrderedDetails.query(Query_102)
                                    OrderedDetails.query(Query_103)
                                    OrderedDetails.release()
                                    response_001.render('Payment successful')
                                    response_001.end()
                                }catch(Error_102){
                                    response_001.send(Error_102)
                                    response_001.end()
                                }
                            }
                        })
                    }else{
                        response_001.redirect('/Payment_failure')
                        response_001.end()
                    }
                })
            })
            // Post the data
            post_req.write(post_data)
            post_req.end()
        })
    })
})
Router_001.get('/Payment_success',(request_001,response_001)=>{
    response_001.render('Payment successful')
    response_001.end()
})
Router_001.get('/Payment_failure',(request_001,response_001)=>{
    response_001.render('Payment failed')
    response_001.end()
})
Router_001.use('/Order_list',(request_001,response_001)=>{
    if(request_001.session.AnyRandomValue!=null && request_001.session.AnyRandomUserName!=null){
        SQLConnection.getConnection((error_001,DB_101)=>{
            if(error_001){
                response_001.send(error_001)
                response_001.end()
            }else{
                var Query_110=`select * from shipping_table where Customer_EMailID='${request_001.session.AnyRandomValue}'`
                DB_101.query(Query_110,(error_001,DB_102)=>{
                    if(error_001){
                        response_001.send(error_001)
                        response_001.end()
                    }else{
                        response_001.render('Order history',{OrderData:DB_102,emailID:request_001.session.AnyRandomValue,Username:request_001.session.AnyRandomUserName,message_101:0})
                        response_001.end()
                    }
                })
            }
        })
    }else{
        response_001.render('Home',{message_002:'Please login here!!!',emailID:null,Username:null})
        response_001.end()
    }
})
Router_001.use('/Payment_details/:OrderingID',(request_001,response_001)=>{
    if(request_001.session.AnyRandomValue!=null && request_001.session.AnyRandomUserName!=null){
        var OrderItemID=request_001.params.OrderingID
        SQLConnection.getConnection((error_001,DB_111)=>{
            if(error_001){
                response_001.send(error_001)
                response_001.end()
            }else{
                var Query_110=`select * from payment_table where Order_ID='${OrderItemID}'`
                DB_111.query(Query_110,(error_001,DB_112)=>{
                    if(error_001){
                        response_001.send(error_001)
                        response_001.end()
                    }else{
                        response_001.render('Payment details',{PaymentData:DB_112,emailID:request_001.session.AnyRandomValue,Username:request_001.session.AnyRandomUserName,message_102:0})
                        response_001.end()
                    }
                })
            }
        })
    }else{
        response_001.render('Home',{message_002:'Please login here!!!',emailID:null,Username:null})
        response_001.end()
    }
})
var COR=0
Router_001.use('/Customer_order_request',urlEncoded,(request_001,response_001)=>{
    if(request_001.session.AdministratoreMailID!=null&&request_001.session.AdministratorUserName!=null){
        if(request_001.method!='POST'){
            SQLConnection.getConnection((error_001,DB_110)=>{
                if(error_001){
                    response_001.send(error_001)
                    response_001.end()
                }else{
                    var Query_110=`select * from shipping_table`
                    DB_110.query(Query_110,(error_001,DB_120)=>{
                        if(error_001){
                            response_001.send(error_001)
                            response_001.end()
                        }else{
                            if(COR==1){
                                response_001.render('Customer order requests',{CrDB:DB_120,emailID:request_001.session.AdministratoreMailID,Username:request_001.session.AdministratorUserName,message_010:1})
                                response_001.end()
                                COR=0
                            }else{
                                response_001.render('Customer order requests',{CrDB:DB_120,emailID:request_001.session.AdministratoreMailID,Username:request_001.session.AdministratorUserName,message_010:0,message_101:0,message_102:0})
                                response_001.end()
                            }
                        }
                    })
                }
            })
        }else{
            COR=1
            var OrID=request_001.body.CustOID
            var OrOP=request_001.body.CustOOP
            var OrSS=request_001.body.CustOSS
            var OrDS=request_001.body.CustODS
            SQLConnection.getConnection((error_001,DB_011)=>{
                if(error_001){
                    response_001.send(error_001)
                    response_001.end()
                }else{
                    if(OrOP!='') var Query_211=`Order_Processing='${OrOP}'`; else var Query_211=``;
                    if(OrSS!='') var Query_212=`Shipping_Status='${OrSS}'`; else var Query_212=``;
                    if(OrDS!='') var Query_213=`Delivery_Status='${OrDS}'`; else var Query_213=``;
                    if(OrOP!='' && OrSS!='') var Comma_211=`,`; else var Comma_211=``;
                    if(OrSS!='' && OrDS!='') var Comma_212=`,`; else var Comma_212=``;
                    if(OrOP!='' && OrDS!='') var Comma_213=`,`; else var Comma_213=``;
                    if(OrOP!='' && OrSS!='' && OrDS!='') var Comma_213=``;
                    var Query_210=`update shipping_table set ${Query_211} ${Comma_211} ${Query_212} ${Comma_212} ${Comma_213} ${Query_213} where Order_ID='${OrID}'`
                    var Query_220=`BEGIN NOT ATOMIC\n`+Query_210+`;\nselect * from shipping_table;`+`\nEND;`
                    DB_011.query(Query_220,(error_001,DB_021)=>{
                        if(error_001){
                            response_001.send(error_001)
                            response_001.end()
                        }else{
                            response_001.redirect('back')
                            response_001.end()
                        }
                    })
                }
            })
        }
    }else{
        response_001.render('Admin login',{Message_001: 'Login here!!!'})
        response_001.end()
    }
})
Router_001.use('/Admin_Password_change',urlEncoded,(request_001,response_001,Next)=>{
    Administer.PasswordChange(request_001,response_001)
    Next()
})
Router_001.use('/Admin_Password_change',urlEncoded,(request_001,response_001)=>{
    response_001.redirect('back')
})
module.exports=Router_001
