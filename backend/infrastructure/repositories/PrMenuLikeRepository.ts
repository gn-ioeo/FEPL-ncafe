import { MenuLike } from "@/backend/domain/entities/MenuLike";
import { MenuLikeRepository } from "@/backend/domain/repositories/MenuLikeRepository";
import prisma from "@/utils/prisma";

export class PrMenuLikeRepository implements MenuLikeRepository {
	async findByMemberIdAndMenuId(
		memberId: string,
		menuId: number
	): Promise<MenuLike | null> {
		const menuLike = await prisma.menuLike.findUnique({
			where: {
				memberId_menuId: {
					memberId,
					menuId,
				},
			},
		});

		return menuLike as MenuLike | null;
	}

	async findByMenuId(menuId: number): Promise<MenuLike[]> {
		const menuLikes = await prisma.menuLike.findMany({
			where: { menuId },
		});

		return menuLikes as MenuLike[];
	}

	async findByMemberId(memberId: string): Promise<MenuLike[]> {
		const menuLikes = await prisma.menuLike.findMany({
			where: { memberId },
		});

		return menuLikes as MenuLike[];
	}

	async save(menuLike: MenuLike): Promise<MenuLike> {
		const saved = await prisma.menuLike.upsert({
			where: {
				memberId_menuId: {
					memberId: menuLike.memberId,
					menuId: menuLike.menuId,
				},
			},
			update: {
				createdAt: menuLike.createdAt,
			},
			create: {
				memberId: menuLike.memberId,
				menuId: menuLike.menuId,
				createdAt: menuLike.createdAt,
			},
		});

		return saved as MenuLike;
	}

	async delete(memberId: string, menuId: number): Promise<void> {
		await prisma.menuLike.delete({
			where: {
				memberId_menuId: {
					memberId,
					menuId,
				},
			},
		});
	}
}
