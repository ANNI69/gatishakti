"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, QrCode, FileText, AlertTriangle, CheckCircle, Eye, Download, ExternalLink } from "lucide-react"

// Mock data for components
const componentsData = [
  {
    id: "RID-2024-001234",
    type: "Elastic Rail Clip",
    qrCode: "QR-ERC-001234",
    vendor: "Vendor A",
    batchNumber: "VB-2024-1156",
    manufactureDate: "2024-01-15",
    supplyDate: "2024-02-01",
    location: "Sector 12-A, Track 3",
    status: "Active",
    warrantyExpiry: "2027-01-15",
    lastInspection: "2024-11-01",
    nextInspection: "2025-02-01",
    qualityScore: 98,
    inspectionHistory: [
      { date: "2024-11-01", inspector: "INS-001", result: "Passed", notes: "Excellent condition" },
      { date: "2024-08-01", inspector: "INS-002", result: "Passed", notes: "Minor wear, within limits" },
      { date: "2024-05-01", inspector: "INS-001", result: "Passed", notes: "Good condition" },
    ],
  },
  {
    id: "RID-2024-001235",
    type: "Rail Pad",
    qrCode: "QR-RP-001235",
    vendor: "Vendor B",
    batchNumber: "VB-2024-1157",
    manufactureDate: "2024-01-20",
    supplyDate: "2024-02-05",
    location: "Sector 8-B, Track 1",
    status: "Under Review",
    warrantyExpiry: "2027-01-20",
    lastInspection: "2024-10-28",
    nextInspection: "2025-01-28",
    qualityScore: 85,
    inspectionHistory: [
      { date: "2024-10-28", inspector: "INS-003", result: "Review Required", notes: "Unusual wear pattern detected" },
      { date: "2024-07-28", inspector: "INS-001", result: "Passed", notes: "Normal wear" },
    ],
  },
  {
    id: "RID-2024-001236",
    type: "Liner",
    qrCode: "QR-LN-001236",
    vendor: "Vendor C",
    batchNumber: "VB-2024-1158",
    manufactureDate: "2024-02-01",
    supplyDate: "2024-02-15",
    location: "Sector 15-C, Track 2",
    status: "Active",
    warrantyExpiry: "2027-02-01",
    lastInspection: "2024-11-05",
    nextInspection: "2025-02-05",
    qualityScore: 92,
    inspectionHistory: [
      { date: "2024-11-05", inspector: "INS-002", result: "Passed", notes: "Good performance" },
      { date: "2024-08-05", inspector: "INS-003", result: "Passed", notes: "Satisfactory condition" },
    ],
  },
]

