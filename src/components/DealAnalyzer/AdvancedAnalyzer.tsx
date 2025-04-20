'use client';

import { useState, useEffect } from 'react';
import { calculateMortgage } from '@/lib/mockData';
import { mockFMRData } from '@/lib/mockData';
import { 
type AdvancedAnalyzerProps = {ar, XAxis, YAxis, 
  propertyId: string;tip, Legend, ResponsiveContainer 
  price: number;';
  beds: number;} from 'jspdf';
  zip: string;nvas from 'html2canvas';
  sqft: number;} from 'react-hot-toast';
};
type AdvancedAnalyzerProps = {
export default function AdvancedAnalyzer({ propertyId, price, beds, zip, sqft }: AdvancedAnalyzerProps) {
  // Financial parameters with reasonable defaults
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(7.0);
  const [loanTermYears, setLoanTermYears] = useState(30);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.0);
  const [insuranceCost, setInsuranceCost] = useState(1200);
  const [vacancyRate, setVacancyRate] = useState(5);
  const [maintenancePercent, setMaintenancePercent] = useState(5);
  const [propertyManagementPercent, setPropertyManagementPercent] = useState(8);
  const [section8Premium, setSection8Premium] = useState(0);
  const [annualAppreciation, setAnnualAppreciation] = useState(3);
  const [otherExpenses, setOtherExpenses] = useState(0);
    interestRate: number;
  // ResultsYears: number;
  const [monthlyMortgage, setMonthlyMortgage] = useState(0);
  const [monthlyRent, setMonthlyRent] = useState(0);
  const [cashFlow, setCashFlow] = useState(0);
  const [capRate, setCapRate] = useState(0);
  const [roi, setRoi] = useState(0);r;
  const [dealScore, setDealScore] = useState(0);
    annualAppreciation: number;
  // Fetch FMR data for the property zip code
  useEffect(() => {
    // In production, this would be an API call
    const fmrData = mockFMRData[zip] || { 
      beds_1: 0, ge: number;
      beds_2: 0, ber;
      beds_3: 0, 
      beds_4: 0 ber;
    };alScore: number;
    
    // Select appropriate FMR based on number of bedrooms
    let fmrRent = 0;
    if (beds <= 1) fmrRent = fmrData.beds_1;ropertyId, price, beds, zip, sqft }: AdvancedAnalyzerProps) {
    else if (beds === 2) fmrRent = fmrData.beds_2;
    else if (beds === 3) fmrRent = fmrData.beds_3;] = useState(20);
    else fmrRent = fmrData.beds_4;Rate] = useState(7.0);
    nst [loanTermYears, setLoanTermYears] = useState(30);
    // Apply Section 8 premium if anyTaxRate] = useState(1.0);
    const totalRent = fmrRent * (1 + section8Premium / 100);
    setMonthlyRent(totalRent);cyRate] = useState(5);
  }, [zip, beds, section8Premium]);ntenancePercent] = useState(5);
  const [propertyManagementPercent, setPropertyManagementPercent] = useState(8);
  // Calculate financial metrics whenever inputs changee(0);
  useEffect(() => {eciation, setAnnualAppreciation] = useState(3);
    // Calculate mortgageetOtherExpenses] = useState(0);
    const mortgage = calculateMortgage(price, downPaymentPercent, interestRate, loanTermYears);
    setMonthlyMortgage(mortgage);tates
    nst [activeTab, setActiveTab] = useState('numbers'); // 'numbers', 'charts', 'compliance'
    // Calculate monthly expensesnalyses] = useState<SavedAnalysis[]>([]);
    const propertyTax = (price * (propertyTaxRate / 100)) / 12;
    const insurance = insuranceCost / 12;g] = useState(false);
    const vacancy = (monthlyRent * (vacancyRate / 100));se);
    const maintenance = (monthlyRent * (maintenancePercent / 100));
    const propertyManagement = (monthlyRent * (propertyManagementPercent / 100));
    const other = otherExpenses / 12;
    hasSeparateEntrance: true,
    const totalExpenses = mortgage + propertyTax + insurance + vacancy + maintenance + propertyManagement + other;
    const monthlyCashFlow = monthlyRent - totalExpenses;
    
    // Calculate investment metrics
    const downPayment = price * (downPaymentPercent / 100);;
    const closingCosts = price * 0.03; // Estimated at 3% of purchase price
    const totalInvestment = downPayment + closingCosts;
    const annualCashFlow = monthlyCashFlow * 12;
    const cashOnCashROI = (annualCashFlow / totalInvestment) * 100;
    nst [dealScore, setDealScore] = useState(0);
    // Calculate cap rate
    const annualIncome = monthlyRent * 12;ode
    const annualExpenses = (totalExpenses - mortgage) * 12;
    const netOperatingIncome = annualIncome - annualExpenses;
    const calculatedCapRate = (netOperatingIncome / price) * 100;
      beds_1: 0, 
    // Update state with calculated values
    setCashFlow(monthlyCashFlow);
    setRoi(cashOnCashROI);
    setCapRate(calculatedCapRate);
    
    // Calculate deal score (proprietary algorithm)drooms
    // This is a simplified version - the real one would be more complex
    let score = 0; fmrRent = fmrData.beds_1;
    if (monthlyCashFlow > 0) score += 30 * (monthlyCashFlow / 500); // Up to 30 points for cash flow
    if (cashOnCashROI > 0) score += 30 * (cashOnCashROI / 15); // Up to 30 points for ROI
    if (calculatedCapRate > 0) score += 20 * (calculatedCapRate / 10); // Up to 20 points for cap rate
    
    // Bonus points for high beds/price ratio - Section 8 tends to value more bedrooms
    score += 10 * (beds / 3) * (300000 / price);mium / 100);
    setMonthlyRent(totalRent);
    // Section 8 specific scoring - properties that exceed FMR by little get bonus points
    if (section8Premium <= 5) score += 10;
     Calculate financial metrics whenever inputs change
    // Cap the score at 100
    score = Math.min(Math.round(score), 100);
    const mortgage = calculateMortgage(price, downPaymentPercent, interestRate, loanTermYears);
    setDealScore(score);ortgage);
    
  }, [ Calculate monthly expenses
    price, beds, zip, monthlyRent, downPaymentPercent, interestRate, loanTermYears,
    propertyTaxRate, insuranceCost, vacancyRate, maintenancePercent, propertyManagementPercent,
    section8Premium, annualAppreciation, otherExpenses);
  ]);onst maintenance = (monthlyRent * (maintenancePercent / 100));
    const propertyManagement = (monthlyRent * (propertyManagementPercent / 100));
  // Get color for deal scorees / 12;
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';Tax + insurance + vacancy + maintenance + propertyManagement + other;
    if (score >= 60) return 'text-yellow-500';lExpenses;
    return 'text-red-500';
  };// Calculate investment metrics
    const downPayment = price * (downPaymentPercent / 100);
  // Prepare data for chartsclosingCosts = price * 0.03; // Estimated at 3% of purchase price
  const projectionData = [1, 2, 3, 4, 5].map(year => {
    const futureValue = price * Math.pow(1 + annualAppreciation/100, year);
    const loanPaid = price * (1 - downPaymentPercent/100) * (1 - (year / loanTermYears) * 0.15);nst cashOnCashROI = (annualCashFlow / totalInvestment) * 100;
    const equity = futureValue - loanPaid;
    const annualCF = cashFlow * 12;
    const totalReturn = (equity - (price * downPaymentPercent/100)) + (annualCF * year);
    
    return {netOperatingIncome = annualIncome - annualExpenses;
      year: `Year ${year}`,ratingIncome / price) * 100;
      propertyValue: Math.round(futureValue),
      cashFlow: Math.round(annualCF * year),
      equity: Math.round(equity),hlyCashFlow);
      totalReturn: Math.round(totalReturn)
    };CapRate);
  });
  e (proprietary algorithm)
  // Monthly breakdown for first yearreal one would be more complex
  const monthlyBreakdown = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1; += 30 * (monthlyCashFlow / 500); // Up to 30 points for cash flow
    return {shROI > 0) score += 30 * (cashOnCashROI / 15); // Up to 30 points for ROI
      month: `Month ${month}`,Up to 20 points for cap rate
      mortgage: monthlyMortgage,
      rent: monthlyRent,ore bedrooms
      cashFlow: monthlyRent - monthlyMortgage300000 / price);
    };
  });pecific scoring - properties that exceed FMR by little get bonus points
  ion8Premium <= 5) score += 10;
  // Handle save analysis
  const handleSaveAnalysis = () => {
    if (!analysisName.trim()) {(Math.round(score), 100);
      toast.error('Please enter a name for this analysis');
      return;;
    }
    
    const newAnalysis: SavedAnalysis = {ownPaymentPercent, interestRate, loanTermYears,
      id: Date.now().toString(),ManagementPercent,
      name: analysisName,ation, otherExpenses
      date: new Date(),
      parameters: {
        downPaymentPercent,
        interestRate,
        loanTermYears,t-green-600';
        propertyTaxRate, return 'text-yellow-500';
        insuranceCost,ed-500';
        vacancyRate,
        maintenancePercent,
        propertyManagementPercent,
        section8Premium,g-white rounded-lg shadow-lg p-6 my-6">
        annualAppreciation,ld mb-6 text-gray-800">Advanced Deal Analysis</h2>
        otherExpenses
      },
      results: {ut Parameters */}
        monthlyRent,
        monthlyMortgage,text-gray-700">Financing Parameters</h3>
        cashFlow,
        roi,e="space-y-4">
        capRate,
        dealScore  <label className="block text-sm font-medium text-gray-700">Down Payment (%)</label>
      }put
    };
    "3.5"
    setSavedAnalyses([...savedAnalyses, newAnalysis]);
    setShowSaveDialog(false);.5"
    setAnalysisName('');ownPaymentPercent}
    toast.success('Analysis saved successfully');e) => setDownPaymentPercent(parseFloat(e.target.value))}
  };
  
  // Handle export to PDF
  const handleExportPDF = async () => {<span>3.5%</span>
    try {pan className="font-medium">{downPaymentPercent}%</span>
      setExportLoading(true);    <span>50%</span>
      const element = document.getElementById('analysis-content');iv>
      if (!element) return;
      
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');assName="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;step="0.125"
      const imgHeight = canvas.height;lue={interestRate}
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);onChange={(e) => setInterestRate(parseFloat(e.target.value))}
        className="w-full"
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth * ratio, imgHeight * ratio);      />
      pdf.save(`Section8_Analysis_${propertyId}.pdf`); justify-between text-xs text-gray-500">
      
      toast.success('PDF exported successfully');
    } catch (error) {      <span>12%</span>
      console.error('PDF export failed:', error);
      toast.error('Failed to export PDF');>
    } finally {
      setExportLoading(false);
    }me="block text-sm font-medium text-gray-700">Loan Term (Years)</label>
  };
