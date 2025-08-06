import { MenuImage } from "./MenuImage";
import { Category } from "./Category";
import { Member } from "./Member";
import { MenuLike } from "./MenuLike";

export class Menu {
	constructor(
		public id?: number,
		public korName?: string,
		public engName?: string,
		public price?: number,
		public isPublic?: boolean,
		public hasIce?: boolean,
		public hasHot?: boolean,
		public description?: string | null,
		public createdAt?: Date,
		public updatedAt?: Date,
		public deletedAt?: Date | null,
		public categoryId?: number,
		public memberId?: string,
		public images?: MenuImage[],
		public likes?: MenuLike[],
		public category?: Category,
		public member?: Member
	) {}
}
