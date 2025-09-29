import React from 'react';
import { BookOpen, Download, FileText } from 'lucide-react';
import { Button } from '../components/UI/Button';

export function Methodology() {
  const downloadMethodology = () => {
    // Mock download functionality
    console.log('Downloading methodology PDF...');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">IFRS 16 Methodology</h1>
            <p className="text-slate-600">Assumptions, calculations, and accounting policies</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={downloadMethodology}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-8 prose prose-slate max-w-none">
        <h2 className="text-xl font-bold text-slate-900 mb-4">IFRS 16 Leases Model — Assumptions & Methodology</h2>
        
        <p className="text-slate-600 mb-6">
          This document defines modeling assumptions, accounting policy elections, and calculation methodology 
          for measuring lease liabilities and right-of-use (ROU) assets under IFRS 16.
        </p>

        <div className="space-y-8">
          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">1. Scope & Principles</h3>
            <ul className="space-y-2 text-slate-700">
              <li><strong>Standard:</strong> IFRS 16 (Lessee accounting). Lessors are out of scope.</li>
              <li><strong>Measurement focus:</strong> Initial measurement at commencement and subsequent measurement.</li>
              <li><strong>Granularity:</strong> Per lease (no portfolio expedient by default).</li>
              <li><strong>Currency:</strong> Functional currency per entity; multi-currency supported via FX translation.</li>
              <li><strong>Materiality:</strong> Apply reasonable rounding (2 dp); immaterial deltas may be posted in final period.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">2. Accounting Policy Elections</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-800">Lease Term Determination (IFRS 16 ¶18–21)</h4>
                <p className="text-slate-700">Renewal options are included only if reasonably certain. Default threshold: likelihood ≥ 80%.</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Discount Rate (¶26, ¶27)</h4>
                <p className="text-slate-700">Use the Incremental Borrowing Rate (IBR) at commencement when implicit rate is not readily determinable.</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Variable Lease Payments (¶27)</h4>
                <p className="text-slate-700">Usage-based or purely variable amounts are excluded from liability; recognised in P&L as incurred.</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">ROU Depreciation (¶31)</h4>
                <p className="text-slate-700">Straight-line over the shorter of lease term or useful life.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">3. Initial Measurement</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-800">Lease Liability</h4>
                <p className="text-slate-700">Present value of lease payments using IBR and timing convention (advance vs arrears).</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">ROU Asset</h4>
                <p className="text-slate-700">ROU₀ = Liability₀ + Initial Direct Costs + Prepayments − Incentives</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">4. Subsequent Measurement</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-800">Liability Amortisation</h4>
                <p className="text-slate-700">Effective interest method: Interest expense = opening liability × per-period rate</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">ROU Depreciation</h4>
                <p className="text-slate-700">Straight-line per period over depreciation horizon = min(lease term, useful life)</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">5. Journal Entries</h3>
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-800 mb-2">Commencement</h4>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>Dr ROU Asset / Cr Lease Liability</li>
                <li>Dr/Cr Cash for prepayments and IDC</li>
                <li>Dr Lease Incentives Receivable (if applicable)</li>
              </ul>
              
              <h4 className="font-semibold text-slate-800 mb-2 mt-4">Periodic</h4>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>Dr Interest Expense (lease) / Cr Lease Liability</li>
                <li>Dr Lease Liability / Cr Cash (payment)</li>
                <li>Dr Depreciation Expense / Cr Accumulated Depreciation</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}