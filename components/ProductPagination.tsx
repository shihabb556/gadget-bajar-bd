import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductPaginationProps {
    currentPage: number;
    totalPages: number;
    searchParams: any;
}

export default function ProductPagination({ currentPage, totalPages, searchParams }: ProductPaginationProps) {
    if (totalPages <= 1) return null;

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        return `/?${params.toString()}`;
    };

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Logic for displaying limited page numbers
    const getVisiblePages = () => {
        if (totalPages <= 7) return pages;
        if (currentPage <= 4) return [...pages.slice(0, 5), '...', totalPages];
        if (currentPage >= totalPages - 3) return [1, '...', ...pages.slice(totalPages - 5)];
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    };

    return (
        <div className="flex items-center justify-center gap-2 py-12">
            <Link
                href={currentPage > 1 ? createPageUrl(currentPage - 1) : '#'}
                className={`flex items-center justify-center h-10 w-10 rounded-xl border border-gray-100 bg-white transition-all shadow-sm ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:border-blue-200 hover:shadow-md'
                    }`}
            >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
            </Link>

            <div className="flex items-center gap-1.5">
                {getVisiblePages().map((page, index) => (
                    typeof page === 'number' ? (
                        <Link
                            key={index}
                            href={createPageUrl(page)}
                            className={`flex items-center justify-center h-10 w-10 text-xs font-black tracking-tighter rounded-xl transition-all ${currentPage === page
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                    : 'bg-white border border-gray-100 text-gray-500 hover:border-blue-200 hover:text-blue-600 shadow-sm'
                                }`}
                        >
                            {page}
                        </Link>
                    ) : (
                        <span key={index} className="px-2 text-gray-300 font-bold self-end pb-1.5 leading-none">...</span>
                    )
                ))}
            </div>

            <Link
                href={currentPage < totalPages ? createPageUrl(currentPage + 1) : '#'}
                className={`flex items-center justify-center h-10 w-10 rounded-xl border border-gray-100 bg-white transition-all shadow-sm ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:border-blue-200 hover:shadow-md'
                    }`}
            >
                <ChevronRight className="w-4 h-4 text-gray-600" />
            </Link>
        </div>
    );
}
