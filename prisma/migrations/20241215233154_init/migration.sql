-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('seller', 'customer', 'admin');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('created', 'payed', 'delivery', 'delivered', 'success', 'canceled');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('pending', 'success', 'error');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roles" "UserRole"[] DEFAULT ARRAY['customer']::"UserRole"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailCode" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoodCategory" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "parentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoodCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Good" (
    "id" TEXT NOT NULL,
    "articleNumber" TEXT,
    "modifiedName" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "count" INTEGER NOT NULL DEFAULT 0,
    "images" TEXT[],
    "categoryId" INTEGER,
    "brandId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Good_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BasketItem" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "goodId" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BasketItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteItem" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "goodId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryMethod" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeliveryMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Checkout" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "paymentMethodId" TEXT,
    "paymentMethodName" TEXT,
    "deliveryMethodId" TEXT NOT NULL,
    "deliveryMethodName" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "recipientAddress" TEXT NOT NULL,
    "recipientPhone" TEXT NOT NULL,
    "goodsIdList" TEXT[],
    "goodsPrice" DOUBLE PRECISION[],
    "goodsCount" INTEGER[],
    "goodsName" TEXT[],
    "paymentTotal" DOUBLE PRECISION NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'created',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Checkout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipient" (
    "userId" INTEGER NOT NULL,
    "recipientName" TEXT NOT NULL,
    "recipientAddress" TEXT NOT NULL,
    "recipientPhone" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'pending',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "checkoutId" TEXT NOT NULL,
    "providerData" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EmailCode_email_key" ON "EmailCode"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BasketItem_userId_goodId_key" ON "BasketItem"("userId", "goodId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteItem_userId_goodId_key" ON "FavoriteItem"("userId", "goodId");

-- CreateIndex
CREATE UNIQUE INDEX "Recipient_userId_key" ON "Recipient"("userId");

-- AddForeignKey
ALTER TABLE "GoodCategory" ADD CONSTRAINT "GoodCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "GoodCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Good" ADD CONSTRAINT "Good_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "GoodCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Good" ADD CONSTRAINT "Good_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BasketItem" ADD CONSTRAINT "BasketItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BasketItem" ADD CONSTRAINT "BasketItem_goodId_fkey" FOREIGN KEY ("goodId") REFERENCES "Good"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteItem" ADD CONSTRAINT "FavoriteItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteItem" ADD CONSTRAINT "FavoriteItem_goodId_fkey" FOREIGN KEY ("goodId") REFERENCES "Good"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipient" ADD CONSTRAINT "Recipient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_checkoutId_fkey" FOREIGN KEY ("checkoutId") REFERENCES "Checkout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
