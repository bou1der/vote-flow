import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { Bitcoin, CreditCard, X } from "lucide-react";
import { DonateIcon } from "~/components/icons/donate";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "~/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { FiatTab } from "./fiat-tab";
import { CryptoTab } from "./crypto-tab";

export function DonatSection({
	votingId,
}: {
	votingId: string;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="rounded-3xl gap-2 text-sm font-semibold group ">
					<DonateIcon className="size-6 group-hover:invert" />
					Пожертвовать
				</Button>
			</DialogTrigger>

			<DialogContent noCloseButton>
				<DialogHeader>
					<DialogTitle className="text-lg text-center relative">
						Выберите способ оплаты
						<DialogClose className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2">
							<X className="size-5" />
						</DialogClose>
					</DialogTitle>
				</DialogHeader>

				<Tabs defaultValue="fiat">
					<TabsList className="w-full flex gap-1 items-stretch">
						<TabsTrigger className="text-black basis-1/2 gap-2" value="fiat">
							<CreditCard className="size-6" />
							Картой
						</TabsTrigger>
						<TabsTrigger className="text-black basis-1/2 gap-2" value="crypto">
							<Bitcoin className="size-6" />
							Криптовалютой
						</TabsTrigger>
					</TabsList>

					<FiatTab votingId={votingId} />
					<CryptoTab votingId={votingId} />
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
