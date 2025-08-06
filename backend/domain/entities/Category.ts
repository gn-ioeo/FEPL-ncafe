import { Menu } from "./Menu";
import { Member } from "./Member";

export class Category {
	constructor(
		public id: number,
		public name: string,
		public isPublic: boolean,
		public order: number,
		public memberId: string,
		public createdAt: Date,
		public menus?: Menu[],
		public member?: Member
	) {}
}
