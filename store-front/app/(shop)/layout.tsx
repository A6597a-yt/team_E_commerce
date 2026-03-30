import { cookies } from 'next/headers';
import ShopLayoutClient from './ShopLayoutClient';

export default async function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    // 쿠키에 accessToken이 있으면 로그인된 것으로 간주
    const isLoggedIn = cookieStore.has('accessToken');

    return (
        <ShopLayoutClient isLoggedIn={isLoggedIn}>
            {children}
        </ShopLayoutClient>
    );
}