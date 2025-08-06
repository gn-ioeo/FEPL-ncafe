import { Menu } from "@/backend/domain/entities/Menu";
import { MenuRepository } from "../../domain/repositories/MenuRepository";
// import { Menu } from "../../domain/entities/Menu";
import { MenuSearchCriteria } from "../../domain/repositories/criteria/MenuSearchCriteria";
import { MenuRelationsOptions } from "../../domain/repositories/options/MenuRelationsOptions";
import prisma from "@/utils/prisma";

export class PrMenuRepository implements MenuRepository {
	async findAll(
		criteria: MenuSearchCriteria,
		relations?: MenuRelationsOptions
	): Promise<Menu[]> {
		const where: Record<string, unknown> = {};

		// 검색어(한글/영문 이름)
		if (criteria.searchWord) {
			where.OR = [
				{ korName: { contains: criteria.searchWord } },
				{ engName: { contains: criteria.searchWord, mode: "insensitive" } },
			];
		}

		// 카테고리 ID (필요시 추가)
		if (criteria.categoryId) {
			where.categoryId = criteria.categoryId; // TODO: 실제 필드명 확인 필요
		}

		// 멤버 ID (필요시 추가)
		if (criteria.memberId) {
			where.memberId = criteria.memberId; // TODO: 실제 필드명 확인 필요
		}

		// 공개 여부 (isPublic)
		if (criteria.publicOnly) {
			// where.isPublic = true; // TODO: 실제 필드명 확인 필요
		}

		// 정렬
		const orderBy: Record<string, "asc" | "desc"> = {};
		orderBy[criteria.sortField] = criteria.ascending ? "asc" : "desc";

		// relations
		const include: Record<string, boolean> = {};
		if (relations?.includeImages) include.images = true;
		if (relations?.includeMember) include.member = true;
		if (relations?.includeLikes) include.likes = true;

		const menus = await prisma.menu.findMany({
			where,
			orderBy,
			skip: criteria.offset,
			take: criteria.limit,
			include,
			//   include: {
			//     MenuImage: true,
			//   },
		});

		return menus as Menu[];
	}

	async findById(
		id: number,
		relations?: MenuRelationsOptions
	): Promise<Menu | null> {
		const include: Record<string, boolean> = {};
		if (relations?.includeImages) include.images = true;
		if (relations?.includeMember) include.member = true;
		if (relations?.includeLikes) include.likes = true;
		const menu = await prisma.menu.findUnique({
			where: { id },
			include,
		});
		return menu as Menu | null;
	}

	async count(criteria: MenuSearchCriteria): Promise<number> {
		const where: Record<string, unknown> = {};
		if (criteria.searchWord) {
			where.OR = [
				{ korName: { contains: criteria.searchWord, mode: "insensitive" } },
				{ engName: { contains: criteria.searchWord, mode: "insensitive" } },
			];
		}
		if (criteria.categoryId) {
			where.categoryId = criteria.categoryId;
		}
		if (criteria.memberId) {
			where.memberId = criteria.memberId;
		}
		if (criteria.publicOnly) {
			where.isPublic = true;
		}
		return await prisma.menu.count({ where });
	}

	async save(menu: Menu): Promise<Menu> {
		const created = await prisma.menu.create({
			data: {
				korName: menu.korName!,
				engName: menu.engName!,
				price: menu.price!,
				description: menu.description,
				memberId: menu.memberId!,
				categoryId: menu.categoryId!,
				hasIce: menu.hasIce ?? true,
				hasHot: menu.hasHot ?? true,
				isPublic: menu.isPublic ?? false,
			},
		});
		return created as Menu;
	}

	async update(menu: Menu): Promise<Menu> {
		const updated = await prisma.menu.update({
			where: { id: menu.id! },
			data: {
				korName: menu.korName!,
				engName: menu.engName!,
				price: menu.price!,
				description: menu.description,
				memberId: menu.memberId!,
				categoryId: menu.categoryId!,
				hasIce: menu.hasIce ?? true,
				hasHot: menu.hasHot ?? true,
				isPublic: menu.isPublic ?? false,
			},
		});
		return updated as Menu;
	}

	async delete(id: number): Promise<void> {
		await prisma.menu.delete({ where: { id } });
	}
}
