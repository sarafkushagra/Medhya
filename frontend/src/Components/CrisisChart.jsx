import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Alert, AlertDescription } from '../ui/Alert';
import { Button } from '../ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Loader2, AlertTriangle, PieChart, RefreshCw } from 'lucide-react';
import { useCrisisAnalytics, useCrisisChartData, useCrisisSeverityChartData } from '../hooks/useCrisisData';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function CrisisChart({ timeRange: initialTimeRange = '30d', title = "Crisis Management Analytics" }) {
  const [timeRange, setTimeRange] = React.useState(initialTimeRange);
  const [chartType, setChartType] = React.useState('type'); // 'type' or 'severity'
  const { data: analyticsData, loading, error, refetch } = useCrisisAnalytics(timeRange);

  const typeChartData = useCrisisChartData(analyticsData);
  const severityChartData = useCrisisSeverityChartData(analyticsData);

  const chartData = chartType === 'type' ? typeChartData : severityChartData;

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      title: {
        display: true,
        text: chartType === 'type' ? 'Crisis Types Distribution' : 'Crisis Severity Distribution',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            {title}
          </CardTitle>
          <CardDescription>Loading crisis data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading crisis analytics...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Error loading crisis data: {error}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // No data state
  if (!chartData || chartData.labels.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            {title}
          </CardTitle>
          <CardDescription>No crisis data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No crisis data found for the selected time period</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              {title}
            </CardTitle>
            <CardDescription>
              Crisis distribution for {timeRange === '7d' ? 'the last 7 days' :
              timeRange === '30d' ? 'the last 30 days' :
              timeRange === '90d' ? 'the last 90 days' : 'all time'}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                <SelectItem value="type">By Type</SelectItem>
                <SelectItem value="severity">By Severity</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <Pie data={chartData} options={options} />
        </div>

        {/* Summary stats */}
        {analyticsData && analyticsData.summary && (
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {analyticsData.summary.totalAlerts || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Alerts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {analyticsData.summary.uniqueTypes || 0}
              </div>
              <div className="text-sm text-muted-foreground">Unique Types</div>
            </div>
          </div>
        )}

        {/* Crisis type breakdown */}
        {analyticsData && analyticsData.typeBreakdown && chartType === 'type' && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Crisis Types Breakdown:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(analyticsData.typeBreakdown).map(([type, data]) => (
                <div key={type} className="flex justify-between">
                  <span className="capitalize">{type}:</span>
                  <span className="font-medium">{data.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Crisis severity breakdown */}
        {analyticsData && analyticsData.severityBreakdown && chartType === 'severity' && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Severity Breakdown:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(analyticsData.severityBreakdown).map(([severity, count]) => (
                <div key={severity} className="flex justify-between">
                  <span className="capitalize">{severity}:</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
