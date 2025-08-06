import {
	MemberTable,
	CategoryTable,
	MenuTable,
	MenuImageTable,
	RoleTable,
	MemberRoleTable,
} from "../types/database";
import { Member } from "@/backend/domain/entities/Member";
import { Category } from "@/backend/domain/entities/Category";
import { Menu } from "@/backend/domain/entities/Menu";
import { MenuImage } from "@/backend/domain/entities/MenuImage";
import { Role } from "@/backend/domain/entities/Role";
import { MemberRole } from "@/backend/domain/entities/MemberRole";

export class Mapper {
	static toMember(source: MemberTable): Member {
		return new Member(
			source.id,
			source.email ?? "",
			source.username ?? "",
			undefined, // phone
			source.created_at ? new Date(source.created_at) : undefined,
			source.updated_at ? new Date(source.updated_at) : undefined,
			source.deleted_at ? new Date(source.deleted_at) : null,
			source.password ?? undefined,
			source.image ?? null
		);
	}

	static toCategory(source: CategoryTable): Category {
		return new Category(
			source.id,
			source.name,
			source.is_public,
			source.order,
			"", // memberId - CategoryTable에 없으므로 빈 문자열
			new Date(source.created_at)
		);
	}

	static toMenu(source: MenuTable): Menu {
		return new Menu(
			source.id,
			source.kor_name,
			source.eng_name,
			source.price,
			source.is_public,
			source.has_ice,
			undefined, // has_hot - MenuTable에 없음
			source.description,
			new Date(source.created_at),
			source.updated_at ? new Date(source.updated_at) : undefined,
			source.deleted_at ? new Date(source.deleted_at) : null,
			source.category_id,
			source.member_id
		);
	}

	static toMenuImage(source: MenuImageTable): MenuImage {
		return new MenuImage(
			source.id,
			source.name,
			source.is_default,
			source.menu_id
		);
	}

	static toRole(source: RoleTable): Role {
		return new Role(source.id, source.name, new Date(source.created_at));
	}

	static toMemberRole(source: MemberRoleTable): MemberRole {
		return new MemberRole(
			source.member_id,
			source.role_id,
			new Date(source.created_at)
		);
	}
}
