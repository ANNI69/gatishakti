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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Calendar, Clock, AlertTriangle, CheckCircle, User, MapPin, QrCode, FileText, Plus } from "lucide-react"

// Mock data for inspection queue
const inspectionQueue = [
  {
    id: "INS-2024-001",
    componentId: "RID-2024-001234",
    componentType: "Elastic Rail Clip",
    location: "Sector 12-A, Track 3",
    dueDate: "2024-12-15",
    priority: "High",
    status: "Overdue",
    assignedTo: "INS-001",
    inspectorName: "John Smith",
    lastInspection: "2024-09-15",
    vendor: "Vendor A",
    batchNumber: "VB-2024-1156",
    qrCode: "QR-ERC-001234",
  },
  {
    id: "INS-2024-002",
    componentId: "RID-2024-001235",
    componentType: "Rail Pad",
    location: "Sector 8-B, Track 1",
    dueDate: "2024-12-18",
    priority: "Medium",
    status: "Scheduled",
    assignedTo: "INS-002",
    inspectorName: "Sarah Johnson",
    lastInspection: "2024-09-18",
    vendor: "Vendor B",
    batchNumber: "VB-2024-1157",
    qrCode: "QR-RP-001235",
  },
  {
    id: "INS-2024-003",
    componentId: "RID-2024-001236",
    componentType: "Liner",
    location: "Sector 15-C, Track 2",
    dueDate: "2024-12-20",
    priority: "Low",
    status: "Pending",
    assignedTo: null,
    inspectorName: null,
    lastInspection: "2024-09-20",
    vendor: "Vendor C",
    batchNumber: "VB-2024-1158",
    qrCode: "QR-LN-001236",
  },
  {
    id: "INS-2024-004",
    componentId: "RID-2024-001237",
    componentType: "Sleeper",
    location: "Sector 5-A, Track 4",
    dueDate: "2024-12-22",
    priority: "High",
    status: "In Progress",
    assignedTo: "INS-003",
    inspectorName: "Mike Wilson",
    lastInspection: "2024-09-22",
    vendor: "Vendor D",
    batchNumber: "VB-2024-1159",
    qrCode: "QR-SL-001237",
  },
]

const inspectors = [
  { id: "INS-001", name: "John Smith", status: "Available", currentLoad: 5 },
  { id: "INS-002", name: "Sarah Johnson", status: "Busy", currentLoad: 8 },
  { id: "INS-003", name: "Mike Wilson", status: "Available", currentLoad: 3 },
  { id: "INS-004", name: "Lisa Brown", status: "Available", currentLoad: 2 },
]

