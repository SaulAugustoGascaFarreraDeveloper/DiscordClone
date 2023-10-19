"use client"
import * as z from 'zod'
import {zodResolver} from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { useForm } from "react-hook-form"
import { formSchema } from '@/app/schemas/formSchea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import FileUpload from '../file-upload'
import {useMutation} from "@tanstack/react-query"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useModal } from '../../../hooks/use-modal-store'
import { Label } from '../ui/label'
import { Check, Copy, RefreshCw } from 'lucide-react'
import { useOrigin } from '../../../hooks/use-origin'
import { useState } from 'react'

type Values = z.infer<typeof formSchema>

const InviteModal = () => {

    const {isOpen,onClose,type,data,onOpen} = useModal()

    const origin = useOrigin()

    const isModalOpen = isOpen && type === "invite"


    const {server} = data

    const [isCopied,setIsCopied] = useState<boolean>(false)
    const [isLoading,setIsLoading] = useState<boolean>(false)

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`

    const onCopy = () => {

        navigator.clipboard.writeText(inviteUrl)
        setIsCopied(true)

        setTimeout(()=>{
            setIsCopied(false)
        },1000)
    }


    const onNew = async () => {

        try{

            setIsLoading(true)

            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`)

            onOpen('invite',{server: response.data})

        }catch(error){

            console.log(error)

        }finally{
            setIsLoading(false)
        }

    }


  return (
    <Dialog open={isModalOpen} onOpenChange={onClose} >
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
            <DialogHeader className="pt-8 px-6">
                <DialogTitle className="text-2xl text-center font-bold">
                    Invite Friends
                </DialogTitle>
            </DialogHeader>
          <div className='p-6'>
                <Label className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                    Server Invite Link
                </Label>

                <div className="flex items-center mt-2 gap-x-2 ">
                    <Input disabled={isLoading} className='bg-zinc-300 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0' value={inviteUrl} />

                    <Button disabled={isLoading} onClick={onCopy} size="icon" className=''>
                        {isCopied ? (<Check className='w-4 h-4' />) : (<Copy className='w-4 h-4' />)}
                        
                    </Button>

                </div>
                <Button disabled={isLoading} onClick={onNew} variant="link" size="sm" className='text-xs text-zinc-500 mt-4' >
                    Generate a new link
                    {isLoading ? <RefreshCw className='w-4 h-4 ml-2 animate-spin' /> : <RefreshCw className='w-4 h-4 ml-2' />}
                </Button>
          </div>
        </DialogContent>
    </Dialog>
  )
}

export default InviteModal