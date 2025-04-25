import { DataTable } from "ui/components/data-table";
import { columns } from "./columns";
import { api } from "~/lib/api";
import { headers } from "~/lib/server/headers";
import { notFound } from "next/navigation";

export default async function ReviewsAdmin() {
	const { data: reviews } = await api.reviews.index.get({
		query: {},
		headers: await headers(),
	});
	if (!reviews) notFound();

	return <DataTable data={reviews} columns={columns} />;
}