export default function InspectionPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [selectedInspections, setSelectedInspections] = useState<string[]>([])
  const [selectedInspection, setSelectedInspection] = useState<(typeof inspectionQueue)[0] | null>(null)

  const filteredInspections = inspectionQueue.filter((inspection) => {
    const matchesSearch =
      inspection.componentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.componentType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || inspection.status.toLowerCase() === filterStatus.toLowerCase()
    const matchesPriority =
      filterPriority === "all" || inspection.priority.toLowerCase() === filterPriority.toLowerCase()

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "in progress":
        return <Badge className="bg-purple-100 text-purple-800">In Progress</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleSelectInspection = (inspectionId: string, checked: boolean) => {
    if (checked) {
      setSelectedInspections([...selectedInspections, inspectionId])
    } else {
      setSelectedInspections(selectedInspections.filter((id) => id !== inspectionId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedInspections(filteredInspections.map((inspection) => inspection.id))
    } else {
      setSelectedInspections([])
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
                  <h1 className="text-3xl font-bold text-foreground">Inspection Queue</h1>
                  <p className="text-muted-foreground">Manage and track component inspections</p>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Inspection
                </Button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">+3 from yesterday</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">5</div>
                    <p className="text-xs text-muted-foreground">Requires immediate attention</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">Currently being inspected</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">+4 from yesterday</p>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="queue" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="queue">Inspection Queue</TabsTrigger>
                  <TabsTrigger value="inspectors">Inspectors</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                </TabsList>

                <TabsContent value="queue" className="space-y-6">
                  {/* Search and Filters */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Search & Filter</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <Label htmlFor="search">Search Inspections</Label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="search"
                              placeholder="Search by RID, location, or type..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="w-full md:w-48">
                          <Label htmlFor="status-filter">Status</Label>
                          <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger>
                              <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Status</SelectItem>
                              <SelectItem value="overdue">Overdue</SelectItem>
                              <SelectItem value="scheduled">Scheduled</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in progress">In Progress</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-full md:w-48">
                          <Label htmlFor="priority-filter">Priority</Label>
                          <Select value={filterPriority} onValueChange={setFilterPriority}>
                            <SelectTrigger>
                              <SelectValue placeholder="All Priorities" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Priorities</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bulk Actions */}
                  {selectedInspections.length > 0 && (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            {selectedInspections.length} inspection(s) selected
                          </p>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Assign Inspector
                            </Button>
                            <Button variant="outline" size="sm">
                              Reschedule
                            </Button>
                            <Button variant="outline" size="sm">
                              Export
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Inspection Queue Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Inspection Queue</CardTitle>
                      <CardDescription>
                        Found {filteredInspections.length} inspections matching your criteria
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">
                              <Checkbox
                                checked={selectedInspections.length === filteredInspections.length}
                                onCheckedChange={handleSelectAll}
                              />
                            </TableHead>
                            <TableHead>Component</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Inspector</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredInspections.map((inspection) => (
                            <TableRow key={inspection.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedInspections.includes(inspection.id)}
                                  onCheckedChange={(checked) =>
                                    handleSelectInspection(inspection.id, checked as boolean)
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{inspection.componentId}</p>
                                  <p className="text-xs text-muted-foreground font-mono">{inspection.qrCode}</p>
                                </div>
                              </TableCell>
                              <TableCell>{inspection.componentType}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm">{inspection.location}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm">{inspection.dueDate}</span>
                                </div>
                              </TableCell>
                              <TableCell>{getPriorityBadge(inspection.priority)}</TableCell>
                              <TableCell>{getStatusBadge(inspection.status)}</TableCell>
                              <TableCell>
                                {inspection.inspectorName ? (
                                  <div className="flex items-center space-x-1">
                                    <User className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sm">{inspection.inspectorName}</span>
                                  </div>
                                ) : (
                                  <span className="text-sm text-muted-foreground">Unassigned</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setSelectedInspection(inspection)}
                                    >
                                      View
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Inspection Details - {inspection.id}</DialogTitle>
                                      <DialogDescription>Complete inspection information and actions</DialogDescription>
                                    </DialogHeader>

                                    {selectedInspection && (
                                      <div className="space-y-6">
                                        {/* Component Information */}
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label>Component ID</Label>
                                            <p className="font-medium">{selectedInspection.componentId}</p>
                                          </div>
                                          <div>
                                            <Label>Component Type</Label>
                                            <p className="font-medium">{selectedInspection.componentType}</p>
                                          </div>
                                          <div>
                                            <Label>QR Code</Label>
                                            <p className="font-mono text-sm">{selectedInspection.qrCode}</p>
                                          </div>
                                          <div>
                                            <Label>Location</Label>
                                            <p className="font-medium">{selectedInspection.location}</p>
                                          </div>
                                          <div>
                                            <Label>Vendor</Label>
                                            <p className="font-medium">{selectedInspection.vendor}</p>
                                          </div>
                                          <div>
                                            <Label>Batch Number</Label>
                                            <p className="font-medium">{selectedInspection.batchNumber}</p>
                                          </div>
                                        </div>

                                        {/* Inspection Details */}
                                        <div className="border-t pt-4">
                                          <h4 className="font-medium mb-3">Inspection Information</h4>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <Label>Due Date</Label>
                                              <p className="font-medium">{selectedInspection.dueDate}</p>
                                            </div>
                                            <div>
                                              <Label>Priority</Label>
                                              {getPriorityBadge(selectedInspection.priority)}
                                            </div>
                                            <div>
                                              <Label>Status</Label>
                                              {getStatusBadge(selectedInspection.status)}
                                            </div>
                                            <div>
                                              <Label>Last Inspection</Label>
                                              <p className="font-medium">{selectedInspection.lastInspection}</p>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Inspector Assignment */}
                                        <div className="border-t pt-4">
                                          <h4 className="font-medium mb-3">Inspector Assignment</h4>
                                          <div className="space-y-3">
                                            <div>
                                              <Label htmlFor="inspector-select">Assign Inspector</Label>
                                              <Select defaultValue={selectedInspection.assignedTo || ""}>
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Select inspector" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {inspectors.map((inspector) => (
                                                    <SelectItem key={inspector.id} value={inspector.id}>
                                                      {inspector.name} ({inspector.status} - {inspector.currentLoad}{" "}
                                                      inspections)
                                                    </SelectItem>
                                                  ))}
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            <div>
                                              <Label htmlFor="inspection-notes">Inspection Notes</Label>
                                              <Textarea
                                                id="inspection-notes"
                                                placeholder="Add any special instructions or notes for the inspector..."
                                              />
                                            </div>
                                          </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex space-x-2 pt-4">
                                          <Button>
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Assign & Schedule
                                          </Button>
                                          <Button variant="outline">
                                            <QrCode className="mr-2 h-4 w-4" />
                                            Scan QR Code
                                          </Button>
                                          <Button variant="outline">
                                            <FileText className="mr-2 h-4 w-4" />
                                            Generate Report
                                          </Button>
                                        </div>
                                      </div>
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
                </TabsContent>

                <TabsContent value="inspectors" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Inspector Management</CardTitle>
                      <CardDescription>Manage inspector assignments and workload</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {inspectors.map((inspector) => (
                          <Card key={inspector.id}>
                            <CardContent className="pt-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <div className="bg-primary rounded-full p-2">
                                    <User className="h-4 w-4 text-primary-foreground" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{inspector.name}</p>
                                    <p className="text-sm text-muted-foreground">{inspector.id}</p>
                                  </div>
                                </div>
                                <Badge
                                  className={
                                    inspector.status === "Available"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }
                                >
                                  {inspector.status}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Current Workload:</span>
                                  <span className="font-medium">{inspector.currentLoad} inspections</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full"
                                    style={{ width: `${(inspector.currentLoad / 10) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              <Button variant="outline" className="w-full mt-4 bg-transparent">
                                View Schedule
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="schedule" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Inspection Schedule</CardTitle>
                      <CardDescription>Weekly inspection schedule overview</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Schedule view will be implemented here</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          This would show a calendar view of scheduled inspections
                        </p>
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
