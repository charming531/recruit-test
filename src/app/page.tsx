import React from 'react';
import HiringInsights from '../components/HiringInsights';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Track your hiring metrics and insights</p>
        </div>
        <HiringInsights />
      </div>
    </main>
  );
} 