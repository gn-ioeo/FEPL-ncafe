import { CategoryRepository } from "@/backend/domain/repositories/CategoryRepository";
import { Category } from "@/backend/domain/entities/Category";
import { CategoryRelationsOptions } from "@/backend/domain/repositories/options/CategoryRelationsOptions";
import prisma from "@/utils/prisma";
import { Member } from "@/backend/domain/entities/Member";
import { Menu } from "@/backend/domain/entities/Menu";

export class PrCategoryRepository implements CategoryRepository {
	async findAll(relations?: CategoryRelationsOptions): Promise<Category[]> {
		const include: Record<string, boolean> = {};
		if (relations?.includeMenus) include.menus = true;
		if (relations?.includeMember) include.member = true;

		const categories = await prisma.category.findMany({
			include,
			orderBy: { order: "asc" },
		});

		return categories.map(
			(category) =>
				new Category(
					category.id,
					category.name,
					category.isPublic,
					category.order,
					category.memberId,
					category.createdAt,
					category.menus as Menu[],
					category.member as unknown as Member
				)
		);
	}

	async findById(
		id: number,
		relations?: CategoryRelationsOptions
	): Promise<Category | null> {
		const include: Record<string, boolean> = {};
		if (relations?.includeMenus) include.menus = true;

		const category = await prisma.category.findUnique({
			where: { id },
			include,
		});

		if (!category) return null;

		return new Category(
			category.id,
			category.name,
			category.isPublic,
			category.order,
			category.memberId,
			category.createdAt,
			category.menus as Menu[],
			category.member as unknown as Member
		);
	}

	async save(category: Category): Promise<Category> {
		const created = await prisma.category.create({
			data: {
				name: category.name,
				isPublic: category.isPublic,
				order: category.order,
				memberId: category.memberId,
				createdAt: category.createdAt,
			},
		});

		return new Category(
			created.id,
			created.name,
			created.isPublic,
			created.order,
			created.memberId,
			created.createdAt
		);
	}

	async update(category: Category): Promise<Category> {
		const updated = await prisma.category.update({
			where: { id: category.id },
			data: {
				name: category.name,
				isPublic: category.isPublic,
				order: category.order,
			},
		});

		return new Category(
			updated.id,
			updated.name,
			updated.isPublic,
			updated.order,
			updated.memberId,
			updated.createdAt
		);
	}

	async delete(id: number): Promise<void> {
		await prisma.category.delete({
			where: { id },
		});
	}
}
