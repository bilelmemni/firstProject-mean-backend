const mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/project-yolio')
.then(
    ()=>{
        console.log('connect');
    }
)
.catch(
    (err)=>{
        console.log(err);
    }
)

module.exports=mongoose