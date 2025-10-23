"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Plus, Layout, XCircle, ChevronLeft, ChevronRight, X, Layers, PlusSquare, LayoutGrid, Move } from 'lucide-react';
import useStore from '@/hooks/useStore';
import { WIDGET_REGISTRY } from './WidgetRegistry';
import WidgetWrapper from './WidgetWrapper';
import Modal from '@/components/Modal';
import SkeletonLoader from '@/components/SkeletonLoader';
import { DashboardTemplate, DashboardLayoutItem } from '@/types';

// --- ADD WIDGET MODAL ---

const AddWidgetModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { activeDashboardTabId, dashboardTabs, addWidgetToLayout } = useStore();
  const activeTab = dashboardTabs.find(t => t.id === activeDashboardTabId);
  const dashboardLayout = activeTab ? activeTab.layout : [];

  const categoryOrder = [
    'Analytics & Info',
    'Essential Metrics',
    'Financial & Revenue',
    'Creator & Relationship',
    'Campaign Intelligence',
    'Intelligent Insights',
    'Utility',
  ];

  const groupedWidgets = useMemo(() => {
    const groups: { [category: string]: (typeof WIDGET_REGISTRY[string] & { key: string })[] } = {};
    for (const [key, widget] of Object.entries(WIDGET_REGISTRY)) {
      const category = widget.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push({ key, ...widget });
    }
    return groups;
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Widget to Dashboard" maxWidth="4xl">
      <div className="space-y-10 max-h-[70vh] overflow-y-auto pr-4">
        {categoryOrder.map(category => {
          const widgets = groupedWidgets[category];
          if (!widgets) return null;
          return (
            <div key={category}>
              <h3 className="text-xl font-bold text-brand-text-primary mb-4 pb-2 border-b border-brand-border">{category}</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {widgets.map(widget => {
                  const { key, ...widgetConfig } = widget;
                  const isAdded = dashboardLayout.some(item => item.id === key);
                  return (
                    <div key={key} className="bg-brand-bg p-5 rounded-lg flex flex-col gap-5 border border-brand-border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-brand-text-primary">{widgetConfig.title}</h3>
                          <p className="text-sm text-brand-text-secondary mt-1">{widgetConfig.description}</p>
                        </div>
                        <button
                          onClick={() => {
                            addWidgetToLayout(key, widgetConfig);
                            onClose();
                          }}
                          disabled={isAdded}
                          className="bg-brand-primary text-white font-semibold py-1.5 px-4 rounded-lg hover:bg-brand-accent disabled:bg-brand-secondary disabled:cursor-not-allowed whitespace-nowrap ml-4"
                        >
                          {isAdded ? 'Added' : 'Add'}
                        </button>
                      </div>
                      <div className="futuristic-border bg-brand-surface rounded-xl p-4 min-h-[240px] pointer-events-none flex flex-col overflow-hidden">
                        <widgetConfig.component />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

// --- TEMPLATE LIBRARY MODAL ---

const TemplateLibraryModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { dashboardTemplates, applyTemplate, addDashboardTab, dashboardTabs, activeDashboardTabId } = useStore();

  const handleApplyClick = (template: DashboardTemplate, mode: 'new-tab' | 'current-tab') => {
    applyTemplate(template.id, mode);
    onClose();
  };

  const templateCategories = {
    'Getting Started': dashboardTemplates.filter(t => ['blank-dashboard', 'new-agency-starter'].includes(t.id)),
    'Agency Type': dashboardTemplates.filter(t => ['creator-focused-agency', 'brand-focused-agency', 'performance-driven-agency'].includes(t.id)),
    'Business Stage': dashboardTemplates.filter(t => ['multi-client-dashboard', 'growth-stage-agency', 'enterprise-agency'].includes(t.id)),
    'Specialized': dashboardTemplates.filter(t => ['financial-focused-dashboard', 'ai-powered-executive'].includes(t.id))
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dashboard Template Library" maxWidth="4xl">
      <div className="space-y-10 max-h-[80vh] overflow-y-auto pr-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-text-primary mb-2">Choose Your Perfect Dashboard</h2>
          <p className="text-brand-text-secondary">Get started quickly with professionally designed templates tailored to your agency&apos;s needs and growth stage.</p>
        </div>

        {Object.entries(templateCategories).map(([category, templates]) => (
          <div key={category}>
            <h3 className="text-xl font-bold text-brand-text-primary mb-4 pb-2 border-b border-brand-border">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(template => {
                const activeTab = dashboardTabs.find(t => t.id === activeDashboardTabId);
                const isCurrentTabEmpty = activeTab?.layout.length === 0;

                return (
                  <div key={template.id} className="futuristic-border bg-brand-surface rounded-xl p-5 flex flex-col group hover:shadow-glow-lg transition-all duration-300">
                    <div className="text-center mb-4">
                      <div className="mx-auto mb-3 w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center">
                        {template.icon}
                      </div>
                      <h3 className="font-bold text-lg text-brand-text-primary">{template.name}</h3>
                      <p className="text-sm text-brand-text-secondary mt-1">{template.description}</p>
                    </div>

                    {/* Template Preview */}
                    <div className="w-full h-32 bg-brand-bg rounded-lg p-2 border border-brand-border/50 mb-4">
                      <div className="grid grid-cols-12 grid-rows-4 gap-1 h-full">
                        {template.layout.slice(0, 8).map(item => (
                          <div key={item.id} className="bg-brand-primary/20 rounded-sm" style={{
                            gridColumn: `${item.x + 1} / span ${item.w}`,
                            gridRow: `${item.y + 1} / span ${item.h}`,
                          }}></div>
                        ))}
                        {template.layout.length > 8 && (
                          <div className="col-span-12 text-center text-xs text-brand-text-secondary py-1">
                            +{template.layout.length - 8} more widgets
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Widget Count Badge */}
                    <div className="flex items-center justify-center gap-1 mb-4">
                      <div className="w-2 h-2 bg-brand-insight rounded-full"></div>
                      <span className="text-xs text-brand-text-secondary">
                        {template.layout.length} widget{template.layout.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-stretch gap-3 mt-auto">
                      <button
                        onClick={() => handleApplyClick(template, 'current-tab')}
                        title={template.id === 'blank-dashboard' ? "Clear all widgets from the current dashboard" : "Add this template's widgets to your current dashboard"}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-surface border border-brand-border text-brand-text-primary font-semibold py-2.5 px-3 rounded-lg hover:bg-brand-border transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={template.id === 'blank-dashboard' && isCurrentTabEmpty}
                      >
                        <Layers className="w-4 h-4" />
                        {template.id === 'blank-dashboard' ? 'Clear Current' : 'Add to Current'}
                      </button>
                      <button
                        onClick={() => handleApplyClick(template, 'new-tab')}
                        title="Create a new dashboard tab using this template"
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold py-2.5 px-3 rounded-lg hover:bg-brand-accent transition-colors text-sm"
                      >
                        <PlusSquare className="w-4 h-4" />
                        New Tab
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

// --- DASHBOARD TABS COMPONENT ---

const DashboardTabs: React.FC<{ onRemoveTab: (tabId: string) => void }> = ({ onRemoveTab }) => {
  const { dashboardTabs, activeDashboardTabId, setActiveDashboardTab, addDashboardTab, renameDashboardTab } = useStore();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; tabId: string } | null>(null);
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [creatingTab, setCreatingTab] = useState(false);
  const [newTabName, setNewTabName] = useState('');
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [showScroll, setShowScroll] = useState({ left: false, right: false });

  const handleContextMenu = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, tabId });
  };

  const handleRename = () => {
    if (contextMenu) {
      setEditingTabId(contextMenu.tabId);
      setContextMenu(null);
    }
  };

  const handleTabNameChange = (e: React.KeyboardEvent<HTMLInputElement>, tabId: string) => {
    if (e.key === 'Enter') {
      renameDashboardTab(tabId, (e.target as HTMLInputElement).value);
      setEditingTabId(null);
    } else if (e.key === 'Escape') {
      setEditingTabId(null);
    }
  };

  const handleCreateTab = () => {
    if (newTabName.trim()) {
      addDashboardTab(newTabName.trim());
      setNewTabName('');
      setCreatingTab(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const checkScroll = useCallback(() => {
    const el = tabsContainerRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      setShowScroll({
        left: hasOverflow && el.scrollLeft > 5,
        right: hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 5,
      });
    }
  }, []);

  useEffect(() => {
    checkScroll();
    const el = tabsContainerRef.current;
    el?.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      el?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [dashboardTabs, checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    const el = tabsContainerRef.current;
    if (el) {
      el.scrollBy({ left: direction === 'left' ? -250 : 250, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative mb-8">
      {/* Tab Management Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-brand-text-primary">Dashboard Tabs</h2>
          <p className="text-sm text-brand-text-secondary">Organize your widgets into focused dashboards</p>
        </div>
        <div className="flex items-center gap-4">
          {creatingTab ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTabName}
                onChange={(e) => setNewTabName(e.target.value)}
                placeholder="Tab name..."
                className="bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateTab();
                  if (e.key === 'Escape') setCreatingTab(false);
                }}
                autoFocus
              />
              <button
                onClick={handleCreateTab}
                className="px-3 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-colors text-sm"
              >
                Create
              </button>
              <button
                onClick={() => setCreatingTab(false)}
                className="p-2 text-brand-text-secondary hover:text-brand-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCreatingTab(true)}
              className="inline-flex items-center gap-2 bg-brand-primary/20 text-brand-primary font-semibold py-2 px-4 rounded-lg hover:bg-brand-primary/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Tab
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="relative">
        <div className="relative overflow-hidden">
          <div
            ref={tabsContainerRef}
            className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-2 px-12"
          >
            {dashboardTabs.map(tab => (
              <div key={tab.id} onContextMenu={(e) => handleContextMenu(e, tab.id)} className="relative group">
                {editingTabId === tab.id ? (
                  <input
                    type="text"
                    defaultValue={tab.name}
                    onKeyDown={(e) => handleTabNameChange(e, tab.id)}
                    onBlur={() => setEditingTabId(null)}
                    autoFocus
                    className="bg-brand-bg border border-brand-primary rounded-lg px-3 py-1.5 text-sm font-semibold text-brand-text-primary focus:outline-none w-32"
                  />
                ) : (
                  <button
                    onClick={() => setActiveDashboardTab(tab.id)}
                    className={`relative px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-all duration-200 ${
                      activeDashboardTabId === tab.id
                        ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
                        : 'bg-brand-surface text-brand-text-secondary hover:bg-brand-border hover:scale-105'
                    }`}
                  >
                    {tab.name}
                    {activeDashboardTabId === tab.id && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-brand-accent rounded-full"></div>
                    )}
                  </button>
                )}
                {dashboardTabs.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemoveTab(tab.id); }}
                    className="absolute -top-1 -right-1 p-0.5 rounded-full bg-brand-bg text-brand-text-secondary opacity-0 group-hover:opacity-100 hover:bg-brand-border hover:text-red-400 transition-all duration-200 hover:scale-110"
                    aria-label={`Delete ${tab.name} dashboard`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Scroll Controls */}
          <div className={`absolute left-0 top-0 bottom-0 flex items-center transition-all duration-300 ${showScroll.left ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-brand-bg to-transparent pointer-events-none"></div>
            <button onClick={() => scroll('left')} className="relative z-10 p-2 bg-brand-surface rounded-full hover:bg-brand-border shadow-md hover:shadow-glow-sm transition-all duration-200">
              <ChevronLeft className="w-5 h-5"/>
            </button>
          </div>

          <div className={`absolute right-0 top-0 bottom-0 flex items-center transition-all duration-300 ${showScroll.right ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-brand-bg to-transparent pointer-events-none"></div>
            <button onClick={() => scroll('right')} className="relative z-10 p-2 bg-brand-surface rounded-full hover:bg-brand-border shadow-md hover:shadow-glow-sm transition-all duration-200">
              <ChevronRight className="w-5 h-5"/>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Statistics */}
      <div className="flex items-center justify-between text-sm text-brand-text-secondary mt-2">
        <span>{dashboardTabs.length} dashboard{dashboardTabs.length !== 1 ? 's' : ''}</span>
        <span>Active: {dashboardTabs.find(t => t.id === activeDashboardTabId)?.name}</span>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div style={{ top: contextMenu.y, left: contextMenu.x }} className="fixed z-50 bg-brand-surface futuristic-border rounded-lg shadow-lg py-2 w-40">
          <button onClick={handleRename} className="w-full text-left px-4 py-2 text-sm hover:bg-brand-border transition-colors">
            Rename Tab
          </button>
          {dashboardTabs.length > 1 && (
            <button
              onClick={() => { onRemoveTab(contextMenu.tabId); setContextMenu(null); }}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-brand-border transition-colors"
            >
              Delete Tab
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// --- MAIN ENHANCED DASHBOARD COMPONENT ---

const EnhancedDashboard: React.FC = () => {
  const {
    dashboardTabs,
    activeDashboardTabId,
    setActiveDashboardTab,
    removeWidgetFromLayout,
    removeDashboardTab,
    addDashboardTab
  } = useStore();

  // Diagnostic logging for widget availability
  React.useEffect(() => {
    const availableWidgets = Object.keys(WIDGET_REGISTRY);
    console.log('🚀 EnhancedDashboard loaded - Available widgets:', availableWidgets.length, availableWidgets);

    const activeTab = dashboardTabs.find(t => t.id === activeDashboardTabId);
    if (activeTab) {
      const validWidgets = activeTab.layout.filter(item => availableWidgets.includes(item.widgetId));
      const invalidWidgets = activeTab.layout.filter(item => !availableWidgets.includes(item.widgetId));

      if (invalidWidgets.length > 0) {
        console.warn('⚠️ Dashboard has widgets that are not registered:', invalidWidgets.map(w => w.widgetId));
      }

      console.log(`📈 Active tab "${activeTab.name}" has ${validWidgets.length} valid widgets out of ${activeTab.layout.length} total`);
    }
  }, [dashboardTabs, activeDashboardTabId]);

  const [isLoading, setIsLoading] = useState(true);
  const [isAddWidgetModalOpen, setAddWidgetModalOpen] = useState(false);
  const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [widgetToRemove, setWidgetToRemove] = useState<string | null>(null);
  const [tabToRemove, setTabToRemove] = useState<string | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [activeDashboardTabId]);

  const currentIndex = useMemo(() =>
    dashboardTabs.findIndex(t => t.id === activeDashboardTabId),
    [dashboardTabs, activeDashboardTabId]
  );

  const goToNextTab = () => {
    const nextIndex = (currentIndex + 1) % dashboardTabs.length;
    setActiveDashboardTab(dashboardTabs[nextIndex].id);
  };

  const goToPrevTab = () => {
    const prevIndex = (currentIndex - 1 + dashboardTabs.length) % dashboardTabs.length;
    setActiveDashboardTab(dashboardTabs[prevIndex].id);
  };

  const handleConfirmRemoveWidget = () => {
    if (widgetToRemove) {
      removeWidgetFromLayout(widgetToRemove);
      setWidgetToRemove(null);
    }
  };

  const handleConfirmRemoveTab = () => {
    if (tabToRemove) {
      removeDashboardTab(tabToRemove);
      setTabToRemove(null);
    }
  };

  const activeTab = dashboardTabs.find(t => t.id === activeDashboardTabId);

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary font-display">Enhanced Dashboard</h1>
          <p className="text-brand-text-secondary mt-2">Professional business intelligence with customizable widgets</p>
        </div>

        {/* Dashboard Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTemplateModalOpen(true)}
            className="inline-flex items-center gap-2 bg-brand-surface text-brand-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-brand-border transition-colors"
          >
            <LayoutGrid className="w-5 h-5" /> Templates
          </button>
          <button
            onClick={() => setAddWidgetModalOpen(true)}
            className="inline-flex items-center gap-2 bg-brand-primary/20 text-brand-primary font-semibold py-2 px-4 rounded-lg hover:bg-brand-primary/30 transition-colors"
          >
            <Plus className="w-5 h-5" /> Add Widget
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`inline-flex items-center gap-2 font-semibold py-2 px-4 rounded-lg transition-colors ${
              isEditing
                ? 'bg-brand-accent text-white'
                : 'bg-brand-surface hover:bg-brand-border text-brand-text-primary'
            }`}
          >
            <Layout className="w-5 h-5" />
            {isEditing ? 'Save Layout' : 'Edit Layout'}
          </button>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <DashboardTabs onRemoveTab={setTabToRemove} />

      {/* Dashboard Content */}
      <div className="relative group">
        {dashboardTabs.length > 1 && (
          <div className="absolute inset-0 flex justify-between items-center pointer-events-none z-10">
            <button
              onClick={goToPrevTab}
              aria-label="Previous Dashboard"
              className="relative left-0 p-2 bg-brand-surface/50 rounded-full text-brand-text-secondary hover:bg-brand-surface hover:text-brand-text-primary backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 pointer-events-auto hover:scale-110"
            >
              <ChevronLeft className="w-8 h-8"/>
            </button>
            <button
              onClick={goToNextTab}
              aria-label="Next Dashboard"
              className="relative right-0 p-2 bg-brand-surface/50 rounded-full text-brand-text-secondary hover:bg-brand-surface hover:text-brand-text-primary backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 pointer-events-auto hover:scale-110"
            >
              <ChevronRight className="w-8 h-8"/>
            </button>
          </div>
        )}

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {dashboardTabs.map(tab => (
              <div key={tab.id} className="w-full flex-shrink-0">
                <div
                  ref={tab.id === activeDashboardTabId ? gridRef : null}
                  className="relative grid grid-cols-12 gap-6"
                  style={{
                    gridAutoRows: 'minmax(280px, auto)',
                  }}
                >
                  {isLoading && tab.id === activeDashboardTabId ? (
                    tab.layout.map(item => (
                      <div key={item.id} className="futuristic-border bg-brand-surface rounded-xl p-4" style={{
                        gridColumn: `${item.x + 1} / span ${item.w}`,
                        gridRow: `${item.y + 1} / span ${item.h}`,
                      }}>
                        <SkeletonLoader className="h-full w-full bg-brand-bg/50" />
                      </div>
                    ))
                  ) : tab.layout.length === 0 && tab.id === activeDashboardTabId ? (
                    <div className="col-span-12 text-center py-24 futuristic-border bg-brand-surface rounded-xl">
                      <div className="mx-auto mb-6 w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center">
                        <Layout className="w-10 h-10 text-brand-primary" />
                      </div>
                      <h3 className="mt-4 text-2xl font-bold text-brand-text-primary">Welcome to Your Enhanced Dashboard</h3>
                      <p className="mt-2 text-brand-text-secondary max-w-md mx-auto">
                        Start building your perfect dashboard by choosing a template or adding individual widgets tailored to your agency&apos;s needs.
                      </p>

                      {/* Quick Stats */}
                      <div className="mt-8 grid grid-cols-3 gap-6 max-w-lg mx-auto">
                        <div className="bg-brand-bg p-4 rounded-lg">
                          <p className="text-2xl font-bold text-brand-primary">{dashboardTabs.length}</p>
                          <p className="text-xs text-brand-text-secondary">Dashboard Tabs</p>
                        </div>
                        <div className="bg-brand-bg p-4 rounded-lg">
                          <p className="text-2xl font-bold text-brand-primary">8</p>
                          <p className="text-xs text-brand-text-secondary">Available Widgets</p>
                        </div>
                        <div className="bg-brand-bg p-4 rounded-lg">
                          <p className="text-2xl font-bold text-brand-primary">9</p>
                          <p className="text-xs text-brand-text-secondary">Template Options</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-6">
                        <button
                          onClick={() => setTemplateModalOpen(true)}
                          className="inline-flex items-center gap-2 bg-brand-primary text-white font-semibold py-3 px-8 rounded-lg hover:bg-brand-accent transition-colors shadow-lg hover:shadow-glow-sm"
                        >
                          <LayoutGrid className="w-5 h-5" /> Browse Templates
                        </button>
                        <button
                          onClick={() => setAddWidgetModalOpen(true)}
                          className="inline-flex items-center gap-2 bg-brand-surface border border-brand-border text-brand-text-primary font-semibold py-3 px-8 rounded-lg hover:bg-brand-border transition-colors"
                        >
                          <Plus className="w-5 h-5" /> Add Widgets
                        </button>
                      </div>

                      {/* Feature Highlights */}
                      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                        <div className="text-center">
                          <div className="w-8 h-8 bg-brand-insight/20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Layout className="w-4 h-4 text-brand-insight" />
                          </div>
                          <p className="text-sm font-semibold text-brand-text-primary">Customizable Layout</p>
                          <p className="text-xs text-brand-text-secondary">Arrange widgets to fit your workflow</p>
                        </div>
                        <div className="text-center">
                          <div className="w-8 h-8 bg-brand-success/20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Plus className="w-4 h-4 text-brand-success" />
                          </div>
                          <p className="text-sm font-semibold text-brand-text-primary">Professional Templates</p>
                          <p className="text-xs text-brand-text-secondary">Pre-built dashboards for every agency type</p>
                        </div>
                        <div className="text-center">
                          <div className="w-8 h-8 bg-brand-warning/20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <LayoutGrid className="w-4 h-4 text-brand-warning" />
                          </div>
                          <p className="text-sm font-semibold text-brand-text-primary">Multiple Dashboards</p>
                          <p className="text-xs text-brand-text-secondary">Organize different views for different needs</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {tab.layout.map(item => (
                        <WidgetWrapper
                          key={`${tab.id}-${item.id}`}
                          widgetItem={item}
                          isEditing={false}
                          isDragging={false}
                          onMouseDown={() => {}}
                          onRemove={setWidgetToRemove}
                        />
                      ))}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <div>
        <AddWidgetModal isOpen={isAddWidgetModalOpen} onClose={() => setAddWidgetModalOpen(false)} />
        <TemplateLibraryModal isOpen={isTemplateModalOpen} onClose={() => setTemplateModalOpen(false)} />
      </div>

      {/* Confirmation Modals */}
      {widgetToRemove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-brand-surface futuristic-border rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-brand-text-primary mb-2">
              Remove Widget?
            </h3>
            <p className="text-brand-text-secondary mb-6">
              Are you sure you want to remove this widget from your dashboard? You can always add it back later.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setWidgetToRemove(null)}
                className="flex-1 px-4 py-2 bg-brand-surface text-brand-text-primary rounded-lg hover:bg-brand-border transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemoveWidget}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Remove Widget
              </button>
            </div>
          </div>
        </div>
      )}

      {tabToRemove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-brand-surface futuristic-border rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-brand-text-primary mb-2">
              Delete Dashboard: &quot;{dashboardTabs.find(t => t.id === tabToRemove)?.name}&quot;?
            </h3>
            <p className="text-brand-text-secondary mb-6">
              Are you sure you want to delete this dashboard tab and its layout? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setTabToRemove(null)}
                className="flex-1 px-4 py-2 bg-brand-surface text-brand-text-primary rounded-lg hover:bg-brand-border transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemoveTab}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedDashboard;