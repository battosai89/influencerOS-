"use client";

import { ErrorBoundary } from "react-error-boundary";
import Academy from '@/views/Academy';

export default function AcademyPage() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <div className="space-y-6 animate-page-enter">
        <Academy />
      </div>
    </ErrorBoundary>
  );
}