import React, { useState } from 'react';
import { useLeaseContext, SavedContract } from '../context/LeaseContext';
import { ModeSelector } from '../components/Contract/ModeSelector';
import { BasicInfoForm } from '../components/Contract/BasicInfoForm';
import { PaymentDetailsForm } from '../components/Contract/PaymentDetailsForm';
import { AdvancedOptionsForm } from '../components/Contract/AdvancedOptionsForm';
import { ContractPreview } from '../components/Contract/ContractPreview';
import { CSVUpload } from '../components/Contract/CSVUpload';
import { ContractList } from '../components/Contract/ContractList';
import { ProgressBar } from '../components/UI/ProgressBar';
import { Button } from '../components/UI/Button';
import { ArrowLeft, ArrowRight, FileText, RefreshCw, Save, Upload } from 'lucide-react';

const steps = [
  { id: 1, name: 'Basic Info', component: BasicInfoForm },
  { id: 2, name: 'Payment Details', component: PaymentDetailsForm },
  { id: 3, name: 'Advanced Options', component: AdvancedOptionsForm },
  { id: 4, name: 'Preview & Generate', component: ContractPreview },
];

export function ContractInitiation() {
  const { state, dispatch } = useLeaseContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [modeSelected, setModeSelected] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'upload' | 'list'>('list');
  const [editingContract, setEditingContract] = useState<SavedContract | null>(null);

  const CurrentStepComponent =
    steps.find(step => step.id === currentStep)?.component || BasicInfoForm;

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleModeChange = (mode: 'MINIMAL' | 'FULL') => {
    dispatch({ type: 'SET_MODE', payload: mode });
    setModeSelected(true);
    setActiveTab('form');
  };

  const resetMode = () => {
    setModeSelected(false);
    setCurrentStep(1);
    setActiveTab('list');
    setEditingContract(null);
    dispatch({ type: 'RESET' });
  };

  const handleSaveContract = () => {
    const contractData: SavedContract = {
      id: editingContract?.id || Date.now().toString(),
      contractId: state.leaseData.ContractID || '',
      lessorName: state.leaseData.LessorName || '',
      lesseeName: state.leaseData.LesseeEntity || '',
      assetDescription: state.leaseData.AssetDescription || '',
      commencementDate: state.leaseData.CommencementDate || '',
      status: 'pending',
      createdAt: editingContract?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: state.leaseData,
      mode: state.mode
    };

    if (editingContract) {
      dispatch({ type: 'UPDATE_CONTRACT', payload: contractData });
    } else {
      dispatch({ type: 'SAVE_CONTRACT', payload: contractData });
    }

    alert('Contract saved successfully!');
  };

  const handleEditContract = (contract: SavedContract) => {
    setEditingContract(contract);
    dispatch({ type: 'SET_MODE', payload: contract.mode });
    dispatch({ type: 'LOAD_CONTRACT', payload: contract.data });
    setModeSelected(true);
    setActiveTab('form');
    setCurrentStep(1);
  };

  const handleNewContract = () => {
    setEditingContract(null);
    dispatch({ type: 'RESET' });
    setModeSelected(false);
    setActiveTab('form');
  };

  const handleCSVUploadComplete = () => {
    setModeSelected(true);
    setActiveTab('form');
    setCurrentStep(1);
  };

  if (!modeSelected && activeTab !== 'list') {
    return (
      <div className="w-full min-h-screen p-6 space-y-6 bg-slate-100">
        <div className="bg-white rounded-lg border border-slate-200 p-6 flex items-start gap-3 shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Contract Initiation & Approval
            </h1>
            <p className="text-slate-600">
              Select a mode to start creating your lease contract
            </p>
          </div>
        </div>

        <ModeSelector currentMode={state.mode} onModeChange={handleModeChange} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-6 space-y-6 bg-slate-100">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 flex items-start gap-3 shadow">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">
            Contract Initiation & Approval
          </h1>
          <p className="text-slate-600">
            {modeSelected ? `Running in ${state.mode} mode` : 'Manage your lease contracts'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-slate-200 shadow">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'list', name: 'Contract List', icon: FileText },
              { id: 'form', name: 'Create/Edit Contract', icon: FileText },
              { id: 'upload', name: 'CSV Import', icon: Upload },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors
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

        <div className="p-6">
          {activeTab === 'list' && (
            <ContractList
              onEditContract={handleEditContract}
              onNewContract={handleNewContract}
            />
          )}

          {activeTab === 'upload' && (
            <CSVUpload onUploadComplete={handleCSVUploadComplete} />
          )}

          {activeTab === 'form' && modeSelected && (
            <div className="space-y-6">
              {/* Progress Bar */}
              <ProgressBar steps={steps} currentStep={currentStep} />

              {/* Form Content */}
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
                <CurrentStepComponent />
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={resetMode}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Back to Contract List
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleSaveContract}
                    disabled={!state.leaseData.ContractID}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Contract
                  </Button>

                  {currentStep < steps.length ? (
                    <Button onClick={nextStep} className="flex items-center gap-2">
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        console.log('Generating contract...');
                      }}
                      className="flex items-center gap-2"
                    >
                      Generate Contract
                      <FileText className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}