export class GetMenuDto {
  constructor(
    public id: number,
    public korName: string,
    public engName: string,
    public price: number,
    public likeCount: number,
    public defaultImage?: string
  ) {}
}
