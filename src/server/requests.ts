import { Prisma, type RequestStatus, type RequestType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function nextReference() {
  const year = new Date().getFullYear();
  const start = new Date(year, 0, 1);
  const count = await prisma.travelRequest.count({ where: { createdAt: { gte: start } } });
  return `DV-${year}-${String(count + 1).padStart(4, "0")}`;
}

export async function createTravelRequest(input: {
  type: RequestType;
  fullName: string;
  email: string;
  phone: string;
  destination: string;
  travelDate: string;
  travelers: number | null;
  message: string;
  details?: Record<string, string>;
}) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const reference = await nextReference();
    try {
      return await prisma.travelRequest.create({
        data: {
          reference,
          type: input.type,
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          destination: input.destination,
          travelDate: input.travelDate,
          travelers: input.travelers,
          message: input.message,
          details: input.details ? (input.details as Prisma.InputJsonValue) : undefined,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002" && attempt < 2) {
        continue;
      }
      throw error;
    }
  }
  throw new Error("Impossible d'enregistrer la demande.");
}

export async function listRequests() {
  return prisma.travelRequest.findMany({ orderBy: { createdAt: "desc" }, take: 300 });
}

export async function getRequest(id: string) {
  return prisma.travelRequest.findUnique({ where: { id } });
}

export async function updateRequestStatus(id: string, status: RequestStatus) {
  return prisma.travelRequest.update({ where: { id }, data: { status } });
}

export async function subscribeNewsletter(email: string) {
  return prisma.newsletterSubscriber.upsert({
    where: { email },
    update: { active: true },
    create: { email },
  });
}

export async function listSubscribers() {
  return prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
}
