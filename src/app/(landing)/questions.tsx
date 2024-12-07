import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";



export function Questions(){

  return (
    <div className="container py-16 sm:py-20 space-y-16">
      <div>
        <h1 className="font-bold text-center">Часто задаваемые вопросы</h1>
        <p className="text-center">Ответы на вопросы, которые вы хотели задать</p>
      </div>
      <div>
        <Collapsible className="bg-primary p-6 rounded-3xl border border-gray-500/50">
          <CollapsibleTrigger className="w-full flex justify-between cursor-pointer">
            <span>Как создать свою тему для голосования?</span>
            <ChevronDown />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="mt-2">Просто зарегистрируйтесь, нажмите “Создать тему” и опишите свой вопрос.</p>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}
