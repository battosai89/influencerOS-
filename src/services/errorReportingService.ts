export interface ErrorContext {
  component?: string;
  action?: string;
  page?: string;
  userId?: string;
  formField?: string;
  metadata?: Record<string, unknown>;
  additionalData?: Record<string, unknown>;
}

export interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  context?: ErrorContext;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  userAgent?: string;
  url?: string;
}

class ErrorReportingService {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private errorQueue: ErrorReport[] = [];
  private errorReports: ErrorReport[] = [];
  private flushInterval?: NodeJS.Timeout;

  constructor() {
    if (typeof window !== 'undefined') {
      this.startPeriodicFlush();
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  reportError(error: Error, context?: ErrorContext, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'): string {
    const errorReport: ErrorReport = {
      id: this.generateId(),
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date(),
      severity,
      resolved: false,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    this.errorReports.push(errorReport);

    if (this.isDevelopment) {
      console.error('Error reported:', errorReport);
    } else {
      this.addToQueue(errorReport);
    }

    return errorReport.id;
  }

  reportHandledError(message: string, context?: ErrorContext, severity: 'low' | 'medium' | 'high' | 'critical' = 'low'): string {
    const errorReport: ErrorReport = {
      id: this.generateId(),
      message,
      context,
      timestamp: new Date(),
      severity,
      resolved: false,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    this.errorReports.push(errorReport);

    if (this.isDevelopment) {
      console.warn('Handled error reported:', errorReport);
    } else {
      this.addToQueue(errorReport);
    }

    return errorReport.id;
  }

  private addToQueue(report: ErrorReport): void {
    this.errorQueue.push(report);

    // Flush if queue gets too large
    if (this.errorQueue.length >= 10) {
      this.flush();
    }
  }

  private startPeriodicFlush(): void {
    // Flush every 30 seconds
    this.flushInterval = setInterval(() => {
      if (this.errorQueue.length > 0) {
        this.flush();
      }
    }, 30000);
  }

  private async flush(): Promise<void> {
    if (this.errorQueue.length === 0) return;

    const reports = [...this.errorQueue];
    this.errorQueue = [];

    try {
      // Send to your error reporting service (e.g., Sentry, LogRocket, etc.)
      // For now, we'll just log to console in production
      if (!this.isDevelopment) {
        console.group('📊 Error Reports Batch');
        reports.forEach((report, index) => {
          console.log(`Report ${index + 1}:`, report);
        });
        console.groupEnd();

        // Here you would typically send to your error reporting service:
        // await fetch('/api/errors', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ errors: reports }),
        // });
      }
    } catch (error) {
      // If flush fails, add reports back to queue
      this.errorQueue.unshift(...reports);
      console.error('Failed to flush error reports:', error);
    }
  }

  getErrors(filters?: { severity?: 'low' | 'medium' | 'high' | 'critical'; resolved?: boolean; component?: string }): ErrorReport[] {
    return this.errorReports.filter(report => {
      if (filters?.severity && report.severity !== filters.severity) return false;
      if (filters?.resolved !== undefined && report.resolved !== filters.resolved) return false;
      if (filters?.component && report.context?.component !== filters.component) return false;
      return true;
    });
  }

  resolveError(errorId: string): boolean {
    const report = this.errorReports.find(r => r.id === errorId);
    if (report) {
      report.resolved = true;
      return true;
    }
    return false;
  }

  getErrorStats(): { total: number; bySeverity: Record<string, number>; unresolved: number } {
    const total = this.errorReports.length;
    const bySeverity: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 };
    const unresolved = this.errorReports.filter(r => !r.resolved).length;

    this.errorReports.forEach(report => {
      bySeverity[report.severity]++;
    });

    return { total, bySeverity, unresolved };
  }

  // Cleanup method for when the service is no longer needed
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    if (this.errorQueue.length > 0) {
      this.flush();
    }
  }
}

export const errorReportingService = new ErrorReportingService();