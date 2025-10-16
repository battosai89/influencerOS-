interface Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
  sources: Array<LayoutShiftAttribution>;
}

interface LayoutShiftAttribution {
  node?: Node;
  previousRect: DOMRectReadOnly;
  currentRect: DOMRectReadOnly;
}

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  mountTime: number;
  updateCount: number;
  lastUpdate: number;
  memoryUsage?: number;
}

interface PerformanceReport {
  timestamp: number;
  metrics: PerformanceMetrics[];
  pageLoadTime: number;
  coreWebVitals?: {
    fcp?: number; // First Contentful Paint
    lcp?: number; // Largest Contentful Paint
    fid?: number; // First Input Delay
    cls?: number; // Cumulative Layout Shift
  };
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private observers: PerformanceObserver[] = [];
  private reports: PerformanceReport[] = [];
  private maxReports = 50;

  constructor() {
    this.initializeCoreWebVitals();
    this.initializeMemoryMonitoring();
  }

  /**
   * Start monitoring a component's performance
   */
  startComponentMonitoring(componentName: string): () => void {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      if (!this.metrics.has(componentName)) {
        this.metrics.set(componentName, {
          componentName,
          renderTime,
          mountTime: endTime,
          updateCount: 0,
          lastUpdate: endTime,
        });
      } else {
        const existing = this.metrics.get(componentName)!;
        existing.renderTime = renderTime;
        existing.updateCount += 1;
        existing.lastUpdate = endTime;
      }
    };
  }

  /**
   * Record component mount time
   */
  recordMount(componentName: string, mountTime: number): void {
    const metrics = this.metrics.get(componentName);
    if (metrics) {
      metrics.mountTime = mountTime;
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Get metrics for a specific component
   */
  getComponentMetrics(componentName: string): PerformanceMetrics | undefined {
    return this.metrics.get(componentName);
  }

  /**
   * Generate performance report
   */
  generateReport(): PerformanceReport {
    const report: PerformanceReport = {
      timestamp: Date.now(),
      metrics: this.getMetrics(),
      pageLoadTime: performance.now(),
      coreWebVitals: this.getCoreWebVitals(),
    };

    this.reports.push(report);

    // Keep only recent reports
    if (this.reports.length > this.maxReports) {
      this.reports = this.reports.slice(-this.maxReports);
    }

    return report;
  }

  /**
   * Get recent performance reports
   */
  getReports(limit = 10): PerformanceReport[] {
    return this.reports.slice(-limit);
  }

  /**
   * Clear all metrics and reports
   */
  clear(): void {
    this.metrics.clear();
    this.reports = [];
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  private initializeCoreWebVitals(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    try {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            console.log('FCP:', entry.startTime);
          }
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(fcpObserver);

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as PerformanceEventTiming;
          console.log('FID:', fidEntry.processingStart - fidEntry.startTime);
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as LayoutShift).hadRecentInput) {
            clsValue += (entry as LayoutShift).value;
          }
        }
        console.log('CLS:', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);

    } catch (error) {
      console.warn('Failed to initialize Core Web Vitals monitoring:', error);
    }
  }

  private initializeMemoryMonitoring(): void {
    if (typeof window === 'undefined' || !('memory' in performance)) return;

    // Monitor memory usage periodically
    setInterval(() => {
      const memory = (performance as Performance).memory;
      if (memory) {
        // Update memory usage for all tracked components
        this.metrics.forEach(metrics => {
          metrics.memoryUsage = memory.usedJSHeapSize;
        });
      }
    }, 30000); // Check every 30 seconds
  }

  private getCoreWebVitals() {
    if (typeof window === 'undefined') return undefined;

    const paintEntries = performance.getEntriesByType('paint');

    return {
      fcp: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime,
      lcp: performance.getEntriesByType('largest-contentful-paint')[0]?.startTime,
      fid: (performance.getEntriesByType('first-input')[0] as PerformanceEventTiming)?.processingStart,
    };
  }
}

// Global performance monitor instance
const performanceMonitor = new PerformanceMonitor();

/**
 * Hook for monitoring component performance
 */
export const usePerformanceMonitor = (componentName: string) => {
  const endRenderRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Start monitoring when component mounts
    endRenderRef.current = performanceMonitor.startComponentMonitoring(componentName);

    return () => {
      // End monitoring when component unmounts
      if (endRenderRef.current) {
        endRenderRef.current();
      }
    };
  }, [componentName]);

  useEffect(() => {
    // Record mount time
    performanceMonitor.recordMount(componentName, performance.now());
  }, [componentName]);

  const getMetrics = useCallback(() => {
    return performanceMonitor.getComponentMetrics(componentName);
  }, [componentName]);

  const generateReport = useCallback(() => {
    return performanceMonitor.generateReport();
  }, []);

  return {
    getMetrics,
    generateReport,
  };
};

/**
 * Hook for measuring execution time of operations
 */
export const useExecutionTimer = () => {
  const [times, setTimes] = useState<Map<string, number>>(new Map());

  const startTimer = useCallback((operation: string): (() => void) => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      setTimes(prev => {
        const newTimes = new Map(prev);
        newTimes.set(operation, duration);
        return newTimes;
      });

      console.log(`${operation} took ${duration.toFixed(2)}ms`);
    };
  }, []);

  const getTime = useCallback((operation: string): number | undefined => {
    return times.get(operation);
  }, [times]);

  const getAllTimes = useCallback(() => {
    return Object.fromEntries(times);
  }, [times]);

  const clearTimes = useCallback(() => {
    setTimes(new Map());
  }, []);

  return {
    startTimer,
    getTime,
    getAllTimes,
    clearTimes,
  };
};

