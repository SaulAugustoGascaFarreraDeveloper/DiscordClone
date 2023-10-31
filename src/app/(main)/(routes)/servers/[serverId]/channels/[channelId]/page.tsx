import ChatMessages from "@/components/chat/chat-messages"
import ChatHeader from "@/components/chat/chat-header"
import ChatInputComponent from "@/components/chat/chat-input"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { redirectToSignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"

interface ChannelIdPageProps{
    params:{
        serverId: string
        channelId: string
    }
}

const ChannelIdPage = async ({params} : ChannelIdPageProps) => {

    const profile = await currentProfile()

    if(!profile)
    {
        return redirectToSignIn()
    }

    const channel = await db.channel.findUnique({
        where:{
            id: params.channelId
        }
    })

    const member = await db.member.findFirst({
        where:{
            serverId: params.serverId,
            profileId: profile.id
        }
    })


    if(!channel || !member)
    {
        redirect("/")
    }

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader serverId={channel.serverId} name={channel.name} type="channel"   />
            
            <ChatMessages name={channel.name} member={member} chatId={channel.id} type="channel" apiUrl="/api/messages" socketUrl="/api/socket/messages" socketQuery={{
                channelId: channel.id,
                serverId: channel.serverId
            }} paramKey="channelId" paramValue={channel.id} />

            <ChatInputComponent name={channel.name} type="channel" apiUrl="/api/socket/messages" query={{
                channelId: channel.id,
                serverId: channel.serverId,
            }} />
        </div>
    );
}
 
export default ChannelIdPage;