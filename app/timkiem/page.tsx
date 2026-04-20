'use client';
import { useContext } from 'react';
import useSWR from 'swr';
import { Product } from '../types/product';

import { SearchContext } from '../component/searchContext';
import ProductCard from '../component/ProductCard';

export default function SearchPage() {
    const { keyword } = useContext(SearchContext); 
    console.log('Keyword in SearchPage:', keyword); // Debug log

    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    const { data, error } = useSWR('http://localhost:3000/products', fetcher, {
        refreshInterval: 6000,
    });

    if (error) return <div>Lỗi load dữ liệu.</div>;
    if (!data) return <div>Đang tải...</div>;

    const searchResult = data.filter((item: Product) =>
        item.name.toLowerCase().includes(keyword.toLowerCase()) //chuyển hết về chữ thường
    );
    console.log('Search results:', searchResult); // Debug log

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="font-bold text-xl">
                Kết quả tìm kiếm với từ khóa:  {keyword}
            </h1>
            <br />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {searchResult.map((product: Product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
}
