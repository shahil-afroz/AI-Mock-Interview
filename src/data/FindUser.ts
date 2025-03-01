
// import { db } from "@/lib/db";
// import { currentUser } from "@clerk/nextjs/dist/types/server";


// export const findUserbyId=async(id:string|undefined)=> {
//    const user = await currentUser();
//    if (!user) {
//     console.log("user not found");
//    }

//     try{
//         const User=await db.user.findUnique({
//             where:{
//                 id:user.id
//             }
//         })
//         return user;
//     }catch(error){        
//         console.log("User not found with the given id");
//         return null;
//     }

// }



