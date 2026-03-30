import {
  IconUserCircle,
  IconSettings,
  IconBox,
  IconCashBanknote,
  IconAlertCircle
} from '@tabler/icons-react';

// 👤 프로필 데이터 타입 정의
interface ProfileType {
  title: string;
  subtitle: string;
  href: string; // url에서 href로 변경
  icon: string;
}

// 🔔 알림 데이터 타입 정의
interface NotificationType {
  id: number;
  icon: any;
  bgcolor: string;
  color: string;
  title: string;
  subtitle: string;
  time: string;
}

// 1. 프로필 드롭다운 데이터 (Profile.tsx와 변수명 동기화)
const profile: ProfileType[] = [
  {
    title: "내 프로필",
    subtitle: "관리자 정보 수정",
    icon: "tabler:user-circle",
    href: "/admin/profile",
  },
  {
    title: "계정 설정",
    subtitle: "보안 및 비밀번호 변경",
    icon: "tabler:settings",
    href: "/admin/settings",
  },
];

// 2. 알림창 데이터 (장난감 쇼핑몰 도메인 맞춤화 및 구조 확장)
const Notifications: NotificationType[] = [
  {
    id: 1,
    icon: IconBox,
    bgcolor: "bg-blue-100",
    color: "text-blue-600",
    title: "신규 주문 접수",
    subtitle: "레고 시티 경찰서 외 2건",
    time: "방금 전",
  },
  {
    id: 2,
    icon: IconCashBanknote,
    bgcolor: "bg-red-100",
    color: "text-red-600",
    title: "취소/환불 요청",
    subtitle: "[파손] 캐치티니핑 피규어",
    time: "15분 전",
  },
  {
    id: 3,
    icon: IconAlertCircle,
    bgcolor: "bg-orange-100",
    color: "text-orange-600",
    title: "재고 부족 알림",
    subtitle: "너프건 엘리트 (3개 남음)",
    time: "1시간 전",
  },
];

export {
  Notifications,
  profile, // profileDD 대신 profile로 내보내기
};