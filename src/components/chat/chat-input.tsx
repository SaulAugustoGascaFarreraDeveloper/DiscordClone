"use client"

import { chatFormSchema } from "@/app/schemas/formSchea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { Plus, Smile } from "lucide-react"
import { Input } from "../ui/input"
import axios from "axios"
import qs from "query-string"
import { useMutation } from "@tanstack/react-query"
import { useModal } from "../../../hooks/use-modal-store"
import EmojiPicker from "../emoji-picker"
import { useRouter } from "next/navigation"

interface ChatInputProps{
    apiUrl: string
    query: Record<string,any>
    name: string
    type: "conversation" | "channel"
}

type chatFormData =  z.infer<typeof chatFormSchema>

const ChatInputComponent = ({apiUrl,query,name,type} : ChatInputProps) => {

    const {onOpen} = useModal()
    const router = useRouter()

    const chatForm = useForm<z.infer<typeof chatFormSchema>>({
        resolver: zodResolver(chatFormSchema),
        defaultValues:{
            content:''
        }
    })

    const {mutate:sendMessage} = useMutation({
        mutationFn: async({content}:chatFormData) => {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query: query
            })

            const response = await axios.post(url,{content})

            return response.data

        }
    })

    const isLoading = chatForm.formState.isSubmitting

    const onSubmit = async(values: chatFormData) => {
        sendMessage(values,{
            onSuccess: () => {
                
                chatForm.reset()
                router.refresh()
            },
            onError: (error) => {
                console.log(error)
            }
        })
    }

    return (
        <Form {...chatForm}>
            <form onSubmit={chatForm.handleSubmit(onSubmit)}>
                <FormField control={chatForm.control} name="content" render={({field}) =>(
                    <FormItem>
                        <FormControl>
                            <div className="relative p-4 pb-6">
                                <button type="button" onClick={() => onOpen("messageFile",{apiUrl,query})} className="absolute top-7 left-8 
                                h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600
                                dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center
                                justify-center">
                                    <Plus className="text-white dark:text-[#313338]" />
                                </button>
                                <Input disabled={isLoading} 
                                className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/95 
                                border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 
                                text-zinc-600 dark:text-zinc-200" 
                                placeholder={`Message ${type === "conversation" ? name : "#" + name}`} {...field} />
                                <div className="absolute top-7 right-8 ">
                                    <EmojiPicker onChange={(emoji: string) => field.onChange(`${field.value} ${emoji}`)} />
                                </div>
                            </div>
                        </FormControl>
                    </FormItem>
                )} />
            </form>
        </Form>
    );
}
 
export default ChatInputComponent;