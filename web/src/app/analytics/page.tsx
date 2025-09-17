"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
} from "recharts"
import { TrendingUp, BarChart3, Download, Filter, MapPin, AlertTriangle, CheckCircle, DollarSign } from "lucide-react"

// Mock analytics data
const performanceData = [
  { month: "Jan", clips: 95, pads: 92, liners: 88, sleepers: 90 },
  { month: "Feb", clips: 96, pads: 94, liners: 90, sleepers: 92 },
  { month: "Mar", clips: 94, pads: 91, liners: 87, sleepers: 89 },
  { month: "Apr", clips: 97, pads: 95, liners: 92, sleepers: 94 },
  { month: "May", clips: 98, pads: 96, liners: 94, sleepers: 95 },
  { month: "Jun", clips: 96, pads: 93, liners: 91, sleepers: 93 },
]

const qualityTrends = [
  { month: "Jan", passed: 8500, failed: 450, pending: 200 },
  { month: "Feb", passed: 9200, failed: 380, pending: 180 },
  { month: "Mar", passed: 8800, failed: 520, pending: 250 },
  { month: "Apr", passed: 9800, failed: 320, pending: 150 },
  { month: "May", passed: 10200, failed: 280, pending: 120 },
  { month: "Jun", passed: 9600, failed: 350, pending: 180 },
]

const vendorAnalytics = [
  { vendor: "Vendor A", performance: 96, deliveries: 1250, quality: 98, cost: 2.5 },
  { vendor: "Vendor B", performance: 89, deliveries: 980, quality: 94, cost: 2.2 },
  { vendor: "Vendor C", performance: 93, deliveries: 1100, quality: 96, cost: 2.4 },
  { vendor: "Vendor D", performance: 87, deliveries: 850, quality: 91, cost: 2.1 },
  { vendor: "Vendor E", performance: 91, deliveries: 1050, quality: 95, cost: 2.3 },
]

const sectorPerformance = [
  { sector: "Sector 1-5", components: 15000, quality: 95, issues: 12 },
  { sector: "Sector 6-10", components: 18000, quality: 92, issues: 18 },
  { sector: "Sector 11-15", components: 12000, quality: 97, issues: 8 },
  { sector: "Sector 16-20", components: 14000, quality: 89, issues: 22 },
]

const predictiveData = [
  { component: "Elastic Rail Clips", predicted: 85, actual: 87, variance: 2 },
  { component: "Rail Pads", predicted: 78, actual: 82, variance: 4 },
  { component: "Liners", predicted: 92, actual: 89, variance: -3 },
  { component: "Sleepers", predicted: 88, actual: 91, variance: 3 },
]

