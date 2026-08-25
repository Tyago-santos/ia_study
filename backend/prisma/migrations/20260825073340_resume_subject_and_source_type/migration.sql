-- AlterTable
ALTER TABLE "resumes" ADD COLUMN     "sourceType" TEXT NOT NULL DEFAULT 'text',
ADD COLUMN     "subjectId" TEXT;

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
