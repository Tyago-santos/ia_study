-- CreateTable
CREATE TABLE "mindmaps" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mindmaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mindmap_nodes" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "note" TEXT,
    "color" TEXT,
    "collapsed" BOOLEAN NOT NULL DEFAULT false,
    "positionX" DOUBLE PRECISION,
    "positionY" DOUBLE PRECISION,
    "mindMapId" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "mindmap_nodes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "mindmaps" ADD CONSTRAINT "mindmaps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mindmaps" ADD CONSTRAINT "mindmaps_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "schoolsubjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mindmap_nodes" ADD CONSTRAINT "mindmap_nodes_mindMapId_fkey" FOREIGN KEY ("mindMapId") REFERENCES "mindmaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mindmap_nodes" ADD CONSTRAINT "mindmap_nodes_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "mindmap_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
