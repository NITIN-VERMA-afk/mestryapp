import UserModel  from '@/models/User';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/option";
import dbModel from "@/models/User";
import {User} from "next-auth";
import dbConnect from '@/lib/dbConnect';


export async function GET(request:Request){
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
  const userId=new mongoose.Types.ObjectId(user._id);

  try {

    const user = await UserModel.aggregate([
        {$match:{id:userId}},
        {$unwind:'$messages'},
        {$sort:{'messages.createdAt':-1}},
        {$group:{_id:'$_id',messages:{$push:'$messages'}}}


        
    ])
    if(!user || user.length === 0){
        return Response.json(
            {
                success:false,
                message:"User not found"
            },
            {status:401}
        )
    }
    return Response.json(
        {
            success:true,
            message:user[0].Messages
        },
        {status:200}
    )
    
  } catch (error) {
    return Response.json(
        {
            success:false,
            message:"Not Authenticated"
        },
        {status:401}
    )
    
  }





}
