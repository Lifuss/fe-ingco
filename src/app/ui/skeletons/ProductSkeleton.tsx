import React from 'react';

export default function ProductSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1440px] animate-pulse rounded-2xl border border-gray-100 bg-white p-5 px-4 py-8 font-sans shadow-sm">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6 h-4 w-48 rounded bg-neutral-200" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Side: Images Skeleton */}
        <div className="col-span-12 flex flex-col gap-4 lg:col-span-6">
          <div className="aspect-square w-full rounded-2xl bg-neutral-200" />
          <div className="flex gap-2.5">
            <div className="h-20 w-20 rounded-lg bg-neutral-200" />
            <div className="h-20 w-20 rounded-lg bg-neutral-200" />
            <div className="h-20 w-20 rounded-lg bg-neutral-200" />
          </div>
        </div>

        {/* Right Side: Product Details Skeleton */}
        <div className="col-span-12 flex flex-col gap-6 lg:col-span-6">
          <div className="flex flex-col gap-2">
            <div className="h-8 w-3/4 rounded bg-neutral-200" />
            <div className="mt-1 h-4 w-1/3 rounded bg-neutral-200" />
          </div>

          <div className="my-1 h-px bg-neutral-100" />

          {/* Pricing Info Skeleton */}
          <div className="flex items-baseline gap-4">
            <div className="h-10 w-32 rounded bg-neutral-200" />
            <div className="h-6 w-24 rounded bg-neutral-200" />
          </div>

          {/* Actions Skeleton */}
          <div className="mt-2 flex items-center gap-4">
            <div className="h-12 w-28 rounded-xl bg-neutral-200" />
            <div className="h-12 w-full max-w-[200px] rounded-xl bg-neutral-200" />
            <div className="h-12 w-12 rounded-xl bg-neutral-200" />
          </div>

          <div className="my-1 h-px bg-neutral-100" />

          {/* Features Skeleton */}
          <div className="flex flex-col gap-3">
            <div className="h-4 w-full rounded bg-neutral-200" />
            <div className="h-4 w-5/6 rounded bg-neutral-200" />
            <div className="h-4 w-2/3 rounded bg-neutral-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
