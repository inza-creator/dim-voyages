import { NewsletterBoard } from "@/components/admin/newsletter-board";
import { listSubscribers } from "@/server/requests";

export default async function NewsletterPage() {
  const items = await listSubscribers();
  return <NewsletterBoard initialItems={JSON.parse(JSON.stringify(items))} />;
}
