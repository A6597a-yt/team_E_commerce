import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider"; // 💡 1. 테마 프로바이더 임포트

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TACTICAL SHOP - 프리미엄 에어소프트 기어", // 💡 2. 사이트 제목 수정
  description: "최고의 에어소프트건과 밀리터리 장비를 만나보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko" // 💡 3. 한국어 서비스이므로 ko로 변경
      suppressHydrationWarning // 💡 4. 테마 깜빡임 및 에러 방지 (필수)
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body className="min-h-full flex flex-col">
        {/* 💡 5. 테마 보호막 씌우기 (라이트 모드 기본 설정) */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}