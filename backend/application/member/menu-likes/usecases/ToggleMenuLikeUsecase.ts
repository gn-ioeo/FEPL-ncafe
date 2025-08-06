import { MenuLikeRepository } from "@/backend/domain/repositories/MenuLikeRepository";
import { MenuRepository } from "@/backend/domain/repositories/MenuRepository";
import { CreateMenuLikeDto } from "../dtos/CreateMenuLikeDto";
import { MenuLikeResponseDto } from "../dtos/MenuLikeResponseDto";
import { MenuLike } from "@/backend/domain/entities/MenuLike";

export class ToggleMenuLikeUsecase {
	constructor(
		private readonly menuLikeRepository: MenuLikeRepository,
		private readonly menuRepository: MenuRepository
	) {}

	async execute(dto: CreateMenuLikeDto): Promise<MenuLikeResponseDto> {
		// 기존 좋아요 여부 확인
		const existingLike = await this.menuLikeRepository.findByMemberIdAndMenuId(
			dto.memberId,
			dto.menuId
		);

		if (existingLike) {
			// 좋아요 취소
			await this.menuLikeRepository.delete(dto.memberId, dto.menuId);

			// 업데이트된 좋아요 개수 조회
			const updatedLikes = await this.menuLikeRepository.findByMenuId(
				dto.menuId
			);

			return new MenuLikeResponseDto(
				true,
				"좋아요가 취소되었습니다.",
				updatedLikes.length,
				false
			);
		} else {
			// 좋아요 추가
			const newMenuLike = new MenuLike(dto.memberId, dto.menuId, new Date());

			await this.menuLikeRepository.save(newMenuLike);

			// 업데이트된 좋아요 개수 조회
			const updatedLikes = await this.menuLikeRepository.findByMenuId(
				dto.menuId
			);

			return new MenuLikeResponseDto(
				true,
				"좋아요가 추가되었습니다.",
				updatedLikes.length,
				true
			);
		}
	}
}
