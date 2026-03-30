"use client";

import React from "react";

export const Footer = () => {
    // 현재 연도를 자동으로 가져옵니다 (2026)
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-6 mt-auto">
            <p className="text-sm text-center text-slate-500 font-medium">
                © {currentYear} <span className="font-bold text-slate-700 dark:text-slate-300">장난감 쇼핑몰 관리 시스템</span>. All Rights Reserved.
            </p>
        </footer>
    );
};