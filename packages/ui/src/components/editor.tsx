"use client";
import { type Editor as EditorText, EditorContent, useEditor } from "@tiptap/react";
import { Bold, Italic, List, ListOrdered, Quote, Strikethrough } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { Toggle } from "./toggle";

import Blockquote from "@tiptap/extension-blockquote";
import type { Level } from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";

import { Skeleton } from "./skeleton";
import { cn } from "../lib/utils";
import { Button } from "./button";

const HeadingsSheet = [
	{
		name: "Параграф",
		type: "paragraph",
		tag: "<p>",
		level: 0,
		style: "text-sm",
	},
	{
		name: "Заголовок 1",
		type: "h1",
		tag: "<h1>",
		level: 1,
		style: "text-2xl font-bold",
	},
	{
		name: "Заголовок 2",
		type: "h2",
		tag: "<h2>",
		level: 2,
		style: "text-lg font-bold",
	},
	{
		name: "Заголовок 3",
		type: "h3",
		tag: "<h3>",
		level: 3,
		style: "text-base font-bold",
	},
];
const IconClassName = "size-4";
StarterKit.configure({
	heading: {
		levels: [1, 2, 3],
	},
});

type Options = {
	quotes?: boolean;
};

export default function Editor({
	text,
	setText,
	options,
	disabled,
	className,
}: {
	text: string;
	className?: string;
	setText?: (text: string) => void;
	options?: Options;
	disabled?: boolean;
}) {
	const editor = useEditor({
		extensions: [StarterKit, Paragraph, Blockquote],
		onUpdate: ({ editor }) => {
			setText ? setText(editor.getHTML()) : "";
		},
		content: text,
	});

	if (disabled) {
		editor?.setEditable(false);
	}

	if (!editor) {
		return (
			<div className="space-y-2">
				<div className="flex gap-2">
					<Skeleton className="w-40 h-10 rounded-md" />
					<Skeleton className="size-10 rounded-md" />
					<Skeleton className="size-10 rounded-md" />
					<Skeleton className="size-10 rounded-md" />
					<Skeleton className="size-10 rounded-md" />
					<Skeleton className="size-10 rounded-md" />
					<Skeleton className="size-10 rounded-md" />
				</div>
				<Skeleton className="h-40 w-full rounded-md" />
			</div>
		);
	}
	return (
		<div className="flex flex-col h-full gap-4 rounded-xl focus:outline-none">
			{disabled ?? <EditorControllers editor={editor} options={options} />}
			<EditorContent
				editor={editor}
				className={cn("p-4 border border-input rounded-xl tiptap bg-input  tiptap", className)}
			/>
		</div>
	);
}

function EditorControllers({
	editor,
	options,
}: {
	editor: EditorText;
	options?: Options;
}) {
	const [currentHeading, setCurrentHeading] = useState(HeadingsSheet[0]!);

	useEffect(() => {
		if (currentHeading.level === 0) {
			editor.chain().focus().setParagraph().run();
		} else {
			editor
				.chain()
				.focus()
				.setHeading({ level: currentHeading.level as Level })
				.run();
		}
	}, [currentHeading, editor]);

	return (
		<>
			<div className="flex flex-row flex-wrap sm:flex-nowrap  gap-4  bg-background">
				<Select
					onValueChange={value => {
						setCurrentHeading(HeadingsSheet.find(e => e.type === value) ?? HeadingsSheet[0]!);
					}}
				>
					<SelectTrigger className="w-fit transition-all" asChild>
						<Button variant={"input"} className="w-fit" chevron>
							{currentHeading.name}
						</Button>
					</SelectTrigger>
					<SelectContent className="bg-background border-input">
						{HeadingsSheet.map(heading => {
							return (
								<SelectItem key={heading.type} value={heading.type} className={heading.style}>
									{heading.name}
								</SelectItem>
							);
						})}
					</SelectContent>
				</Select>
				<div className="flex gap-0.5">
					<Toggle pressed={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
						<Bold className={IconClassName} />
					</Toggle>
					<Toggle pressed={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
						<Italic className={IconClassName} />
					</Toggle>
					<Toggle pressed={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
						<Strikethrough className={IconClassName} />
					</Toggle>
				</div>
				<div className="flex gap-0.5">
					<Toggle pressed={editor.isActive("bulletList")} onClick={() => editor.commands.toggleBulletList()}>
						<List className={IconClassName} />
					</Toggle>
					<Toggle pressed={editor.isActive("orderedList")} onClick={() => editor.commands.toggleOrderedList()}>
						<ListOrdered className={IconClassName} />
					</Toggle>
				</div>
				<div className="flex gap-0.5">
					{options?.quotes && (
						<Toggle pressed={editor.isActive("blockquote")} onClick={() => editor.commands.toggleBlockquote()}>
							<Quote className={IconClassName} />
						</Toggle>
					)}
				</div>
			</div>
		</>
	);
}
