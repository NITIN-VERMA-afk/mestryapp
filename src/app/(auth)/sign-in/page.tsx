"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import axios from "axios"
import { useState } from "react"



const Page = () => {

    const [username,setUsername]=useState('')
    const [usernameMessage,setUsernameMessage]=useState('')
    const[Loader,setLoader]=useState('')


  return (
    <div>
        <div>page</div>
      
    </div>
  )
}

export default Page
