export class GetMenuListQueryDto {
  constructor(
    public categoryId: number,
    public pageNum: number,
    public query: string
  ) {}
}


