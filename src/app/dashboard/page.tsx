"use client";

import { ErrorBoundary } from "react-error-boundary";
import EnhancedDashboard from "@/components/widgets/EnhancedDashboard";

export default function DashboardPage() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <EnhancedDashboard />
    </ErrorBoundary>
  );
}
