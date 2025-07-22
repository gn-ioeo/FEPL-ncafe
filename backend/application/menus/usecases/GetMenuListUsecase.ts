import { GetMenuListQueryDto } from "../dtos/GetMenuListQueryDto";
import { GetMenuListDto } from "../dtos/GetMenuListDto";
import { GetMenuDto } from "../dtos/GetMenuDto";

// 실제로는 repository나 service를 주입받아야 하지만, 예시로 임시 데이터를 반환합니다.
export class GetMenuListUsecase {
  async execute(query: GetMenuListQueryDto): Promise<GetMenuListDto> {
    // 임시 데이터
    const menus: GetMenuDto[] = [
      new GetMenuDto(
        1,
        "아메리카노",
        "Americano",
        3000,
        2,
        "/image/product/americano.png"
      ),
      new GetMenuDto(
        2,
        "카페라떼",
        "Cafe Latte",
        3500,
        5,
        "/image/product/latte.png"
      ),
    ];

    // 실제 구현에서는 query.categoryId, query.pageNum, query.query를 활용하여
    // DB에서 데이터를 조회해야 합니다.

    // 임시로 endPage를 2로 설정 (menus 배열과 endPage 파라미터만 사용)
    return new GetMenuListDto(menus, 2);
  }
}
