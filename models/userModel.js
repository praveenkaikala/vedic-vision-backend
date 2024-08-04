const mongoose=require("mongoose")
const bycript=require("bcryptjs")
const UserModel=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
},
{
    timeStamp:true,
})
UserModel.methods.matchPassword=async function(enteredpassword)
{
    return await bycript.compare(enteredpassword,this.password)
}
UserModel.pre("save", async function(next)
{
if(!this.isModified)
{
    next()
}
const salt=await bycript.genSalt(10)
this.password=await bycript.hash(this.password,salt)
})
const User = mongoose.models.User || mongoose.model('User', UserModel);
export default User