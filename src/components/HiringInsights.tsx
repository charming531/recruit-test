'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data type
interface HiringData {
  date: string;
  applicationToInterview: number;
  offerAcceptance: number;
  rejection: number;
}

// Function to generate date string based on timeframe
const getDateString = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Generate mock data with growing trends and random variations
const generateMockData = (days: number): HiringData[] => {
  const data: HiringData[] = [];
  const today = new Date();
  
  // Initial values with some randomness
  let appToInt = 45 + Math.random() * 10; // Start between 45-55
  let offerAcc = 55 + Math.random() * 10; // Start between 55-65
  let reject = 25 + Math.random() * 5;    // Start between 25-30
  
  // Growth rates (small positive numbers)
  const appGrowth = 0.1 + Math.random() * 0.2;  // 0.1-0.3 per day
  const offerGrowth = 0.15 + Math.random() * 0.2; // 0.15-0.35 per day
  const rejectGrowth = 0.05 + Math.random() * 0.1; // 0.05-0.15 per day
  
  // Generate data points for each day
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Add random variation (-2 to +2)
    const randomVariation = (Math.random() * 4 - 2);
    
    // Update values with growth and random variation
    appToInt = Math.min(90, Math.max(40, appToInt + appGrowth + randomVariation));
    offerAcc = Math.min(95, Math.max(50, offerAcc + offerGrowth + randomVariation));
    reject = Math.min(40, Math.max(5, reject + rejectGrowth + randomVariation * 0.5));
    
    data.push({
      date: getDateString(date),
      applicationToInterview: Math.round(appToInt),
      offerAcceptance: Math.round(offerAcc),
      rejection: Math.round(reject)
    });
  }
  
  return data;
};

const timeframes = [
  { label: 'Last 30 days', value: '30' },
  { label: 'Last 90 days', value: '90' },
  { label: 'Last 6 months', value: '180' },
  { label: 'Last year', value: '365' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
        <p className="font-semibold text-gray-800">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomLegend = () => {
  return (
    <div className="flex flex-wrap gap-6 mt-4 justify-start">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#22c55e]"></div>
        <span className="text-sm text-gray-600">Application to Interview Rate</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#a855f7]"></div>
        <span className="text-sm text-gray-600">Offer Acceptance Rate</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#f97316]"></div>
        <span className="text-sm text-gray-600">Rejection Rate</span>
      </div>
    </div>
  );
};

export default function HiringInsights() {
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframes[0].value);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate data based on selected timeframe
  const mockData = useMemo(() => {
    return generateMockData(parseInt(selectedTimeframe));
  }, [selectedTimeframe]);

  // Calculate interval based on screen width
  const getInterval = () => {
    if (!isClient) return 5; // Default value for server-side rendering
    return Math.floor(mockData.length / (window.innerWidth < 640 ? 5 : 10));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2 sm:mb-6 ml-12 mr-5">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Hiring Insights</h2>
        <div className="relative w-full sm:w-auto">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="w-full sm:w-auto appearance-none bg-white pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer hover:border-gray-300 transition-colors duration-200"
            aria-label="Select timeframe"
          >
            {timeframes.map((timeframe) => (
              <option key={timeframe.value} value={timeframe.value}>
                {timeframe.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="h-[300px] sm:h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={mockData}
            margin={{ top: 20, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#f0f0f0"
              horizontal={true}
              vertical={false}
            />
            <XAxis 
              dataKey="date" 
              stroke="#666"
              tick={{ fill: '#666', fontSize: 12 }}
              interval={getInterval()}
              height={40}
              tickMargin={5}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#666"
              tick={{ fill: '#666', fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
              ticks={[0, 13, 25, 38, 50, 63, 75, 88, 100]}
              width={40}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              content={<CustomTooltip />}
              wrapperStyle={{ outline: 'none' }}
            />
            <Line
              type="monotone"
              dataKey="applicationToInterview"
              stroke="#22c55e"
              strokeWidth={2}
              name="Application to Interview Rate"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="offerAcceptance"
              stroke="#a855f7"
              strokeWidth={2}
              name="Offer Acceptance Rate"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="rejection"
              stroke="#f97316"
              strokeWidth={2}
              name="Rejection Rate"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex flex-wrap gap-4 sm:gap-6 ml-12 sm:ml-12">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#22c55e]"></div>
          <span className="text-sm sm:text-base text-gray-600">Application to Interview Rate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#a855f7]"></div>
          <span className="text-sm sm:text-base text-gray-600">Offer Acceptance Rate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#f97316]"></div>
          <span className="text-sm sm:text-base text-gray-600">Rejection Rate</span>
        </div>
      </div>
    </div>
  );
} 