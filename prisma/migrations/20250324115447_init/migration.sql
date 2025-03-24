/*
  Warnings:

  - You are about to drop the column `title` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TextNotation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `alt` to the `Skill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Skill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Skill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Skill` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_skillId_fkey";

-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "title",
ADD COLUMN     "alt" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- DropTable
DROP TABLE "Image";

-- DropTable
DROP TABLE "TextNotation";

-- CreateTable
CREATE TABLE "ImageSection" (
    "id" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,

    CONSTRAINT "ImageSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextSection" (
    "id" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "name" TEXT,
    "heading" TEXT NOT NULL,
    "desc" TEXT,
    "text" TEXT NOT NULL,

    CONSTRAINT "TextSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "formation" TEXT NOT NULL,
    "organisme" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "poste" TEXT NOT NULL,
    "entreprise" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkWork" (
    "id" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "workId" TEXT,

    CONSTRAINT "LinkWork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Work" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Work_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SkillToWork" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SkillToWork_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImageSection_section_key" ON "ImageSection"("section");

-- CreateIndex
CREATE UNIQUE INDEX "TextSection_section_key" ON "TextSection"("section");

-- CreateIndex
CREATE INDEX "_SkillToWork_B_index" ON "_SkillToWork"("B");

-- AddForeignKey
ALTER TABLE "LinkWork" ADD CONSTRAINT "LinkWork_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillToWork" ADD CONSTRAINT "_SkillToWork_A_fkey" FOREIGN KEY ("A") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillToWork" ADD CONSTRAINT "_SkillToWork_B_fkey" FOREIGN KEY ("B") REFERENCES "Work"("id") ON DELETE CASCADE ON UPDATE CASCADE;
