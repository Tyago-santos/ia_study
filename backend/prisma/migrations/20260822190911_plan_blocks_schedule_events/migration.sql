-- AlterTable
ALTER TABLE "users" ADD COLUMN     "weeklyGoalMinutes" INTEGER NOT NULL DEFAULT 600;

-- CreateTable
CREATE TABLE "plan_blocks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "subjectId" TEXT,
    "subjectName" TEXT NOT NULL,
    "subjectColor" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "startTime" TEXT,
    "topicId" TEXT,
    "topicName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plan_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "subjectId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER,
    "description" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schedule_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "plan_blocks_userId_weekday_idx" ON "plan_blocks"("userId", "weekday");

-- CreateIndex
CREATE INDEX "schedule_events_userId_date_idx" ON "schedule_events"("userId", "date");

-- AddForeignKey
ALTER TABLE "plan_blocks" ADD CONSTRAINT "plan_blocks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_blocks" ADD CONSTRAINT "plan_blocks_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_events" ADD CONSTRAINT "schedule_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_events" ADD CONSTRAINT "schedule_events_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
