import { MediaManager } from "@/components/admin/media-manager";
import { listMedia } from "@/server/media";

export default async function MediaPage() {
  const items = await listMedia();
  return <MediaManager initialItems={JSON.parse(JSON.stringify(items))} />;
}
