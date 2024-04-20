import UserModel  from '@/models/User';
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/option";
import dbModel from "@/models/User";
import {User} from "next-auth";
import dbConnect from '@/lib/dbConnect';



export async function POST(request:Request){
    await dbConnect()


    const session=await getServerSession(authOptions)
     const user=session?.user
     if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Error verifying user"
        },
    {status:500})
     }
  const userId=user._id;

  const {acceptMessage} =await request.json()
  try {
   const updatedUser= await UserModel.findByIdAndUpdate(
        userId,
        {isAcceptingMessages:acceptMessage},
        {new:true}
    )
    if(!updatedUser){
        return Response.json({
            success:false,
            message:"failed to update user status to accept messages"
        },{status:401})
    }
    return Response.json({
        success:true,
        message:"Message acceptance status update successfully",
        updatedUser
    },{status:200})
    
  } catch (error) {
    console.log("failed to update user status to accept messages")
    return Response.json(
        {
            success:false,
            message:"failed to update user status to accept messages"
        },{status:401}
    )
    
  }




}

export async function GET(request:Request){
    await dbConnect()


    try {
        const session=await getServerSession(authOptions)
         const user=session?.user
         if(!session || !session.user){
            return Response.json({
                success:false,
                message:"Error verifying user"
            },
        {status:500})
         }
      const userId=user._id;
    
      const foundUser= await UserModel.findById(userId)
      if(!foundUser){
        return Response.json({
            success:false,
            message:"User not found "
        },{status:404})
      }
    
      return Response.json(
        {
            success:true,
            isAcceptingMessages:foundUser.isAcceptingMessage
        },
        {status:200}
      )
    } catch (error) {
        return Response.json({
            success:false,
            message:"Error in gettting message acceptance",
            
        },{status:500})
        
    }

}