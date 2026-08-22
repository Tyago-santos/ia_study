-- CreateTable
CREATE TABLE "schoolsubjects" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "schoolsubjects_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "schoolsubjects" ADD CONSTRAINT "schoolsubjects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
