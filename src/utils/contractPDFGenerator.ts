import { jsPDF } from 'jspdf';
import { LeaseData } from '../context/LeaseContext';

export async function generateContractPDF(leaseData: Partial<LeaseData>, mode: 'MINIMAL' | 'FULL'): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
      });

      const margin = 15;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const maxWidth = pageWidth - margin * 2;
      let y = 20;

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

      const addText = (text: string, fontSize: number = 11, isBold: boolean = false) => {
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
        pdf.setFontSize(fontSize);
        const lines = pdf.splitTextToSize(text, maxWidth);
        
        if (y + lines.length * 6 > pageHeight - 20) {
          pdf.addPage();
          y = 20;
        }
        
        pdf.text(lines, margin, y);
        y += lines.length * 6 + 4;
      };

      const addTitle = (text: string) => {
        addText(text, 14, true);
        y += 4;
      };

      const addSection = (text: string) => {
        addText(text, 12, true);
        y += 2;
      };

      // Title
      addTitle(mode === 'FULL' ? 'MASTER EQUIPMENT LEASE AGREEMENT' : 'EQUIPMENT LEASE AGREEMENT');
      
      addText(`Contract ID: ${leaseData.ContractID || 'N/A'} | Date: ${formatDate(leaseData.ContractDate || '')}`);
      y += 5;

      // Schedule
      addSection('Schedule — Key Commercial Terms');
      
      const scheduleData = [
        ['Lessor', `${leaseData.LessorName || 'N/A'}${mode === 'FULL' && leaseData.LessorJurisdiction ? ` (${leaseData.LessorJurisdiction})` : ''}`],
        ['Lessee', `${leaseData.LesseeEntity || 'N/A'}${mode === 'FULL' && leaseData.LesseeJurisdiction ? ` (${leaseData.LesseeJurisdiction})` : ''}`],
        ['Asset', `${leaseData.AssetDescription || 'N/A'}${leaseData.AssetClass ? ` (${leaseData.AssetClass})` : ''}${mode === 'FULL' && leaseData.AssetLocation ? ` at ${leaseData.AssetLocation}` : ''}`],
        ['Commencement', formatDate(leaseData.CommencementDate || '')],
        ['Term (Firm)', `${leaseData.NonCancellableYears || 0} years, ending ${formatDate(leaseData.EndDateOriginal || '')}`],
        ['Rent', `${leaseData.Currency} ${formatCurrency(leaseData.FixedPaymentPerPeriod || 0)} per ${leaseData.PaymentFrequency || 'period'}; payable in ${leaseData.PaymentTiming || 'advance'}`],
        ['Escalation', leaseData.EscalationType || 'None'],
        ['Currency / IBR', `${leaseData.Currency || 'NGN'} / IBR (annual): ${((leaseData.IBR_Annual || 0) * 100).toFixed(1)}%`]
      ];

      if (mode === 'FULL') {
        scheduleData.push(
          ['Options', `Renewal: ${leaseData.RenewalOptionYears || 0} years (likelihood: ${leaseData.RenewalOptionLikelihood || 'N/A'}). Termination: ${leaseData.TerminationOptionPoint || 'N/A'}`],
          ['Prepayments / IDC / Incentives', `${formatCurrency(leaseData.PrepaymentsBeforeCommencement || 0)} / ${formatCurrency(leaseData.InitialDirectCosts || 0)} / ${formatCurrency(leaseData.LeaseIncentives || 0)}`],
          ['Purchase Option / RVG', `${formatCurrency(leaseData.PurchaseOptionPrice || 0)} / ${formatCurrency(leaseData.RVGExpected || 0)}`],
          ['Bank Details', `${leaseData.BankName || 'N/A'} – ${leaseData.BankAccountName || 'N/A'} – ${leaseData.BankAccountNo || 'N/A'}`],
          ['Governing Law / Disputes', `${leaseData.GoverningLaw || 'Laws of the Federal Republic of Nigeria'} / ${leaseData.ArbitrationRules || 'Lagos Court of Arbitration Rules'}`]
        );
      }

      scheduleData.forEach(([label, value]) => {
        addText(`${label}: ${value}`);
      });

      y += 5;

      // Contract sections
      const sections = [
        {
          title: '1. Parties and Definitions',
          content: `This agreement (the "Agreement") is between ${leaseData.LessorName || 'Lessor'} (the "Lessor") and ${leaseData.LesseeEntity || 'Lessee'} (the "Lessee").`
        },
        {
          title: '2. Lease and Title',
          content: `2.1 Lessor leases the equipment described in the Schedule (the "Asset") to Lessee for the Term. Title to the Asset remains with Lessor at all times.\n\n2.2 No right, title or interest passes to Lessee other than the leasehold interest. The Asset is a chattel separate from any site.`
        },
        {
          title: '3. Delivery, Commissioning and Acceptance',
          content: `3.1 Delivery and commissioning shall occur${mode === 'FULL' && leaseData.AssetLocation ? ` at ${leaseData.AssetLocation}` : ''} by ${formatDate(leaseData.CommencementDate || '')} (or as otherwise agreed).\n\n3.2 Risk Transfer: Risk passes upon Signing of Acceptance Certificate; title remains with Lessor.\n\n3.3 Acceptance: Upon successful commissioning and Lessee's execution of the Acceptance Certificate, the Asset is deemed accepted.`
        },
        {
          title: '4. Rent; Payment Mechanics; Escalation',
          content: `4.1 Lessee shall pay rent of ${leaseData.Currency} ${formatCurrency(leaseData.FixedPaymentPerPeriod || 0)} per ${leaseData.PaymentFrequency || 'period'} in ${leaseData.PaymentTiming || 'advance'} without set-off or counterclaim.\n\n4.2 Late amounts accrue default interest at the maximum rate permitted by law.\n\n4.3 Escalation: ${leaseData.EscalationType === 'CPI' ? `Rent is adjusted by reference to CPI (Base ${leaseData.BaseCPI || 0})` : leaseData.EscalationType === 'Fixed%' ? `Fixed escalation of ${((leaseData.FixedEscalationPct || 0) * 100).toFixed(1)}% annually` : 'No escalation applies'}.`
        },
        {
          title: '5. Taxes; Withholding; Gross-Up',
          content: 'All amounts are exclusive of taxes. If Lessee is required by law to withhold or deduct taxes from a payment, Lessee shall gross-up so that Lessor receives the amount it would have received absent such withholding, except for taxes on Lessor\'s net income.'
        },
        {
          title: '6. Use; Maintenance; Relocation',
          content: '6.1 Lessee shall use the Asset solely for lawful business purposes and keep it in good working order per manufacturer specs.\n\n6.2 No relocation without Lessor consent.\n\n6.3 Embedded software is licensed on a non-exclusive, non-transferable, term-limited basis.'
        },
        {
          title: '7. Insurance',
          content: `Lessee shall insure the Asset for${mode === 'FULL' && leaseData.InsuranceSumInsured ? ` not less than ${formatCurrency(leaseData.InsuranceSumInsured)}` : ' replacement value'} and maintain${mode === 'FULL' && leaseData.InsuranceTPLimit ? ` third-party liability of at least ${formatCurrency(leaseData.InsuranceTPLimit)}` : ' adequate third-party liability coverage'} with a reputable insurer${mode === 'FULL' && leaseData.InsurerRatingMin ? ` rated at least "${leaseData.InsurerRatingMin}"` : ''}.`
        },
        {
          title: '8. Compliance Undertakings',
          content: 'Lessee shall comply with applicable law, maintain anti-bribery and sanctions controls, and operate the Asset in line with ESG requirements.'
        },
        {
          title: '9. Events of Default; Remedies',
          content: 'Events include non-payment, breach, insolvency, unlawful use, failure to insure, or unauthorised relocation. On default, Lessor may terminate, demand payment, repossess, and claim damages.'
        },
        {
          title: '10. Risk; Loss and Damage',
          content: 'From risk transfer, Lessee bears risk of loss or damage (except Lessor\'s wilful misconduct). Insurance proceeds are applied to repair or settlement.'
        },
        {
          title: '11. Assignment and Sub-leasing',
          content: 'Lessee may not assign or sub-lease without consent. Lessor may assign or finance rights with notice.'
        }
      ];

      if (mode === 'FULL') {
        sections.push(
          {
            title: '12. Data; Metering; Audit Rights',
            content: 'Where the Asset generates data, Lessee grants Lessor access for maintenance and billing. Lessee shall permit reasonable audits upon notice.'
          }
        );
      }

      sections.push(
        {
          title: `${mode === 'FULL' ? '13' : '12'}. Force Majeure`,
          content: 'Neither Party is liable for failure or delay caused by events beyond its control, provided mitigation efforts are made.'
        },
        {
          title: `${mode === 'FULL' ? '14' : '13'}. Dispute Resolution; Governing Law`,
          content: `Disputes are referred to arbitration under ${mode === 'FULL' && leaseData.ArbitrationRules ? leaseData.ArbitrationRules : 'applicable rules'}. This Agreement is governed by ${mode === 'FULL' && leaseData.GoverningLaw ? leaseData.GoverningLaw : 'the laws of the relevant jurisdiction'}.`
        },
        {
          title: `${mode === 'FULL' ? '15' : '14'}. Notices`,
          content: 'Notices shall be delivered to addresses in the Schedule. Email may be used for operational communications.'
        },
        {
          title: `${mode === 'FULL' ? '16' : '15'}. Entire Agreement; Variation; Severability`,
          content: 'This Agreement is the entire agreement. Amendments must be in writing signed by both Parties. Invalid provisions do not affect the remainder.'
        },
        {
          title: `${mode === 'FULL' ? '17' : '16'}. Signatures`,
          content: `Lessor: ${leaseData.LessorName || 'N/A'}\nBy: ____________________\nName: ____________________\nTitle: Director\nDate: ${formatDate(leaseData.ContractDate || '')}\n\nLessee: ${leaseData.LesseeEntity || 'N/A'}\nBy: ____________________\nName: ____________________\nTitle: Authorized Signatory\nDate: ${formatDate(leaseData.ContractDate || '')}`
        }
      );

      sections.forEach(section => {
        addSection(section.title);
        addText(section.content);
        y += 3;
      });

      if (mode === 'FULL') {
        // Add schedules for full mode
        const additionalSchedules = [
          {
            title: 'Schedule 4 — Acceptance Certificate (Template)',
            content: `Contract ID: ${leaseData.ContractID || 'N/A'} | Asset: ${leaseData.AssetDescription || 'N/A'} | Site: ${leaseData.AssetLocation || 'N/A'}\nCommissioning completed on: _____________. Lessee confirms the Asset has been installed, tested and is operational in accordance with specifications.\nSigned for Lessee: ____________________ Date: __________`
          },
          {
            title: 'Schedule 5 — ESG & Compliance Undertakings',
            content: '1. Operate the Asset in accordance with applicable environmental, health and safety laws.\n2. Promptly notify Lessor of any material environmental incident.\n3. Maintain policies addressing anti-bribery/anti-corruption, sanctions, and AML/CFT.'
          },
          {
            title: 'Schedule 6 — Purchase Option / Residual Value Guarantee',
            content: `Purchase Option Price: ${formatCurrency(leaseData.PurchaseOptionPrice || 0)}. RVG (if any) applies as per Schedule 1.`
          },
          {
            title: 'Schedule 7 — Insurance Details',
            content: `Sum Insured: ${formatCurrency(leaseData.InsuranceSumInsured || 200000000)}; TPL: ${formatCurrency(leaseData.InsuranceTPLimit || 50000000)}; Insurer minimum rating: ${leaseData.InsurerRatingMin || 'A'}. Lessor named as loss payee and additional insured where applicable.`
          }
        ];

        additionalSchedules.forEach(schedule => {
          addSection(schedule.title);
          addText(schedule.content);
          y += 3;
        });
      }

      // Footer
      y += 10;
      addText('This is a system-generated contract preview. Final execution requires legal review and party signatures.', 9);

      // Save the PDF
      pdf.save(`${leaseData.ContractID || 'lease-contract'}-${mode.toLowerCase()}.pdf`);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}