import { GetCategoryListDto } from "../dtos/GetCategoryListDto";
import { GetCategoryDto } from "../dtos/GetCategoryDto";
import { CategoryRepository } from "@/backend/domain/repositories/CategoryRepository";
import { Category } from "@/backend/domain/entities/Category";

export class GetCategoryListUsecase {
	constructor(private readonly categoryRepository: CategoryRepository) {}

	async execute(): Promise<GetCategoryListDto> {
		const categories: Category[] = await this.categoryRepository.findAll();

		const getCategoryDtos: GetCategoryDto[] = categories.map((category) => {
			return new GetCategoryDto(category.id!, category.name!, category.order!);
		});

		return new GetCategoryListDto(getCategoryDtos);
	}
}
