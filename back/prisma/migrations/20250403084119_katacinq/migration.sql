-- CreateTable
CREATE TABLE "Menu" (
    "id" SERIAL NOT NULL,
    "plate" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "plateId" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_plateId_fkey" FOREIGN KEY ("plateId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
