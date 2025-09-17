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
import { Textarea } from "@/components/ui/textarea"
import { QrCode, Camera, Search, Package, MapPin, User, CheckCircle, AlertTriangle } from "lucide-react"

export default function ScannerPage() {
  const [scannedCode, setScannedCode] = useState("")
  const [scanResult, setScanResult] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)

  const handleScan = () => {
    setIsScanning(true)
    // Simulate scanning process
    setTimeout(() => {
      // Mock scan result
      setScanResult({
        id: "RID-2024-001234",
        type: "Elastic Rail Clip",
        qrCode: scannedCode || "QR-ERC-001234",
        vendor: "Vendor A",
        batchNumber: "VB-2024-1156",
        location: "Sector 12-A, Track 3",
        status: "Active",
        lastInspection: "2024-11-01",
        nextInspection: "2025-02-01",
        qualityScore: 98,
        warrantyExpiry: "2027-01-15",
      })
      setIsScanning(false)
    }, 2000)
  }

  const handleManualEntry = () => {
    if (scannedCode) {
      handleScan()
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
              <div>
                <h1 className="text-3xl font-bold text-foreground">QR Code Scanner</h1>
                <p className="text-muted-foreground">Scan QR codes on track fittings to access component information</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Scanner Interface */}
                <Card>
                  <CardHeader>
                    <CardTitle>QR Code Scanner</CardTitle>
                    <CardDescription>Use your device camera or enter QR code manually</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Camera Scanner Placeholder */}
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                      {isScanning ? (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                          <p className="text-sm text-muted-foreground">Scanning QR Code...</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-sm text-muted-foreground">Camera view will appear here</p>
                        </div>
                      )}
                    </div>

                    <Button onClick={handleScan} className="w-full" disabled={isScanning}>
                      <QrCode className="mr-2 h-4 w-4" />
                      {isScanning ? "Scanning..." : "Start Camera Scan"}
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or</span>
                      </div>
                    </div>

                    {/* Manual Entry */}
                    <div className="space-y-2">
                      <Label htmlFor="manual-code">Enter QR Code Manually</Label>
                      <Input
                        id="manual-code"
                        placeholder="QR-ERC-001234"
                        value={scannedCode}
                        onChange={(e) => setScannedCode(e.target.value)}
                      />
                    </div>

                    <Button onClick={handleManualEntry} variant="outline" className="w-full bg-transparent">
                      <Search className="mr-2 h-4 w-4" />
                      Search Component
                    </Button>
                  </CardContent>
                </Card>

                {/* Scan Results */}
                <Card>
                  <CardHeader>
                    <CardTitle>Scan Results</CardTitle>
                    <CardDescription>Component information will appear here after scanning</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {scanResult ? (
                      <div className="space-y-4">
                        {/* Component Header */}
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{scanResult.id}</h3>
                            <p className="text-sm text-muted-foreground">{scanResult.type}</p>
                          </div>
                          <Badge
                            className={
                              scanResult.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {scanResult.status}
                          </Badge>
                        </div>

                        {/* Component Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <QrCode className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">QR Code:</span>
                            </div>
                            <p className="font-mono text-xs bg-muted p-2 rounded">{scanResult.qrCode}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Batch:</span>
                            </div>
                            <p>{scanResult.batchNumber}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Location:</span>
                            </div>
                            <p>{scanResult.location}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Vendor:</span>
                            </div>
                            <p>{scanResult.vendor}</p>
                          </div>
                        </div>

                        {/* Inspection Status */}
                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-2">Inspection Status</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Last Inspection:</p>
                              <p className="font-medium">{scanResult.lastInspection}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Next Inspection:</p>
                              <p className="font-medium">{scanResult.nextInspection}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Quality Score:</p>
                              <div className="flex items-center space-x-2">
                                <p className="font-medium">{scanResult.qualityScore}%</p>
                                {scanResult.qualityScore >= 95 ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Warranty Expiry:</p>
                              <p className="font-medium">{scanResult.warrantyExpiry}</p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="border-t pt-4 space-y-2">
                          <Button className="w-full">View Full Details</Button>
                          <Button variant="outline" className="w-full bg-transparent">
                            Schedule Inspection
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <QrCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Scan a QR code to view component details</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              {scanResult && (
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Perform common actions for this component</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="inspection-notes">Add Inspection Notes</Label>
                        <Textarea
                          id="inspection-notes"
                          placeholder="Enter any observations or notes about this component..."
                          className="mt-1"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Inspected
                        </Button>
                        <Button variant="outline">
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Report Issue
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
