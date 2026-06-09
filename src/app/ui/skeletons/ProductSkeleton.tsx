import React from 'react';

export default function ProductSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-8 animate-pulse font-sans bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-48 bg-neutral-200 rounded mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Images Skeleton */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
          <div className="w-full aspect-square bg-neutral-200 rounded-2xl" />
          <div className="flex gap-2.5">
            <div className="w-20 h-20 bg-neutral-200 rounded-lg" />
            <div className="w-20 h-20 bg-neutral-200 rounded-lg" />
            <div className="w-20 h-20 bg-neutral-200 rounded-lg" />
          </div>
        </div>

        {/* Right Side: Product Details Skeleton */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="h-8 w-3/4 bg-neutral-200 rounded" />
            <div className="h-4 w-1/3 bg-neutral-200 rounded mt-1" />
          </div>

          <div className="h-px bg-neutral-100 my-1" />

          {/* Pricing Info Skeleton */}
          <div className="flex items-baseline gap-4">
            <div className="h-10 w-32 bg-neutral-200 rounded" />
            <div className="h-6 w-24 bg-neutral-200 rounded" />
          </div>

          {/* Actions Skeleton */}
          <div className="flex items-center gap-4 mt-2">
            <div className="h-12 w-28 bg-neutral-200 rounded-xl" />
            <div className="h-12 w-full max-w-[200px] bg-neutral-200 rounded-xl" />
            <div className="h-12 w-12 bg-neutral-200 rounded-xl" />
          </div>

          <div className="h-px bg-neutral-100 my-1" />

          {/* Features Skeleton */}
          <div className="flex flex-col gap-3">
            <div className="h-4 w-full bg-neutral-200 rounded" />
            <div className="h-4 w-5/6 bg-neutral-200 rounded" />
            <div className="h-4 w-2/3 bg-neutral-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
