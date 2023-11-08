import { ChannelType } from "@prisma/client";
import { z } from "zod";


export const formSchema = z.object({
    name: z.string().min(1,{message:"Server name is required"}),
    imageUrl: z.string().min(1,{message:"Server image is required"})
})

export const channelFormSchema = z.object({
    name: z.string().min(1,{message:"Channel name is required"}).refine(name => name !== 'general',{
        message:"Channel name cannot be 'general'"
    }),
    type: z.nativeEnum(ChannelType)
})

export const chatFormSchema = z.object({
    content: z.string().min(1)
})


export const messageFileSchema = z.object({
    fileUrl: z.string().min(1,{message:"Image file is required"})
})

export const editFormSchema = z.object({
    content: z.string().min(1)
})