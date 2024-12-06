'use client'
import * as React from "react";

import { cn } from "~/lib/client/utils";
import { ProcessedFile } from "~/lib/shared/types/file";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import { Button } from "./button";
import { ConvertFiles } from "~/lib/client/file";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { api } from "~/trpc/react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onUpload?:(files:ProcessedFile[]) => void;
  preUpload?:(imageId:string) => void;
  asChild?:boolean;
}

const InputBase = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onUpload, preUpload, ...props}, ref) => {
    if(type === "file"){
      return (
        <label 
          className={
            cn(
              props.disabled
                ? "animate-pulse cursor-not-allowed"
                : "cursor-pointer",
              className,
              "h-12 block"
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
          {
            props.asChild
              ? props.children
              : (
                <Button 
                  type="button"
                  disabled={props.disabled}
                  className="pointer-events-none w-fit px-8"
                >
                  Выбрать файл
                </Button>
              )
          }
        </label>
      )
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-md border border-input text-background bg-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
              props.asChild
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
