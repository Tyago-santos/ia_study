import { prisma } from "@/config/prisma.js";
import type { Prisma } from "@/generated/prisma/client.js";

export class SchoolSubjects {
  async finBySchoolSubjectsAll(userId: string) {
    return await prisma.schoolSubject.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async findById(userId: string, id: string) {
    return await prisma.schoolSubject.findFirst({
      where: { id, userId },
    });
  }

  async updateSchoolSubjects(
    userId: string,
    id: string,
    data: Prisma.SchoolSubjectUpdateInput,
  ) {
    const subject = await prisma.schoolSubject.findFirst({
      where: { id, userId },
    });

    if (!subject) return null;

    return await prisma.schoolSubject.update({
      where: { id: subject.id },
      data,
    });
  }

  async deleteSchoolSubjects(userId: string, id: string) {
    const subject = await prisma.schoolSubject.findFirst({
      where: { id, userId },
    });

    if (!subject) return null;

    return await prisma.schoolSubject.delete({
      where: { id: subject.id },
    });
  }

  async createSchoolSubjects(data: Prisma.SchoolSubjectCreateInput) {
    return await prisma.schoolSubject.create({
      data,
    });
  }
}
