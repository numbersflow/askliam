// "use client"

// import React, { useState } from 'react'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress"
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
// import { BarChart, Bar } from 'recharts'

// const tokenAccuracyData = [
//   { position: 1, accuracy: 0.6 },
//   { position: 2, accuracy: 0.7 },
//   { position: 3, accuracy: 0.65 },
//   { position: 4, accuracy: 0.8 },
//   { position: 5, accuracy: 0.75 },
// ]

// const errorAnalysisData = [
//   { name: 'Repetitive phrases', value: 15 },
//   { name: 'Incorrect facts', value: 8 },
//   { name: 'Inconsistent context', value: 5 },
//   { name: 'Grammatical errors', value: 3 },
//   { name: 'Off-topic responses', value: 2 },
// ]

// export default function AIModelInterface() {
//   const [activeTab, setActiveTab] = useState("evaluation")
//   const [isLoading, setIsLoading] = useState(false)
//   const [progress, setProgress] = useState(0)
//   const [evaluationComplete, setEvaluationComplete] = useState(false)
//   const [selectedModel, setSelectedModel] = useState("")

//   const handleEvaluate = () => {
//     if (!selectedModel) {
//       alert("Please select a model first")
//       return
//     }
//     setIsLoading(true)
//     setProgress(0)
//     setEvaluationComplete(false)

//     const interval = setInterval(() => {
//       setProgress((prevProgress) => {
//         if (prevProgress >= 100) {
//           clearInterval(interval)
//           setIsLoading(false)
//           setEvaluationComplete(true)
//           return 100
//         }
//         return prevProgress + 10
//       })
//     }, 500)
//   }

//   return (
//     <div className="container mx-auto p-4 bg-gray-50">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">AI Model Fine-tuning Interface</h1>

//       <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
//         <TabsList className="grid w-full grid-cols-5 bg-blue-100 p-1 rounded-lg">
//           <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Dashboard</TabsTrigger>
//           <TabsTrigger value="model-config" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Model Config</TabsTrigger>
//           <TabsTrigger value="dataset" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Dataset</TabsTrigger>
//           <TabsTrigger value="training" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Training</TabsTrigger>
//           <TabsTrigger value="evaluation" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Evaluation</TabsTrigger>
//         </TabsList>

//         <TabsContent value="evaluation" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Select Causal LM for Evaluation</CardTitle>
//             </CardHeader>
//             <CardContent className="flex items-center space-x-4">
//               <Select value={selectedModel} onValueChange={setSelectedModel}>
//                 <SelectTrigger className="w-[200px]">
//                   <SelectValue placeholder="Choose Model" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="gpt2">GPT-2</SelectItem>
//                   <SelectItem value="gpt3">GPT-3</SelectItem>
//                   <SelectItem value="bert">BERT</SelectItem>
//                 </SelectContent>
//               </Select>
//               <Button onClick={handleEvaluate} disabled={isLoading}>
//                 {isLoading ? "Evaluating..." : "Evaluate"}
//               </Button>
//             </CardContent>
//           </Card>

//           {isLoading && (
//             <Card>
//               <CardContent className="py-6">
//                 <Progress value={progress} className="w-full" />
//                 <p className="text-center mt-2">Evaluating model... {progress}%</p>
//               </CardContent>
//             </Card>
//           )}

//           {evaluationComplete && (
//             <>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <MetricCard title="Perplexity" value="15.23" />
//                 <MetricCard title="Avg. Token Accuracy" value="0.62" />
//                 <MetricCard title="BLEU Score" value="32.5" />
//                 <MetricCard title="Avg. Response Time" value="0.25s" />
//                 <MetricCard title="F1 Score" value="0.78" />
//                 <MetricCard title="ROUGE-L" value="0.56" />
//                 <MetricCard title="METEOR" value="0.68" />
//                 <MetricCard title="Coherence Score" value="0.82" />
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Token Prediction Accuracy</CardTitle>
//                   </CardHeader>
//                   <CardContent className="h-[300px]">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <LineChart data={tokenAccuracyData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="position" />
//                         <YAxis />
//                         <Tooltip />
//                         <Line type="monotone" dataKey="accuracy" stroke="#8884d8" />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Error Analysis</CardTitle>
//                   </CardHeader>
//                   <CardContent className="h-[300px]">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={errorAnalysisData} layout="vertical">
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis type="number" />
//                         <YAxis dataKey="name" type="category" width={150} />
//                         <Tooltip />
//                         <Bar dataKey="value" fill="#82ca9d" />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </CardContent>
//                 </Card>
//               </div>

//               <Card>
//                 <CardHeader>
//                   <CardTitle>Generated Text Sample</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="font-semibold mb-2">Prompt: "The future of AI is..."</p>
//                   <p className="bg-gray-100 p-4 rounded">
//                     "The future of AI is both exciting and challenging. As technology continues to advance,
//                     we can expect AI to play an increasingly significant role in various aspects of our lives,
//                     from healthcare and education to transportation and entertainment. However, it's crucial
//                     to address ethical concerns and ensure that AI development aligns with human values and societal needs."
//                   </p>
//                 </CardContent>
//               </Card>
//             </>
//           )}
//         </TabsContent>

//         {/* Placeholder content for other tabs */}
//         <TabsContent value="dashboard">Dashboard content goes here</TabsContent>
//         <TabsContent value="model-config">Model configuration content goes here</TabsContent>
//         <TabsContent value="dataset">Dataset management content goes here</TabsContent>
//         <TabsContent value="training">Training process content goes here</TabsContent>
//       </Tabs>
//     </div>
//   )
// }

// function MetricCard({ title, value }: { title: string; value: string }) {
//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <CardTitle className="text-sm font-medium">{title}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="text-2xl font-bold">{value}</div>
//       </CardContent>
//     </Card>
//   )
// }