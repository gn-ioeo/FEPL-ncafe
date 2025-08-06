import { Member } from "./Member";
import { Menu } from "./Menu";

export class MenuLike {
	constructor(
		public memberId: string,
		public menuId: number,
		public createdAt: Date,
		public member?: Member,
		public menu?: Menu
	) {}
}
