"use client"
import * as z from 'zod'
import {zodResolver} from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { useForm } from "react-hook-form"
import { formSchema, messageFileSchema } from '@/app/schemas/formSchea'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { Button } from '../ui/button'
import FileUpload from '../file-upload'
import {useMutation} from "@tanstack/react-query"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useModal } from '../../../hooks/use-modal-store'
import qs from "query-string"

type Values = z.infer<typeof messageFileSchema>

const MessageFileModal = () => {

   const {isOpen,onClose,type,data} = useModal()

    const router = useRouter()

    const isModalOpen = isOpen && type === "messageFile"

    const {apiUrl,query} = data

    const {mutate:createServer,isLoading} = useMutation({
        mutationFn: async ({fileUrl}: Values) => {

            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query: query 
            })

            const response = await axios.post(url,{fileUrl,content: fileUrl})

            return response.data
        }
    })

    

    const form = useForm({
        resolver: zodResolver(messageFileSchema),
        defaultValues:{
            fileUrl: ""
        }
    })



    //const isLoading = form.formState.isSubmitting

    const handleClose = () => {
        form.reset()
        onClose()
    }

    const onSubmit = async (values:Values) => {
        console.log(values)

        createServer(values,{
            onSuccess: () => {
                form.reset()
                router.refresh()
               
                handleClose()
            },
            onError:(error)=>{
                console.log(error)
            }
        })
    }


  return (
    <Dialog  open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
            <DialogHeader className="pt-8 px-6">
                <DialogTitle className="text-2xl text-center font-bold">
                    Add an attachment
                </DialogTitle>
                <DialogDescription className="text-center text-zinc-500">
                    Send a file as a message
                </DialogDescription>
            </DialogHeader>
            <Form  {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                    <div className='space-y-8 px-6'>
                        <div className="flex items-center justify-center text-center">
                           <FormField

                            control={form.control}
                            name='fileUrl'
                            render={({field}) => (
                                <FormItem>
                                    <FormControl >
                                        <FileUpload  endpoint="messageFile" value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )}

                           />
                        </div>

                      
                    </div>
                    <DialogFooter className='bg-gray-100 px-6 py-4'>
                            <Button variant="primary" disabled={isLoading} className=''>
                                Send
                            </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default MessageFileModal