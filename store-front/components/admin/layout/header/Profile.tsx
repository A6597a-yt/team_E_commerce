'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import * as profileData from './Data'
import SimpleBar from 'simplebar-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation' // 3. useRouter 훅 추가
import { adminLogoutAction } from '@/features/admin/actions' // 1. 로그아웃 액션 추가
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

const Profile = () => {
  const router = useRouter();

  // 1. 로그아웃 핸들러: 쿠키 삭제 후 이동
  const handleLogout = async () => {
    if (window.confirm("정말 로그아웃 하시겠습니까?")) {
      await adminLogoutAction(); // 쿠키 삭제 수행
      router.push('/admin/login'); // 로그인 페이지로 이동
      router.refresh(); // 클라이언트 사이드 캐시 갱신
    }
  }

  return (
    <div className='relative group/menu ps-15 shrink-0'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <span className='hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary'>
            <Image
              src='/public/admin/images/profile/user-1.jpg'
              alt='logo'
              height={35}
              width={35}
              className='rounded-full'
            />
          </span>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align='end'
          className='w-screen sm:w-[200px] pb-4 pt-2 rounded-sm'>
          <SimpleBar>
            {/* 2. Data.ts의 profile 배열에 맞춰 데이터 매핑 */}
            {profileData.profile.map((item, index) => (
              <DropdownMenuItem key={index} asChild>
                <Link
                  href={item.href} // Data.ts 구조에 맞춰 url을 href로 변경
                  className='px-4 py-2 flex justify-between items-center group/link w-full hover:bg-lightprimary hover:text-primary'>
                  <div className='flex items-center gap-3 w-full'>
                    <Icon
                      icon={item.icon}
                      className='text-lg text-slateGray group-hover/link:text-primary'
                    />
                    <h5 className='mb-0 text-sm text-slateGray group-hover/link:text-primary'>
                      {item.title}
                    </h5>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </SimpleBar>

          <DropdownMenuSeparator className='my-2' />

          <div className='px-4'>
            {/* 1. 로그아웃 버튼: onClick 이벤트 연결 및 스타일 유지 */}
            <Button 
              variant='outline' 
              className='w-full rounded-md text-red-500 hover:text-red-600 hover:bg-red-50'
              onClick={handleLogout}
            >
              로그아웃
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default Profile