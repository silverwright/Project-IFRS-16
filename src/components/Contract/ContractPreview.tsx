import React, { useEffect, useState } from 'react';
import { useLeaseContext } from '../../context/LeaseContext';
import { Button } from '../UI/Button';
import { Download, FileText, Eye, Loader2 } from 'lucide-react';
import { generateContractHTML } from '../../utils/contractGenerator';
import { generateContractPDF } from '../../utils/contractPDFGenerator';

export function ContractPreview() {
  const { state } = useLeaseContext();
  const { leaseData, mode } = state;
  const [contractHtml, setContractHtml] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (leaseData.ContractID) {
      generateContractPreview();
    } else {
      setContractHtml('');
    }
  }, [leaseData, mode]);

  const generateContractPreview = async () => {
    setIsGenerating(true);
    setError('');
    
    try {
      // Use setTimeout to prevent blocking the UI
      setTimeout(() => {
        try {
          const html = generateContractHTML(leaseData, mode);
          setContractHtml(html);
          setIsGenerating(false);
        } catch (err) {
          console.error('Error generating contract:', err);
          setError('Failed to generate contract preview');
          setIsGenerating(false);
        }
      }, 100);
    } catch (err) {
      console.error('Error in generateContractPreview:', err);
      setError('Failed to generate contract preview');
      setIsGenerating(false);
    }
  };

  const downloadPDF = async () => {
    if (!leaseData.ContractID) {
      alert('Please complete the contract details first');
      return;
    }

    setIsDownloading(true);
    try {
      await generateContractPDF(leaseData, mode);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Contract Preview</h3>
        <Button
          variant="outline"
          onClick={downloadPDF}
          disabled={!leaseData.ContractID || isDownloading}
          className="flex items-center gap-2"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download PDF
            </>
          )}
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
          {isGenerating ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
              <span className="text-slate-600">Generating contract preview...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              <FileText className="w-8 h-8 mx-auto mb-2 text-red-400" />
              <p>{error}</p>
            </div>
          ) : contractHtml ? (
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: contractHtml }}
            />
          ) : (
            <div className="text-center text-slate-500 py-8">
              <FileText className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p>Complete the form to generate contract preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}