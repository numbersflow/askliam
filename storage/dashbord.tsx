// import { useState } from 'react'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Progress } from "@/components/ui/progress"
// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// const trainingData = [
//   { epoch: 1, loss: 2.5, accuracy: 0.6 },
//   { epoch: 2, loss: 2.2, accuracy: 0.65 },
//   { epoch: 3, loss: 2.0, accuracy: 0.7 },
//   { epoch: 4, loss: 1.8, accuracy: 0.75 },
//   { epoch: 5, loss: 1.6, accuracy: 0.8 },
// ]

// const modelComparisonData = [
//   { epoch: 1, v1: 0.6, v2: 0.62, v3: 0.58 },
//   { epoch: 2, v1: 0.65, v2: 0.67, v3: 0.63 },
//   { epoch: 3, v1: 0.7, v2: 0.72, v3: 0.68 },
//   { epoch: 4, v1: 0.75, v2: 0.77, v3: 0.73 },
//   { epoch: 5, v1: 0.8, v2: 0.82, v3: 0.78 },
// ]

// export default function Dashboard() {
//   const [activeTab, setActiveTab] = useState("dashboard")
//   const [isTraining, setIsTraining] = useState(true)

//   return (
//     <div className="container mx-auto p-4">
//       <header className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">AI Model Fine-tuning Interface</h1>
//         <div className="flex items-center gap-4">
//           <span>Welcome, User123</span>
//           <Button variant="destructive">Logout</Button>
//         </div>
//       </header>

//       <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
//         <TabsList className="grid w-full grid-cols-5 bg-blue-100">
//           <TabsTrigger 
//             value="dashboard" 
//             className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
//           >
//             Dashboard
//           </TabsTrigger>
//           <TabsTrigger 
//             value="model-config"
//             className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
//           >
//             Model Config
//           </TabsTrigger>
//           <TabsTrigger 
//             value="dataset"
//             className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
//           >
//             Dataset
//           </TabsTrigger>
//           <TabsTrigger 
//             value="training"
//             className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
//           >
//             Training
//           </TabsTrigger>
//           <TabsTrigger 
//             value="evaluation"
//             className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
//           >
//             Evaluation
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="dashboard" className="space-y-4">
//           <Card className={isTraining ? "bg-green-100" : "bg-gray-100"}>
//             <CardContent className="p-4">
//               <h2 className="text-xl font-semibold">
//                 {isTraining ? "Currently Training" : "Training Inactive"}
//               </h2>
//               {isTraining ? (
//                 <p>Model: GPT-2 (Fine-tuned) | Epoch: 3/10 | Batch: 1500/5000 | Current Loss: 2.34 | Time Elapsed: 5h 23m</p>
//               ) : (
//                 <p>No active training session. Start a new training session from the Training tab.</p>
//               )}
//             </CardContent>
//           </Card>

//           <div className="grid grid-cols-3 gap-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Quick Stats</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p>Total Training Time: 5h 23m</p>
//                 <p>Estimated Time Remaining: 2h 30m</p>
//                 <p>Best Perplexity: 15.23</p>
//                 <p>Last Checkpoint: 30 min ago</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Model Performance Summary</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span>Accuracy:</span>
//                     <span className="font-semibold">85.6%</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>F1 Score:</span>
//                     <span className="font-semibold">0.823</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>BLEU Score:</span>
//                     <span className="font-semibold">32.5</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Perplexity:</span>
//                     <span className="font-semibold">15.23</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Recent Activities</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ul className="list-disc list-inside">
//                   <li>Checkpoint saved (30 min ago)</li>
//                   <li>Learning rate adjusted (1h ago)</li>
//                   <li>Dataset updated (5h ago)</li>
//                 </ul>
//               </CardContent>
//             </Card>
//           </div>

//           <Card>
//             <CardHeader>
//               <CardTitle>Training Progress</CardTitle>
//             </CardHeader>
//             <CardContent className="h-[300px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={trainingData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="epoch" />
//                   <YAxis yAxisId="left" />
//                   <YAxis yAxisId="right" orientation="right" />
//                   <Tooltip />
//                   <Legend />
//                   <Line yAxisId="left" type="monotone" dataKey="loss" stroke="#8884d8" name="Loss" />
//                   <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="#82ca9d" name="Accuracy" />
//                 </LineChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>

//           <div className="grid grid-cols-2 gap-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Resource Usage</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div>
//                     <div className="flex justify-between mb-1">
//                       <span>GPU: 80%</span>
//                       <span>28.2 GB / 32 GB</span>
//                     </div>
//                     <Progress value={80} />
//                   </div>
//                   <div>
//                     <div className="flex justify-between mb-1">
//                       <span>Memory: 88%</span>
//                       <span>28.2 GB / 32 GB</span>
//                     </div>
//                     <Progress value={88} />
//                   </div>
//                   <div>
//                     <div className="flex justify-between mb-1">
//                       <span>CPU: 45%</span>
//                     </div>
//                     <Progress value={45} />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Performance Metrics</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <h3 className="font-semibold">Perplexity</h3>
//                     <p className="text-3xl">15.23</p>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">BLEU Score</h3>
//                     <p className="text-3xl">32.5</p>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Token Accuracy</h3>
//                     <p className="text-3xl">0.62</p>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Response Time</h3>
//                     <p className="text-3xl">0.25s</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <Card>
//             <CardHeader>
//               <CardTitle>AI Model Performance Comparison</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex gap-6">
//                 <div className="w-1/4">
//                   <h3 className="font-semibold mb-2">Select Models to Compare</h3>
//                   <div className="space-y-2">
//                     <div className="flex items-center space-x-2">
//                       <Checkbox id="model1" />
//                       <label htmlFor="model1">Model v1.0.3 (2023-09-25)</label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Checkbox id="model2" />
//                       <label htmlFor="model2">Model v1.0.2 (2023-09-20)</label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Checkbox id="model3" />
//                       <label htmlFor="model3">Model v1.0.1 (2023-09-15)</label>
//                     </div>
//                   </div>
//                   <div className="mt-4">
//                     <h3 className="font-semibold mb-2">Select Performance Metric</h3>
//                     <select className="w-full p-2 border rounded">
//                       <option>Accuracy</option>
//                       <option>Loss</option>
//                       <option>Perplexity</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="w-3/4">
//                   <ResponsiveContainer width="100%" height={300}>
//                     <LineChart data={modelComparisonData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="epoch" />
//                       <YAxis />
//                       <Tooltip />
//                       <Legend />
//                       <Line type="monotone" dataKey="v1" stroke="#8884d8" name="Model v1.0.3" />
//                       <Line type="monotone" dataKey="v2" stroke="#82ca9d" name="Model v1.0.2" />
//                       <Line type="monotone" dataKey="v3" stroke="#ffc658" name="Model v1.0.1" />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="model-config">
//           <Card>
//             <CardHeader>
//               <CardTitle>Model Configuration</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p>Model configuration content goes here.</p>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="dataset">
//           <Card>
//             <CardHeader>
//               <CardTitle>Dataset Management</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p>Dataset management content goes here.</p>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="training">
//           <Card>
//             <CardHeader>
//               <CardTitle>Training Settings</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p>Training settings content goes here.</p>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="evaluation">
//           <Card>
//             <CardHeader>
//               <CardTitle>Model Evaluation</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p>Model evaluation content goes here.</p>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }