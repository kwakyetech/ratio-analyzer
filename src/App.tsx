import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, DollarSign, Activity, Settings, Info, Briefcase } from 'lucide-react';

function App() {
  // Input State
  const [inputs, setInputs] = useState({
    revenue: 100000,
    cogs: 40000,
    netIncome: 20000,
    totalAssets: 50000,
    currentAssets: 30000,
    inventory: 5000,
    currentLiabilities: 15000
  });

  const [activeTab, setActiveTab] = useState<'liquidity' | 'profitability' | 'efficiency'>('liquidity');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  // Calculations
  const ratios = useMemo(() => {
    // Liquidity
    const currentRatio = inputs.currentLiabilities ? inputs.currentAssets / inputs.currentLiabilities : 0;
    const quickRatio = inputs.currentLiabilities ? (inputs.currentAssets - inputs.inventory) / inputs.currentLiabilities : 0;

    // Profitability
    const grossProfit = inputs.revenue - inputs.cogs;
    const grossMargin = inputs.revenue ? (grossProfit / inputs.revenue) * 100 : 0;
    const netMargin = inputs.revenue ? (inputs.netIncome / inputs.revenue) * 100 : 0;
    const roa = inputs.totalAssets ? (inputs.netIncome / inputs.totalAssets) * 100 : 0;

    // Efficiency
    const assetTurnover = inputs.totalAssets ? inputs.revenue / inputs.totalAssets : 0;
    const inventoryTurnover = inputs.inventory ? inputs.cogs / inputs.inventory : 0;

    return {
      currentRatio,
      quickRatio,
      grossProfit,
      grossMargin,
      netMargin,
      roa,
      assetTurnover,
      inventoryTurnover
    };
  }, [inputs]);

  // Chart Data
  const liquidityData = [
    { name: 'Current Ratio', value: ratios.currentRatio, fill: '#4CAF50' },
    { name: 'Quick Ratio', value: ratios.quickRatio, fill: '#2196F3' },
  ];

  const efficiencyData = [
    { name: 'Asset Turnover', value: ratios.assetTurnover, fill: '#FF9800' },
    { name: 'Inv. Turnover', value: ratios.inventoryTurnover, fill: '#FF5722' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto hidden md:block">
        <div className="p-6">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-indigo-600">
            <Activity className="w-6 h-6" />
            Ratio Analyzer
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Profitability Inputs</h3>
              <div className="space-y-3">
                <InputGroup label="Revenue (₵)" name="revenue" value={inputs.revenue} onChange={handleInputChange} />
                <InputGroup label="COGS (₵)" name="cogs" value={inputs.cogs} onChange={handleInputChange} />
                <InputGroup label="Net Income (₵)" name="netIncome" value={inputs.netIncome} onChange={handleInputChange} />
              </div>
            </div>

            <hr className="border-gray-100" />

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Balance Sheet Inputs</h3>
              <div className="space-y-3">
                <InputGroup label="Total Assets (₵)" name="totalAssets" value={inputs.totalAssets} onChange={handleInputChange} />
                <InputGroup label="Current Assets (₵)" name="currentAssets" value={inputs.currentAssets} onChange={handleInputChange} />
                <InputGroup label="Inventory (₵)" name="inventory" value={inputs.inventory} onChange={handleInputChange} />
                <InputGroup label="Current Liabilities (₵)" name="currentLiabilities" value={inputs.currentLiabilities} onChange={handleInputChange} />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Financial Ratio Dashboard</h1>
          <p className="text-gray-500 mt-2">Analyze liquidity, profitability, and efficiency metrics in real-time.</p>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Net Profit Margin"
            value={`${ratios.netMargin.toFixed(2)}%`}
            icon={<DollarSign className="w-5 h-5 text-emerald-500" />}
            trend={ratios.netMargin > 15 ? 'positive' : 'neutral'}
          />
          <MetricCard
            title="Current Ratio"
            value={ratios.currentRatio.toFixed(2)}
            icon={<Briefcase className="w-5 h-5 text-blue-500" />}
            trend={ratios.currentRatio > 1.5 ? 'positive' : 'negative'}
          />
          <MetricCard
            title="ROA"
            value={`${ratios.roa.toFixed(2)}%`}
            icon={<TrendingUp className="w-5 h-5 text-purple-500" />}
            trend={ratios.roa > 5 ? 'positive' : 'neutral'}
          />
          <MetricCard
            title="Asset Turnover"
            value={ratios.assetTurnover.toFixed(2)}
            icon={<Settings className="w-5 h-5 text-orange-500" />}
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <TabButton
              active={activeTab === 'liquidity'}
              onClick={() => setActiveTab('liquidity')}
              label="💧 Liquidity"
            />
            <TabButton
              active={activeTab === 'profitability'}
              onClick={() => setActiveTab('profitability')}
              label="💰 Profitability"
            />
            <TabButton
              active={activeTab === 'efficiency'}
              onClick={() => setActiveTab('efficiency')}
              label="⚙️ Efficiency"
            />
          </div>

          <div className="p-6">
            {activeTab === 'liquidity' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Liquidity Analysis</h3>
                    <p className="text-gray-600 mb-6">Liquidity ratios measure a company's ability to pay debt obligations.</p>
                    <div className="space-y-4">
                      <InfoBox
                        label="Current Ratio"
                        value={ratios.currentRatio.toFixed(2)}
                        desc="Target: > 1.5. Ability to pay short-term obligations."
                        color="bg-blue-50 text-blue-700 border-blue-200"
                      />
                      <InfoBox
                        label="Quick Ratio"
                        value={ratios.quickRatio.toFixed(2)}
                        desc="Target: > 1.0. Ability to pay without selling inventory."
                        color="bg-sky-50 text-sky-700 border-sky-200"
                      />
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={liquidityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {liquidityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profitability' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Profitability Analysis</h3>
                    <p className="text-gray-600 mb-6">Measures ability to generate earnings relative to revenue and assets.</p>
                    <div className="grid grid-cols-1 gap-4">
                      <MetricDetail label="Gross Margin" value={`${ratios.grossMargin.toFixed(2)}%`} color="text-green-600" />
                      <MetricDetail label="Net Margin" value={`${ratios.netMargin.toFixed(2)}%`} color="text-emerald-600" />
                      <MetricDetail label="Return on Assets (ROA)" value={`${ratios.roa.toFixed(2)}%`} color="text-teal-600" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center bg-gray-50 rounded-lg p-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-emerald-600 mb-2">{ratios.netMargin.toFixed(1)}%</div>
                      <div className="text-gray-500">Net Profit Margin</div>
                      {/* A simple progress bar visualization */}
                      <div className="mt-4 w-48 h-3 bg-gray-200 rounded-full overflow-hidden mx-auto">
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${Math.min(Math.max(ratios.netMargin, 0), 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'efficiency' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Efficiency Analysis</h3>
                    <p className="text-gray-600 mb-6">Efficiency ratios measure how effectively a company uses its assets.</p>
                    <div className="space-y-4">
                      <InfoBox
                        label="Asset Turnover"
                        value={ratios.assetTurnover.toFixed(2)}
                        desc="Higher is better. Revenue generated per dollar of assets."
                        color="bg-orange-50 text-orange-700 border-orange-200"
                      />
                      <InfoBox
                        label="Inventory Turnover"
                        value={ratios.inventoryTurnover.toFixed(2)}
                        desc="Higher is better. Times inventory is sold and replaced."
                        color="bg-amber-50 text-amber-700 border-amber-200"
                      />
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={efficiencyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {efficiencyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Sub-components
function InputGroup({ label, name, value, onChange }: { label: string, name: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
      />
    </div>
  );
}

function MetricCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend?: 'positive' | 'negative' | 'neutral' }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend === 'positive' ? 'bg-green-100 text-green-700' :
            trend === 'negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
            }`}>
            {trend === 'positive' ? 'Good' : trend === 'negative' ? 'Alert' : 'Neutral'}
          </span>
        )}
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-4 text-sm font-medium transition-colors relative ${active ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
        }`}
    >
      {label}
      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
    </button>
  );
}

function InfoBox({ label, value, desc, color }: { label: string, value: string, desc: string, color: string }) {
  return (
    <div className={`p-4 rounded-lg border ${color}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold">{label}</span>
        <span className="text-xl font-bold">{value}</span>
      </div>
      <p className="text-xs opacity-80">{desc}</p>
    </div>
  );
}

function MetricDetail({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className={`text-lg font-bold ${color}`}>{value}</span>
    </div>
  );
}

export default App;
