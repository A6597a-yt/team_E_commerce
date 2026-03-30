import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import SidebarContent, { MenuItem, ChildItem } from './Sidebaritems' // 타입 import 추가
import SimpleBar from 'simplebar-react'
import { Icon } from '@iconify/react'
import {
  AMMenu,
  AMMenuItem,
  AMSidebar,
} from 'tailwind-sidebar' // 사용하지 않는 AMSubmenu, AMLogo 제거
import 'tailwind-sidebar/styles.css'

// 3뎁스 로직(AMSubmenu) 및 재귀 호출 제거, ChildItem 배열만 렌더링하도록 단순화
const renderSidebarItems = (
  items: ChildItem[],
  currentPath: string,
  onClose?: () => void
) => {
  return items.map((item) => {
    const isSelected = currentPath === item.url
    const IconComp = item.icon || null

    const iconElement = IconComp ? (
      <Icon icon={IconComp} height={21} width={21} />
    ) : (
      <Icon icon={'ri:checkbox-blank-circle-line'} height={9} width={9} />
    )

    const linkTarget = item.url?.startsWith('https') ? '_blank' : '_self'

    // 2뎁스 고정이므로 기존 isSubItem(true) 일 때의 스타일을 기본으로 적용
    const itemClassNames = `mt-0.5 text-slate-600 dark:text-slate-400 !hover:bg-transparent ${isSelected ? '!bg-transparent !text-primary font-semibold' : ''
      } !px-1.5`

    // 불필요한 이중 key 제거 (item.id 사용)
    return (
      <div onClick={onClose} key={item.id || item.name}>
        <AMMenuItem
          icon={iconElement}
          isSelected={isSelected}
          link={item.url || undefined}
          target={linkTarget}
          disabled={item.disabled}
          component={Link}
          className={itemClassNames}>
          <span className='truncate flex-1'>{item.name}</span>
        </AMMenuItem>
      </div>
    )
  })
}

const SidebarLayout = ({ onClose }: { onClose?: () => void }) => {
  const pathname = usePathname()
  const { theme } = useTheme()

  const sidebarMode = theme === 'light' || theme === 'dark' ? theme : undefined

  return (
    <AMSidebar
      collapsible='none'
      animation={true}
      showProfile={false}
      width={'270px'}
      showTrigger={false}
      mode={sidebarMode}
      className='fixed left-0 top-0 xl:top-[68px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 h-screen'>

      {/* 기존 로고 영역 유지 */}
      <div className='px-6 h-[68px] flex items-center xl:hidden border-b border-slate-100 dark:border-slate-800'>
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Image
            src='/admin/images/logos/logo-square.png'
            alt='Admin Logo'
            width={32}
            height={32}
            className='object-contain'
          />
          <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-white">
            ToyShop Admin
          </span>
        </Link>
      </div>

      {/* Sidebar Menu Scroll Area */}
      <SimpleBar className='h-[calc(100vh-68px)]'>
        <div className='px-4 py-6'>

          {/* 강제 배열 쪼개기 제거, SidebarContent의 2뎁스 구조 그대로 순회 */}
          {SidebarContent.map((section: MenuItem) => (
            <div key={section.heading || section.name}>
              {/* 1뎁스: 그룹 제목 */}
              {section.heading && (
                <div className='mb-1 mt-4 first:mt-0'>
                  <AMMenu
                    subHeading={section.heading}
                    ClassName='hide-menu leading-21 text-slate-500 font-bold uppercase text-xs tracking-wider'
                  />
                </div>
              )}

              {/* 2뎁스: 하위 메뉴 아이템 렌더링 */}
              {section.children && renderSidebarItems(section.children, pathname, onClose)}
            </div>
          ))}

          {/* 기존 시스템 상태 위젯 유지 */}
          <div className='mt-8 pt-6 border-t border-slate-100 dark:border-slate-800'>
            <div className='flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700'>

              <div className="flex items-center justify-between">
                <span className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>
                  System Status
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Icon icon="solar:server-minimalistic-line-duotone" className="text-emerald-500" width={20} />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  정상 작동 중
                </span>
              </div>

              <div className="text-[10px] text-slate-400">
                마지막 업데이트: 방금 전
              </div>
            </div>
          </div>

        </div>
      </SimpleBar>
    </AMSidebar>
  )
}

export default SidebarLayout