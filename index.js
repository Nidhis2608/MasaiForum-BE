const express=require("express")
const dotenv=require("dotenv")
const cors=require("cors")
const { connection } = require("./config/db")
const { userRoute } = require("./routes/user.routes")
const { postRoute } = require("./routes/post.routes")
dotenv.config()


const app = express();

app.use(express.json());
app.use(cors({
    origin: 'https://masai-forum-fe.vercel.app/', 
    optionsSuccessStatus: 200
}));
app.use('/api',userRoute);
app.use('/api/posts',postRoute)



const PORT=process.env.PORT
app.listen(PORT,async()=>{
    try{
    await connection
    console.log("Connected to DB")
    console.log("Server is running at port 3000")
    }
    catch(err){
        console.error(err);

    }
})