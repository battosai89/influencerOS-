"use client";

import { useCallback } from 'react';
import { errorReportingService, ErrorContext } from '@/services/errorReportingService';
import { useErrorContext } from '@/contexts/ErrorContext';

/**
 * Hook for error reporting functionality
 */
export const useErrorReporting = () => {
  const errorContext = useErrorContext();

  const reportError = useCallback((
    error: Error,
    context: ErrorContext & { endpoint?: string } = {},
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): string => {
    // Merge with global error context if available
    const enrichedContext = errorContext ? { ...errorContext, ...context } : context;

    return errorReportingService.reportError(error, enrichedContext, severity);
  }, [errorContext]);

  const reportHandledError = useCallback((
    message: string,
    context: ErrorContext & { endpoint?: string } = {},
    severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
  ): string => {
    // Merge with global error context if available
    const enrichedContext = errorContext ? { ...errorContext, ...context } : context;

    return errorReportingService.reportHandledError(message, enrichedContext, severity);
  }, [errorContext]);

  const getErrors = useCallback((filters?: Parameters<typeof errorReportingService.getErrors>[0]) => {
    return errorReportingService.getErrors(filters);
  }, []);

  const resolveError = useCallback((errorId: string): boolean => {
    return errorReportingService.resolveError(errorId);
  }, []);

  const getErrorStats = useCallback(() => {
    return errorReportingService.getErrorStats();
  }, []);

  return {
    reportError,
    reportHandledError,
    getErrors,
    resolveError,
    getErrorStats,
  };
};

/**
 * Hook for handling errors with automatic context
 */
export const useErrorHandler = () => {
  const { reportError } = useErrorReporting();

  const handleError = useCallback((
    error: Error | string,
    context: ErrorContext & { endpoint?: string } = {},
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): string => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;

    return reportError(errorObj, {
      action: 'error_handler',
      ...context,
    }, severity);
  }, [reportError]);

  const handleAsyncError = useCallback(async (
    asyncFn: () => Promise<void>,
    context: ErrorContext & { endpoint?: string } = {},
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): Promise<boolean> => {
    try {
      await asyncFn();
      return true;
    } catch (error) {
      handleError(error instanceof Error ? error : new Error(String(error)), {
        action: 'async_operation',
        ...context,
      }, severity);
      return false;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
  };
};

/**
 * Hook for component-level error handling
 */
export const useComponentErrorHandler = (componentName: string) => {
  const { reportError } = useErrorReporting();

  const handleComponentError = useCallback((
    error: Error,
    context: ErrorContext & { endpoint?: string } = {},
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): string => {
    return reportError(error, {
      component: componentName,
      ...context,
    }, severity);
  }, [reportError, componentName]);

  const withErrorHandler = useCallback(<T extends (...args: never[]) => unknown>(
    fn: T,
    context: ErrorContext & { endpoint?: string } = {}
  ): T => {
    return ((...args: Parameters<T>) => {
      try {
        return fn(...args);
      } catch (error) {
        handleComponentError(error as Error, {
          action: 'component_method',
          ...context,
        });
        throw error; // Re-throw to maintain normal error flow
      }
    }) as T;
  }, [handleComponentError]);

  return {
    handleComponentError,
    withErrorHandler,
  };
};

/**
 * Hook for form error handling
 */
export const useFormErrorHandler = (formName: string) => {
  const { reportHandledError } = useErrorReporting();

  const handleFormError = useCallback((
    message: string,
    field?: string,
    context: ErrorContext & { endpoint?: string } = {}
  ): string => {
    return reportHandledError(`Form Error in ${formName}${field ? ` - ${field}` : ''}: ${message}`, {
      component: formName,
      action: 'form_validation',
      formField: field,
      ...context,
    }, 'low');
  }, [reportHandledError, formName]);

  const handleSubmitError = useCallback((
    error: Error,
    context: ErrorContext & { endpoint?: string } = {}
  ): string => {
    return reportHandledError(`Form submission failed: ${error.message}`, {
      component: formName,
      action: 'form_submit',
      ...context,
    }, 'medium');
  }, [reportHandledError, formName]);

  return {
    handleFormError,
    handleSubmitError,
  };
};

/**
 * Hook for API/network error handling
 */
export const useNetworkErrorHandler = () => {
  const { reportError } = useErrorReporting();

  const handleNetworkError = useCallback((
    error: Error,
    endpoint?: string,
    context: ErrorContext & { endpoint?: string } = {}
  ): string => {
    return reportError(error, {
      action: 'network_request',
      endpoint,
      ...context,
    }, 'high');
  }, [reportError]);

  const handleFetchError = useCallback(async (
    fetchPromise: Promise<Response>,
    endpoint?: string,
    context: ErrorContext = {}
  ): Promise<{ success: true; data: unknown } | { success: false; error: string }> => {
    try {
      const response = await fetchPromise;

      if (!response.ok) {
        const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        handleNetworkError(new Error(errorMessage), endpoint, context);
        return { success: false, error: errorMessage };
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        handleNetworkError(new Error(`Invalid JSON response: ${parseError}`), endpoint, context);
        return { success: false, error: 'Invalid JSON response' };
      }

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network request failed';
      handleNetworkError(new Error(errorMessage), endpoint, context);
      return { success: false, error: errorMessage };
    }
  }, [handleNetworkError]);

  return {
    handleNetworkError,
    handleFetchError,
  };
};