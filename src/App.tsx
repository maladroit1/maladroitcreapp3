import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ChevronDown,
  ChevronRight,
  Download,
  Save,
  FileText,
  DollarSign,
  Building,
  Home,
  ShoppingCart,
  Briefcase,
} from "lucide-react";

// Type definitions
interface PropertyType {
  name: string;
  icon: React.FC<{ className?: string }>;
  color: string;
}

interface CashFlowData {
  year: number;
  rent: number;
  expenses: number;
  noi: number;
  debtService: number;
  cashFlow: number;
  cumulativeCashFlow: number;
  grossRevenue?: number;
  operatingExpenses?: number;
  salePrice?: number;
  exitProceeds?: number;
}

export default function App() {
  // Property Types
  const propertyTypes: Record<string, PropertyType> = {
    office: { name: "Office", icon: Briefcase, color: "bg-blue-500" },
    retail: { name: "Retail", icon: ShoppingCart, color: "bg-green-500" },
    apartment: { name: "Apartment", icon: Building, color: "bg-purple-500" },
    forSale: { name: "For-Sale", icon: Home, color: "bg-orange-500" },
  };

  // Initial State
  const [propertyType, setPropertyType] = useState("office");
  const [projectName, setProjectName] = useState("New Development Project");
  const [mode, setMode] = useState("simple"); // simple or detailed

  // Land & Site
  const [landCost, setLandCost] = useState(5000000);
  const [siteAreaAcres, setSiteAreaAcres] = useState(1); // in acres
  const [buildingGFA, setBuildingGFA] = useState(50000);
  const [parkingRatio, setParkingRatio] = useState(2.5); // per 1000 SF
  const [includeParking, setIncludeParking] = useState(true);

  // Construction Costs
  const [hardCosts, setHardCosts] = useState({
    coreShell: 200,
    tenantImprovements: 50,
    siteWork: 500000,
    parkingSurface: 5000,
    parkingStructured: 25000,
    landscaping: 10,
    contingency: 5,
  });

  const [softCosts, setSoftCosts] = useState({
    architectureEngineering: 6,
    permitsImpactFees: 15,
    legalAccounting: 150000,
    propertyTaxConstruction: 1.2,
    insuranceConstruction: 0.5,
    marketingLeasing: 250000,
    constructionMgmtFee: 3,
    developerFee: 4,
  });

  // Development Timeline
  const [timeline, setTimeline] = useState({
    preDevelopment: 6,
    construction: 24,
    leaseUp: 12,
  });

  // Financing
  const [constructionLoan, setConstructionLoan] = useState({
    ltc: 65,
    rate: 8.5,
    originationFee: 1,
    term: 24,
  });

  const [permanentLoan, setPermanentLoan] = useState({
    ltv: 70,
    rate: 6.5,
    amortization: 30,
    term: 10,
    ioPeriod: 0,
  });

  // Equity Structure
  const [equityStructure, setEquityStructure] = useState({
    lpEquity: 90,
    gpEquity: 10,
    preferredReturn: 8,
  });

  // Waterfall Tiers
  const [waterfallTiers, setWaterfallTiers] = useState([
    { minIRR: 0, maxIRR: 8, lpShare: 90, gpShare: 10 },
    { minIRR: 8, maxIRR: 12, lpShare: 80, gpShare: 20 },
    { minIRR: 12, maxIRR: 15, lpShare: 70, gpShare: 30 },
    { minIRR: 15, maxIRR: 100, lpShare: 60, gpShare: 40 },
  ]);

  // Operating Assumptions
  const [operatingAssumptions, setOperatingAssumptions] = useState({
    rentPSF: propertyType === "apartment" ? 2.5 : 35,
    vacancy: 5,
    opex: propertyType === "apartment" ? 6000 : 8,
    capRate: 6.5,
    rentGrowth: 3,
    expenseGrowth: 2.5,
    holdPeriod: 10,
  });

  // Apartment Specific
  const [unitMix, setUnitMix] = useState([
    { type: "Studio", units: 10, size: 500, rent: 1500 },
    { type: "1BR", units: 30, size: 750, rent: 2000 },
    { type: "2BR", units: 20, size: 1100, rent: 2800 },
    { type: "3BR", units: 5, size: 1400, rent: 3500 },
  ]);

  // For-Sale Specific
  const [salesAssumptions, setSalesAssumptions] = useState({
    avgPricePerUnit: 750000,
    salesPace: 5, // units per month
    priceEscalation: 4,
    salesCommission: 5,
    marketingCost: 2,
  });

  // Office & Retail Specific
  const [tenants, setTenants] = useState([
    {
      name: "Anchor Tenant",
      sf: 20000,
      rentPSF: 35,
      term: 10,
      freeRent: 6,
      tiPSF: 50,
    },
    {
      name: "Tenant 2",
      sf: 10000,
      rentPSF: 38,
      term: 7,
      freeRent: 3,
      tiPSF: 40,
    },
    {
      name: "Tenant 3",
      sf: 8000,
      rentPSF: 40,
      term: 5,
      freeRent: 2,
      tiPSF: 35,
    },
  ]);

  const [leasingAssumptions, setLeasingAssumptions] = useState({
    brokerCommission: 6, // % of total lease value
    renewalProbability: 75,
    marketLeaseUpMonths: 6,
    annualEscalations: 3,
  });

  // Sync construction loan term with timeline
  useEffect(() => {
    setConstructionLoan((prev) => ({ ...prev, term: timeline.construction }));
  }, [timeline.construction]);

  // Expanded sections state
  const [expandedSections, setExpandedSections] = useState({
    land: true,
    construction: true,
    financing: true,
    equity: true,
    operations: true,
    analysis: true,
    unitMix: true,
    salesAssumptions: true,
    rentRoll: true,
    retailFeatures: true,
    officeFeatures: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format number with commas
  const formatNumber = (value: number | null | undefined) => {
    if (!value && value !== 0) return "";
    return new Intl.NumberFormat("en-US").format(value);
  };

  // Parse formatted number
  const parseFormattedNumber = (value: string | number) => {
    return Number(value.toString().replace(/,/g, ""));
  };

  // Handle formatted input
  const handleFormattedInput = (
    value: string,
    setter: (value: number) => void
  ) => {
    const parsed = parseFormattedNumber(value);
    if (!isNaN(parsed)) {
      setter(parsed);
    }
  };

  // Calculate Total Development Cost
  const calculateTotalCost = useMemo(() => {
    const siteAreaSF = siteAreaAcres * 43560; // Convert acres to SF
    const parkingSpaces = includeParking
      ? Math.round((buildingGFA / 1000) * parkingRatio)
      : 0;

    const hardCostTotal =
      (hardCosts.coreShell + hardCosts.tenantImprovements) * buildingGFA +
      hardCosts.siteWork +
      parkingSpaces * hardCosts.parkingSurface +
      hardCosts.landscaping * siteAreaSF;

    const hardCostWithContingency =
      hardCostTotal * (1 + hardCosts.contingency / 100);

    const softCostTotal =
      (hardCostWithContingency * softCosts.architectureEngineering) / 100 +
      buildingGFA * softCosts.permitsImpactFees +
      softCosts.legalAccounting +
      (landCost * softCosts.propertyTaxConstruction) / 100 +
      (hardCostWithContingency * softCosts.insuranceConstruction) / 100 +
      softCosts.marketingLeasing +
      (hardCostWithContingency * softCosts.constructionMgmtFee) / 100;

    const totalBeforeDeveloperFee =
      landCost + hardCostWithContingency + softCostTotal;
    const developerFee =
      (totalBeforeDeveloperFee * softCosts.developerFee) / 100;

    return {
      hardCost: hardCostWithContingency,
      softCost: softCostTotal,
      developerFee: developerFee,
      total: totalBeforeDeveloperFee + developerFee,
      parkingSpaces: parkingSpaces,
      siteAreaSF: siteAreaSF,
    };
  }, [
    landCost,
    hardCosts,
    softCosts,
    buildingGFA,
    parkingRatio,
    siteAreaAcres,
    includeParking,
  ]);

  // Calculate Financing
  const calculateFinancing = useMemo(() => {
    const constructionLoanAmount =
      (calculateTotalCost.total * constructionLoan.ltc) / 100;
    const constructionInterest =
      ((constructionLoanAmount * constructionLoan.rate) / 100) *
      (constructionLoan.term / 12) *
      0.6; // 60% average outstanding
    const loanFees =
      (constructionLoanAmount * constructionLoan.originationFee) / 100;

    const totalProjectCost =
      calculateTotalCost.total + constructionInterest + loanFees;
    const equityRequired = totalProjectCost - constructionLoanAmount;

    return {
      constructionLoanAmount,
      constructionInterest,
      loanFees,
      totalProjectCost,
      equityRequired,
      lpEquity: (equityRequired * equityStructure.lpEquity) / 100,
      gpEquity: (equityRequired * equityStructure.gpEquity) / 100,
    };
  }, [calculateTotalCost, constructionLoan, equityStructure]);

  // Calculate NOI and Cash Flows
  const calculateCashFlows = useMemo(() => {
    const cashFlows: CashFlowData[] = [];
    let currentRent = operatingAssumptions.rentPSF;
    let currentExpenses = operatingAssumptions.opex;

    // Calculate stabilized Year 1 NOI for financing
    const year1EffectiveRent =
      currentRent * (1 - operatingAssumptions.vacancy / 100);
    const year1GrossRevenue =
      year1EffectiveRent *
      buildingGFA *
      (propertyType === "apartment" ? 12 : 1);
    const year1OperatingExpenses =
      currentExpenses *
      (propertyType === "apartment"
        ? unitMix.reduce((sum, u) => sum + u.units, 0)
        : buildingGFA);
    const year1NOI = year1GrossRevenue - year1OperatingExpenses;

    // Calculate permanent loan based on stabilized NOI and cap rate
    const stabilizedValue = year1NOI / (operatingAssumptions.capRate / 100);
    const permanentLoanAmount = (stabilizedValue * permanentLoan.ltv) / 100;

    // Year 0 - Investment
    cashFlows.push({
      year: 0,
      rent: 0,
      expenses: 0,
      noi: 0,
      debtService: 0,
      cashFlow: -calculateFinancing.equityRequired,
      cumulativeCashFlow: -calculateFinancing.equityRequired,
    });

    // Operating Years
    for (let year = 1; year <= operatingAssumptions.holdPeriod; year++) {
      const effectiveRent =
        currentRent * (1 - operatingAssumptions.vacancy / 100);
      const grossRevenue =
        effectiveRent * buildingGFA * (propertyType === "apartment" ? 12 : 1);
      const operatingExpenses =
        currentExpenses *
        (propertyType === "apartment"
          ? unitMix.reduce((sum, u) => sum + u.units, 0)
          : buildingGFA);
      const noi = grossRevenue - operatingExpenses;

      // Calculate debt service
      const rate = permanentLoan.rate / 100;
      const annualDebtService =
        year <= permanentLoan.ioPeriod
          ? permanentLoanAmount * rate
          : permanentLoanAmount *
            (rate / (1 - Math.pow(1 + rate, -permanentLoan.amortization)));

      const cashFlow = noi - annualDebtService;

      cashFlows.push({
        year,
        rent: currentRent,
        expenses: currentExpenses,
        grossRevenue,
        operatingExpenses,
        noi,
        debtService: annualDebtService,
        cashFlow,
        cumulativeCashFlow:
          (cashFlows[year - 1]?.cumulativeCashFlow || 0) + cashFlow,
      });

      // Apply growth rates
      currentRent *= 1 + operatingAssumptions.rentGrowth / 100;
      currentExpenses *= 1 + operatingAssumptions.expenseGrowth / 100;
    }

    // Exit Year
    const exitNOI = cashFlows[operatingAssumptions.holdPeriod].noi;
    const salePrice = exitNOI / (operatingAssumptions.capRate / 100);
    const exitCosts = salePrice * 0.02; // 2% transaction costs

    // Calculate remaining loan balance
    const yearsAmortized = Math.max(
      0,
      operatingAssumptions.holdPeriod - permanentLoan.ioPeriod
    );
    const remainingBalance =
      yearsAmortized > 0
        ? permanentLoanAmount *
          (1 -
            (Math.pow(1 + permanentLoan.rate / 100, yearsAmortized) - 1) /
              (Math.pow(
                1 + permanentLoan.rate / 100,
                permanentLoan.amortization
              ) -
                1))
        : permanentLoanAmount;

    const exitProceeds = salePrice - exitCosts - remainingBalance;

    cashFlows[operatingAssumptions.holdPeriod].cashFlow += exitProceeds;
    cashFlows[operatingAssumptions.holdPeriod].salePrice = salePrice;
    cashFlows[operatingAssumptions.holdPeriod].exitProceeds = exitProceeds;

    return { cashFlows, permanentLoanAmount, year1NOI };
  }, [
    calculateFinancing,
    operatingAssumptions,
    buildingGFA,
    propertyType,
    permanentLoan,
    unitMix,
  ]);

  // Calculate Returns with Waterfall
  const calculateReturns = useMemo(() => {
    if (
      !calculateCashFlows ||
      !calculateCashFlows.cashFlows ||
      calculateCashFlows.cashFlows.length === 0
    ) {
      return {
        irr: "0.00",
        equityMultiple: "0.00",
        totalReturn: 0,
        lpReturn: 0,
        gpReturn: 0,
        lpIRR: "0.00",
        gpIRR: "0.00",
      };
    }

    const { cashFlows } = calculateCashFlows;
    const cashFlowArray = cashFlows.map((cf) => cf.cashFlow);

    // Calculate IRR using Newton's method approximation
    let irr = 0.1; // Initial guess
    for (let i = 0; i < 100; i++) {
      let npv = 0;
      let dnpv = 0;

      for (let j = 0; j < cashFlowArray.length; j++) {
        npv += cashFlowArray[j] / Math.pow(1 + irr, j);
        dnpv -= (j * cashFlowArray[j]) / Math.pow(1 + irr, j + 1);
      }

      if (dnpv === 0) break;
      const newIrr = irr - npv / dnpv;
      if (Math.abs(newIrr - irr) < 0.0001) break;
      irr = newIrr;
    }

    irr = irr * 100; // Convert to percentage

    // Calculate equity multiple
    const totalDistributions = cashFlowArray
      .slice(1)
      .reduce((sum, cf) => sum + Math.max(0, cf), 0);
    const initialEquity = Math.abs(cashFlowArray[0]);
    const equityMultiple =
      initialEquity > 0 ? totalDistributions / initialEquity : 0;

    // Waterfall distributions
    let remainingCashFlow = totalDistributions;
    const distributions = { lp: 0, gp: 0 };

    // Calculate required returns for each tier
    waterfallTiers.forEach((tier, index) => {
      if (irr >= tier.minIRR && remainingCashFlow > 0) {
        // Calculate the portion of cash flow attributable to this tier
        const tierCashFlow = remainingCashFlow * 0.25; // Simplified - in reality would calculate based on IRR bands
        distributions.lp += (tierCashFlow * tier.lpShare) / 100;
        distributions.gp += (tierCashFlow * tier.gpShare) / 100;
        remainingCashFlow -= tierCashFlow;
      }
    });

    // Calculate individual IRRs (simplified approximation)
    const lpShare = equityStructure.lpEquity / 100;
    const gpShare = equityStructure.gpEquity / 100;
    const lpIRR =
      totalDistributions > 0
        ? (irr * (distributions.lp / totalDistributions)) / lpShare
        : 0;
    const gpIRR =
      totalDistributions > 0
        ? (irr * (distributions.gp / totalDistributions)) / gpShare
        : 0;

    return {
      irr: isFinite(irr) ? irr.toFixed(2) : "0.00",
      equityMultiple: isFinite(equityMultiple)
        ? equityMultiple.toFixed(2)
        : "0.00",
      totalReturn: totalDistributions,
      lpReturn: distributions.lp,
      gpReturn: distributions.gp,
      lpIRR: isFinite(lpIRR) ? lpIRR.toFixed(2) : "0.00",
      gpIRR: isFinite(gpIRR) ? gpIRR.toFixed(2) : "0.00",
    };
  }, [calculateCashFlows, waterfallTiers, equityStructure]);

  // Chart data
  const cashFlowChartData = calculateCashFlows?.cashFlows
    ? calculateCashFlows.cashFlows.map((cf) => ({
        year: `Year ${cf.year}`,
        cashFlow: cf.cashFlow - (cf.exitProceeds || 0), // Show operating cash flow separately
        noi: cf.noi,
      }))
    : [];

  const sourcesUsesData = [
    { name: "Senior Debt", value: calculateFinancing.constructionLoanAmount },
    { name: "LP Equity", value: calculateFinancing.lpEquity },
    { name: "GP Equity", value: calculateFinancing.gpEquity },
  ];

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B"];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
              />
              <p className="text-gray-600 mt-2">
                Advanced Real Estate Development Pro Forma
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
                <Save size={20} />
                Save
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2">
                <Download size={20} />
                Export Excel
              </button>
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2">
                <FileText size={20} />
                Generate PDF
              </button>
            </div>
          </div>

          {/* Property Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type
            </label>
            <div className="grid grid-cols-4 gap-4">
              {(
                Object.keys(propertyTypes) as Array<keyof typeof propertyTypes>
              ).map((key) => {
                const type = propertyTypes[key];
                const Icon = type.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setPropertyType(key)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      propertyType === key
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <Icon
                      className={`w-8 h-8 mx-auto mb-2 ${
                        propertyType === key ? "text-blue-500" : "text-gray-500"
                      }`}
                    />
                    <p
                      className={`font-medium ${
                        propertyType === key ? "text-blue-900" : "text-gray-700"
                      }`}
                    >
                      {type.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="mt-4 flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Input Mode:
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setMode("simple")}
                className={`px-4 py-2 rounded-lg ${
                  mode === "simple"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Simple
              </button>
              <button
                onClick={() => setMode("detailed")}
                className={`px-4 py-2 rounded-lg ${
                  mode === "detailed"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Detailed
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Land & Site Section */}
            <div className="bg-white rounded-lg shadow-sm">
              <button
                onClick={() => toggleSection("land")}
                className="w-full p-4 flex justify-between items-center hover:bg-gray-50"
              >
                <h2 className="text-xl font-semibold">Land & Site</h2>
                {expandedSections.land ? <ChevronDown /> : <ChevronRight />}
              </button>
              {expandedSections.land && (
                <div className="p-4 border-t space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Land Cost
                      </label>
                      <input
                        type="text"
                        value={formatNumber(landCost)}
                        onChange={(e) =>
                          handleFormattedInput(e.target.value, setLandCost)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Site Area (Acres)
                      </label>
                      <input
                        type="number"
                        value={siteAreaAcres}
                        onChange={(e) =>
                          setSiteAreaAcres(Number(e.target.value))
                        }
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Building GFA (SF)
                      </label>
                      <input
                        type="text"
                        value={formatNumber(buildingGFA)}
                        onChange={(e) =>
                          handleFormattedInput(e.target.value, setBuildingGFA)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <input
                          type="checkbox"
                          checked={includeParking}
                          onChange={(e) => setIncludeParking(e.target.checked)}
                          className="mr-2"
                        />
                        Parking Ratio (per 1,000 SF)
                      </label>
                      <input
                        type="number"
                        value={parkingRatio}
                        onChange={(e) =>
                          setParkingRatio(Number(e.target.value))
                        }
                        disabled={!includeParking}
                        step="0.1"
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          !includeParking ? "bg-gray-100" : ""
                        }`}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">FAR</p>
                      <p className="text-lg font-semibold">
                        {(buildingGFA / (siteAreaAcres * 43560)).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Land $/SF</p>
                      <p className="text-lg font-semibold">
                        ${(landCost / buildingGFA).toFixed(0)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Parking</p>
                      <p className="text-lg font-semibold">
                        {includeParking
                          ? calculateTotalCost.parkingSpaces
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Construction Costs Section */}
            <div className="bg-white rounded-lg shadow-sm">
              <button
                onClick={() => toggleSection("construction")}
                className="w-full p-4 flex justify-between items-center hover:bg-gray-50"
              >
                <h2 className="text-xl font-semibold">Construction Costs</h2>
                {expandedSections.construction ? (
                  <ChevronDown />
                ) : (
                  <ChevronRight />
                )}
              </button>
              {expandedSections.construction && (
                <div className="p-4 border-t space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">
                      Hard Costs
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Core & Shell ($/SF)
                        </label>
                        <input
                          type="number"
                          value={hardCosts.coreShell}
                          onChange={(e) =>
                            setHardCosts({
                              ...hardCosts,
                              coreShell: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          TI Allowance ($/SF)
                        </label>
                        <input
                          type="number"
                          value={hardCosts.tenantImprovements}
                          onChange={(e) =>
                            setHardCosts({
                              ...hardCosts,
                              tenantImprovements: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Site Work
                        </label>
                        <input
                          type="text"
                          value={formatNumber(hardCosts.siteWork)}
                          onChange={(e) => {
                            const parsed = parseFormattedNumber(e.target.value);
                            if (!isNaN(parsed)) {
                              setHardCosts({ ...hardCosts, siteWork: parsed });
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contingency (%)
                        </label>
                        <input
                          type="number"
                          value={hardCosts.contingency}
                          onChange={(e) =>
                            setHardCosts({
                              ...hardCosts,
                              contingency: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {mode === "detailed" && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">
                        Soft Costs
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            A&E (% of Hard)
                          </label>
                          <input
                            type="number"
                            value={softCosts.architectureEngineering}
                            onChange={(e) =>
                              setSoftCosts({
                                ...softCosts,
                                architectureEngineering: Number(e.target.value),
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Developer Fee (%)
                          </label>
                          <input
                            type="number"
                            value={softCosts.developerFee}
                            onChange={(e) =>
                              setSoftCosts({
                                ...softCosts,
                                developerFee: Number(e.target.value),
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Financing Section */}
            <div className="bg-white rounded-lg shadow-sm">
              <button
                onClick={() => toggleSection("financing")}
                className="w-full p-4 flex justify-between items-center hover:bg-gray-50"
              >
                <h2 className="text-xl font-semibold">Financing Structure</h2>
                {expandedSections.financing ? (
                  <ChevronDown />
                ) : (
                  <ChevronRight />
                )}
              </button>
              {expandedSections.financing && (
                <div className="p-4 border-t space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">
                      Construction Loan
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          LTC (%)
                        </label>
                        <input
                          type="number"
                          value={constructionLoan.ltc}
                          onChange={(e) =>
                            setConstructionLoan({
                              ...constructionLoan,
                              ltc: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Interest Rate (%)
                        </label>
                        <input
                          type="number"
                          value={constructionLoan.rate}
                          onChange={(e) =>
                            setConstructionLoan({
                              ...constructionLoan,
                              rate: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">
                      Permanent Financing
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          LTV (%)
                        </label>
                        <input
                          type="number"
                          value={permanentLoan.ltv}
                          onChange={(e) =>
                            setPermanentLoan({
                              ...permanentLoan,
                              ltv: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Interest Rate (%)
                        </label>
                        <input
                          type="number"
                          value={permanentLoan.rate}
                          onChange={(e) =>
                            setPermanentLoan({
                              ...permanentLoan,
                              rate: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Year 1 DSCR</p>
                      <p className="text-lg font-semibold text-blue-600">
                        {calculateCashFlows?.year1NOI &&
                        calculateCashFlows?.permanentLoanAmount &&
                        permanentLoan.rate > 0
                          ? (
                              calculateCashFlows.year1NOI /
                              ((calculateCashFlows.permanentLoanAmount *
                                permanentLoan.rate) /
                                100)
                            ).toFixed(2)
                          : "N/A"}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Refi Proceeds</p>
                      <p className="text-lg font-semibold text-green-600">
                        {calculateCashFlows?.permanentLoanAmount &&
                        calculateFinancing?.constructionLoanAmount &&
                        calculateCashFlows.permanentLoanAmount >
                          calculateFinancing.constructionLoanAmount
                          ? formatCurrency(
                              calculateCashFlows.permanentLoanAmount -
                                calculateFinancing.constructionLoanAmount
                            )
                          : "$0"}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600">Debt Yield</p>
                      <p className="text-lg font-semibold text-purple-600">
                        {calculateCashFlows?.year1NOI &&
                        calculateCashFlows?.permanentLoanAmount &&
                        calculateCashFlows.permanentLoanAmount > 0
                          ? (
                              (calculateCashFlows.year1NOI /
                                calculateCashFlows.permanentLoanAmount) *
                              100
                            ).toFixed(1) + "%"
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Operating Assumptions */}
            <div className="bg-white rounded-lg shadow-sm">
              <button
                onClick={() => toggleSection("operations")}
                className="w-full p-4 flex justify-between items-center hover:bg-gray-50"
              >
                <h2 className="text-xl font-semibold">Operating Assumptions</h2>
                {expandedSections.operations ? (
                  <ChevronDown />
                ) : (
                  <ChevronRight />
                )}
              </button>
              {expandedSections.operations && (
                <div className="p-4 border-t space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {propertyType === "apartment"
                          ? "Monthly Rent/SF"
                          : "Annual Rent/SF"}
                      </label>
                      <input
                        type="number"
                        value={operatingAssumptions.rentPSF}
                        onChange={(e) =>
                          setOperatingAssumptions({
                            ...operatingAssumptions,
                            rentPSF: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vacancy (%)
                      </label>
                      <input
                        type="number"
                        value={operatingAssumptions.vacancy}
                        onChange={(e) =>
                          setOperatingAssumptions({
                            ...operatingAssumptions,
                            vacancy: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {propertyType === "apartment" ? "OpEx/Unit" : "OpEx/SF"}
                      </label>
                      <input
                        type="number"
                        value={operatingAssumptions.opex}
                        onChange={(e) =>
                          setOperatingAssumptions({
                            ...operatingAssumptions,
                            opex: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exit Cap Rate (%)
                      </label>
                      <input
                        type="number"
                        value={operatingAssumptions.capRate}
                        onChange={(e) =>
                          setOperatingAssumptions({
                            ...operatingAssumptions,
                            capRate: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Analysis */}
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">Project IRR</span>
                  <span className="text-xl font-bold text-blue-600">
                    {calculateReturns.irr}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700">Equity Multiple</span>
                  <span className="text-xl font-bold text-green-600">
                    {calculateReturns.equityMultiple}x
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-gray-700">Total Development Cost</span>
                  <span className="text-lg font-bold text-purple-600">
                    {formatCurrency(calculateTotalCost.total)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-gray-700">Equity Required</span>
                  <span className="text-lg font-bold text-orange-600">
                    {formatCurrency(calculateFinancing.equityRequired)}
                  </span>
                </div>
              </div>
            </div>

            {/* Sources & Uses */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Sources & Uses</h2>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourcesUsesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sourcesUsesData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Senior Debt</span>
                  <span className="font-medium">
                    {formatCurrency(calculateFinancing.constructionLoanAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>LP Equity ({equityStructure.lpEquity}%)</span>
                  <span className="font-medium">
                    {formatCurrency(calculateFinancing.lpEquity)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>GP Equity ({equityStructure.gpEquity}%)</span>
                  <span className="font-medium">
                    {formatCurrency(calculateFinancing.gpEquity)}
                  </span>
                </div>
              </div>
            </div>

            {/* Waterfall Returns */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">
                Partnership Returns
              </h2>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">LP Returns</span>
                    <span className="text-sm font-medium">
                      {calculateReturns.lpIRR}% IRR
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">
                      {formatCurrency(calculateReturns.lpReturn)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">
                      GP Returns (incl. promote)
                    </span>
                    <span className="text-sm font-medium">
                      {calculateReturns.gpIRR}% IRR
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">
                      {formatCurrency(calculateReturns.gpReturn)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cash Flow Analysis */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Cash Flow Projection</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                />
                <Legend />
                <Bar dataKey="noi" fill="#10B981" name="NOI" />
                <Bar dataKey="cashFlow" fill="#3B82F6" name="Cash Flow" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
