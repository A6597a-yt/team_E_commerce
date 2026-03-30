'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Icon } from '@iconify/react'
import Profile from './Profile'
import Link from 'next/link'
import Image from 'next/image' // Image 추가
import Notifications from './Notifications'
import SidebarLayout from '../sidebar/Sidebar'
// FullLogo import는 더 이상 사용하지 않으므로 제거해도 좋습니다.
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const Header = () => {
  const { theme, setTheme } = useTheme()
  const [isSticky, setIsSticky] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true)
      } else {
        setIsSticky(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const toggleMode = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <>
      <header
        className={`sticky top-0 z-[10] ${isSticky ? 'bg-background/95 backdrop-blur shadow-md' : 'bg-transparent'
          }`}>
        <nav className='py-4 sm:ps-6 max-w-full sm:pe-10 flex justify-between items-center px-6'>

          {/* 1. 모바일 영역 (왼쪽: 사이드바 토글 / 중앙: 우리 로고) */}
          <div className='flex items-center gap-4 xl:hidden'>
            <div
              onClick={() => setIsOpen(true)}
              className='p-2 hover:bg-lightprimary rounded-full cursor-pointer transition-colors'>
              <Icon icon='tabler:menu-2' height={20} width={20} />
            </div>

            <Link href="/admin/dashboard">
              <Image
                src='/admin/images/logos/logo-square.png'
                alt='Logo'
                height={32}
                width={32}
                className='object-contain'
              />
            </Link>
          </div>

          {/* 2. PC 영역 (왼쪽: 검색창) */}
          <div className='hidden xl:flex items-center gap-2'>
            <div className='relative'>
              <Icon
                icon='solar:magnifer-linear'
                width={18}
                height={18}
                className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'
              />
              <Input
                type='text'
                placeholder='상품명, 주문번호, 고객명 검색...'
                className='rounded-xl pl-10 w-72 focus:ring-1 focus:ring-primary border-slate-200'
              />
            </div>
          </div>

          {/* 3. 공통 우측 영역 (테마 토글, 알림, 프로필) */}
          <div className='flex items-center gap-2 md:gap-4'>

            {/* 다크/라이트 모드 토글 */}
            <div
              className='p-2 hover:bg-lightprimary rounded-full cursor-pointer transition-colors'
              onClick={toggleMode}>
              {theme === 'light' ? (
                <Icon icon='tabler:moon' width='20' />
              ) : (
                <Icon icon='solar:sun-bold-duotone' width='20' className='text-yellow-500' />
              )}
            </div>

            {/* 알림창 */}
            <Notifications />

            {/* 프로필 드롭다운 */}
            <Profile />
          </div>
        </nav>
      </header>

      {/* 모바일 사이드바 시트 */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side='left' className='w-64 p-0 border-none shadow-xl'>
          <VisuallyHidden>
            <SheetTitle>sidebar</SheetTitle>
          </VisuallyHidden>
          <SidebarLayout onClose={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  )
}

export default Header