const mongoose=require('mongoose');
CONN_STR="mongodb+srv://admin:YT2tZMiYv8hSayp5@cluster0.5gqni.mongodb.net/CourseManagement?retryWrites=true&w=majority&appName=Cluster0"
const connectDB=async()=>{
    try{
        await mongoose.connect(CONN_STR);
        console.log("Connected to MongoDB Successfully");
    }catch(error){
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}
connectDB()