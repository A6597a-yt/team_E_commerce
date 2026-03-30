"use client";
import React, { useState, useEffect } from "react";
// 상대 경로를 유지하여 에러를 방지합니다.
import { Product } from "./Product";

const BestSeller = () => {
  // 1. 실제 서버에서 받아올 데이터를 관리할 State (초기값은 장난감 쇼핑몰 데이터)
  const [products, setProducts] = useState([
    {
      id: "product1",
      photo: "/images/products/airsoft-m4.jpg", // 경로에 맞는 이미지 파일 필요
      title: "VFC M4A1 RIS 가스 블로우백 (GBB)",
      price: 585000,      // 현재 판매가
      salesPrice: 650000, // 할인 전 원가
      rating: 5,
    },
    {
      id: "product2",
      photo: "/images/products/vest-multicam.jpg",
      title: "JPC 2.0 타입 전술 플레이트 캐리어",
      price: 185000,
      salesPrice: 220000,
      rating: 4,
    },
    {
      id: "product3",
      photo: "/images/products/tank-tiger.jpg",
      title: "1/35 독일군 타이거 I 후기형 프라모델",
      price: 38000,
      salesPrice: 45000,
      rating: 5,
    },
    {
      id: "product4",
      photo: "/images/products/scope-dot.jpg",
      title: "전술용 레드 도트사이트 (QD 마운트 포함)",
      price: 125000,
      salesPrice: 145000,
      rating: 4,
    },
  ]);

  // 2. 백엔드 API 연동을 위한 뼈대
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        // const res = await fetch('/api/admin/dashboard/best-sellers');
        // const data = await res.json();
        // setProducts(data);
      } catch (error) {
        console.error("Failed to fetch best sellers:", error);
      }
    };
    fetchBestSellers();
  }, []);

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        {products.map((item) => {
          return (
            <div
              key={item.id}
              className="lg:col-span-3 md:col-span-6 col-span-12"
            >
              {/* 기존 Product 컴포넌트의 Props 규격을 완벽히 준수합니다. */}
              <Product
                photo={item.photo}
                title={item.title}
                price={item.price}
                salesPrice={item.salesPrice}
                rating={item.rating}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default BestSeller;