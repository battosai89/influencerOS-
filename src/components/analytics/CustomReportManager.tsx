import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Play, Settings } from 'lucide-react';
import Modal from '../Modal';
import ConfirmationModal from '../ConfirmationModal';
import notificationService from '../../services/notificationService';
import { CustomReport } from '../../types';

interface CustomReportFormData {
  name: string;
  description: string;
  type: 'financial' | 'campaign' | 'influencer' | 'client';
  filters: Record<string, any>;
  schedule?: 'daily' | 'weekly' | 'monthly';
}

interface CustomReportManagerProps {
  reports: CustomReport[];
  onCreateReport: (report: Omit<CustomReport, 'id' | 'createdAt' | 'lastRun'>) => void;
  onUpdateReport: (id: string, updates: Partial<CustomReport>) => void;
  onDeleteReport: (id: string) => void;
  onRunReport: (id: string) => Promise<void>;
}

const CustomReportManager: React.FC<CustomReportManagerProps> = ({
  reports,
  onCreateReport,
  onUpdateReport,
  onDeleteReport,
  onRunReport
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<CustomReport | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState<CustomReportFormData>({
    name: '',
    description: '',
    type: 'financial',
    filters: {},
    schedule: undefined
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'financial',
      filters: {},
      schedule: undefined
    });
  };

  const handleCreateReport = async () => {
    if (!formData.name.trim()) {
      notificationService.error('Report name is required');
      return;
    }

    try {
      setIsLoading('create');
      await onCreateReport({
        name: formData.name,
        description: formData.description,
        type: formData.type,
        filters: formData.filters,
        schedule: formData.schedule
      });

      notificationService.success('Custom report created successfully');
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error) {
      notificationService.error('Failed to create report');
    } finally {
      setIsLoading(null);
    }
  };

  const handleEditReport = async () => {
    if (!selectedReport || !formData.name.trim()) {
      notificationService.error('Report name is required');
      return;
    }

    try {
      setIsLoading('edit');
      await onUpdateReport(selectedReport.id, {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        filters: formData.filters,
        schedule: formData.schedule
      });

      notificationService.success('Report updated successfully');
      setIsEditModalOpen(false);
      setSelectedReport(null);
      resetForm();
    } catch (error) {
      notificationService.error('Failed to update report');
    } finally {
      setIsLoading(null);
    }
  };

  const handleDeleteReport = async () => {
    if (!selectedReport) return;

    try {
      setIsLoading('delete');
      await onDeleteReport(selectedReport.id);
      notificationService.success('Report deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedReport(null);
    } catch (error) {
      notificationService.error('Failed to delete report');
    } finally {
      setIsLoading(null);
    }
  };

  const handleRunReport = async (reportId: string) => {
    try {
      setIsLoading(reportId);
      await onRunReport(reportId);
      notificationService.success('Report executed successfully');
    } catch (error) {
      notificationService.error('Failed to run report');
    } finally {
      setIsLoading(null);
    }
  };

  const openEditModal = (report: CustomReport) => {
    setSelectedReport(report);
    setFormData({
      name: report.name,
      description: report.description,
      type: report.type,
      filters: report.filters,
      schedule: report.schedule
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (report: CustomReport) => {
    setSelectedReport(report);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className="bg-brand-surface rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-brand-text-primary">Custom Reports</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Report
          </button>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-brand-text-secondary mb-2">No custom reports yet</div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="text-brand-primary hover:text-brand-accent transition-colors"
            >
              Create your first report
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 bg-brand-bg rounded-lg border border-brand-border"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-brand-text-primary">{report.name}</h3>
                  <p className="text-sm text-brand-text-secondary">{report.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      report.type === 'financial' ? 'bg-green-100 text-green-800' :
                      report.type === 'campaign' ? 'bg-blue-100 text-blue-800' :
                      report.type === 'influencer' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {report.type}
                    </span>
                    {report.schedule && (
                      <span className="text-xs text-brand-text-secondary">
                        Runs {report.schedule}
                      </span>
                    )}
                    {report.lastRun && (
                      <span className="text-xs text-brand-text-secondary">
                        Last run: {new Date(report.lastRun).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRunReport(report.id)}
                    disabled={isLoading === report.id}
                    className="p-2 text-brand-text-secondary hover:text-brand-primary hover:bg-brand-border rounded-lg transition-colors"
                    title="Run Report"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEditModal(report)}
                    className="p-2 text-brand-text-secondary hover:text-brand-primary hover:bg-brand-border rounded-lg transition-colors"
                    title="Edit Report"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(report)}
                    className="p-2 text-brand-text-secondary hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Report Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Create Custom Report"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              Report Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="Enter report name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="Enter report description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              Report Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as CustomReport['type'] })}
              className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="financial">Financial</option>
              <option value="campaign">Campaign</option>
              <option value="influencer">Influencer</option>
              <option value="client">Client</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              Schedule (Optional)
            </label>
            <select
              value={formData.schedule || ''}
              onChange={(e) => setFormData({
                ...formData,
                schedule: e.target.value ? e.target.value as CustomReport['schedule'] : undefined
              })}
              className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="">No schedule</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-brand-border">
          <button
            onClick={() => {
              setIsCreateModalOpen(false);
              resetForm();
            }}
            className="px-4 py-2 text-brand-text-secondary hover:text-brand-text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateReport}
            disabled={isLoading === 'create' || !formData.name.trim()}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent disabled:bg-brand-secondary disabled:cursor-not-allowed transition-colors"
          >
            {isLoading === 'create' ? 'Creating...' : 'Create Report'}
          </button>
        </div>
      </Modal>

      {/* Edit Report Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedReport(null);
          resetForm();
        }}
        title="Edit Custom Report"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              Report Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="Enter report name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="Enter report description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              Report Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as CustomReport['type'] })}
              className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="financial">Financial</option>
              <option value="campaign">Campaign</option>
              <option value="influencer">Influencer</option>
              <option value="client">Client</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              Schedule (Optional)
            </label>
            <select
              value={formData.schedule || ''}
              onChange={(e) => setFormData({
                ...formData,
                schedule: e.target.value ? e.target.value as CustomReport['schedule'] : undefined
              })}
              className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="">No schedule</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-brand-border">
          <button
            onClick={() => {
              setIsEditModalOpen(false);
              setSelectedReport(null);
              resetForm();
            }}
            className="px-4 py-2 text-brand-text-secondary hover:text-brand-text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleEditReport}
            disabled={isLoading === 'edit' || !formData.name.trim()}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent disabled:bg-brand-secondary disabled:cursor-not-allowed transition-colors"
          >
            {isLoading === 'edit' ? 'Updating...' : 'Update Report'}
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedReport(null);
        }}
        onConfirm={handleDeleteReport}
        title="Delete Custom Report"
        message={`Are you sure you want to delete "${selectedReport?.name}"? This action cannot be undone.`}
        confirmText={isLoading === 'delete' ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
};

export default CustomReportManager;