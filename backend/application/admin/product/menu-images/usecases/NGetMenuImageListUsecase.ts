import { MenuImageRepository } from "@/backend/domain/repositories/MenuImageRepository";
import { GetMenuImageListDto } from "../dtos/GetMenuImageListDto";
import { GetMenuImageListQueryDto } from "../dtos/GetMenuImageListQueryDto";

export class NGetMenuImageListUsecase {
	private menuImageRepository: MenuImageRepository;

	constructor(menuImageRepository: MenuImageRepository) {
		this.menuImageRepository = menuImageRepository;
	}

	async execute(
		query?: GetMenuImageListQueryDto
	): Promise<GetMenuImageListDto> {
		const images = await this.menuImageRepository.findAll();

		// menuId 필터링 적용
		let filteredImages = images;
		if (query?.menuId) {
			filteredImages = images.filter((img) => img.menuId === query.menuId);
		}

		const result: GetMenuImageListDto = {
			images: filteredImages.map((img) => ({
				id: img.id ?? 0,
				menuId: img.menuId ?? 0,
				name: img.name ?? "",
				isDefault: img.isDefault ?? false,
			})),
		};
		return result;
	}
}