oanTermYears}
  // Check Section 8 compliance={(e) => setLoanTermYears(parseInt(e.target.value))}
  useEffect(() => {x-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
    // Simple compliance checks based on Section 8 requirements
    setSection8Compliance({>15 years</option>
      isBelowFmr: monthlyRent <= (monthlyRent * 1.1), // Simplified check assuming FMR is our monthlyRent<option value={20}>20 years</option>
      hasEnoughBathrooms: beds <= (baths * 2), // At least 1 bathroom per 2 bedrooms
      hasSeparateEntrance: true, // Default assumption
      meetsHqsStandards: true // Default assumption
    });
  }, [beds, monthlyRent]);
  el className="block text-sm font-medium text-gray-700">Property Tax Rate (%)</label>
  return (  <input
    <div className="bg-white rounded-lg shadow-lg p-6 my-6">ype="number"
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Advanced Deal Analysis</h2>
      "10"
      {/* Tab Navigation */}
      <div className="flex border-b mb-6">propertyTaxRate}
        <button ={(e) => setPropertyTaxRate(parseFloat(e.target.value))}
          onClick={() => setActiveTab('numbers')}e="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          className={`px-4 py-2 font-medium ${activeTab === 'numbers' 
            ? 'text-blue-600 border-b-2 border-blue-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
        >>
          Financial Analysisnnual Insurance Cost ($)</label>
        </button>
        <button 
          onClick={() => setActiveTab('charts')}
          className={`px-4 py-2 font-medium ${activeTab === 'charts' ="100"
            ? 'text-blue-600 border-b-2 border-blue-600' lue={insuranceCost}
            : 'text-gray-500 hover:text-gray-700'}`}    onChange={(e) => setInsuranceCost(parseFloat(e.target.value))}
        >lassName="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          Visualizations
        </button>
        <button 
          onClick={() => setActiveTab('compliance')}
          className={`px-4 py-2 font-medium ${activeTab === 'compliance' 
            ? 'text-blue-600 border-b-2 border-blue-600' penses */}
            : 'text-gray-500 hover:text-gray-700'}`}">
        >
          Section 8 Compliance
        </button>lassName="space-y-4">
      </div>
      "block text-sm font-medium text-gray-700">Vacancy Rate (%)</label>
      <div id="analysis-content">
        {activeTab === 'numbers' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">"0"
            {/* Existing code for input parameters, operating expenses, and results */}x="20"
            <div className="bg-gray-50 p-4 rounded-lg">    step="1"
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Financing Parameters</h3>alue={vacancyRate}
              
              <div className="space-y-4">sName="w-full"
                <div>
                  <label className="block text-sm font-medium text-gray-700">Down Payment (%)</label>sName="flex justify-between text-xs text-gray-500">
                  <input</span>
                    type="range"assName="font-medium">{vacancyRate}%</span>
                    min="3.5"
                    max="50"
                    step="0.5"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(parseFloat(e.target.value))}
                    className="w-full""block text-sm font-medium text-gray-700">Maintenance (%)</label>
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>3.5%</span>"0"
                    <span className="font-medium">{downPaymentPercent}%</span>
                    <span>50%</span>ep="1"
                  </div>    value={maintenancePercent}
                </div>nChange={(e) => setMaintenancePercent(parseFloat(e.target.value))}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>="flex justify-between text-xs text-gray-500">
                  <input%</span>
                    type="range"assName="font-medium">{maintenancePercent}%</span>
                    min="2"/span>
                    max="12"
                    step="0.125"
                    value={interestRate}
                    onChange={(e) => setInterestRate(parseFloat(e.target.value))}>
                    className="w-full"roperty Management (%)</label>
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>2%</span>
                    <span className="font-medium">{interestRate}%</span>"15"
                    <span>12%</span>ep="1"
                  </div>    value={propertyManagementPercent}
                </div>nChange={(e) => setPropertyManagementPercent(parseFloat(e.target.value))}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Loan Term (Years)</label>"flex justify-between text-xs text-gray-500">
                  <select%</span>
                    value={loanTermYears}ssName="font-medium">{propertyManagementPercent}%</span>
                    onChange={(e) => setLoanTermYears(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={15}>15 years</option>
                    <option value={20}>20 years</option>
                    <option value={30}>30 years</option>abel className="block text-sm font-medium text-gray-700">Section 8 Premium (%)</label>
                  </select><input
                </div>        type="range"
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Property Tax Rate (%)</label>
                  <input      value={section8Premium}
                    type="number"ection8Premium(parseFloat(e.target.value))}
                    min="0"
                    max="10"
                    step="0.01"
                    value={propertyTaxRate}pan>0%</span>
                    onChange={(e) => setPropertyTaxRate(parseFloat(e.target.value))}    <span className="font-medium">{section8Premium}%</span>
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div></p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Annual Insurance Cost ($)</label>
                  <input">Annual Appreciation (%)</label>
                    type="number"
                    min="0"
                    step="100"0"
                    value={insuranceCost}x="10"
                    onChange={(e) => setInsuranceCost(parseFloat(e.target.value))}    step="0.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />rget.value))}
                </div>
              </div>
            </div>assName="flex justify-between text-xs text-gray-500">
            pan>0%</span>
            {/* Operating Expenses */}    <span className="font-medium">{annualAppreciation}%</span>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Operating Expenses</h3>
              
              <div className="space-y-4">
                <div><div>
                  <label className="block text-sm font-medium text-gray-700">Vacancy Rate (%)</label>font-medium text-gray-700">Other Monthly Expenses ($)</label>
                  <input
                    type="range"
                    min="0"
                    max="20"="10"
                    step="1"
                    value={vacancyRate}(e.target.value))}
                    onChange={(e) => setVacancyRate(parseFloat(e.target.value))}der-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span className="font-medium">{vacancyRate}%</span>
                    <span>20%</span>Results */}
                  </div>  <div className="bg-gray-50 p-4 rounded-lg">
                </div>g font-semibold mb-4 text-gray-700">Investment Analysis</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Maintenance (%)</label>between items-center border-b pb-2">
                  <input</span>
                    type="range" className="text-lg font-bold text-green-600">${monthlyRent.toFixed(0)}/mo</span>
                    min="0"
                    max="15"
                    step="1"
                    value={maintenancePercent}
                    onChange={(e) => setMaintenancePercent(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">ssName="flex justify-between items-center border-b pb-2">
                    <span>0%</span>/span>
                    <span className="font-medium">{maintenancePercent}%</span>-bold ${cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <span>15%</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Property Management (%)</label>pan className="text-gray-600">Cash on Cash ROI:</span>
                  <inputsName={`text-lg font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    type="range"
                    min="0"
                    max="15"
                    step="1"
                    value={propertyManagementPercent}
                    onChange={(e) => setPropertyManagementPercent(parseFloat(e.target.value))}
                    className="w-full"ssName="text-lg font-bold text-blue-600">{capRate.toFixed(2)}%</span>
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>ssName="mt-8 text-center">
                    <span className="font-medium">{propertyManagementPercent}%</span>className="text-sm uppercase text-gray-500 font-medium">Section 8 Deal Score</h4>
                    <span>15%</span><div className={`text-5xl font-black ${getScoreColor(dealScore)}`}>
                  </div>    {dealScore}
                </div>        </div>
                xt-gray-500">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Section 8 Premium (%)</label>ore >= 60 ? 'Good Investment' :
                  <inputdealScore >= 40 ? 'Average Investment' : 'Poor Investment'}
                    type="range"
                    min="0"
                    max="20"
                    step="1"v>
                    value={section8Premium}v>
                    onChange={(e) => setSection8Premium(parseFloat(e.target.value))}  
                    className="w-full"     {/* 5-Year Projection */}
                  />      <div className="mt-8">
























































































































































































































































































































}  );    </div>      )}        </div>          </div>            </div>              </button>                Save              >                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"                onClick={handleSaveAnalysis}              <button               </button>                Cancel              >                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"                onClick={() => setShowSaveDialog(false)}              <button             <div className="flex justify-end space-x-2">            </div>              />                placeholder="e.g., Baseline Scenario"                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"                onChange={(e) => setAnalysisName(e.target.value)}                value={analysisName}                type="text"              <input              <label className="block text-sm font-medium text-gray-700 mb-1">Analysis Name</label>            <div className="mb-4">            <h3 className="text-xl font-bold mb-4">Save Analysis</h3>          <div className="bg-white p-6 rounded-lg max-w-md w-full">        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">      {showSaveDialog && (      {/* Save Analysis Dialog */}            </div>        </button>          ) : "Export PDF"}            </>              Exporting...              </svg>                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">            <>          {exportLoading ? (        >          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg shadow transition-colors flex items-center"          disabled={exportLoading}          onClick={handleExportPDF}        <button         </button>          Save Analysis        >          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow transition-colors mr-4"          onClick={() => setShowSaveDialog(true)}        <button       <div className="mt-8 flex justify-end">            </div>        )}          </div>            </div>              </ul>                <li>Working refrigerator and stove/oven</li>                <li>Secure doors and windows with proper locks</li>                <li>No major structural issues or safety hazards</li>                <li>Adequate heat source for all living areas</li>                <li>Functioning bathroom and kitchen with hot/cold running water</li>                <li>No peeling or chipping paint (especially in pre-1978 homes)</li>                <li>Smoke detectors on every floor and in every bedroom</li>              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-amber-700">              <h4 className="font-medium text-amber-800">Additional Section 8 Requirements</h4>            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">                        </div>              </div>                </p>                  <strong>Note:</strong> An official Section 8 inspection will be required before final approval. This is a preliminary assessment only.                <p className="text-sm text-blue-800">              <div className="p-4 bg-blue-50">                            </div>                </div>                  </div>                    </span>                      Assumed                    <span className={`px-2 py-1 rounded text-xs font-medium ${section8Compliance.meetsHqsStandards ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>                  <div className="text-right">                  </div>                    <p className="text-sm text-gray-600">Must meet HUD's Housing Quality Standards (HQS)</p>                    <h4 className="font-medium">Housing Quality Standards</h4>                  <div className="flex-grow">                  </div>                    {section8Compliance.meetsHqsStandards ? '✓' : '✗'}                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${section8Compliance.meetsHqsStandards ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>                <div className="flex items-center">              <div className="p-4">                            </div>                </div>                  </div>                    </span>                      Assumed                    <span className={`px-2 py-1 rounded text-xs font-medium ${section8Compliance.hasSeparateEntrance ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>                  <div className="text-right">                  </div>                    <p className="text-sm text-gray-600">Units should have their own private entrance</p>                    <h4 className="font-medium">Separate Entrance</h4>                  <div className="flex-grow">                  </div>                    {section8Compliance.hasSeparateEntrance ? '✓' : '✗'}                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${section8Compliance.hasSeparateEntrance ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>                <div className="flex items-center">              <div className="p-4 border-b">                            </div>                </div>                  </div>                    </span>                      {section8Compliance.hasEnoughBathrooms ? 'Passes' : 'Fails'}                    <span className={`px-2 py-1 rounded text-xs font-medium ${section8Compliance.hasEnoughBathrooms ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>                  <div className="text-right">                  </div>                    <p className="text-sm text-gray-600">Typically requires at least 1 bathroom per 2 bedrooms</p>                    <h4 className="font-medium">Adequate Bathroom Ratio</h4>                  <div className="flex-grow">                  </div>                    {section8Compliance.hasEnoughBathrooms ? '✓' : '✗'}                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${section8Compliance.hasEnoughBathrooms ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>                <div className="flex items-center">              <div className="p-4 border-b">                            </div>                </div>                  </div>                    </span>                      {section8Compliance.isBelowFmr ? 'Passes' : 'Fails'}                    <span className={`px-2 py-1 rounded text-xs font-medium ${section8Compliance.isBelowFmr ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>                  <div className="text-right">                  </div>                    <p className="text-sm text-gray-600">Section 8 typically pays up to FMR, though some programs allow slight increases</p>                    <h4 className="font-medium">Rent Below FMR + Reasonable Adjustment</h4>                  <div className="flex-grow">                  </div>                    {section8Compliance.isBelowFmr ? '✓' : '✗'}                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${section8Compliance.isBelowFmr ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>                <div className="flex items-center">              <div className="p-4 border-b">            <div className="bg-white shadow rounded-lg border border-gray-200">                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Section 8 Compliance Checklist</h3>          <div className="space-y-6">        {activeTab === 'compliance' && (                )}          </div>            </div>              </div>                </div>                  </div>                    <div className="text-sm text-gray-600">Section 8 Deal Score</div>                    <div className={`text-3xl font-bold ${getScoreColor(dealScore)}`}>{dealScore}</div>                  <div>                  </div>                    <div className="text-sm text-gray-600">Cap Rate</div>                    <div className="text-3xl font-bold text-green-700">{capRate.toFixed(2)}%</div>                  <div>                  </div>                    <div className="text-sm text-gray-600">Annual Cash-on-Cash ROI</div>                    <div className="text-3xl font-bold text-blue-700">{roi.toFixed(2)}%</div>                  <div>                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">              <div className="bg-blue-50 p-6 rounded-lg">              <h3 className="text-lg font-semibold mb-4 text-gray-700">Return on Investment</h3>            <div>                        </div>              </div>                </ResponsiveContainer>                  </BarChart>                    <Bar dataKey="cashFlow" fill="#8884d8" name="Cash Flow" />                    <Bar dataKey="mortgage" fill="#ff7300" name="Mortgage Payment" />                    <Bar dataKey="rent" fill="#82ca9d" name="Rent Income" />                    <Legend />                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />                    <YAxis />                    <XAxis dataKey="month" />                    <CartesianGrid strokeDasharray="3 3" />                  >                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}                    data={monthlyBreakdown}                  <BarChart                <ResponsiveContainer width="100%" height="100%">              <div className="h-80">              <h3 className="text-lg font-semibold mb-4 text-gray-700">Monthly Cash Flow (Year 1)</h3>            <div>                        </div>              </div>                </ResponsiveContainer>                  </LineChart>                    <Line type="monotone" dataKey="totalReturn" stroke="#ff7300" name="Total Return" />                    <Line type="monotone" dataKey="equity" stroke="#82ca9d" name="Equity" />                    <Line type="monotone" dataKey="propertyValue" stroke="#8884d8" name="Property Value" />                    <Legend />                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />                    <YAxis />                    <XAxis dataKey="year" />                    <CartesianGrid strokeDasharray="3 3" />                  >                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}                    data={projectionData}                  <LineChart                <ResponsiveContainer width="100%" height="100%">              <div className="h-80">              <h3 className="text-lg font-semibold mb-4 text-gray-700">5-Year Investment Projection</h3>            <div>          <div className="space-y-8">        {activeTab === 'charts' && (                )}          </div>            </div>              </div>                </div>                  </div>                     dealScore >= 40 ? 'Average Investment' : 'Poor Investment'}                     dealScore >= 60 ? 'Good Investment' :                    {dealScore >= 80 ? 'Excellent Investment' :                   <div className="mt-2 text-sm text-gray-500">                  </div>                    {dealScore}                  <div className={`text-5xl font-black ${getScoreColor(dealScore)}`}>                  <h4 className="text-sm uppercase text-gray-500 font-medium">Section 8 Deal Score</h4>                <div className="mt-8 text-center">                                </div>                  <span className="text-lg font-bold text-blue-600">{capRate.toFixed(2)}%</span>                  <span className="text-gray-600">Cap Rate:</span>                <div className="flex justify-between items-center border-b pb-2">                                </div>                  </span>                    {roi.toFixed(2)}%                  <span className={`text-lg font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>                  <span className="text-gray-600">Cash on Cash ROI:</span>                <div className="flex justify-between items-center border-b pb-2">                                </div>                  </span>                    ${cashFlow.toFixed(0)}/mo                  <span className={`text-lg font-bold ${cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>                  <span className="text-gray-600">Monthly Cash Flow:</span>                <div className="flex justify-between items-center border-b pb-2">                                </div>                  <span className="text-lg font-bold text-red-600">${monthlyMortgage.toFixed(0)}/mo</span>                  <span className="text-gray-600">Est. Mortgage (PITI):</span>                <div className="flex justify-between items-center border-b pb-2">                                </div>                  <span className="text-lg font-bold text-green-600">${monthlyRent.toFixed(0)}/mo</span>                  <span className="text-gray-600">Section 8 FMR Rent:</span>                <div className="flex justify-between items-center border-b pb-2">              <div className="space-y-6">                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Investment Analysis</h3>            <div className="bg-gray-50 p-4 rounded-lg">            {/* Results */}                        </div>              </div>                </div>                  />                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"                    onChange={(e) => setOtherExpenses(parseFloat(e.target.value))}                    value={otherExpenses}                    step="10"                    min="0"                    type="number"                  <input                  <label className="block text-sm font-medium text-gray-700">Other Monthly Expenses ($)</label>                <div>                                </div>                  </div>                    <span>10%</span>                    <span className="font-medium">{annualAppreciation}%</span>                    <span>0%</span>                  <div className="flex justify-between text-xs text-gray-500">                  />                    className="w-full"                    onChange={(e) => setAnnualAppreciation(parseFloat(e.target.value))}                    value={annualAppreciation}                    step="0.5"                    max="10"                    min="0"                    type="range"                  <input                  <label className="block text-sm font-medium text-gray-700">Annual Appreciation (%)</label>                <div>                                </div>                  <p className="text-xs text-gray-500 mt-1">Premium above FMR that Section 8 might approve</p>                  </div>                    <span>20%</span>                    <span className="font-medium">{section8Premium}%</span>                    <span>0%</span>                  <div className="flex justify-between text-xs text-gray-500">        <h3 className="text-lg font-semibold mb-4 text-gray-700">5-Year Projection</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property Value</th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Annual Cash Flow</th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equity</th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Return</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map(year => {
                const futureValue = price * Math.pow(1 + annualAppreciation/100, year);
                const loanPaid = price * (1 - downPaymentPercent/100) * (1 - (year / loanTermYears) * 0.15); // Simplified
                const equity = futureValue - loanPaid;
                const annualCF = cashFlow * 12;
                const totalReturn = (equity - (price * downPaymentPercent/100)) + (annualCF * year);
                
                return (
                  <tr key={year}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Year {year}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">${Math.round(futureValue).toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">${Math.round(annualCF * year).toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">${Math.round(equity).toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">${Math.round(totalReturn).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow transition-colors mr-4">
          Save Analysis
        </button>
        <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg shadow transition-colors">
          Export PDF
        </button>
      </div>
    </div>
  );
}
