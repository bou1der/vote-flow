import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "ui/components/collapsible";
import { ChevronDown } from "lucide-react";

const questions = [
	{
		title: "Как создать свою тему для голосования?",
		description: "Просто зарегистрируйтесь, нажмите “Создать тему” и опишите свой вопрос.",
	},
	{
		title: "Можно ли голосовать анонимно?",
		description: "Да, наш сервис обеспечивает полную конфиденциальность.",
	},
	{
		title: "Как узнать результаты голосования?",
		description: "Итоги отображаются сразу после завершения голосования.",
	},
	{
		title: "Есть ли ограничения по количеству голосов?",
		description: "Нет, вы можете привлекать любое количество участников.",
	},
	{
		title: "Можно ли изменить свой голос?",
		description: "К сожалению, голос нельзя изменить после отправки, чтобы сохранить честность выборов.",
	},
];

export function Questions() {
	return (
		<div className="container py-16 sm:py-20 space-y-16">
			<div>
				<h1 className="font-bold text-center">Часто задаваемые вопросы</h1>
				<p className="text-center">Ответы на вопросы, которые вы хотели задать</p>
			</div>
			<div className="space-y-8">
				{questions.map(question => (
					<Collapsible key={question.title} className="bg-primary p-6 rounded-3xl border border-gray-500/50">
						<CollapsibleTrigger className="w-full flex justify-between cursor-pointer">
							<span className="text-2xl font-bold">{question.title}</span>
							<ChevronDown />
						</CollapsibleTrigger>
						<CollapsibleContent>
							<p className="mt-2">{question.description}</p>
						</CollapsibleContent>
					</Collapsible>
				))}
			</div>
		</div>
	);
}
