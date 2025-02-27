
import { db } from "@/lib/db";

export const findUserbyId=async(id:string|undefined)=> {
    try{
        const user=await db.user.findUnique({
            where:{
                userId:id
            }
        })
        return user;

    }catch(error){        
        console.log("User not found with the given id");
        return null;
    }

}

