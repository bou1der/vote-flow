"use client";
import * as React from "react";

import { EyeIcon, EyeOffIcon, X } from "lucide-react";
import { Button } from "./button";
import Loader from "./loader";
import { Label } from "./label";
import Image from "./image";
import { toast } from "sonner";
import { MAX_FILE_SIZE } from "shared/const";
import { cn } from "../lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
	className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
	return (
		<input
			type={type}
			className={cn(
				"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				className,
			)}
			ref={ref}
			{...props}
		/>
	);
});
Input.displayName = "Input";

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
	const [visible, setVisible] = React.useState(false);

	return (
		<div className="h-fit relative flex">
			<Input
				autoComplete="current-password"
				type={visible ? "text" : "password"}
				className="pr-12"
				ref={ref}
				{...props}
			/>
			<Button
				tabIndex={-1}
				size="icon"
				type="button"
				variant="transparent"
				onClick={() => setVisible(!visible)}
				className="absolute h-12 right-0 inset-y-0 text-muted-foreground"
			>
				{visible ? <EyeOffIcon className="size-8" /> : <EyeIcon className="size-8" />}
			</Button>
		</div>
	);
});
PasswordInput.displayName = "PasswordInput";

class f {
	b64 = "";
	fileName = "";
	contentType = "";
	fileSize = 0;
}

const isFile = (arg: unknown): arg is File => arg instanceof File;
const isString = (arg: unknown): arg is string => typeof arg === "string";

export interface ImageInputProps extends Omit<React.ComponentProps<"input">, "value" | "onChange"> {
	value?: File | string | undefined;
	onChange: (arg: File) => void;
	hidden?: boolean;
	className?: string;
}

const ImageInput = React.forwardRef<HTMLInputElement, ImageInputProps>(
	({ className, type, onChange, value, hidden, ...props }, ref) => {
		const [node, setNode] = React.useState(
			<div className="size-20 flex items-center justify-center">
				<Loader className="size-6" />
			</div>,
		);

		return (
			<>
				<Label className={cn(className, "w-full flex gap-2")} htmlFor="img-input">
					{isString(value) ? (
						<Image className={cn(className, "size-20 rounded-full")} src={value} alt="" width={2000} height={2000} />
					) : isFile(value) ? (
						(() => {
							const reader = new FileReader();
							reader.readAsDataURL(value);
							reader.onloadend = () => {
								setTimeout(() => {
									setNode(
										<img
											className={cn(className, "size-20 rounded-full object-cover")}
											src={reader.result instanceof ArrayBuffer ? undefined : reader.result!}
										/>,
									);
								}, 400);
							};
							reader.onerror = () => setNode(<X className="size-8 text-destructive" />);
							return node;
						})()
					) : (
						<div className={cn(className, "size-20 bg-input border-2 border-white border-dashed rounded-full")} />
					)}
					{hidden || (
						<div className="flex flex-col items-start justify-center">
							<p className="text-sm text-white/80">Изображение в любом формате</p>
							<p className="text-sm text-white/80">Размер файла до {MAX_FILE_SIZE / 1024 / 1024}МБ</p>
						</div>
					)}
				</Label>
				<input
					onChange={async e => {
						if (e.target.files?.[0]) {
							if (e.target.files[0].size > MAX_FILE_SIZE)
								return toast.error("Ошибка", {
									description: "Файл превышает максимальный размер",
								});
							onChange(e.target.files[0]);
						}
					}}
					id="img-input"
					type={"file"}
					className="hidden"
				/>
			</>
		);
	},
);
ImageInput.displayName = "ImageInput";

export { Input, PasswordInput };
