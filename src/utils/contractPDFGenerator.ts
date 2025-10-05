export async function generateContractPDF(leaseData: Partial<LeaseData>, mode: 'MINIMAL' | 'FULL') {
  return new Promise<void>((resolve, reject) => {
    try {
      const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
      });
      
      // Save the PDF
      pdf.save(`${leaseData.ContractID || 'lease-contract'}-${mode.toLowerCase()}.pdf`);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}