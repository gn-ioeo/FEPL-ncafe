import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.scss";
import FilterForm from "./components/FilterForm";
import { GetMenuListDto } from "@/backend/application/menus/dtos/GetMenuListDto";

const {
  ["menus-box"]: menusBox,
  menus,
  list,
  ["menu-card"]: menuCard,
  ["img-box"]: imgBox,
  ["menu-info"]: menuInfo,
  price,
  like,
  pay,
} = styles;

export default async function MenuListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const searchParamsResolved = await searchParams;
  const categoryId = searchParamsResolved.c;
  const search = searchParamsResolved.q;
  const url = new URL("http://localhost:3000/api/menus");
  if (categoryId) {
    url.searchParams.set("c", categoryId as string);
  } else if (search) {
    url.searchParams.set("q", search as string);
  }

  console.log("Fetching URL:", url.toString());

  const res = await fetch(url.toString());

  if (!res.ok) {
    console.error("API Error:", res.status, res.statusText);
    const text = await res.text();
    console.error("Response body:", text);
    throw new Error(`API request failed: ${res.status}`);
  }

  const data: GetMenuListDto = await res.json();
  console.log(data);

  return (
    <main>
      <FilterForm />

      <div className={menusBox}>
        <section className={menus}>
          <h1 className="d:none">메뉴 목록</h1>
          <div className={list}>
            {data.menus.map((menu) => (
              <section key={menu.id} className={menuCard}>
                <div className={imgBox}>
                  <Image
                    src={menu.defaultImage || "/image/product/default.png"}
                    alt={menu.korName ?? "메뉴 이미지"}
                    width={200}
                    height={200}
                  />
                </div>
                <div className={menuInfo}>
                  <h1>
                    <Link href={`/menus/${menu.id}`}>{menu.korName}</Link>
                  </h1>
                  <h2>{menu.engName}</h2>
                  <div className={price}>{menu.price?.toLocaleString()}원</div>
                  <div className={like}>
                    <label className="n-icon n-icon:favorite">
                      좋아요
                      <input
                        className="d:none"
                        type="checkbox"
                        defaultValue={menu.id}
                      />
                    </label>
                  </div>
                  <div className={pay}>
                    <button className="n-icon n-icon:shopping_cart n-btn n-btn:rounded n-btn-color:main">
                      장바구니에 담기
                    </button>
                    <button className="n-icon n-icon:credit_card n-btn n-btn:rounded n-btn-color:sub">
                      주문하기
                    </button>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
