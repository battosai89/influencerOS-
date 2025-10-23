"use client";

import React, { useState } from 'react';
import useStore from '../../hooks/useStore';
import { Plus, Download, Edit, Trash2, Filter, Calendar } from 'lucide-react';
import { CustomReport } from '../../types';

interface CustomReport {
  id: string;
  name: string;
  description: string;
  type: 'financial' | 'campaign' | 'influencer' | 'client';
  filters: Record<string, any>;
  createdAt: string;
  lastRun?: string;
  schedule?: 'daily' | 'weekly' | 'monthly';
}

// Mock data for now - TODO: Integrate with store
const mockReports: CustomReport[] = [
  {
    id: '1',
    name: 'Monthly Revenue Report',
    description: 'Comprehensive monthly revenue analysis',
    type: 'financial',
    filters: { period: 'monthly' },
    createdAt: '2025-01-01',
    schedule: 'monthly'
  }
];

const CustomReportManager: React.FC = () => {
  const [customReports] = useState<CustomReport[]>(mockReports);
  const [isCreating, setIsCreating] = useState(false);
  const [newReport, setNewReport] = useState<Partial<CustomReport>>({
    name: '',
    description: '',
    type: 'financial',
    filters: {},
    schedule: 'weekly'
  });

  const handleCreateReport = () => {
    // TODO: Implement report creation
    console.log('Creating report:', newReport);
    setIsCreating(false);
    setNewReport({
      name: '',
      description: '',
      type: 'financial',
      filters: {},
      schedule: 'weekly'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-brand-text-primary">Custom Reports</h3>
          <p className="text-brand-text-secondary">Create and manage custom analytics reports</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Report
        </button>
      </div>

      {/* Create Report Form */}
      {isCreating && (
        <div className="bg-brand-surface futuristic-border rounded-xl p-6">
          <h4 className="text-lg font-semibold text-brand-text-primary mb-4">Create New Report</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                Report Name
              </label>
              <input
                type="text"
                value={newReport.name}
                onChange={(e) => setNewReport({...newReport, name: e.target.value})}
                className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="Enter report name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                Report Type
              </label>
              <select
                value={newReport.type}
                onChange={(e) => setNewReport({...newReport, type: e.target.value as CustomReport['type']})}
                className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="financial">Financial</option>
                <option value="campaign">Campaign</option>
                <option value="influencer">Influencer</option>
                <option value="client">Client</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                Description
              </label>
              <textarea
                value={newReport.description}
                onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="Describe what this report shows"
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                Schedule
              </label>
              <select
                value={newReport.schedule}
                onChange={(e) => setNewReport({...newReport, schedule: e.target.value as CustomReport['schedule']})}
                className="px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCreateReport}
              className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-colors"
            >
              Create Report
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 bg-brand-surface text-brand-text-secondary rounded-lg hover:bg-brand-border transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Existing Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customReports.map((report) => (
          <div key={report.id} className="bg-brand-surface futuristic-border rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-brand-text-primary">{report.name}</h4>
                <p className="text-sm text-brand-text-secondary">{report.description}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-1 text-brand-text-secondary hover:text-brand-primary transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-1 text-brand-text-secondary hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                <Filter className="w-4 h-4" />
                <span>Type: {report.type}</span>
              </div>
              {report.schedule && (
                <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                  <Calendar className="w-4 h-4" />
                  <span>Schedule: {report.schedule}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                <span>Created: {new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-3 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Run Report
              </button>
            </div>
          </div>
        ))}
      </div>

      {customReports.length === 0 && (
        <div className="text-center py-12">
          <Filter className="w-16 h-16 mx-auto text-brand-border mb-4" />
          <h3 className="text-lg font-semibold text-brand-text-primary mb-2">No custom reports yet</h3>
          <p className="text-brand-text-secondary mb-4">
            Create your first custom report to get started with advanced analytics
          </p>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Report
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomReportManager;