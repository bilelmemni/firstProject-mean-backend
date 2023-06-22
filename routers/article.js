const express=require('express');
const Article=require('../models/article')
const multer=require('multer')
const router=express.Router();

filename='';
const mystorage=multer.diskStorage({
    destination:'./uploads',
    filename:(req,file,redirect)=>{
        date=Date.now();
        fl=date+'.'+file.mimetype.split('/')[1] //split('.') bech yfarekli kelma selon point    
        redirect(null,fl)
        filename=fl 
    }
})
const upload=multer({storage:mystorage})//middlewair



router.post('/create',upload.any('image'),async(req,res)=>{

    try {
        data=req.body;
        art=new Article(data);
   
        art.image=filename
        art.date=new Date()//date mte3 la7dha hadika
        art.tags=data.tags.split(',')
        
        savedart=await art.save()
        filename=''
       
        res.status(200).send(savedart)
        
    } catch (error) {
        res.status(400).send(error)
    }
});
router.get('/getall',async(req,res)=>{
    try {
        articls=await Article.find();
        res.status(200).send(articls)
        
    } catch (error) {
        res.status(400).send(error)
    }
});
router.get('/getByID/:id',async(req,res)=>{
    try {
        myid=req.params.id;
        art=await Article.findOne({_id:myid})
        res.status(200).send(art)
    } catch (error) {
        res.status(400).send(error)
    }

});
router.get('/getByIDAuth/:id',async(req,res)=>{
    try {
        myid=req.params.id;
        art=await Article.find({idAuthor:myid})
        res.status(200).send(art)
    } catch (error) {
        res.status(400).send(error)
    }

});
router.delete('/delete/:id',async(req,res)=>{

    try {
        myid=req.params.id;
        artDelete=await Article.findOneAndDelete({_id:myid});
        res.status(200).send(artDelete)
    } catch (error) {
        res.status(400).send(error)
    }
});
router.put('/update/:id',upload.any('image'),async(req,res)=>{
    try {
        id=req.params.id;
        data=req.body;
        data.tags=data.tags.split(',');
        data.date=new Date()//date mte3 la7dha hadika
        if (filename.lenght>0) {
            data.image=filename;
        }
       update=await Article.findByIdAndUpdate({_id:id},data)
       filename='';
       res.status(200).send(update)
    } catch (error) {
        res.status(400).send(error)
    }

})
router.put('/update1/:id',upload.any('image'),(req,res)=>{

    id=req.params.id;
    data=req.body;
    data.tags=data.tags.split(',');
    data.date=new Date()//date mte3 la7dha hadika
    if (filename.lenght>0) {
        data.image=filename;
    }
    Article.findByIdAndUpdate({_id:id},data)
    .then(
        (article)=>{
 
            filename='';
            res.status(200).send(article)
        }
    )
    .catch(
        (err)=>{
            res.status(400).send(err)

        }
    )

})






module.exports=router