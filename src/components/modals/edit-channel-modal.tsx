"use client"
import * as z from 'zod'
import qs from "query-string"
import {zodResolver} from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { useForm } from "react-hook-form"
import { channelFormSchema } from '@/app/schemas/formSchea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import {useMutation} from "@tanstack/react-query"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useModal } from '../../../hooks/use-modal-store'
import { ChannelType } from '@prisma/client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useEffect } from 'react'

type Values = z.infer<typeof channelFormSchema>

const EditChannelModal = () => {

    const {isOpen,onClose,type,data} = useModal()

    const router = useRouter()

 

    const isModalOpen = isOpen && type === "editChannel"

    const {server,channel} = data

    const {mutate:createChannel,isLoading} = useMutation({
        mutationFn: async ({name,type}: Values) => {

            const url = qs.stringifyUrl({
                url:`/api/channels/${channel?.id}`,
                query:{
                    serverId: server?.id
                }
            })

           
            const response = await axios.patch(url,{name,type})

            return response.data
        }
    })

    
  

    const form = useForm({
        resolver: zodResolver(channelFormSchema),
        defaultValues:{
            name: "",
            type: channel?.type || ChannelType.TEXT
            
        }
    })

    //const isLoading = form.formState.isSubmitting


    useEffect(()=>{

        if(channel)
        {
            form.setValue("name",channel.name)
            form.setValue("type",channel.type)
        }

    },[form,channel])



    const onSubmit = async (values:Values) => {
        //console.log(values)

        createChannel(values,{
            onSuccess: () => {
                form.reset()
                router.refresh()
                onClose()
                
            },
            onError:(error)=>{
                console.log(error)
            }
        })
    }

    const handleClose = () => {
        form.reset()
        onClose()
    }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose} >
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
            <DialogHeader className="pt-8 px-6">
                <DialogTitle className="text-2xl text-center font-bold">
                    Edit Channel
                </DialogTitle>
                
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                    <div className='space-y-8 px-6'>
                       
                        <FormField control={form.control} name='name' render={({field}) => (
                            <FormItem>
                                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/80'>
                                    Channel Name
                                </FormLabel>
                                <FormControl>
                                    <Input disabled={isLoading} className='bg-zinc-300/50 borde-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0' placeholder='Enter channel name' {...field} />
                                </FormControl>
                                <FormMessage  />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name='type' render={({field}) => (
                            <FormItem>
                                <FormLabel>Channel Type</FormLabel>
                                <Select
                                    disabled={isLoading}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger
                                            className='bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 
                                            focus:ring-offset-0 capitalize outline-none'
                                        >
                                            <SelectValue placeholder="Select a channel type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.values(ChannelType).map((type) => (
                                            <SelectItem key={type} value={type} className='capitalize' >
                                                {type.toLowerCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}  />

                    </div>
                    <DialogFooter className='bg-gray-100 px-6 py-4'>
                            <Button variant="primary" disabled={isLoading} className=''>
                                Save
                            </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default EditChannelModal