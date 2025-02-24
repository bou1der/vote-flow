'use client'
import * as React from "react";

import { cn } from "~/lib/client/utils";
import { ProcessedFile } from "~/lib/shared/types/file";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import { Button } from "./button";
import { ConvertFiles } from "~/lib/client/file";
import { toast } from "sonner";
import { Upload, UploadIcon } from "lucide-react";
import { api } from "~/trpc/react";
import Image from "./image";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  images?:ProcessedFile | string;
  aspectClassName?:string;
  onUpload?:(files:ProcessedFile[]) => void;
  preUpload?:(imageId:string) => void;
  asChild?:boolean;
}


const InputBase = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, images, aspectClassName, type, onUpload, preUpload, ...props}, ref) => {

    if(type === "file"){
      return (
        <label 
          className={
            cn(
              props.disabled
                ? "animate-pulse cursor-not-allowed"
                : "cursor-pointer",
              className,
              "w-max block space-y-3"
            )}>
          <input 
            type="file"
            className="hidden"
            {...props}
            onChange={async (e) => {
              if(!e.target.files || !onUpload) return 
              onUpload(await ConvertFiles(Array.from(e.target.files)))
            }}
          />
          <div className="group relative block">
            <div className="z-10 rounded-3xl group-hover:bg-black/15 transition-colors duration-300 absolute size-full" />
            <UploadIcon className="absolute opacity-0 size-10 z-[11] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:opacity-100 transition-opacity duration-300" />
            {
              images && typeof images === "string"
                ? <Image
                    width={2000}
                    height={2000}
                    className={cn(aspectClassName, "size-60 rounded-3xl overflow-hidden")}
                    src={images}
                    key={images}
                    alt={images}
                  />
                : images ? <img
                    src={(images as ProcessedFile).b64}
                    key={(images as ProcessedFile).fileSize}
                    className={cn(aspectClassName, "size-60 rounded-3xl object-cover")}
                    alt={(images as ProcessedFile).fileName}

                  />
                  : <div className={cn(aspectClassName, "size-60 rounded-3xl bg-white/10 border border-white/20 flex justify-center items-center")} />
                
            }
          </div>
          <Button 
            type="button"
            disabled={props.disabled}
            className="pointer-events-none w-fit px-8"
          >
            Выбрать файл
          </Button>
        </label>
      )
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-md border border-input text-foreground bg-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onUpload, preUpload, ...props }, ref) => {

    if(preUpload && type === "file"){
      const [open, setOpen] = React.useState(false)

      const uploadImageMutation = api.file.create.useMutation({
        onSuccess:(res) => {
          preUpload(res.id)
          setOpen(false)
        },
        onError:(err) => {
          toast.error("Ошибка", {
            description:err.message
          })
        }
      })

      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className={className} asChild>
            {
              props.children
                ? props.children
                : <Button className="group/upload" variant="outline"><Upload className="size-6 transition-colors " /></Button>
            }
          </DialogTrigger>
          <DialogContent>
            <InputBase
              type="file"
              disabled={uploadImageMutation.isPending}
              onUpload={(f) => {
                if(!f[0]) return 
                uploadImageMutation.mutate({...f[0]})
              }}
            />
          </DialogContent>
        </Dialog>
      )
    }

    return (
      <InputBase
        type={type}
        className={className}
        onUpload={onUpload}
        ref={ref}
        {...props}
      />
    )
  },
);

Input.displayName = "Input";

export { Input };
