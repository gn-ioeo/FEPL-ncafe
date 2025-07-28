import { GetMenuListQueryDto } from "../dtos/GetMenuListQueryDto";
import { GetMenuListDto } from "../dtos/GetMenuListDto";
import { GetMenuDto } from "../dtos/GetMenuDto";
import { MenuRepository } from "@/backend/domain/repositories/MenuRepository";
import { Menu } from "@/backend/domain/entities/Menu";

// 실제로는 repository나 service를 주입받아야 하지만, 예시로 임시 데이터를 반환합니다.
export class GetMenuListUsecase {
  constructor(private readonly menuRepository: MenuRepository) {}

  async execute(query: GetMenuListQueryDto): Promise<GetMenuListDto> {
    const menus: Menu[] = await this.menuRepository.findAll({
      offset: query.pageNum ?? 0,
      limit: 10,
      sortField: "korName",
      ascending: true,
      publicOnly: false,
      categoryId: query.categoryId,
      searchWord: query.query,
    });

    const getMenuDtos: GetMenuDto[] = menus.map((menu) => {
      const dto = new GetMenuDto();
      dto.id = menu.id!;
      dto.korName = menu.korName!;
      dto.engName = menu.engName!;
      dto.price = menu.price!;
      dto.description = menu.description!;
      dto.defaultImage = "";
      return dto;
    });

    const endPage = Math.ceil(menus.length / 10);
    return {
      menus: getMenuDtos,
      endPage,
    };
  }
}
