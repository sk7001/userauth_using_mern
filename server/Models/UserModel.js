const mongoose=require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        username:{
            type:String
        },
        email:{
            type:String,
            unique:true
        },
        password:{
            type:String
        },
        isVerified:{
            type:Boolean,
            default:false
        },
        OTP_VerificationToken:{
            OTP:String,
            expires:Date
        },
        VerificationToken:{
            token: String,
            expires:Date
        }
    }
)

const UserModel=mongoose.model('Users',UserSchema)
module.exports =UserModel