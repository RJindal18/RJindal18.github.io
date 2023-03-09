const MySQL=require('mysql')
const myConnection=MySQL.createPool(
    {
        user:'root',
        password:'',
        host:'localhost',
        database:'e-Commerce'
    }
)
module.exports=myConnection
