import React from 'react';
import { useLeaseContext } from '../../context/LeaseContext';
import { Button } from '../UI/Button';
import { Download, FileText, Eye } from 'lucide-react';
import { jsPDF } from 'jspdf';

export function ContractPreview() {
  const { state } = useLeaseContext();
  const { leaseData, mode } = state;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'TBD';
    return new Date(dateStr).toLocaleDateString('en-GB');
  };

  const downloadPDF = () => {
    try {
      const pdf = new jsPDF();
      
      // Add title
      pdf.setFontSize(16);
      pdf.text('EQUIPMENT LEASE AGREEMENT', 20, 30);
      
      // Add basic info
      pdf.setFontSize(12);
      pdf.text(`Contract ID: ${leaseData.ContractID || 'N/A'}`, 20, 50);
      pdf.text(`Lessor: ${leaseData.LessorName || 'N/A'}`, 20, 60);
      pdf.text(`Lessee: ${leaseData.LesseeEntity || 'N/A'}`, 20, 70);
      pdf.text(`Asset: ${leaseData.AssetDescription || 'N/A'}`, 20, 80);
      pdf.text(`Term: ${leaseData.NonCancellableYears || 0} years`, 20, 90);
      pdf.text(`Payment: ${leaseData.Currency} ${formatCurrency(leaseData.FixedPaymentPerPeriod)} per ${leaseData.PaymentFrequency}`, 20, 100);
      
      pdf.save(`${leaseData.ContractID || 'lease-contract'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Contract Preview</h3>
        <Button
          variant="outline"
          onClick={downloadPDF}
          disabled={!leaseData.ContractID}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      </div>

      {/* Contract Summary */}
      <div className="bg-slate-50 rounded-lg p-6 space-y-4">
        <h4 className="font-semibold text-slate-900">Contract Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-slate-600">Contract ID:</span>
            <span className="ml-2 font-medium">{leaseData.ContractID || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-600">Mode:</span>
            <span className="ml-2 font-medium">{mode}</span>
          </div>
          <div>
            <span className="text-slate-600">Asset:</span>
            <span className="ml-2 font-medium">{leaseData.AssetDescription || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-600">Term:</span>
            <span className="ml-2 font-medium">{leaseData.NonCancellableYears || 0} years</span>
          </div>
          <div>
            <span className="text-slate-600">Payment:</span>
            <span className="ml-2 font-medium">
              {leaseData.Currency} {formatCurrency(leaseData.FixedPaymentPerPeriod)} / {leaseData.PaymentFrequency}
            </span>
          </div>
          <div>
            <span className="text-slate-600">IBR:</span>
            <span className="ml-2 font-medium">{((leaseData.IBR_Annual || 0) * 100).toFixed(2)}%</span>
          </div>
        </div>
      </div>

      {/* Contract Preview */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
          <Eye className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Contract Preview</span>
        </div>
        <div className="max-h-96 overflow-y-auto p-6">
          {leaseData.ContractID ? (
            <div className="prose prose-sm max-w-none">
              <h1 className="text-xl font-bold text-blue-600 mb-4">EQUIPMENT LEASE AGREEMENT</h1>
              
              <div className="mb-4 pb-4 border-b border-slate-200">
                <strong>Contract ID:</strong> {leaseData.ContractID} | 
                <strong> Date:</strong> {formatDate(leaseData.ContractDate || '')}
              </div>

              <h2 className="text-lg font-semibold text-blue-600 mt-6 mb-3">Schedule — Key Commercial Terms</h2>
              <table className="w-full border-collapse border border-slate-300 mb-6">
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-2 font-semibold bg-slate-50">Lessor</td>
                    <td className="border border-slate-300 p-2">{leaseData.LessorName || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-semibold bg-slate-50">Lessee</td>
                    <td className="border border-slate-300 p-2">{leaseData.LesseeEntity || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-semibold bg-slate-50">Asset</td>
                    <td className="border border-slate-300 p-2">{leaseData.AssetDescription || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-semibold bg-slate-50">Term</td>
                    <td className="border border-slate-300 p-2">{leaseData.NonCancellableYears || 0} years</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-semibold bg-slate-50">Rent</td>
                    <td className="border border-slate-300 p-2">
                      {leaseData.Currency} {formatCurrency(leaseData.FixedPaymentPerPeriod)} per {leaseData.PaymentFrequency || 'period'}
                    </td>
                  </tr>
                </tbody>
              </table>

              <h2 className="text-lg font-semibold mt-6 mb-3">1. Parties and Definitions</h2>
              <p className="mb-4">
                This agreement is between <strong>{leaseData.LessorName || 'Lessor'}</strong> (the "Lessor") 
                and <strong>{leaseData.LesseeEntity || 'Lessee'}</strong> (the "Lessee").
              </p>

              <h2 className="text-lg font-semibold mt-6 mb-3">2. Lease and Title</h2>
              <p className="mb-4">
                Lessor leases the equipment described in the Schedule to Lessee for the Term. 
                Title to the Asset remains with Lessor at all times.
              </p>

              <h2 className="text-lg font-semibold mt-6 mb-3">3. Payment Terms</h2>
              <p className="mb-4">
                Lessee shall pay rent of {leaseData.Currency} {formatCurrency(leaseData.FixedPaymentPerPeriod)} 
                per {leaseData.PaymentFrequency || 'period'} in {leaseData.PaymentTiming || 'advance'}.
              </p>

              <div className="mt-8 pt-4 border-t border-slate-200 text-sm text-slate-600">
                <p><em>This is a system-generated contract preview. Full contract available in PDF download.</em></p>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500">
              <FileText className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p>Complete the form to generate contract preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}