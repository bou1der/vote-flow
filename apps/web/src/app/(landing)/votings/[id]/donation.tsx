import { Bitcoin, CreditCard, X } from "lucide-react";
import { DonateIcon } from "ui/components/icons/donate";
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle } from "ui/components/dialog";
import { Tabs, TabsList, TabsTrigger } from "ui/components/tabs";
import { FiatTab } from "./fiat-tab";
// import { CryptoTab } from "./crypto-tab";
import { Button } from "ui/components/button";

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

			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-lg text-center relative">Выберите способ оплаты</DialogTitle>
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
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
// <CryptoTab votingId={votingId} />
