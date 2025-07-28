export class GetMenuDto {
  constructor(
    public id?: number,
    public korName?: string,
    public engName?: string,
    public price?: number,
    public description?: string,
    public defaultImage?: string
  ) {}
}