"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Clock,
  Activity,
  Database,
  ExternalLink,
  Settings,
  Zap,
  Globe,
  Server,
} from "lucide-react"

// Mock integration data
const integrationStatus = [
  {
    id: "udm-portal",
    name: "UDM Portal",
    description: "User Depot Module Integration",
    url: "www.ireps.gov.in",
    status: "online",
    lastSync: "2024-12-14 10:30:00",
    responseTime: 245,
    uptime: 99.8,
    dataSync: 98.5,
    errorCount: 2,
    totalRequests: 15420,
  },
  {
    id: "tms-portal",
    name: "TMS Portal",
    description: "Track Management System Integration",
    url: "www.irecept.gov.in",
    status: "online",
    lastSync: "2024-12-14 10:28:00",
    responseTime: 312,
    uptime: 99.2,
    dataSync: 96.8,
    errorCount: 5,
    totalRequests: 12850,
  },
  {
    id: "mobile-scanners",
    name: "Mobile Scanner Network",
    description: "Field QR Code Scanners",
    url: "Internal Network",
    status: "syncing",
    lastSync: "2024-12-14 10:25:00",
    responseTime: 180,
    uptime: 97.5,
    dataSync: 94.2,
    errorCount: 12,
    totalRequests: 8920,
  },
  {
    id: "backup-system",
    name: "Backup System",
    description: "Data Backup & Recovery",
    url: "Internal Backup",
    status: "maintenance",
    lastSync: "2024-12-14 08:00:00",
    responseTime: 0,
    uptime: 85.0,
    dataSync: 100.0,
    errorCount: 0,
    totalRequests: 0,
  },
]

const responseTimeData = [
  { time: "00:00", udm: 250, tms: 320, mobile: 180 },
  { time: "04:00", udm: 245, tms: 315, mobile: 175 },
  { time: "08:00", udm: 260, tms: 340, mobile: 190 },
  { time: "12:00", udm: 280, tms: 360, mobile: 200 },
  { time: "16:00", udm: 270, tms: 350, mobile: 185 },
  { time: "20:00", udm: 255, tms: 325, mobile: 170 },
]

const syncHistory = [
  { timestamp: "2024-12-14 10:30:00", system: "UDM Portal", status: "Success", records: 1250, duration: "2.3s" },
  { timestamp: "2024-12-14 10:28:00", system: "TMS Portal", status: "Success", records: 980, duration: "3.1s" },
  { timestamp: "2024-12-14 10:25:00", system: "Mobile Scanners", status: "Partial", records: 750, duration: "1.8s" },
  { timestamp: "2024-12-14 10:20:00", system: "UDM Portal", status: "Success", records: 1180, duration: "2.1s" },
  { timestamp: "2024-12-14 10:18:00", system: "TMS Portal", status: "Failed", records: 0, duration: "0.5s" },
]

const errorLogs = [
  {
    timestamp: "2024-12-14 10:18:00",
    system: "TMS Portal",
    level: "Error",
    message: "Connection timeout after 30 seconds",
    code: "CONN_TIMEOUT",
  },
  {
    timestamp: "2024-12-14 09:45:00",
    system: "Mobile Scanners",
    level: "Warning",
    message: "Scanner ID MS-001 not responding",
    code: "DEVICE_OFFLINE",
  },
  {
    timestamp: "2024-12-14 09:30:00",
    system: "UDM Portal",
    level: "Error",
    message: "Authentication failed for API key",
    code: "AUTH_FAILED",
  },
  {
    timestamp: "2024-12-14 09:15:00",
    system: "Mobile Scanners",
    level: "Warning",
    message: "Data validation failed for 3 records",
    code: "DATA_VALIDATION",
  },
]

