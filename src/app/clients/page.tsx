"use client";

import useStore from '../../hooks/useStore';

export default function ClientsPage() {
  const { brands } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">Clients</h1>
          <p className="text-brand-text-secondary mt-1">Manage your client relationships</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
          <h3 className="text-lg font-semibold text-brand-text-primary mb-2">Total Clients</h3>
          <p className="text-3xl font-bold text-brand-primary">{brands.length}</p>
          <p className="text-sm text-brand-text-secondary mt-1">Active brands</p>
        </div>
        
        <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
          <h3 className="text-lg font-semibold text-brand-text-primary mb-2">Active Brands</h3>
          <p className="text-3xl font-bold text-brand-accent">{brands.filter(b => b.satisfaction > 70).length}</p>
          <p className="text-sm text-brand-text-secondary mt-1">High satisfaction</p>
        </div>

        <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
          <h3 className="text-lg font-semibold text-brand-text-primary mb-2">Portal Access</h3>
          <p className="text-3xl font-bold text-brand-primary">
            {brands.filter(b => b.portalAccess).length}
          </p>
          <p className="text-sm text-brand-text-secondary mt-1">With portal access</p>
        </div>

        <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
          <h3 className="text-lg font-semibold text-brand-text-primary mb-2">Avg. Satisfaction</h3>
          <p className="text-3xl font-bold text-brand-primary">
            {brands.length > 0 ? Math.round(brands.reduce((sum, b) => sum + (b.satisfaction || 0), 0) / brands.length) : 0}
          </p>
          <p className="text-sm text-brand-text-secondary mt-1">Average score</p>
        </div>
      </div>

      <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
        <h3 className="text-xl font-semibold text-brand-text-primary mb-4">Client List</h3>
        <div className="space-y-4">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center justify-between p-4 bg-brand-bg futuristic-border rounded-xl hover:shadow-glow-md transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-brand-primary font-bold text-lg">
                    {brand.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-brand-text-primary">{brand.name}</h4>
                  <p className="text-sm text-brand-text-secondary">{brand.industry} • Satisfaction: {brand.satisfaction}%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-brand-text-primary">{brand.satisfaction}%</p>
                <p className="text-sm text-brand-text-secondary">Satisfaction</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}