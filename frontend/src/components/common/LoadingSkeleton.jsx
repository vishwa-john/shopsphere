import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse flex flex-col justify-between">
      <div>
        <div className="w-full h-52 bg-slate-200 rounded-xl mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
        <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 bg-slate-200 rounded w-16"></div>
          <div className="h-4 bg-slate-200 rounded w-10"></div>
        </div>
      </div>
      <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 space-y-4 animate-pulse">
      <div className="h-6 bg-slate-200 rounded w-1/4"></div>
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="h-12 bg-slate-100 rounded-lg w-full"></div>
      ))}
    </div>
  );
};
