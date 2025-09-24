import React from 'react';
import { useLeaseContext } from '../context/LeaseContext';
import { 
  FileText, 
  Calculator, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  BarChart3,
  Activity,
  Building,
  Car,
  Wrench
} from 'lucide-react';

export function Dashboard() {
  const { state } = useLeaseContext();
  const { calculations, leaseData } = state;

  // Mock data for demonstration - in real app this would come from API
  const portfolioData = [
    { category: 'Real Estate', value: 1.9, contracts: 8, percentage: 75.5, color: 'bg-blue-500' },
    { category: 'Vehicles', value: 0.3, contracts: 4, percentage: 13.1, color: 'bg-gray-400' },
    { category: 'Equipment', value: 0.3, contracts: 3, percentage: 11.4, color: 'bg-blue-600' }
  ];

  const monthlyTrends = [
    { period: 'Jan', liability: 2.4, asset: 2.6, depreciation: 42 },
    { period: 'Feb', liability: 2.4, asset: 2.6, depreciation: 41 },
    { period: 'Mar', liability: 2.3, asset: 2.5, depreciation: 40 },
    { period: 'Apr', liability: 2.3, asset: 2.5, depreciation: 40 },
    { period: 'May', liability: 2.2, asset: 2.4, depreciation: 39 },
    { period: 'Jun', liability: 2.2, asset: 2.5, depreciation: 39 }
  ];

  const upcomingMaturities = [
    { contract: 'Office Lease - Downtown', maturityDate: '2024-12-31', liability: 185000, daysToMaturity: 267, status: 'Urgent' },
    { contract: 'Vehicle Fleet - Sales', maturityDate: '2025-03-15', liability: 45000, daysToMaturity: 193, status: 'Urgent' },
    { contract: 'Warehouse - North', maturityDate: '2025-06-30', liability: 320000, daysToMaturity: 86, status: 'Urgent' }
  ];

  return (
    <div className="w-full min-h-screen p-6 space-y-6 bg-slate-50">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 flex items-center gap-3 shadow-sm">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">Overview of your IFRS 16 lease portfolio</p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total ROU Assets */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Total ROU Assets</span>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-600">
            {calculations ? `₦${(calculations.initialROU / 1000000).toFixed(1)}M` : '₦0.0M'}
          </div>
        </div>

        {/* Total Liabilities */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Total Liabilities</span>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {calculations ? `₦${(calculations.initialLiability / 1000000).toFixed(1)}M` : '₦0.0M'}
          </div>
        </div>

        {/* Monthly Depreciation */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Monthly Depreciation</span>
            <Activity className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {calculations ? `₦${((calculations.totalDepreciation / (leaseData.NonCancellableYears || 1) / 12) / 1000).toFixed(0)}K` : '₦0K'}
          </div>
        </div>

        {/* Monthly Interest */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Monthly Interest</span>
            <DollarSign className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600">
            {calculations ? `₦${((calculations.totalInterest / (leaseData.NonCancellableYears || 1) / 12) / 1000).toFixed(0)}K` : '₦0K'}
          </div>
        </div>

        {/* Active Contracts */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Active Contracts</span>
            <FileText className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {leaseData.ContractID ? '1' : '0'}
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Expiring Soon</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">3</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Composition */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Portfolio Composition</h3>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>
          
          <div className="space-y-4">
            {portfolioData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.category === 'Real Estate' && <Building className="w-4 h-4 text-blue-500" />}
                    {item.category === 'Vehicles' && <Car className="w-4 h-4 text-gray-500" />}
                    {item.category === 'Equipment' && <Wrench className="w-4 h-4 text-blue-600" />}
                    <span className="text-sm font-medium text-slate-700">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900">₦{item.value}M</div>
                    <div className="text-xs text-slate-500">({item.contracts} contracts)</div>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`${item.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-slate-500">{item.percentage}% of total portfolio</div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends Table */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Monthly Trends</h3>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-2 text-sm font-medium text-slate-600">Period</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-slate-600">Liability</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-slate-600">Asset</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-slate-600">Depreciation</th>
                </tr>
              </thead>
              <tbody>
                {monthlyTrends.map((trend, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-2 text-sm text-slate-900">{trend.period}</td>
                    <td className="py-3 px-2 text-sm text-blue-600 text-right font-medium">₦{trend.liability}M</td>
                    <td className="py-3 px-2 text-sm text-green-600 text-right font-medium">₦{trend.asset}M</td>
                    <td className="py-3 px-2 text-sm text-orange-600 text-right font-medium">₦{trend.depreciation}K</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Payment Performance */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h4 className="text-sm font-medium text-slate-600 mb-4">Payment Performance</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">On Time</span>
              <span className="text-sm font-semibold text-green-600">98.5%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '98.5%' }}></div>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>47 of 48 payments</span>
              <span>Last 12 months</span>
            </div>
          </div>
        </div>

        {/* Lease Modifications */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h4 className="text-sm font-medium text-slate-600 mb-4">Lease Modifications</h4>
          <div className="space-y-3">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-sm text-slate-600">This quarter</div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600">-2 from last quarter</span>
            </div>
          </div>
        </div>

        {/* Compliance Score */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h4 className="text-sm font-medium text-slate-600 mb-4">Compliance Score</h4>
          <div className="space-y-3">
            <div className="text-2xl font-bold text-green-600">94%</div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
            </div>
            <div className="text-sm text-slate-600">IFRS 16 Compliance</div>
          </div>
        </div>

        {/* Cost Savings */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h4 className="text-sm font-medium text-slate-600 mb-4">Cost Optimization</h4>
          <div className="space-y-3">
            <div className="text-2xl font-bold text-purple-600">₦2.1M</div>
              <div className="text-sm text-slate-600">Potential savings identified</div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">+15% vs last year</span>
                </div>
              </div>
            </div>
          </div>


      {/* Upcoming Contract Maturities */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Upcoming Contract Maturities</h3>
          <Calendar className="w-5 h-5 text-slate-400" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">CONTRACT</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">MATURITY DATE</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">OUTSTANDING LIABILITY</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">DAYS TO MATURITY</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {upcomingMaturities.map((contract, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-4 text-sm text-slate-900 font-medium">{contract.contract}</td>
                  <td className="py-4 px-4 text-sm text-slate-600">{contract.maturityDate}</td>
                  <td className="py-4 px-4 text-sm text-slate-900 text-right font-medium">
                    ₦{contract.liability.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600 text-right">
                    {contract.daysToMaturity > 0 ? `${contract.daysToMaturity} days` : `${Math.abs(contract.daysToMaturity)} days overdue`}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      contract.status === 'Urgent' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {contract.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      </div>
  );
}