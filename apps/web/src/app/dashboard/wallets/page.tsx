import { Tabs, TabsList, TabsTrigger } from "ui/components/tabs";
// import { CryptoTab } from "./crypto-tab";
// <CryptoTab />
import { FiatTab } from "./fiat-tab";

export default function WalletsPage() {
	return (
		<Tabs className="relative grow overflow-hidden" defaultValue="fiat">
			<FiatTab />

			<TabsList className="gap-2 absolute bottom-0 left-0">
				<TabsTrigger className="text-black" value="fiat">
					Фиат
				</TabsTrigger>
				<TabsTrigger className="text-black" value="crypto">
					Криптовалюта
				</TabsTrigger>
			</TabsList>
		</Tabs>
	);
}
