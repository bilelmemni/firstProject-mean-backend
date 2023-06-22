const express=require('express');
const articleApi=require('./routers/article')
const authorApi=require('./routers/author')
const cors=require('cors')
require('./config/connect')

const app=express();


app.use(express.json());
app.use(cors());


app.use('/article', articleApi)
app.use('/author',authorApi)
app.use('/image',express.static('./uploads'))








app.listen(3000,()=>{
    console.log('server work !!');
})