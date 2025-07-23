import { NextRequest, NextResponse } from "next/server";

import { PrMenuRepository } from "@/backend/infrastructure/repositories/PrMenuRepository";
import { GetMenuListUsecase } from "@/backend/application/menes/usecases/GetMenuListUsecase";
import { GetMenuListQueryDto } from "@/backend/application/menes/dtos/GetMenuListQueryDto";

// GET /api/menus?p=1&cid=2&q=검색어
export async function GET(req: NextRequest) {
  // 쿼리스트링에서 p, cid, q 추출
  const { searchParams } = new URL(req.url);
  const p = Number(searchParams.get("p")) || 1;
  const cid = Number(searchParams.get("cid")) || 0;
  const q = searchParams.get("q") || "";

  const usecase = new GetMenuListUsecase(new PrMenuRepository());
  const queryDto = new GetMenuListQueryDto(cid, p, q);

  const result = await usecase.execute(queryDto);

  return NextResponse.json(result);
}
