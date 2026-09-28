import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/public/page-hero";
import { formatDate } from "@/lib/utils";
import { getArticle } from "@/server/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getArticle(slug);
  return { title: item?.title ?? "Actualité" };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const item = await getArticle(slug);
  if (!item) notFound();
  return (
    <>
      <PageHero title={item.title} subtitle={item.publishedAt ? formatDate(item.publishedAt) : item.excerpt} image={item.imageUrl} />
      <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        {item.content.split("\n").filter(Boolean).map((paragraph) => (
          <p key={paragraph} className="mb-4 text-base leading-7">{paragraph}</p>
        ))}
      </article>
    </>
  );
}
