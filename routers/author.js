const express=require('express');
const jwt=require('jsonwebtoken')
const Author=require('../models/author');
const router=express.Router();
const multer=require('multer')
const bcrypt=require('bcrypt')
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



router.post('/registre',upload.any('image'),(req,res)=>{

    data=req.body;
    author= new Author(data);
    author.image=filename
   
    salt=bcrypt.genSaltSync(10)
    author.password=bcrypt.hashSync(data.password,salt)
    
    author.save()
    .then(
        (savesauthor)=>{
            filename='';
            res.status(200).send(savesauthor)
        }
    )
    .catch(
        (err)=>{
            res.status(400).send(err)
        }
    )
})

router.post('/register' , upload.any('image') , (req, res)=>{

    data = req.body;
    author = new Author(data);

    author.image = filename;

    salt = bcrypt.genSaltSync(10);
    author.password = bcrypt.hashSync(data.password , salt);


    author.save()
        .then(
            (savedAuthor)=>{
                filename = "";
                res.status(200).send(savedAuthor);
            }
        )
        .catch(
            err=>{
                res.send(err)
            }
        )


})

router.post('/create',async(req,res)=>{
    try {
        data=req.body;
        prd=new Author(data) 
        savedHero=await prd.save()
        res.status(200).send(savedHero)
    } catch (error) {
        res.status(400).send(error)
    }
});

router.post('/login1',async(req,res)=>{
    data=req.body;
    author=await Author.findOne({email:data.email})
    if (author) {
        validpassword=bcrypt.compareSync(data.password,author.password)
        if (validpassword) {
            paylaod={
                _id:author._id,
                email:author.email,
                fullname:author.name+' '+author.lastname
            }

            token=jwt.sign(paylaod,'12345')
            
            res.status(200).send({myToken:token})
            
        } else {
           res.status(400).send('email or password invalid')
        }
        
    } else {
       res.status(400).send('email or password invalid')
    }
})
router.post('/login' , (req, res)=>{
    
    let data = req.body;

    Author.findOne({email: data.email})
        .then(
            (author)=>{
                let valid = bcrypt.compareSync(data.password , author.password);
                if(!valid){
                    res.send('email or password invalid');
                }else{

                    let payload = {
                        _id: author._id,
                        email: author.email,
                        fullname: author.name + ' ' + author.lastname
                    }

                    let token = jwt.sign(payload , '123456789');

                    res.send({ myToken: token })

                }

            }


        )
        .catch(
            err=>{
                res.send(err);
            }
        )



})
router.get('/getall',(req,res)=>{
    Author.find({})
    .then(
        (authors)=>{
            res.status(200).send(authors)
        }
    )
    .catch(
        (err)=>{
            res.status(400).send(err)
        }
    )

})
router.get('/getbyId/:id',(req,res)=>{

    id=req.params.id;
    Author.findOne({_id:id})
    .then(
        (ath)=>{
            res.status(200).send(ath)
        }
    )
    .catch(
        (err)=>{

            res.status(400).send(err)
        }
    )
})
router.delete('/delete/:id',(req,res)=>{

    id=req.params.id;
    Author.findOneAndDelete({_id:id})
    .then(
        (deleteath)=>{
            res.status(200).send(deleteath)
        }
    )
    .catch(
        (err)=>{

            res.status(400).send(err)
        }
    )
})






module.exports=router