/**
 * Hook for monitoring resource loading performance
 */
export const useResourceMonitor = () => {
  const [resources, setResources] = useState<PerformanceResourceTiming[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceResourceTiming[];
      setResources(prev => [...prev, ...entries].slice(-100)); // Keep last 100 entries
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => observer.disconnect();
  }, []);

  const getSlowResources = useCallback((threshold = 1000) => {
    return resources.filter(resource => resource.duration > threshold);
  }, [resources]);

  const getResourcesByType = useCallback((type: string) => {
    return resources.filter(resource => resource.name.includes(type));
  }, [resources]);

  const getAverageLoadTime = useCallback(() => {
    if (resources.length === 0) return 0;
    return resources.reduce((sum, resource) => sum + resource.duration, 0) / resources.length;
  }, [resources]);

  return {
    resources,
    getSlowResources,
    getResourcesByType,
    getAverageLoadTime,
  };
};

/**
 * Hook for monitoring loading states with performance tracking
 */
export const useLoadingMonitor = () => {
  const [loadingStates, setLoadingStates] = useState<Map<string, { startTime: number; endTime?: number; duration?: number }>>(new Map());
  const [activeLoads, setActiveLoads] = useState<Set<string>>(new Set());

  const startLoading = useCallback((operation: string) => {
    const startTime = performance.now();

    setLoadingStates(prev => {
      const newStates = new Map(prev);
      newStates.set(operation, { startTime });
      return newStates;
    });

    setActiveLoads(prev => new Set(prev).add(operation));

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      setLoadingStates(prev => {
        const newStates = new Map(prev);
        const existing = newStates.get(operation);
        if (existing) {
          newStates.set(operation, { ...existing, endTime, duration });
        }
        return newStates;
      });

      setActiveLoads(prev => {
        const newSet = new Set(prev);
        newSet.delete(operation);
        return newSet;
      });

      console.log(`${operation} completed in ${duration.toFixed(2)}ms`);
    };
  }, []);

  const isLoading = useCallback((operation: string) => {
    return activeLoads.has(operation);
  }, [activeLoads]);

  const getLoadingState = useCallback((operation: string) => {
    return loadingStates.get(operation);
  }, [loadingStates]);

  const getSlowOperations = useCallback((threshold = 1000) => {
    return Array.from(loadingStates.entries())
       
      .filter(([_, state]) => state.duration && state.duration > threshold) // eslint-disable-line @typescript-eslint/no-unused-vars
      .map(([operation, state]) => ({ operation, duration: state.duration }));
  }, [loadingStates]);

  const getAverageLoadingTime = useCallback(() => {
    const completedOperations = Array.from(loadingStates.values())
      .filter(state => state.duration !== undefined);

    if (completedOperations.length === 0) return 0;

    return completedOperations.reduce((sum, state) => sum + (state.duration || 0), 0) / completedOperations.length;
  }, [loadingStates]);

  return {
    startLoading,
    isLoading,
    getLoadingState,
    getSlowOperations,
    getAverageLoadingTime,
    activeLoads: Array.from(activeLoads),
  };
};

/**
 * Hook for monitoring memory usage
 */
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState<{
    used: number;
    total: number;
    limit: number;
    usagePercentage: number;
  } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('memory' in performance)) return;

    const updateMemoryInfo = () => {
      const memory = (performance as Performance).memory;
      if (memory) {
        const used = memory.usedJSHeapSize;
        const total = memory.totalJSHeapSize;
        const limit = memory.jsHeapSizeLimit;
        const usagePercentage = (used / limit) * 100;

        setMemoryInfo({
          used,
          total,
          limit,
          usagePercentage,
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const formatBytes = useCallback((bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }, []);

  const getMemoryStatus = useCallback(() => {
    if (!memoryInfo) return 'unknown';

    if (memoryInfo.usagePercentage > 90) return 'critical';
    if (memoryInfo.usagePercentage > 70) return 'high';
    if (memoryInfo.usagePercentage > 50) return 'moderate';
    return 'low';
  }, [memoryInfo]);

  return {
    memoryInfo,
    formatBytes,
    getMemoryStatus,
  };
};

/**
 * Hook for monitoring page visibility and focus
 */
export const usePageMonitor = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFocused, setIsFocused] = useState(true);
  const [visibilityStartTime, setVisibilityStartTime] = useState<number>(Date.now());

  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      setIsVisible(visible);

      if (visible) {
        setVisibilityStartTime(Date.now());
      } else {
        const hiddenTime = Date.now() - visibilityStartTime;
        console.log(`Page was hidden for ${hiddenTime}ms`);
      }
    };

    const handleFocus = () => {
      setIsFocused(true);
      console.log('Page gained focus');
    };

    const handleBlur = () => {
      setIsFocused(false);
      console.log('Page lost focus');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [visibilityStartTime]);

  const getPageHiddenTime = useCallback(() => {
    if (isVisible) return 0;
    return Date.now() - visibilityStartTime;
  }, [isVisible, visibilityStartTime]);

  return {
    isVisible,
    isFocused,
    getPageHiddenTime,
  };
};

// Export the performance monitor instance for direct access
export { performanceMonitor };