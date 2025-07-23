import { PrMenuRepository } from "@/backend/infrastructure/repositories/PrMenuRepository";

async function main() {
  const menuRepository = new PrMenuRepository();
  const menus = await menuRepository.findAll({
    offset: 0,
    limit: 10,
    sortField: "id",
    ascending: true,
    publicOnly: false,
    searchWord: "",
  });
  console.log(menus);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {});
