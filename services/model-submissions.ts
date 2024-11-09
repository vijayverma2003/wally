import ms from "ms";
import { prisma } from "../prisma/client";

export async function clearSubmissions() {
  try {
    const response = await prisma.modelMakerSubmission.deleteMany({
      where: {
        startedAt: { lte: new Date(Date.now() - ms("24 hours")) },
        submitted: null,
      },
    });

    console.log(`Cleared ${response.count} model submissions...`);
  } catch (error) {
    console.log("Error while cleaning up old submissions...", error);
  }
}
