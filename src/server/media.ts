import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { refreshPublic } from "@/server/resources";

const ALLOWED = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);

const MAX_SIZE = 5 * 1024 * 1024;

export function uploadDirectory() {
  return path.join(process.cwd(), "public", "uploads");
}

export async function saveUpload(file: File, alt: string) {
  if (!ALLOWED.has(file.type)) {
    return { error: "Format accepté : JPG, PNG, WEBP ou GIF." as const };
  }
  if (file.size > MAX_SIZE) {
    return { error: "L'image dépasse 5 Mo." as const };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${crypto.randomUUID()}${ALLOWED.get(file.type)}`;
  const directory = uploadDirectory();
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), bytes);

  const media = await prisma.media.create({
    data: {
      filename,
      url: `/uploads/${filename}`,
      alt: alt.trim(),
      mimeType: file.type,
      size: bytes.length,
    },
  });

  return { media };
}

export async function listMedia() {
  return prisma.media.findMany({ orderBy: { createdAt: "desc" } });
}

export async function updateMediaAlt(id: string, alt: string) {
  return prisma.media.update({ where: { id }, data: { alt: alt.trim() } });
}

export async function deleteMedia(id: string) {
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return { error: "Image introuvable." as const };

  await prisma.$transaction([
    prisma.experience.updateMany({ where: { imageUrl: media.url }, data: { imageUrl: "" } }),
    prisma.service.updateMany({ where: { imageUrl: media.url }, data: { imageUrl: "" } }),
    prisma.destination.updateMany({ where: { imageUrl: media.url }, data: { imageUrl: "" } }),
    prisma.offer.updateMany({ where: { imageUrl: media.url }, data: { imageUrl: "" } }),
    prisma.article.updateMany({ where: { imageUrl: media.url }, data: { imageUrl: "" } }),
    prisma.galleryItem.updateMany({ where: { imageUrl: media.url }, data: { imageUrl: "" } }),
    prisma.galleryItem.updateMany({ where: { mediaId: media.id }, data: { mediaId: null } }),
    prisma.siteSetting.updateMany({ where: { value: media.url }, data: { value: "" } }),
    prisma.media.delete({ where: { id: media.id } }),
  ]);

  if (media.url.startsWith("/uploads/")) {
    const filename = path.basename(media.url);
    await unlink(path.join(uploadDirectory(), filename)).catch(() => undefined);
  }

  refreshPublic();
  return { ok: true as const };
}
