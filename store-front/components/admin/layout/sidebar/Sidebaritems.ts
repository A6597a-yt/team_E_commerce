import { uniqueId } from 'lodash'

export interface ChildItem {
  id?: number | string
  name?: string
  icon?: any
  children?: ChildItem[]
  item?: any
  url?: any
  color?: string
  disabled?: boolean
  subtitle?: string
  badge?: boolean
  badgeType?: string
  isPro?: boolean
}

export interface MenuItem {
  heading?: string
  name?: string
  icon?: any
  id?: number
  to?: string
  items?: MenuItem[]
  children?: ChildItem[]
  url?: any
  disabled?: boolean
  subtitle?: string
  badgeType?: string
  badge?: boolean
  isPro?: boolean
}

const SidebarContent: MenuItem[] = [
  {
    heading: "홈",
    children: [
      {
        name: "대시보드",
        icon: 'solar:widget-add-line-duotone',
        id: uniqueId(),
        url: "/admin/dashboard",
        isPro: false,
      },
    ],
  },
  {
    heading: '쇼핑몰 관리',
    children: [
      {
        name: "상품 관리",
        icon: 'solar:box-minimalistic-line-duotone',
        id: uniqueId(),
        url: "/admin/products",
        isPro: false,
      },
      {
        name: "상품 등록",
        icon: 'solar:add-circle-line-duotone',
        id: uniqueId(),
        url: "/admin/products/add",
        isPro: false,
      },
      {
        name: "카테고리 관리",
        icon: 'solar:list-check-minimalistic-line-duotone',
        id: uniqueId(),
        url: "/admin/categories",
        isPro: false,
      },
    ],
  },
  {
    heading: '주문/배송 관리',
    children: [
      {
        name: '주문 목록',
        id: uniqueId(),
        icon: 'solar:cart-3-line-duotone',
        url: '/admin/orders',
        isPro: false,
      },
      {
        name: '취소/반품 요청',
        id: uniqueId(),
        icon: 'solar:back-square-line-duotone',
        url: '/admin/orders/claims',
        isPro: false,
      },
      {
        name: '배송 관리',
        id: uniqueId(),
        icon: 'solar:delivery-line-duotone',
        url: '/admin/orders/shipping',
        isPro: false,
      },
    ],
  },
  {
    heading: '고객 및 CS',
    children: [
      {
        id: uniqueId(),
        name: '회원 목록',
        icon: 'solar:users-group-two-rounded-line-duotone',
        url: '/admin/users',
        isPro: false,
      },
      {
        id: uniqueId(),
        name: '고객 문의',
        icon: 'solar:chat-line-line-duotone',
        url: '/admin/cs',
        isPro: false,
      },
    ],
  },
  {
    heading: '시스템 설정',
    children: [
      {
        id: uniqueId(),
        name: '사이트 설정',
        icon: 'solar:settings-line-duotone',
        url: '/admin/settings/site',
        isPro: false,
      },
      {
        id: uniqueId(),
        name: '내 계정 관리',
        icon: 'solar:user-circle-line-duotone',
        url: '/admin/settings/account',
        isPro: false,
      },
    ],
  },
]

export default SidebarContent