const mongoose=require('mongoose')

const connectdb= async()=>{
try{
await mongoose.connect('mongodb://localhost:27017/pdf-compresor');
console.log('database connect succfully!');
}catch(error){
console.log('database connection failed !');
}


}

module.exports=connectdb;



