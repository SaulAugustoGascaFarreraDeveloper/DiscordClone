"use client"
import * as z from 'zod'
import {zodResolver} from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { formSchema } from '@/app/schemas/formSchea'
import { useModal } from '../../../hooks/use-modal-store'
import { useOrigin } from '../../../hooks/use-origin'
import { useReducer, useState } from 'react'
import { Button } from '../ui/button'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation'

type Values = z.infer<typeof formSchema>

const LeaveServerModal = () => {

    const {isOpen,onClose,type,data} = useModal()

    const router = useRouter()

    const isModalOpen = isOpen && type === "leaveServer"


    const {server} = data

    const {mutate:onLeaveServer,isLoading} = useMutation({
        mutationFn: async () => {

            const response = await axios.patch(`/api/servers/${server?.id}/leave`)

            return response.data
        }
    })


    const leaveServer = () => {

        onLeaveServer(undefined,{
            onSuccess: () => {
                onClose()

                router.refresh()

                router.push("/")
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
                    Leave Server
                </DialogTitle>
                <DialogDescription className='text-center text-zinc-500'>
                    Are you sure you want to leave <span className='font-semibold text-indigo-500'>{server?.name}</span> ?
                </DialogDescription>
            </DialogHeader>
          <DialogFooter className='bg-gray-100 px-6 py-4'>
                <div className="flex items-center justify-between w-full">
                    <Button disabled={isLoading} onClick={onClose} variant="ghost">
                        Cancel 
                    </Button>
                    <Button disabled={isLoading} onClick={leaveServer} variant="primary">
                        Confirm 
                    </Button>
                </div>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default LeaveServerModal