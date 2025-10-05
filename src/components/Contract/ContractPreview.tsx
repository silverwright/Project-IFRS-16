import React, { useEffect } from 'react';
import { useLeaseContext } from '../../context/LeaseContext';
import { Button } from '../UI/Button';
import { Download, FileText, Eye } from 'lucide-react';
import { generateContractHTML } from '../../utils/contractGenerator';
import { generateContractPDF } from '../../utils/contractPDFGenerator';

export function ContractPreview() {
  const { state, dispatch } = useLeaseContext();
  const { leaseData, mode, contractHtml } = state;

  useEffect(() => {
    // Generate contract HTML when component mounts
    if (leaseData.ContractID) {
      const html = generateContractHTML(leaseData, mode);
      dispatch({ type: 'SET_CONTRACT_HTML', payload: html });
    }
  }, [leaseData, mode, dispatch]);

  const downloadContract = () => {
    if (leaseData.ContractID) {
      generateContractPDF(leaseData, mode);
    }
  };

  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Contract Preview</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={downloadContract}
            disabled={!leaseData.ContractID}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
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
              {leaseData.Currency} {(leaseData.FixedPaymentPerPeriod || 0).toLocaleString()} / {leaseData.PaymentFrequency}
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
        <div className="max-h-96 overflow-y-auto">
          {contractHtml ? (
            <div 
              className="p-6 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: contractHtml }}
            />
          ) : (
            <div className="p-6 text-center text-slate-500">
              <FileText className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p>Complete the form to generate contract preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}