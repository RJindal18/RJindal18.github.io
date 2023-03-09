const express=require('express')
const myRouter=require('./Route')
const app=express()
const cookieParser=require("cookie-parser");
const sessions=require('express-session');
const port=3000
const oneDay=1000 * 60 * 60 * 24; //Not important to be used
app.set('view engine','ejs')
app.use('/Public',express.static(__dirname+'/Public'))
app.use('/Assets',express.static(__dirname+'/Assets'))
app.use(sessions({ //Found on searching for 'Session in node' and using 'Section.io' website as the source
    secret: "AnyRandomValue",
    saveUninitialized:true,
    cookie: { maxAge: oneDay }, //Not inportant to be used but defines the length of a session
    resave: false
}));
app.use(sessions({
    secret: "AnyRandomUserName",
    saveUninitialized:true,
    cookie: { maxAge: oneDay }, //Not inportant to be used
    resave: false
}));
app.use(sessions({ //Found on searching for 'Session in node' and using 'Section.io' website as the source
    secret: "AdministratoreMailID",
    saveUninitialized:true,
    resave: false
}));
app.use(sessions({
    secret: "AdministratorUserName",
    saveUninitialized:true,
    resave: false
}));
app.use(sessions({
    secret: "OrderPID",
    saveUninitialized:true,
    resave: false
}));
app.use(sessions({
    secret: "OrderPName",
    saveUninitialized:true,
    resave: false
}));
app.use(sessions({
    secret: "OrderPMobile",
    saveUninitialized:true,
    resave: false
}));
app.use(sessions({
    secret: "OrderPAddress",
    saveUninitialized:true,
    resave: false
}));
app.use('/',myRouter)
app.use('/New_user',myRouter)
app.use('/Login_check',myRouter)
app.use('/Welcome',myRouter)
app.use('/Change_password',myRouter)
app.use('/Logout',myRouter)
app.use('/LS-Admin/ControlPanel',myRouter)
app.use('/Admin_Dashboard',myRouter)
app.use('/Admin_logout',myRouter)
app.use('/Add_product',myRouter)
app.use('/My_product/:ProductID',myRouter)
app.use('/Manage_product',myRouter)
app.use('/Update_item/:ProID',myRouter)
app.use('/Calculate',myRouter)
app.use('/Pay_now',myRouter)
app.use('/Callback/:Payer_ID/:Payer_Name/:Payer_Price/:Payer_Type/:Payer_Qty/:Payer_Mobile/:Payer_Address/:Payer_State',myRouter)
app.use('/Callback',myRouter)
app.use('/Payment_success',myRouter)
app.use('/Payment_failure',myRouter)
app.use('/Order_list',myRouter)
app.use('/Payment_details/:OrderingID',myRouter)
app.use('/Customer_order_request',myRouter)
app.use('/Admin_Password_change',myRouter)
app.use('/Update_item/:OrdID',myRouter)
app.listen(3000,()=>
{
    console.log(`localhost:${port}`)
})
