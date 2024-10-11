import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

const PerformanceMonitoring: React.FC = () => {
  const renderPerformanceMetric = (label: string, value: string) => (
    <div className="flex justify-between items-center py-2">
      <span className="text-sm text-gray-600">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  )

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Performance Monitoring</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {renderPerformanceMetric("GPU Usage", "N/A")}
          {renderPerformanceMetric("Memory Usage", "N/A")}
          {renderPerformanceMetric("Inference Time", "N/A")}
          {renderPerformanceMetric("Tokens per Second", "N/A")}
          {renderPerformanceMetric("Total Params", "N/A")}
          {renderPerformanceMetric("VRAM Usage", "N/A")}
        </div>
      </CardContent>
    </Card>
  )
}

export default PerformanceMonitoring