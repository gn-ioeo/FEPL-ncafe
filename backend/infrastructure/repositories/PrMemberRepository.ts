import { MemberRepository } from "@/backend/domain/repositories/MemberRepository";
import { Member } from "@/backend/domain/entities/Member";
import prisma from "@/utils/prisma";
import { MemberRelationsOptions } from "@/backend/domain/repositories/options/MemberRelationsOptions";

export class PrMemberRepository implements MemberRepository {
	async findByUsername(username: string): Promise<Member | null> {
		console.log("🔍 PrMemberRepository.findByUsername 호출:", username);

		const member = await prisma.member.findUnique({
			where: { username },
			include: {
				memberRoles: {
					include: {
						role: true,
					},
				},
			},
		});

		console.log("📊 조회된 회원 데이터:", JSON.stringify(member, null, 2));
		return member as Member | null;
	}

	async findByEmail(email: string): Promise<Member | null> {
		console.log("🔍 PrMemberRepository.findByEmail 호출:", email);

		const member = await prisma.member.findUnique({
			where: { email },
			include: {
				memberRoles: {
					include: {
						role: true,
					},
				},
			},
		});

		console.log("📊 조회된 회원 데이터:", JSON.stringify(member, null, 2));
		return member as Member | null;
	}

	async findAll(relations?: MemberRelationsOptions): Promise<Member[]> {
		const include: Record<string, boolean> = {};
		if (relations?.includeMenus) include.menus = true;
		const members = await prisma.member.findMany({ include });
		return members as Member[];
	}

	async findByMemberId(
		id: string,
		relations?: MemberRelationsOptions
	): Promise<Member | null> {
		const include: Record<string, boolean> = {};
		if (relations?.includeMenus) include.menus = true;
		const member = await prisma.member.findUnique({
			where: { id },
			include,
		});
		return member as Member | null;
	}

	async save(member: Member): Promise<Member> {
		const created = await prisma.member.create({
			data: {
				username: member.username,
				password: member.password,
				email: member.email,
				phone: member.phone,
				profileImage: member.profileImage,
				provider: member.provider,
				providerId: member.providerId,
				createdAt: member.createdAt ?? new Date(),
				updatedAt: member.updatedAt ?? new Date(),
			},
		});
		return created as Member;
	}

	async update(member: Member): Promise<Member> {
		const updated = await prisma.member.update({
			where: { id: member.id },
			data: {
				username: member.username,
				password: member.password ?? "",
			},
		});

		return updated as Member;
	}

	async delete(id: string): Promise<void> {
		await prisma.member.delete({ where: { id } });
	}
}
