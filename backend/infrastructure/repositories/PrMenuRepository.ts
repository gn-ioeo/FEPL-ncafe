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
    const where: any = {};

    // 검색어(한글/영문 이름)
    if (criteria.searchWord) {
      where.OR = [
        { korName: { contains: criteria.searchWord, mode: "insensitive" } },
        { engName: { contains: criteria.searchWord, mode: "insensitive" } }
      ];
    }

    // 카테고리 ID (필요시 추가)
    if (criteria.categoryId) {
      where.categoryId = criteria.categoryId; // TODO: 실제 필드명 확인 필요
    }

    // 멤버 ID (필요시 추가)
    if (criteria.memberId) {
      // where.memberId = criteria.memberId; // TODO: 실제 필드명 확인 필요
    }

    // 공개 여부 (isPublic)
    if (criteria.publicOnly) {
      // where.isPublic = true; // TODO: 실제 필드명 확인 필요
    }

    // 정렬
    const orderBy: any = {};
    orderBy[criteria.sortField] = criteria.ascending ? "asc" : "desc";

    // relations
    const include: any = {};
    if (relations?.includeImages) include.MenuImage = true;
    if (relations?.includeMember) include.Member = true; // TODO: 실제 relation명 확인 필요

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

  async findById(id: number, relations?: MenuRelationsOptions): Promise<Menu | null> {
    // TODO: relations 변환 구현 필요
    // const menu = await prisma.menu.findUnique({
    //   where: { id },
    //   include: { ... },
    // });
    // return menu as Menu | null;
    throw new Error("Not implemented");
  }

  async count(criteria: MenuSearchCriteria): Promise<number> {
    // TODO: criteria 변환 구현 필요
    // const count = await prisma.menu.count({
    //   where: { ... },
    // });
    // return count;
    throw new Error("Not implemented");
  }

  async save(menu: Menu): Promise<Menu> {
    // TODO: Menu 엔티티를 Prisma 데이터로 변환 필요
    // const created = await prisma.menu.create({
    //   data: { ...menu },
    // });
    // return created as Menu;
    throw new Error("Not implemented");
  }

  async update(menu: Menu): Promise<Menu> {
    // TODO: Menu 엔티티를 Prisma 데이터로 변환 필요
    // const updated = await prisma.menu.update({
    //   where: { id: menu.id },
    //   data: { ...menu },
    // });
    // return updated as Menu;
    throw new Error("Not implemented");
  }

  async delete(id: number): Promise<void> {
    // await prisma.menu.delete({
    //   where: { id },
    // });
    throw new Error("Not implemented");
  }
}
