"use client"
import { UploadDropzone } from "@/lib/uploadthing"
import "@uploadthing/react/styles.css"
import Image from "next/image"
import {X} from "lucide-react"

type Props = {
    endpoint: "messageFile" | "serverImage"
    onChange: (url?: string) => void
    value: string
}


const FileUpload = ({endpoint,value,onChange}: Props) => {

  const fileType = value?.split(".").pop()

  if(value && fileType !== "pdf" || value && fileType !== "video/mp4")
  {
    return(
      <div className="relative h-20 w-20">
          <Image
            fill
            src={value}
            alt="Upload"
            className="rounded-full"
          />
          <button onClick={() => onChange("")} className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
      </div>
    )
  }

  return (
   <UploadDropzone endpoint={endpoint} onClientUploadComplete={(res) => {
      onChange(res?.[0].url)
   }}
   
   onUploadError={(error: Error) => {
    console.log(error)
   }}
   
   />
  )
}

export default FileUpload