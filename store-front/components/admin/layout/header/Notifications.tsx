'use client'

import { Icon } from '@iconify/react'
import Link from 'next/link'
import * as MessagesData from './Data'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

const Notifications = () => {
  return (
    <div className='relative group/menu px-15'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='relative'>
            <span className='relative after:absolute after:w-10 after:h-10 after:rounded-full hover:text-primary after:-top-1/2 hover:after:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:after:bg-lightprimary group-hover/menu:text-primary'>
              {/* 종소리 아이콘 스타일 유지 */}
              <Icon icon='tabler:bell-ringing' height={20} />
            </span>
            {/* 알림 뱃지 (점) */}
            <span className='rounded-full absolute -end-[2px] -top-[2px] text-[10px] h-2 w-2 bg-red-500 flex justify-center items-center shadow-sm'></span>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align='end'
          className='w-[320px] py-4 rounded-md shadow-lg border-none'>
          {/* Header */}
          <div className='flex items-center px-6 justify-between mb-2'>
            <h3 className='text-base font-bold text-slate-800'>새로운 알림</h3>
            <span className='text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold'>
              {MessagesData.Notifications.length}건
            </span>
          </div>

          {/* Scrollable content */}
          <SimpleBar className='max-h-80'>
            {MessagesData.Notifications.map((item, index) => (
              <DropdownMenuItem key={index} asChild>
                <Link
                  href='#'
                  className='px-6 py-3 flex items-start gap-4 group/link w-full hover:bg-slate-50 transition-colors'>

                  {/* 1. 아이콘 영역: bgcolor와 color를 동적으로 적용 */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex justify-center items-center ${item.bgcolor}`}>
                    <item.icon size={20} className={item.color} />
                  </div>

                  {/* 2. 텍스트 영역 */}
                  <div className='flex-grow overflow-hidden'>
                    <div className='flex justify-between items-center mb-1'>
                      <h5 className='text-sm font-semibold text-slate-700 group-hover/link:text-primary truncate'>
                        {item.title}
                      </h5>
                      {/* 3. 시간 정보 */}
                      <span className='text-[10px] text-slate-400 whitespace-nowrap ml-2'>
                        {item.time}
                      </span>
                    </div>
                    <span className='text-xs block truncate text-slate-500 line-clamp-1'>
                      {item.subtitle}
                    </span>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </SimpleBar>

          {/* Footer (선택 사항) */}
          <div className='px-6 pt-3 mt-2 border-t border-slate-100'>
            <Link href="/admin/notifications" className='text-xs text-center block text-primary font-medium hover:underline'>
              모든 알림 보기
            </Link>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default Notifications