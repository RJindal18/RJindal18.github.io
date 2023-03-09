const MyConnection_003=require('../Database/MySQL connector')
class Product_Class{
    AddProduct(request_003,response_003){
        if(request_003.session.AdministratoreMailID!=null && request_003.session.AdministratorUserName!=null){
            if(request_003.method=='POST'){
                var ProductAdd=request_003.body.Dummy
                var ProductName=request_003.body.Products_Name
                var ProductPrice=request_003.body.Products_Price
                var ProductType=request_003.body.Products_Type
                var ProductImage=request_003.file.filename
                var ProductDescription=request_003.body.Products_Description
                MyConnection_003.getConnection((error_003,MyDatabase_003)=>{
                    if(error_003){
                        response_003.send(error_003)
                        response_003.end()
                    }else{
                        var Query_003=`insert into product_details(Product_Name,Product_Price,Product_Type,Product_Image,Product_Description) values('${ProductName}','${ProductPrice}','${ProductType}','${ProductImage}','${ProductDescription}')`
                        MyDatabase_003.query(Query_003,(error_003,MyConnect_003)=>{
                            if(error_003){
                                response_003.send(error_003)
                                response_003.end()
                            }else{
                                MyDatabase_003.release()
                                if(ProductAdd=='Nullify'){
                                    response_003.redirect('/Manage_product')
                                    response_003.end()
                                }else{
                                    response_003.render('Add product',{message_003:'Product added successfully!!!',emailID:request_003.session.AdministratoreMailID,Username:request_003.session.AdministratorUserName,message_101:0,message_102:0})
                                    response_003.end()
                                }
                            }
                        })
                    }
                })
            }else{
                response_003.render('Add product',{message_003:0,emailID:request_003.session.AdministratoreMailID,Username:request_003.session.AdministratorUserName,message_101:0,message_102:0})
                response_003.end()
            }
        }else{
        response_003.render('Admin login',{Message_001:'Login here!!!'});
        response_003.end()
        }
    }
}
const Object=new Product_Class()
module.exports=Object
