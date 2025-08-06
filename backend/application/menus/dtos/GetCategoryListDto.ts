import { GetCategoryDto } from "./GetCategoryDto";

export class GetCategoryListDto {
	constructor(public categories: GetCategoryDto[]) {}
}
