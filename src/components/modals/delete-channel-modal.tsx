"use client"
import * as z from 'zod'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { formSchema } from '@/app/schemas/formSchea'
import { useModal } from '../../../hooks/use-modal-store'
import { Button } from '../ui/button'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import qs from "query-string"


const DeleteChannelModal = () => {

    const {isOpen,onClose,type,data} = useModal()

    const router = useRouter()



    const isModalOpen = isOpen && type === "deleteChannel"


    const {server,channel} = data

    const {mutate:onDeleteChannel,isLoading} = useMutation({
        mutationFn: async () => {

            const url = qs.stringifyUrl({
                url:`/api/channels/${channel?.id}`,
                query:{
                    serverId: server?.id
                }
            })

            const response = await axios.delete(url)

            return response.data
        }
    })


    const deleteChannel = () => {

        onDeleteChannel(undefined,{
            onSuccess: () => {
                onClose()

                router.refresh()

                router.push(`/servers/${server?.id}`)
            },
            onError: (error) => {
                console.log(error)
            }
        })


    }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose} >
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
            <DialogHeader className="pt-8 px-6">
                <DialogTitle className="text-2xl text-center font-bold">
                    Delete Channel
                </DialogTitle>
                <DialogDescription className='text-center text-zinc-500'>
                    Are you sure you want to do this? <span className='font-semibold text-indigo-500'>#{channel?.name}</span> will be permanently deleted.
                </DialogDescription>
            </DialogHeader>
          <DialogFooter className='bg-gray-100 px-6 py-4'>
                <div className="flex items-center justify-between w-full">
                    <Button disabled={isLoading} onClick={onClose} variant="ghost">
                        Cancel 
                    </Button>
                    <Button disabled={isLoading} onClick={deleteChannel} variant="primary">
                        Confirm 
                    </Button>
                </div>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default DeleteChannelModal