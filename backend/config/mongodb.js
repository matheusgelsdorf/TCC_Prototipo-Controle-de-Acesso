const mongoose= require('mongoose')
let mongo_url_db
if(process.env.MONGODB_URI){
     mongo_url_db =  `${process.env.MONGODB_URI}` 
}
else{
    mongo_url_db='mongodb://localhost/teste_db' 
}
mongoose.connect(mongo_url_db, {useUnifiedTopology: true,useNewUrlParser:true})
.catch(e=>{
    const msg = 'ERRO! Nao foi possivel conectar com o MongoDB!.'
    console.log('\x1b[41m%s\x1b[37m',msg,'\x1b[0m')

})
