import { prisma } from "@/lib/prisma";

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function messageHtml(message: string) {
  const body = escapeHtml(message)
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replaceAll("\n", "<br>")}</p>`)
    .join("");
  return `<div style="font-family:sans-serif;font-size:16px;line-height:1.6;color:#122033">${body}<p style="margin-top:24px;color:#5c6d82;font-size:13px">DIM VOYAGES</p></div>`;
}

export async function sendNewsletter(subject: string, message: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return { error: "L'envoi des emails n'est pas encore activé sur le site." as const };
  }

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { active: true },
    select: { email: true },
  });
  if (subscribers.length === 0) {
    return { error: "Aucune adresse active." as const };
  }

  const from = process.env.NEWSLETTER_FROM || "DIM VOYAGES <info@dimvoyages.com>";
  let sent = 0;

  for (let index = 0; index < subscribers.length; index += 100) {
    const chunk = subscribers.slice(index, index + 100);
    const response = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        chunk.map((item) => ({
          from,
          to: [item.email],
          reply_to: "info@dimvoyages.com",
          subject,
          text: message,
          html: messageHtml(message),
        })),
      ),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      const detail = data?.message || "L'envoi a échoué.";
      if (sent > 0) return { error: `${detail} ${sent} message(s) étaient déjà partis.` as const };
      return { error: detail };
    }

    sent += chunk.length;
  }

  return { sent };
}
