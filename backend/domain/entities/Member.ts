import { Menu } from "./Menu";
import { MemberRole } from "./MemberRole";
import { Category } from "./Category";
import { MenuLike } from "./MenuLike";

export class Member {
	constructor(
		public id: string,
		public email: string,
		public username?: string,
		public phone?: string,
		public createdAt?: Date,
		public updatedAt?: Date,
		public deletedAt?: Date | null,
		public password?: string,
		public profileImage?: string | null,
		public provider?: string,
		public providerId?: string,

		// Relations
		public categories?: Category[],
		public memberRoles?: MemberRole[],
		public menuLikes?: MenuLike[],
		public menus?: Menu[]
	) {}
}