const costAnalysis = [
  { category: "Procurement", q1: 2.5, q2: 2.3, q3: 2.4, q4: 2.2 },
  { category: "Inspection", q1: 0.8, q2: 0.9, q3: 0.7, q4: 0.8 },
  { category: "Maintenance", q1: 1.2, q2: 1.1, q3: 1.3, q4: 1.0 },
  { category: "Replacement", q1: 0.5, q2: 0.6, q3: 0.4, q4: 0.5 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months")
  const [selectedSector, setSelectedSector] = useState("all")
  const [selectedComponent, setSelectedComponent] = useState("all")

  return (
    <AuthGuard>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Analytics & Insights</h1>
                  <p className="text-muted-foreground">
                    Comprehensive analytics for railway track fittings performance
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Advanced Filters
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1month">Last Month</SelectItem>
                          <SelectItem value="3months">Last 3 Months</SelectItem>
                          <SelectItem value="6months">Last 6 Months</SelectItem>
                          <SelectItem value="1year">Last Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Select value={selectedSector} onValueChange={setSelectedSector}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sector" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Sectors</SelectItem>
                          <SelectItem value="1-5">Sector 1-5</SelectItem>
                          <SelectItem value="6-10">Sector 6-10</SelectItem>
                          <SelectItem value="11-15">Sector 11-15</SelectItem>
                          <SelectItem value="16-20">Sector 16-20</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Select value={selectedComponent} onValueChange={setSelectedComponent}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select component" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Components</SelectItem>
                          <SelectItem value="clips">Elastic Rail Clips</SelectItem>
                          <SelectItem value="pads">Rail Pads</SelectItem>
                          <SelectItem value="liners">Liners</SelectItem>
                          <SelectItem value="sleepers">Sleepers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overall Performance</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">94.2%</div>
                    <p className="text-xs text-green-600">+2.1% from last period</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">96.8%</div>
                    <p className="text-xs text-green-600">+1.5% from last period</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cost Efficiency</CardTitle>
                    <DollarSign className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹2.3M</div>
                    <p className="text-xs text-green-600">-8.2% cost reduction</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Prediction Accuracy</CardTitle>
                    <BarChart3 className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">91.5%</div>
                    <p className="text-xs text-green-600">+3.2% improvement</p>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="performance" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="quality">Quality</TabsTrigger>
                  <TabsTrigger value="vendors">Vendors</TabsTrigger>
                  <TabsTrigger value="predictive">Predictive</TabsTrigger>
                  <TabsTrigger value="costs">Costs</TabsTrigger>
                </TabsList>

                <TabsContent value="performance" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Component Performance Trends */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Component Performance Trends</CardTitle>
                        <CardDescription>Performance scores by component type over time</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer
                          config={{
                            clips: { label: "Elastic Rail Clips", color: "hsl(var(--chart-1))" },
                            pads: { label: "Rail Pads", color: "hsl(var(--chart-2))" },
                            liners: { label: "Liners", color: "hsl(var(--chart-3))" },
                            sleepers: { label: "Sleepers", color: "hsl(var(--chart-4))" },
                          }}
                          className="h-[300px]"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={performanceData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis domain={[80, 100]} />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Line type="monotone" dataKey="clips" stroke="var(--color-clips)" strokeWidth={2} />
                              <Line type="monotone" dataKey="pads" stroke="var(--color-pads)" strokeWidth={2} />
                              <Line type="monotone" dataKey="liners" stroke="var(--color-liners)" strokeWidth={2} />
                              <Line type="monotone" dataKey="sleepers" stroke="var(--color-sleepers)" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </CardContent>
                    </Card>

                    {/* Sector Performance */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Sector Performance</CardTitle>
                        <CardDescription>Performance metrics by railway sector</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer
                          config={{
                            quality: { label: "Quality Score", color: "hsl(var(--chart-1))" },
                            issues: { label: "Issues", color: "hsl(var(--chart-2))" },
                          }}
                          className="h-[300px]"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sectorPerformance}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="sector" />
                              <YAxis />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Bar dataKey="quality" fill="var(--color-quality)" />
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Performance Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Summary</CardTitle>
                      <CardDescription>Key performance indicators and trends</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium">Best Performing</span>
                          </div>
                          <p className="text-lg font-bold">Elastic Rail Clips</p>
                          <p className="text-sm text-muted-foreground">98% average performance</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">Needs Attention</span>
                          </div>
                          <p className="text-lg font-bold">Liners</p>
                          <p className="text-sm text-muted-foreground">91% average performance</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium">Top Sector</span>
                          </div>
                          <p className="text-lg font-bold">Sector 11-15</p>
                          <p className="text-sm text-muted-foreground">97% quality score</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="quality" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Quality Trends */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Quality Trends</CardTitle>
                        <CardDescription>Inspection results over time</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer
                          config={{
                            passed: { label: "Passed", color: "hsl(var(--chart-1))" },
                            failed: { label: "Failed", color: "hsl(var(--chart-2))" },
                            pending: { label: "Pending", color: "hsl(var(--chart-3))" },
                          }}
                          className="h-[300px]"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={qualityTrends}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Area
                                type="monotone"
                                dataKey="passed"
                                stackId="1"
                                stroke="var(--color-passed)"
                                fill="var(--color-passed)"
                              />
                              <Area
                                type="monotone"
                                dataKey="failed"
                                stackId="1"
                                stroke="var(--color-failed)"
                                fill="var(--color-failed)"
                              />
                              <Area
                                type="monotone"
                                dataKey="pending"
                                stackId="1"
                                stroke="var(--color-pending)"
                                fill="var(--color-pending)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </CardContent>
                    </Card>

                    {/* Quality Distribution */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Quality Distribution</CardTitle>
                        <CardDescription>Current quality status breakdown</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer
                          config={{
                            passed: { label: "Passed", color: "#10b981" },
                            failed: { label: "Failed", color: "#ef4444" },
                            pending: { label: "Pending", color: "#f59e0b" },
                          }}
                          className="h-[300px]"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: "Passed", value: 92, color: "#10b981" },
                                  { name: "Failed", value: 5, color: "#ef4444" },
                                  { name: "Pending", value: 3, color: "#f59e0b" },
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {[
                                  { name: "Passed", value: 92, color: "#10b981" },
                                  { name: "Failed", value: 5, color: "#ef4444" },
                                  { name: "Pending", value: 3, color: "#f59e0b" },
                                ].map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <ChartTooltip content={<ChartTooltipContent />} />
                            </PieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="vendors" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Vendor Performance Analysis</CardTitle>
                      <CardDescription>Comprehensive vendor performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          performance: { label: "Performance", color: "hsl(var(--chart-1))" },
                          quality: { label: "Quality", color: "hsl(var(--chart-2))" },
                        }}
                        className="h-[400px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart data={vendorAnalytics}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="performance" name="Performance" unit="%" />
                            <YAxis dataKey="quality" name="Quality" unit="%" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Scatter dataKey="deliveries" fill="var(--color-performance)" />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  {/* Vendor Rankings */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Vendor Rankings</CardTitle>
                      <CardDescription>Top performing vendors by key metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {vendorAnalytics
                          .sort((a, b) => b.performance - a.performance)
                          .map((vendor, index) => (
                            <div
                              key={vendor.vendor}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center text-primary-foreground text-sm font-bold">
                                  {index + 1}
                                </div>
                                <div>
                                  <p className="font-medium">{vendor.vendor}</p>
                                  <p className="text-sm text-muted-foreground">{vendor.deliveries} deliveries</p>
                                </div>
                              </div>
                              <div className="flex space-x-4 text-sm">
                                <div className="text-center">
                                  <p className="font-medium">{vendor.performance}%</p>
                                  <p className="text-muted-foreground">Performance</p>
                                </div>
                                <div className="text-center">
                                  <p className="font-medium">{vendor.quality}%</p>
                                  <p className="text-muted-foreground">Quality</p>
                                </div>
                                <div className="text-center">
                                  <p className="font-medium">₹{vendor.cost}M</p>
                                  <p className="text-muted-foreground">Cost</p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="predictive" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Predictive Analytics</CardTitle>
                      <CardDescription>AI-powered predictions vs actual performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {predictiveData.map((item) => (
                          <div key={item.component} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{item.component}</h4>
                              <Badge
                                className={
                                  Math.abs(item.variance) <= 2
                                    ? "bg-green-100 text-green-800"
                                    : Math.abs(item.variance) <= 5
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }
                              >
                                {item.variance > 0 ? "+" : ""}
                                {item.variance}% variance
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Predicted Performance</p>
                                <p className="font-medium text-lg">{item.predicted}%</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Actual Performance</p>
                                <p className="font-medium text-lg">{item.actual}%</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Insights */}
                  <Card>
                    <CardHeader>
                      <CardTitle>AI-Generated Insights</CardTitle>
                      <CardDescription>Machine learning insights and recommendations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                          <div className="bg-blue-500 rounded-full p-1">
                            <BarChart3 className="h-3 w-3 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-800">Performance Optimization</p>
                            <p className="text-xs text-blue-600">
                              Elastic Rail Clips in Sector 11-15 show 15% better performance. Consider replicating
                              maintenance practices across other sectors.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                          <div className="bg-yellow-500 rounded-full p-1">
                            <AlertTriangle className="h-3 w-3 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-yellow-800">Maintenance Alert</p>
                            <p className="text-xs text-yellow-600">
                              Liners from Vendor B show higher failure rates. Recommend quality review and enhanced
                              inspection protocols.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                          <div className="bg-green-500 rounded-full p-1">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-800">Cost Savings Opportunity</p>
                            <p className="text-xs text-green-600">
                              Vendor A consistently delivers high quality at competitive rates. Consider increasing
                              allocation by 20%.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="costs" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cost Analysis</CardTitle>
                      <CardDescription>Quarterly cost breakdown by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          q1: { label: "Q1", color: "hsl(var(--chart-1))" },
                          q2: { label: "Q2", color: "hsl(var(--chart-2))" },
                          q3: { label: "Q3", color: "hsl(var(--chart-3))" },
                          q4: { label: "Q4", color: "hsl(var(--chart-4))" },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={costAnalysis}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="q1" fill="var(--color-q1)" />
                            <Bar dataKey="q2" fill="var(--color-q2)" />
                            <Bar dataKey="q3" fill="var(--color-q3)" />
                            <Bar dataKey="q4" fill="var(--color-q4)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  {/* ROI Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle>ROI Analysis</CardTitle>
                      <CardDescription>Return on investment metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600">₹12.5M</div>
                          <p className="text-sm text-muted-foreground">Total Savings</p>
                          <p className="text-xs text-green-600">+18% from last year</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">285%</div>
                          <p className="text-sm text-muted-foreground">ROI</p>
                          <p className="text-xs text-blue-600">Above industry average</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-600">8.2 months</div>
                          <p className="text-sm text-muted-foreground">Payback Period</p>
                          <p className="text-xs text-purple-600">2.1 months faster</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
