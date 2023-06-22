const mongoose=require('mongoose');
const Article=mongoose.model('Article',{
    title:String,
    idAuthor:String,
    description:String,
    date:String,
    content:String,
    image:String,
    tags:Array

})
module.exports=Article