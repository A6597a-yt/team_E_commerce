"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import Image from "next/image";

const Topbar = () => {
  return (
    // 기존의 화려한 그라디언트 배경과 sticky 속성은 그대로 유지합니다.
    <div className="py-3 px-6 z-40 sticky top-0 bg-[linear-gradient(90deg,#0f0533_0%,#1b0a5c_100%)]">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">

        {/* 왼쪽 섹션: 로고 및 긴급 CS 현황 */}
        <div className="md:flex hidden items-center gap-5">
          <Link href="/admin/dashboard">
            <Image
              src="/admin/images/logos/logo-square.png" // 알려주신 로고 경로 적용
              alt="Admin Logo"
              width={35}
              height={35}
              className="object-contain"
            />
          </Link>

          {/* 수정 포인트: xl:flex를 lg:flex로 변경 (또는 md:flex) */}
          <div className="md:flex items-center gap-6 pl-5 border-l border-opacity-20 border-white hidden">
            <div className="flex items-center gap-2">
              <Icon
                icon="solar:danger-triangle-bold-duotone"
                width={20}
                className="text-[#FFD000FF]"
              />
              <h4 className="text-sm font-bold uppercase tracking-wider !text-[#FFD000FF]">
                Emergency CS
              </h4>
            </div>

            {/* 미답변 문의 바로가기 */}
            <Link
              href="/admin/cs/inquiries"
              className="flex items-center gap-2 text-white hover:text-[#5d87ff] transition-colors"
            >
              <Icon icon="solar:chat-line-linear" width={20} />
              <span className="text-sm font-normal">미답변 문의</span>
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">3</span>
            </Link>

            {/* 취소/환불 요청 바로가기 */}
            <Link
              href="/admin/cs/refunds"
              className="flex items-center gap-2 text-white hover:text-[#ff5d5d] transition-colors"
            >
              <Icon icon="solar:back-square-linear" width={20} />
              <span className="text-sm font-normal">취소/환불 대기</span>
              <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">5</span>
            </Link>
          </div>
        </div>

        {/* 오른쪽 섹션: 쇼핑몰 바로가기 버튼 */}
        <div className="flex items-center gap-4">
          <h4 className="hidden sm:block text-xs text-gray-400 uppercase font-medium">
            Admin Monitoring System
          </h4>

          <Link
            href="/"
            target="_blank"
            className="flex items-center px-4 py-2 rounded-lg gap-2 text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
          >
            <Icon icon="solar:shop-2-linear" width={18} />
            <span className="text-sm font-medium">쇼핑몰 상점 바로가기</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Topbar;