import {v4 as uuidv4 } from "uuid"
import { currentProfile } from "@/lib/current-profile"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { MemberRole } from "@prisma/client"


export const POST = async(req:Request,res:Response) => {

    try{

        const {name,imageUrl} = await req.json()

        const profile = await currentProfile()

        if(!profile)
        {
            return new NextResponse("Unauthorised",{status: 401})
        }
        

        const server = await db.server.create({
            data:{
                profileId: profile.id,
                name: name,
                imageUrl: imageUrl,
                inviteCode: uuidv4(),
                channels:{
                    create:[
                        {name: "general",profileId: profile.id}
                    ]
                },
                members:{
                    create:[
                        {
                            profileId: profile.id,
                            role: MemberRole.ADMIN
                        }
                    ]
                }
            }
        })


        return NextResponse.json(server,{status: 200})

    }catch(error)
    {
        console.log("[SERVERS_POST]",error)
        return new NextResponse("Internal Error",{status: 500})
    }

}