import { sendVerificationEmail } from "@/helpers/sendVarificationEmail";
import dbConnect from "@/lib/dbConnect";

import UserModel from "@/models/User";
// import bcrypt from  "bcryptjs"

export async function post(request:Request){
    await dbConnect()
    try {

         const {username,email,password}= await request.json()
        
    } catch (error) {
        console.error('erro registering user',error)
        return Response.json(
            {
                success:false,
                message:"Error registring user"
            },
            {
                status:500
            }
        )
        
    }
}

