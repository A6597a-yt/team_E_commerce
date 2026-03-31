// /data/products.ts

export const categories = [
    { id: 'airsoft', name: '에어소프트건', icon: 'solar:target-bold-duotone', color: 'bg-orange-100 text-orange-600' },
    { id: 'gear', name: '장구류', icon: 'solar:backpack-bold-duotone', color: 'bg-blue-100 text-blue-600' },
    { id: 'model', name: '프라모델', icon: 'solar:box-bold-duotone', color: 'bg-emerald-100 text-emerald-600' },
    { id: 'parts', name: '부품/옵션', icon: 'solar:settings-bold-duotone', color: 'bg-slate-100 text-slate-600' },
];

export const products = [
    {
        id: 1,
        categoryId: 'airsoft', // 문자열 ID 적용
        name: 'VFC M4A1 RIS II GBB (Colt Licensed)',
        price: 685000,
        rating: 4.9,
        image: 'https://placehold.co/400x400/222/fff?text=VFC+M4A1',
        isNew: true
    },
    {
        id: 2,
        categoryId: 'gear',
        name: 'Crye Precision JPC 2.0 - Multicam',
        price: 420000,
        rating: 5.0,
        image: 'https://placehold.co/400x400/222/fff?text=JPC+2.0',
        isBest: true
    },
    {
        id: 3,
        categoryId: 'model',
        name: 'TIGER I Early Production (1/35 Scale)',
        price: 58000,
        rating: 4.8,
        image: 'https://placehold.co/400x400/222/fff?text=TIGER+I'
    },
    {
        id: 4,
        categoryId: 'airsoft',
        name: 'Glock 17 Gen5 GBB (Umarex)',
        price: 245000,
        rating: 4.7,
        image: 'https://placehold.co/400x400/222/fff?text=Glock+17'
    },
    // ... 추가 상품 데이터
];