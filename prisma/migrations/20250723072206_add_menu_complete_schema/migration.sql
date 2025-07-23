-- CreateTable
CREATE TABLE "menus" (
    "id" SERIAL NOT NULL,
    "kor_name" TEXT NOT NULL,
    "eng_name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT,
    "member_id" TEXT,
    "category_id" INTEGER DEFAULT 1,
    "has_ice" BOOLEAN DEFAULT false,
    "is_public" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_images" (
    "id" SERIAL NOT NULL,
    "src" TEXT NOT NULL,
    "menuId" INTEGER NOT NULL,

    CONSTRAINT "menu_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "menu_images" ADD CONSTRAINT "menu_images_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
