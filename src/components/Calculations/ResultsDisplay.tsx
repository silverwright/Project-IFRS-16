import React, { useState } from 'react';
import { useLeaseContext } from '../../context/LeaseContext';
import { KPICard } from '../Dashboard/KPICard';
import { Button } from '../UI/Button';
import { DollarSign, TrendingDown, FileText, Download, BarChart3 } from 'lucide-react';

export function ResultsDisplay() {
  const { state } = useLeaseContext();
  const { calculations, leaseData } = state;
  const [activeTab, setActiveTab] = useState('summary');

  if (!calculations) return null;

  const tabs = [
    { id: 'summary', name: 'Summary', icon: DollarSign },
    { id: 'cashflow', name: 'Cashflow', icon: TrendingDown },
    { id: 'amortization', name: 'Amortization', icon: BarChart3 },
  ];

  const exportToExcel = () => {
    console.log('Exporting to Excel...');
  };

  const formatCurrency = (value: number) => {
    return `${leaseData.Currency || 'NGN'} ${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Calculation Results</h3>
        <Button
          variant="outline"
          onClick={exportToExcel}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export to Excel
        </Button>
      </div>

      {/* Enhanced KPI Summary with gradient backgrounds */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Initial Liability</p>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(calculations.initialLiability)}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Initial ROU Asset</p>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(calculations.initialROU)}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Interest</p>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(calculations.totalInterest)}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Total Depreciation</p>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(calculations.totalDepreciation)}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-slate-900 mb-4">Calculation Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 space-y-4">
                <h5 className="font-semibold text-slate-800 text-lg">Initial Recognition</h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-600">Initial Lease Liability:</span>
                    <span className="font-bold text-blue-600">{formatCurrency(calculations.initialLiability)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-600">Initial ROU Asset:</span>
                    <span className="font-bold text-emerald-600">{formatCurrency(calculations.initialROU)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">Lease Term:</span>
                    <span className="font-medium">{leaseData.NonCancellableYears || 0} years</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 space-y-4">
                <h5 className="font-semibold text-slate-800 text-lg">Total Impact</h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-600">Total Interest Expense:</span>
                    <span className="font-bold text-purple-600">{formatCurrency(calculations.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-600">Total Depreciation:</span>
                    <span className="font-bold text-orange-600">{formatCurrency(calculations.totalDepreciation)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">Payment Frequency:</span>
                    <span className="font-medium">{leaseData.PaymentFrequency || 'Monthly'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cashflow' && (
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-slate-900">Cashflow Schedule</h4>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider">Period</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-blue-800 uppercase tracking-wider">Rent Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {calculations.cashflowSchedule.slice(0, 12).map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{row.period}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{row.date}</td>
                      <td className="px-6 py-4 text-sm font-bold text-right text-green-600">
                        {formatCurrency(row.rent)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {calculations.cashflowSchedule.length > 12 && (
                <div className="bg-slate-50 px-6 py-3 text-sm text-slate-600 text-center border-t border-slate-200">
                  Showing first 12 of {calculations.cashflowSchedule.length} periods
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'amortization' && (
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-slate-900">Amortization Schedule</h4>
            <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-lg">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Month</th>
                    <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider">Payment</th>
                    <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider">Interest</th>
                    <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider">Principal</th>
                    <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider">Remaining Liability</th>
                    <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider">Depreciation</th>
                    <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider">Remaining Asset</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {calculations.amortizationSchedule.slice(0, 12).map((row, index) => (
                    <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gradient-to-r from-slate-50 to-slate-100'} hover:bg-blue-50 transition-colors`}>
                      <td className="px-4 py-3 text-sm font-bold text-slate-900">{row.month}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-right text-blue-600">
                        {formatCurrency(row.payment)}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-right text-red-600">
                        {formatCurrency(row.interest)}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-right text-green-600">
                        {formatCurrency(row.principal)}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-right text-purple-600">
                        {formatCurrency(row.remainingLiability)}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-right text-orange-600">
                        {formatCurrency(row.depreciation)}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-right text-indigo-600">
                        {formatCurrency(row.remainingAsset)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {calculations.amortizationSchedule.length > 12 && (
                <div className="bg-gradient-to-r from-slate-100 to-slate-200 px-6 py-3 text-sm text-slate-700 text-center border-t border-slate-200 font-medium">
                  Showing first 12 of {calculations.amortizationSchedule.length} months
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}