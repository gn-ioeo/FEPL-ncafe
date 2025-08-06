import { MemberRoleRepository } from "@/backend/domain/repositories/MemberRoleRepository";
import { MemberRole } from "@/backend/domain/entities/MemberRole";
import prisma from "@/utils/prisma";

export class PrMemberRoleRepository implements MemberRoleRepository {
	async save(memberRole: MemberRole): Promise<MemberRole> {
		const created = await prisma.memberRole.create({
			data: {
				memberId: memberRole.memberId,
				roleId: memberRole.roleId,
				createdAt: memberRole.createdAt,
			},
		});
		return created as MemberRole;
	}

	async findByMemberId(memberId: string): Promise<MemberRole[]> {
		const memberRoles = await prisma.memberRole.findMany({
			where: { memberId },
		});
		return memberRoles as MemberRole[];
	}

	async deleteByMemberId(memberId: string): Promise<void> {
		await prisma.memberRole.deleteMany({
			where: { memberId },
		});
	}
}
