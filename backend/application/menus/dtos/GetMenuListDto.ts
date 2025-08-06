import { GetMenuDto } from "./GetMenuDto";

export class GetMenuListDto {
  constructor(
    public menus: GetMenuDto[],
    public endPage: number
  ) {}
}
