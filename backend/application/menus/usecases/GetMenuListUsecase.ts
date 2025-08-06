import { GetMenuListQueryDto } from "../dtos/GetMenuListQueryDto";
import { GetMenuListDto } from "../dtos/GetMenuListDto";
import { GetMenuDto } from "../dtos/GetMenuDto";
import { MenuRepository } from "@/backend/domain/repositories/MenuRepository";
import { Menu } from "@/backend/domain/entities/Menu";

// 실제로는 repository나 service를 주입받아야 하지만, 예시로 임시 데이터를 반환합니다.
export class GetMenuListUsecase {
	constructor(private readonly menuRepository: MenuRepository) {}

	async execute(
		query: GetMenuListQueryDto,
		currentUserId?: string
	): Promise<GetMenuListDto> {
		const pageSize = 8;
		const offset = (query.pageNum - 1) * pageSize;

		// 전체 메뉴 개수 조회
		const totalCount = await this.menuRepository.count({
			searchWord: query.query,
			categoryId: query.categoryId,
			publicOnly: false,
			sortField: "createdAt", // count에서는 사용하지 않지만 필수 속성
			ascending: false, // count에서는 사용하지 않지만 필수 속성
			offset: 0, // count에서는 사용하지 않지만 필수 속성
			limit: 0, // count에서는 사용하지 않지만 필수 속성
		});

		const menus: Menu[] = await this.menuRepository.findAll(
			{
				offset: offset,
				limit: pageSize,
				sortField: "korName",
				ascending: true,
				publicOnly: false,
				searchWord: query.query,
				categoryId: query.categoryId,
				// memberId: query.memberId,
			},
			{
				includeImages: true,
				includeLikes: true,
			}
		);

		const getMenuDtos: GetMenuDto[] = menus.map((menu) => {
			const dto = new GetMenuDto();
			dto.id = menu.id!;
			dto.korName = menu.korName!;
			dto.engName = menu.engName!;
			dto.price = menu.price!;
			dto.description = menu.description!;

			// isDefault가 true인 이미지를 찾아서 defaultImage에 대입
			const defaultImage = menu.images?.find(
				(image) => image.isDefault === true
			);
			dto.defaultImage = defaultImage?.name || "";

			// likes 배열의 길이를 likeCount로 설정
			dto.likeCount = menu.likes?.length || 0;

			// 현재 사용자가 이 메뉴에 좋아요를 눌렀는지 확인
			if (currentUserId && menu.likes) {
				dto.isLikedByMe = menu.likes.some(
					(like) => like.memberId === currentUserId
				);
			} else {
				dto.isLikedByMe = false;
			}

			return dto;
		});

		const endPage = Math.ceil(totalCount / pageSize);
		return {
			menus: getMenuDtos,
			endPage,
		};
	}
}