export default function ComponentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedComponent, setSelectedComponent] = useState<(typeof componentsData)[0] | null>(null)

  const filteredComponents = componentsData.filter((component) => {
    const matchesSearch =
      component.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.vendor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || component.type.toLowerCase().includes(filterType.toLowerCase())
    const matchesStatus = filterStatus === "all" || component.status.toLowerCase() === filterStatus.toLowerCase()

    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "under review":
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
      case "inactive":
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getQualityBadge = (score: number) => {
    if (score >= 95) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (score >= 85) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
    if (score >= 75) return <Badge className="bg-yellow-100 text-yellow-800">Fair</Badge>
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>
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
              <div>
                <h1 className="text-3xl font-bold text-foreground">Components & RID Management</h1>
                <p className="text-muted-foreground">
                  Track and manage railway track fittings with detailed component information
                </p>
              </div>

              {/* Search and Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Search & Filter Components</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Label htmlFor="search">Search Components</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="search"
                          placeholder="Search by RID, type, or vendor..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="w-full md:w-48">
                      <Label htmlFor="type-filter">Component Type</Label>
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="elastic">Elastic Rail Clip</SelectItem>
                          <SelectItem value="pad">Rail Pad</SelectItem>
                          <SelectItem value="liner">Liner</SelectItem>
                          <SelectItem value="sleeper">Sleeper</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full md:w-48">
                      <Label htmlFor="status-filter">Status</Label>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="under review">Under Review</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Components Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Components List</CardTitle>
                  <CardDescription>Found {filteredComponents.length} components matching your criteria</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>RID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>QR Code</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Quality</TableHead>
                        <TableHead>Next Inspection</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredComponents.map((component) => (
                        <TableRow key={component.id}>
                          <TableCell className="font-medium">{component.id}</TableCell>
                          <TableCell>{component.type}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <QrCode className="h-4 w-4" />
                              <span className="font-mono text-sm">{component.qrCode}</span>
                            </div>
                          </TableCell>
                          <TableCell>{component.vendor}</TableCell>
                          <TableCell>{component.location}</TableCell>
                          <TableCell>{getStatusBadge(component.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">{component.qualityScore}%</span>
                              {getQualityBadge(component.qualityScore)}
                            </div>
                          </TableCell>
                          <TableCell>{component.nextInspection}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedComponent(component)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Component Details - {component.id}</DialogTitle>
                                  <DialogDescription>
                                    Comprehensive information about this railway track fitting
                                  </DialogDescription>
                                </DialogHeader>

                                {selectedComponent && (
                                  <Tabs defaultValue="overview" className="w-full">
                                    <TabsList className="grid w-full grid-cols-4">
                                      <TabsTrigger value="overview">Overview</TabsTrigger>
                                      <TabsTrigger value="inspections">Inspections</TabsTrigger>
                                      <TabsTrigger value="vendor">Vendor Info</TabsTrigger>
                                      <TabsTrigger value="integrations">Integrations</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="overview" className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-lg">Basic Information</CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-3">
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">RID:</span>
                                              <span className="font-medium">{selectedComponent.id}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Type:</span>
                                              <span className="font-medium">{selectedComponent.type}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">QR Code:</span>
                                              <span className="font-mono text-sm">{selectedComponent.qrCode}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Status:</span>
                                              {getStatusBadge(selectedComponent.status)}
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Quality Score:</span>
                                              <div className="flex items-center space-x-2">
                                                <span className="font-medium">{selectedComponent.qualityScore}%</span>
                                                {getQualityBadge(selectedComponent.qualityScore)}
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>

                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-lg">Location & Dates</CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-3">
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Location:</span>
                                              <span className="font-medium">{selectedComponent.location}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Manufacture Date:</span>
                                              <span className="font-medium">{selectedComponent.manufactureDate}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Supply Date:</span>
                                              <span className="font-medium">{selectedComponent.supplyDate}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Warranty Expiry:</span>
                                              <span className="font-medium">{selectedComponent.warrantyExpiry}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Next Inspection:</span>
                                              <span className="font-medium">{selectedComponent.nextInspection}</span>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      </div>
                                    </TabsContent>

                                    <TabsContent value="inspections" className="space-y-4">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Inspection History</CardTitle>
                                          <CardDescription>
                                            Complete inspection record for this component
                                          </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="space-y-4">
                                            {selectedComponent.inspectionHistory.map((inspection, index) => (
                                              <div
                                                key={index}
                                                className="flex items-center space-x-4 p-3 border rounded-lg"
                                              >
                                                <div
                                                  className={`rounded-full p-2 ${
                                                    inspection.result === "Passed"
                                                      ? "bg-green-100"
                                                      : inspection.result === "Review Required"
                                                        ? "bg-yellow-100"
                                                        : "bg-red-100"
                                                  }`}
                                                >
                                                  {inspection.result === "Passed" ? (
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                  ) : inspection.result === "Review Required" ? (
                                                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                                  ) : (
                                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                                  )}
                                                </div>
                                                <div className="flex-1">
                                                  <div className="flex items-center justify-between">
                                                    <p className="font-medium">{inspection.date}</p>
                                                    <Badge
                                                      variant={
                                                        inspection.result === "Passed" ? "secondary" : "destructive"
                                                      }
                                                    >
                                                      {inspection.result}
                                                    </Badge>
                                                  </div>
                                                  <p className="text-sm text-muted-foreground">
                                                    Inspector: {inspection.inspector}
                                                  </p>
                                                  <p className="text-sm">{inspection.notes}</p>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </TabsContent>

                                    <TabsContent value="vendor" className="space-y-4">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Vendor Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <Label>Vendor Name</Label>
                                              <p className="font-medium">{selectedComponent.vendor}</p>
                                            </div>
                                            <div>
                                              <Label>Batch Number</Label>
                                              <p className="font-medium">{selectedComponent.batchNumber}</p>
                                            </div>
                                          </div>
                                          <div className="flex space-x-2">
                                            <Button variant="outline" size="sm">
                                              <FileText className="h-4 w-4 mr-2" />
                                              View Certificate
                                            </Button>
                                            <Button variant="outline" size="sm">
                                              <Download className="h-4 w-4 mr-2" />
                                              Download Specs
                                            </Button>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </TabsContent>

                                    <TabsContent value="integrations" className="space-y-4">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Portal Integrations</CardTitle>
                                          <CardDescription>Integration status with UDM and TMS portals</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                          <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                              <CheckCircle className="h-5 w-5 text-green-500" />
                                              <div>
                                                <p className="font-medium">UDM Portal</p>
                                                <p className="text-sm text-muted-foreground">www.ireps.gov.in</p>
                                              </div>
                                            </div>
                                            <div className="flex space-x-2">
                                              <Badge className="bg-green-100 text-green-800">Synced</Badge>
                                              <Button variant="outline" size="sm">
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                View in UDM
                                              </Button>
                                            </div>
                                          </div>
                                          <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                              <CheckCircle className="h-5 w-5 text-green-500" />
                                              <div>
                                                <p className="font-medium">TMS Portal</p>
                                                <p className="text-sm text-muted-foreground">www.irecept.gov.in</p>
                                              </div>
                                            </div>
                                            <div className="flex space-x-2">
                                              <Badge className="bg-green-100 text-green-800">Synced</Badge>
                                              <Button variant="outline" size="sm">
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                View in TMS
                                              </Button>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </TabsContent>
                                  </Tabs>
                                )}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
