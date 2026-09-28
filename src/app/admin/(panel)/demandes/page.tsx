import { RequestsBoard } from "@/components/admin/requests-board";
import { listRequests } from "@/server/requests";

export default async function RequestsPage() {
  const items = await listRequests();
  return <RequestsBoard initialItems={JSON.parse(JSON.stringify(items))} />;
}
