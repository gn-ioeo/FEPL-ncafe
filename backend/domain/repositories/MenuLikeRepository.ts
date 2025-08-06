import { MenuLike } from "../entities/MenuLike";

export interface MenuLikeRepository {
	// 조회 메소드들
	findByMemberIdAndMenuId(
		memberId: string,
		menuId: number
	): Promise<MenuLike | null>;
	findByMenuId(menuId: number): Promise<MenuLike[]>;
	findByMemberId(memberId: string): Promise<MenuLike[]>;

	// 조작 메소드들
	save(menuLike: MenuLike): Promise<MenuLike>;
	delete(memberId: string, menuId: number): Promise<void>;
}
