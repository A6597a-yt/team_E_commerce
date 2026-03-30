'use client'

import CardBox from '@/components/admin/shared/CardBox'
import Link from 'next/link'
import { JSX } from 'react'

// 1. 브레드크럼 아이템의 타입을 명확하게 정의합니다.
export interface BreadcrumbItem {
  title: string
  to: string
}

interface BreadCrumbType {
  subtitle?: string
  items?: BreadcrumbItem[]
  title: string
  children?: JSX.Element
}

const BreadcrumbComp = ({ items, title, children }: BreadCrumbType) => {
  return (
    <>
      <CardBox
        className={`mb-6 py-4 bg-lightsecondary dark:bg-darkinfo overflow-hidden rounded-md border-none !shadow-none dark:!shadow-none`}>
        {/* 기존의 grid 구조를 flex로 변경하여 장식 이미지 자리를 지우고 텍스트에 집중합니다. */}
        <div className='flex items-center justify-between'>
          <div>
            <h4 className='font-semibold text-xl text-customdark mb-3'>
              {title}
            </h4>
            <ol
              className='flex items-center whitespace-nowrap'
              aria-label='Breadcrumb'>

              {/* 2. 가짜 링크를 지우고 Next.js Link 컴포넌트 적용 및 한글화 */}
              <li className='flex items-center'>
                <Link
                  href='/admin/dashboard'
                  className='opacity-80 text-sm text-charcoal hover:text-primary transition-colors leading-none'>
                  홈
                </Link>
              </li>

              {/* 3. 전달받은 동적 items 배열을 순회하며 중간 경로 렌더링 */}
              {items && items.map((item, index) => (
                <li key={index} className='flex items-center'>
                  <div className='p-0.5 rounded-full bg-dark dark:bg-darklink mx-2.5 flex items-center'></div>
                  <Link
                    href={item.to}
                    className='opacity-80 text-sm text-charcoal hover:text-primary transition-colors leading-none'>
                    {item.title}
                  </Link>
                </li>
              ))}

              {/* 현재 페이지 제목 렌더링 */}
              <li>
                <div className='p-0.5 rounded-full bg-dark dark:bg-darklink mx-2.5 flex items-center'></div>
              </li>
              <li
                className='flex items-center text-sm text-charcoal font-semibold leading-none'
                aria-current='page'>
                {title}
              </li>
            </ol>
          </div>

          {/* 우측 공간: 버튼 등 추가 컴포넌트(children)를 넣을 수 있도록 보존 */}
          {children && <div>{children}</div>}
        </div>
      </CardBox>
    </>
  )
}

export default BreadcrumbComp