export default function IntegrationPage() {
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      setLastRefresh(new Date())
    }, 2000)
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "syncing":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case "maintenance":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "offline":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "online":
        return <Badge className="bg-green-100 text-green-800">Online</Badge>
      case "syncing":
        return <Badge className="bg-blue-100 text-blue-800">Syncing</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>
      case "offline":
        return <Badge className="bg-red-100 text-red-800">Offline</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getSyncStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>
      case "partial":
        return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getErrorLevelBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
      case "info":
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>
      default:
        return <Badge variant="secondary">{level}</Badge>
    }
  }

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
                  <h1 className="text-3xl font-bold text-foreground">Integration & Sync Monitor</h1>
                  <p className="text-muted-foreground">Monitor system integrations and data synchronization status</p>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleRefresh} disabled={refreshing}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                    {refreshing ? "Refreshing..." : "Refresh"}
                  </Button>
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure
                  </Button>
                </div>
              </div>

              {/* System Status Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Systems Online</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2/4</div>
                    <p className="text-xs text-muted-foreground">50% operational</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                    <Activity className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">279ms</div>
                    <p className="text-xs text-green-600">-15ms from yesterday</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Data Sync Rate</CardTitle>
                    <Database className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">97.4%</div>
                    <p className="text-xs text-green-600">+2.1% from last hour</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Errors</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">19</div>
                    <p className="text-xs text-red-600">+3 from last check</p>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="status" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="status">System Status</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="sync">Sync History</TabsTrigger>
                  <TabsTrigger value="logs">Error Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="status" className="space-y-6">
                  {/* Integration Status Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {integrationStatus.map((integration) => (
                      <Card key={integration.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(integration.status)}
                              <div>
                                <CardTitle className="text-lg">{integration.name}</CardTitle>
                                <CardDescription>{integration.description}</CardDescription>
                              </div>
                            </div>
                            {getStatusBadge(integration.status)}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">URL:</span>
                            <div className="flex items-center space-x-1">
                              <Globe className="h-3 w-3" />
                              <span className="font-mono">{integration.url}</span>
                              {integration.url.startsWith("www") && (
                                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Last Sync:</span>
                            <span className="font-medium">{integration.lastSync}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Response Time:</span>
                            <span className="font-medium">
                              {integration.responseTime > 0 ? `${integration.responseTime}ms` : "N/A"}
                            </span>
                          </div>

                          {/* Progress Bars */}
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Uptime</span>
                                <span>{integration.uptime}%</span>
                              </div>
                              <Progress value={integration.uptime} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Data Sync</span>
                                <span>{integration.dataSync}%</span>
                              </div>
                              <Progress value={integration.dataSync} className="h-2" />
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                            <div className="text-center">
                              <p className="text-lg font-bold text-red-600">{integration.errorCount}</p>
                              <p className="text-xs text-muted-foreground">Errors (24h)</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-blue-600">{integration.totalRequests}</p>
                              <p className="text-xs text-muted-foreground">Total Requests</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex space-x-2 pt-2">
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              <Zap className="mr-2 h-3 w-3" />
                              Test Connection
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              <RefreshCw className="mr-2 h-3 w-3" />
                              Force Sync
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Response Time Trends</CardTitle>
                      <CardDescription>24-hour response time monitoring</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          udm: { label: "UDM Portal", color: "hsl(var(--chart-1))" },
                          tms: { label: "TMS Portal", color: "hsl(var(--chart-2))" },
                          mobile: { label: "Mobile Scanners", color: "hsl(var(--chart-3))" },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={responseTimeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line type="monotone" dataKey="udm" stroke="var(--color-udm)" strokeWidth={2} />
                            <Line type="monotone" dataKey="tms" stroke="var(--color-tms)" strokeWidth={2} />
                            <Line type="monotone" dataKey="mobile" stroke="var(--color-mobile)" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Best Performer</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 rounded-full p-2">
                            <Server className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Mobile Scanners</p>
                            <p className="text-sm text-muted-foreground">180ms avg response</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Most Reliable</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 rounded-full p-2">
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">UDM Portal</p>
                            <p className="text-sm text-muted-foreground">99.8% uptime</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Needs Attention</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-3">
                          <div className="bg-yellow-100 rounded-full p-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div>
                            <p className="font-medium">Backup System</p>
                            <p className="text-sm text-muted-foreground">Under maintenance</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="sync" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Synchronization History</CardTitle>
                      <CardDescription>Recent data synchronization activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>System</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Records</TableHead>
                            <TableHead>Duration</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {syncHistory.map((sync, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-mono text-sm">{sync.timestamp}</TableCell>
                              <TableCell>{sync.system}</TableCell>
                              <TableCell>{getSyncStatusBadge(sync.status)}</TableCell>
                              <TableCell>{sync.records.toLocaleString()}</TableCell>
                              <TableCell>{sync.duration}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* Sync Statistics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Sync Statistics</CardTitle>
                      <CardDescription>Data synchronization performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          success: { label: "Success", color: "hsl(var(--chart-1))" },
                          partial: { label: "Partial", color: "hsl(var(--chart-2))" },
                          failed: { label: "Failed", color: "hsl(var(--chart-3))" },
                        }}
                        className="h-[200px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { name: "Last 24h", success: 45, partial: 3, failed: 2 },
                              { name: "Last 7d", success: 312, partial: 18, failed: 8 },
                              { name: "Last 30d", success: 1340, partial: 75, failed: 25 },
                            ]}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="success" fill="var(--color-success)" />
                            <Bar dataKey="partial" fill="var(--color-partial)" />
                            <Bar dataKey="failed" fill="var(--color-failed)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="logs" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Error Logs</CardTitle>
                      <CardDescription>Recent system errors and warnings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {errorLogs.map((log, index) => (
                          <div key={index} className="flex items-start space-x-4 p-3 border rounded-lg">
                            <div className="flex-shrink-0 mt-1">
                              {log.level === "Error" ? (
                                <XCircle className="h-4 w-4 text-red-500" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium">{log.system}</p>
                                <div className="flex items-center space-x-2">
                                  {getErrorLevelBadge(log.level)}
                                  <span className="text-xs text-muted-foreground font-mono">{log.code}</span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">{log.message}</p>
                              <p className="text-xs text-muted-foreground font-mono">{log.timestamp}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Error Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Critical Errors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-red-600">3</div>
                        <p className="text-sm text-muted-foreground">Require immediate attention</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Warnings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-yellow-600">16</div>
                        <p className="text-sm text-muted-foreground">Monitor closely</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Resolution Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-600">94%</div>
                        <p className="text-sm text-muted-foreground">Errors resolved within 24h</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Last Updated */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    Last updated: {lastRefresh.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
