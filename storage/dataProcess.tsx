// "use client"

// import { useState, useRef, useEffect } from 'react'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Progress } from "@/components/ui/progress"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import ReactWordcloud from 'react-wordcloud'
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
// import { ChevronLeft, ChevronRight, Upload } from 'lucide-react'

// // Mock data for word cloud and length distribution
// const words = [
//   { text: 'hello', value: 64 },
//   { text: 'world', value: 40 },
//   { text: 'data', value: 32 },
//   { text: 'analysis', value: 28 },
//   { text: 'tokenizer', value: 26 },
//   { text: 'model', value: 24 },
//   { text: 'AI', value: 22 },
//   { text: 'machine', value: 20 },
//   { text: 'learning', value: 18 },
//   { text: 'dataset', value: 16 },
// ]

// const lengthDistribution = [
//   { length: '0-10', count: 15 },
//   { length: '11-20', count: 30 },
//   { length: '21-30', count: 25 },
//   { length: '31-40', count: 20 },
//   { length: '41-50', count: 10 },
//   { length: '51+', count: 5 },
// ]

// export default function DatasetManagement() {
//   const [file, setFile] = useState<File | null>(null)
//   const [dataPreview, setDataPreview] = useState<Array<{ system: string; input: string; output: string }>>([
//     { system: "You are a helpful AI assistant.", input: "What is the capital of France?", output: "The capital of France is Paris. Paris is not only the capital city but also the largest city in France. It is known for its iconic landmarks such as the Eiffel Tower, the Louvre Museum, and Notre-Dame Cathedral. Paris is also a global center for art, fashion, gastronomy, and culture." },
//     { system: "You are a knowledgeable history teacher.", input: "Explain the significance of the Industrial Revolution.", output: "The Industrial Revolution was a period of major industrialization and innovation that took place during the late 1700s and early 1800s. It began in Great Britain and quickly spread to other parts of the world. This revolution marked a major turning point in history, influencing almost every aspect of daily life in some way. The Industrial Revolution led to the development of new manufacturing processes, the growth of factories, urbanization, and significant social changes. It transformed economies from being largely rural and agricultural to being urban and industrial. Some key inventions during this period include the steam engine, spinning jenny, and telegraph. The Industrial Revolution had far-reaching effects on society, economics, politics, and the environment, many of which we still feel today." },
//     { system: "You are an expert in computer science.", input: "What is machine learning and how does it work?", output: "Machine learning is a subset of artificial intelligence (AI) that focuses on the development of computer programs that can access data and use it to learn for themselves. The process of learning begins with observations or data, such as examples, direct experience, or instruction, in order to look for patterns in data and make better decisions in the future based on the examples that we provide. The primary aim is to allow the computers to learn automatically without human intervention or assistance and adjust actions accordingly. Machine learning algorithms use computational methods to 'learn' information directly from data without relying on a predetermined equation as a model. The algorithms adaptively improve their performance as the number of samples available for learning increases. Machine learning is used in various applications such as email filtering, detection of network intruders, and computer vision, where it is difficult or infeasible to develop conventional algorithms to perform the needed tasks." },
//   ])
//   const [currentDataIndex, setCurrentDataIndex] = useState(0)
//   const [isConverting, setIsConverting] = useState(false)
//   const [conversionProgress, setConversionProgress] = useState(0)
//   const [convertedTokenizer, setConvertedTokenizer] = useState<string | null>(null)
//   const [tokenizerSettings, setTokenizerSettings] = useState({
//     padding: true,
//     truncation: true,
//     max_length: 512,
//     return_tensors: "pt",
//     return_attention_mask: false,
//     add_special_tokens: false,
//     return_token_type_ids: false,
//     return_special_tokens_mask: false,
//     return_offsets_mapping: false,
//     is_split_into_words: false
//   })
//   const [dataSplit, setDataSplit] = useState({
//     train: 80,
//     test: 10,
//     validation: 10
//   })
//   const [seed, setSeed] = useState(42)

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files[0]) {
//       setFile(event.target.files[0])
//       // In a real application, you would parse the file and update dataPreview
//     }
//   }

//   const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault()
//   }

//   const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault()
//     if (event.dataTransfer.files && event.dataTransfer.files[0]) {
//       setFile(event.dataTransfer.files[0])
//       // In a real application, you would parse the file and update dataPreview
//     }
//   }

//   const handleUpload = () => {
//     // In a real application, you would handle the file upload here
//     console.log("Uploading file:", file?.name)
//   }

//   const handleTokenizerConversion = () => {
//     setIsConverting(true)
//     setConversionProgress(0)

//     // Simulating conversion process
//     const interval = setInterval(() => {
//       setConversionProgress((prevProgress) => {
//         if (prevProgress >= 100) {
//           clearInterval(interval)
//           setIsConverting(false)
//           setConvertedTokenizer("New Tokenizer Info: Vocabulary Size: 30000, Max Length: 512")
//           return 100
//         }
//         return prevProgress + 10
//       })
//     }, 500)
//   }

//   const handlePrevData = () => {
//     setCurrentDataIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex))
//   }

//   const handleNextData = () => {
//     setCurrentDataIndex((prevIndex) => (prevIndex < dataPreview.length - 1 ? prevIndex + 1 : prevIndex))
//   }

//   const handleTokenizerSettingsChange = (setting: string, value: any) => {
//     setTokenizerSettings(prev => ({ ...prev, [setting]: value }))
//   }

//   const handleDataSplitChange = (trainEnd: number, testEnd: number) => {
//     setDataSplit({
//       train: trainEnd,
//       test: testEnd - trainEnd,
//       validation: 100 - testEnd
//     })
//   }

//   const DataSplitVisualizer = () => {
//     const containerRef = useRef<HTMLDivElement>(null)
//     const [isDragging, setIsDragging] = useState<'train' | 'test' | null>(null)
//     const [startX, setStartX] = useState(0)
//     const [startSplit, setStartSplit] = useState({ train: 0, test: 0 })

//     useEffect(() => {
//       const handleMouseMove = (e: MouseEvent) => {
//         if (!isDragging || !containerRef.current) return

//         const containerRect = containerRef.current.getBoundingClientRect()
//         const containerWidth = containerRect.width
//         const deltaX = e.clientX - startX
//         const deltaPercent = (deltaX / containerWidth) * 100

//         if (isDragging === 'train') {
//           const newTrainEnd = Math.max(0, Math.min(startSplit.train + deltaPercent, startSplit.train + startSplit.test - 1))
//           handleDataSplitChange(newTrainEnd, startSplit.train + startSplit.test)
//         } else if (isDragging === 'test') {
//           const newTestEnd = Math.max(startSplit.train + 1, Math.min(startSplit.train + startSplit.test + deltaPercent, 100))
//           handleDataSplitChange(startSplit.train, newTestEnd)
//         }
//       }

//       const handleMouseUp = () => {
//         setIsDragging(null)
//       }

//       if (isDragging) {
//         document.addEventListener('mousemove', handleMouseMove)
//         document.addEventListener('mouseup', handleMouseUp)
//       }

//       return () => {
//         document.removeEventListener('mousemove', handleMouseMove)
//         document.removeEventListener('mouseup', handleMouseUp)
//       }
//     }, [isDragging, startX, startSplit])

//     const handleMouseDown = (e: React.MouseEvent, type: 'train' | 'test') => {
//       e.preventDefault()
//       setIsDragging(type)
//       setStartX(e.clientX)
//       setStartSplit({ train: dataSplit.train, test: dataSplit.test })
//     }

//     const handleClick = (e: React.MouseEvent) => {
//       if (!containerRef.current) return

//       const containerRect = containerRef.current.getBoundingClientRect()
//       const clickX = e.clientX - containerRect.left
//       const clickPercent = (clickX / containerRect.width) * 100

//       if (clickPercent <= dataSplit.train + dataSplit.test / 2) {
//         // Clicked on the left side (Train or left half of Test)
//         handleDataSplitChange(clickPercent, dataSplit.train + dataSplit.test)
//       } else {
//         // Clicked on the right side (right half of Test or Validation)
//         handleDataSplitChange(dataSplit.train, clickPercent)
//       }
//     }

//     return (
//       <div className="mt-4">
//         <div className="flex justify-between text-sm mb-2">
//           <span>Train: {dataSplit.train.toFixed(1)}%</span>
//           <span>Test: {dataSplit.test.toFixed(1)}%</span>
//           <span>Validation: {dataSplit.validation.toFixed(1)}%</span>
//         </div>
//         <div
//           ref={containerRef}
//           className="relative h-8 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
//           onClick={handleClick}
//         >
//           <div
//             className="absolute h-full bg-blue-500"
//             style={{ width: `${dataSplit.train}%` }}
//           />
//           <div
//             className="absolute h-full bg-green-500"
//             style={{ width: `${dataSplit.test}%`, left: `${dataSplit.train}%` }}
//           />
//           <div
//             className="absolute h-full bg-yellow-500"
//             style={{ width: `${dataSplit.validation}%`, left: `${dataSplit.train + dataSplit.test}%` }}
//           />
//           <div
//             className="absolute w-4 h-8 bg-white border-2 border-gray-400 rounded-full cursor-ew-resize"
//             style={{ left: `calc(${dataSplit.train}% - 8px)` }}
//             onMouseDown={(e) => handleMouseDown(e, 'train')}
//           />
//           <div
//             className="absolute w-4 h-8 bg-white border-2 border-gray-400 rounded-full cursor-ew-resize"
//             style={{ left: `calc(${dataSplit.train + dataSplit.test}% - 8px)` }}
//             onMouseDown={(e) => handleMouseDown(e, 'test')}
//           />
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto p-4 bg-gray-50">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">AI Model Fine-tuning Interface</h1>

//       <Tabs defaultValue="dataset" className="space-y-4">
//         <TabsList className="grid w-full grid-cols-5 bg-blue-100 p-1 rounded-lg">
//           <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Dashboard</TabsTrigger>
//           <TabsTrigger value="model-config" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Model Config</TabsTrigger>
//           <TabsTrigger value="dataset" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Dataset</TabsTrigger>
//           <TabsTrigger value="training" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Training</TabsTrigger>
//           <TabsTrigger value="evaluation" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Evaluation</TabsTrigger>
//         </TabsList>

//         <TabsContent value="dataset" className="space-y-4">
//           <Card className="bg-white shadow-md">
//             <CardHeader>
//               <CardTitle>Upload Dataset</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div
//                 className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
//                 onDragOver={handleDragOver}
//                 onDrop={handleDrop}
//               >
//                 <p>Drag and drop your file here, or click to select a file</p>
//                 <Input
//                   type="file"
//                   onChange={handleFileChange}
//                   className="hidden"
//                   id="file-upload"
//                 />
//                 <label htmlFor="file-upload" className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//                   <Upload className="w-5 h-5 mr-2" />
//                   Select File
//                 </label>
//               </div>
//               {file && (
//                 <div className="mt-4">
//                   <p>Selected file: {file.name}</p>
//                   <Button onClick={handleUpload} className="bg-blue-500 hover:bg-blue-600 text-white mt-2">
//                     Upload
//                   </Button>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           <Card className="bg-white shadow-md">
//             <CardHeader>
//               <CardTitle>Dataset Preview</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <Button onClick={handlePrevData} disabled={currentDataIndex === 0}>
//                     <ChevronLeft className="h-4 w-4 mr-2" />
//                     Previous
//                   </Button>
//                   <span>{currentDataIndex + 1} / {dataPreview.length}</span>
//                   <Button onClick={handleNextData} disabled={currentDataIndex === dataPreview.length - 1}>
//                     Next
//                     <ChevronRight className="h-4 w-4 ml-2" />
//                   </Button>
//                 </div>
//                 <div className="grid grid-cols-3 gap-4">
//                   <div>
//                     <Label htmlFor="system">System</Label>
//                     <Textarea id="system" value={dataPreview[currentDataIndex].system} readOnly className="h-64 resize-none" />
//                   </div>
//                   <div>
//                     <Label htmlFor="input">Input</Label>
//                     <Textarea id="input" value={dataPreview[currentDataIndex].input} readOnly className="h-64 resize-none" />
//                   </div>
//                   <div>
//                     <Label htmlFor="output">Output</Label>
//                     <Textarea id="output" value={dataPreview[currentDataIndex].output} readOnly className="h-64 resize-none" />
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <div className="grid grid-cols-2 gap-4">
//             <Card className="bg-white shadow-md">
//               <CardHeader>
//                 <CardTitle>Data Analysis</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <h3 className="font-semibold mb-2">Word Cloud</h3>
//                   <div className="h-64">
//                     <ReactWordcloud words={words} options={{ colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'], enableTooltip: true }} />
//                   </div>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold mb-2">Length Distribution</h3>
//                   <div className="h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={lengthDistribution}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="length" />
//                         <YAxis />
//                         <Tooltip />
//                         <Bar dataKey="count" fill="#8884d8" />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="space-y-4">
//               <Card className="bg-white shadow-md">
//                 <CardHeader>
//                   <CardTitle>Data Cleaning</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Filter by length:</label>
//                     <div className="flex space-x-2 mt-1">
//                       <Input placeholder="Min" type="number" className="w-1/2" />
//                       <Input placeholder="Max" type="number" className="w-1/2" />
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Checkbox id="remove-duplicates" />
//                     <label htmlFor="remove-duplicates">Remove duplicates</label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Checkbox id="remove-empty" />
//                     <label htmlFor="remove-empty">Remove empty entries</label>
//                   </div>
//                   <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full">
//                     Apply Cleaning
//                   </Button>
//                 </CardContent>
//               </Card>

//               <Card className="bg-white shadow-md">
//                 <CardHeader>
//                   <CardTitle>Data Split & Tokenizer Conversion</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div>
//                     <Label>Data Split</Label>
//                     <DataSplitVisualizer />
//                   </div>
//                   <div>
//                     <Label htmlFor="seed">Seed</Label>
//                     <Input
//                       id="seed"
//                       type="number"
//                       value={seed}
//                       onChange={(e) => setSeed(Number(e.target.value))}
//                       min={0}
//                     />
//                   </div>
//                   <Dialog>
//                     <DialogTrigger asChild>
//                       <Button className="bg-gray-500 hover:bg-gray-600 text-white w-full">
//                         Tokenization Settings
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent className="sm:max-w-[425px]">
//                       <DialogHeader>
//                         <DialogTitle>Tokenization Settings</DialogTitle>
//                       </DialogHeader>
//                       <div className="grid gap-4 py-4">
//                         <div className="flex items-center justify-between">
//                           <Label htmlFor="padding" className="mr-2">
//                             Padding
//                           </Label>
//                           <Checkbox
//                             id="padding"
//                             checked={tokenizerSettings.padding}
//                             onCheckedChange={(checked) => handleTokenizerSettingsChange('padding', checked)}
//                           />
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <Label htmlFor="truncation" className="mr-2">
//                             Truncation
//                           </Label>
//                           <Checkbox
//                             id="truncation"
//                             checked={tokenizerSettings.truncation}
//                             onCheckedChange={(checked) => handleTokenizerSettingsChange('truncation', checked)}
//                           />
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <Label htmlFor="max_length" className="mr-2">
//                             Max Length
//                           </Label>
//                           <Input
//                             id="max_length"
//                             type="number"
//                             value={tokenizerSettings.max_length}
//                             onChange={(e) => handleTokenizerSettingsChange('max_length', Number(e.target.value))}
//                             className="w-20"
//                           />
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <Label htmlFor="return_tensors" className="mr-2">
//                             Return Tensors
//                           </Label>
//                           <Select
//                             value={tokenizerSettings.return_tensors}
//                             onValueChange={(value) => handleTokenizerSettingsChange('return_tensors', value)}
//                           >
//                             <SelectTrigger className="w-[100px]">
//                               <SelectValue placeholder="Select" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="pt">pt</SelectItem>
//                               <SelectItem value="tf">tf</SelectItem>
//                               <SelectItem value="np">np</SelectItem>
//                               <SelectItem value="jax">jax</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <Label htmlFor="return_attention_mask" className="mr-2">
//                             Return Attention Mask
//                           </Label>
//                           <Checkbox
//                             id="return_attention_mask"
//                             checked={tokenizerSettings.return_attention_mask}
//                             onCheckedChange={(checked) => handleTokenizerSettingsChange('return_attention_mask', checked)}
//                           />
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <Label htmlFor="add_special_tokens" className="mr-2">
//                             Add Special Tokens
//                           </Label>
//                           <Checkbox
//                             id="add_special_tokens"
//                             checked={tokenizerSettings.add_special_tokens}
//                             onCheckedChange={(checked) => handleTokenizerSettingsChange('add_special_tokens', checked)}
//                           />
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <Label htmlFor="return_token_type_ids" className="mr-2">
//                             Return Token Type IDs
//                           </Label>
//                           <Checkbox
//                             id="return_token_type_ids"
//                             checked={tokenizerSettings.return_token_type_ids}
//                             onCheckedChange={(checked) => handleTokenizerSettingsChange('return_token_type_ids', checked)}
//                           />
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <Label htmlFor="return_special_tokens_mask" className="mr-2">
//                             Return Special Tokens Mask
//                           </Label>
//                           <Checkbox
//                             id="return_special_tokens_mask"
//                             checked={tokenizerSettings.return_special_tokens_mask}
//                             onCheckedChange={(checked) => handleTokenizerSettingsChange('return_special_tokens_mask', checked)}
//                           />
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <Label htmlFor="return_offsets_mapping" className="mr-2">
//                             Return Offsets Mapping
//                           </Label>
//                           <Checkbox
//                             id="return_offsets_mapping"
//                             checked={tokenizerSettings.return_offsets_mapping}
//                             onCheckedChange={(checked) => handleTokenizerSettingsChange('return_offsets_mapping', checked)}
//                           />
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <Label htmlFor="is_split_into_words" className="mr-2">
//                             Is Split Into Words
//                           </Label>
//                           <Checkbox
//                             id="is_split_into_words"
//                             checked={tokenizerSettings.is_split_into_words}
//                             onCheckedChange={(checked) => handleTokenizerSettingsChange('is_split_into_words', checked)}
//                           />
//                         </div>
//                       </div>
//                     </DialogContent>
//                   </Dialog>
//                   <Button 
//                     className="bg-blue-500 hover:bg-blue-600 text-white w-full"
//                     onClick={handleTokenizerConversion}
//                     disabled={isConverting}
//                   >
//                     {isConverting ? "Converting..." : "Convert Tokenizer"}
//                   </Button>
//                   {isConverting && (
//                     <Progress value={conversionProgress} className="w-full" />
//                   )}
//                   {convertedTokenizer && (
//                     <div className="mt-4 p-4 bg-gray-100 rounded">
//                       <h3 className="font-semibold mb-2">Converted Tokenizer Info:</h3>
//                       <p>{convertedTokenizer}</p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }