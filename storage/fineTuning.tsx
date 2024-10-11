// import React, { useState, useCallback } from 'react'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Slider } from "@/components/ui/slider"
// import { Settings } from 'lucide-react'
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// const trainingLossData = [
//   { name: '1', value: 0.5 },
//   { name: '2', value: 0.7 },
//   { name: '3', value: 0.6 },
//   { name: '4', value: 0.65 },
//   { name: '5', value: 0.9 },
// ]

// const gpuUtilizationData = [
//   { name: '1', value: 20 },
//   { name: '2', value: 50 },
//   { name: '3', value: 40 },
//   { name: '4', value: 70 },
//   { name: '5', value: 90 },
// ]

// interface TrainingOptionsModalProps {
//   isOpen: boolean;
//   onOpenChange: (open: boolean) => void;
//   trainingOptions: Record<string, boolean>;
//   onTrainingOptionChange: (option: string, value: boolean) => void;
//   activeSettingsOption: string | null;
//   setActiveSettingsOption: (option: string | null) => void;
// }

// const TrainingOptionsModal: React.FC<TrainingOptionsModalProps> = ({
//   isOpen,
//   onOpenChange,
//   trainingOptions,
//   onTrainingOptionChange,
//   activeSettingsOption,
//   setActiveSettingsOption
// }) => {
//   const [peftSettings, setPeftSettings] = useState({
//     r: 8,
//     lora_alpha: 16,
//     lora_dropout: 0.1,
//     bias: 'none'
//   })

//   const [deepSpeedSettings, setDeepSpeedSettings] = useState({
//     stage: 2,
//     offloadOptimizer: true,
//     contiguousGradients: true
//   })

//   const [quantizationSettings, setQuantizationSettings] = useState({
//     method: 'dynamic',
//     bitsToUse: 8
//   })

//   const [hfToken, setHfToken] = useState('')
//   const [wandbToken, setWandbToken] = useState('')

//   const handlePeftChange = (key: string, value: number | string) => {
//     setPeftSettings(prev => ({ ...prev, [key]: value }))
//   }

//   const handleDeepSpeedChange = (key: string, value: number | boolean) => {
//     setDeepSpeedSettings(prev => ({ ...prev, [key]: value }))
//   }

//   const handleQuantizationChange = (key: string, value: string | number) => {
//     setQuantizationSettings(prev => ({ ...prev, [key]: value }))
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[850px] flex gap-4">
//         <div className="w-1/2">
//           <DialogHeader>
//             <DialogTitle>Training Options</DialogTitle>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             {Object.entries(trainingOptions).map(([option, value]) => (
//               <div key={option} className="flex items-center justify-between">
//                 <Label htmlFor={option}>{option.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
//                 <div className="flex items-center">
//                   <Switch
//                     id={option}
//                     checked={value}
//                     onCheckedChange={(checked) => onTrainingOptionChange(option, checked)}
//                   />
//                   <Button 
//                     variant="ghost" 
//                     size="icon" 
//                     className="ml-2" 
//                     onClick={() => setActiveSettingsOption(option)}
//                   >
//                     <Settings className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="w-1/2 border-l pl-4">
//           <DialogHeader>
//             <DialogTitle>{activeSettingsOption ? `${activeSettingsOption.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} Settings` : 'Additional Settings'}</DialogTitle>
//           </DialogHeader>
//           <div className="py-4">
//             {activeSettingsOption === 'usePeft' && (
//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="r_value">r_value</Label>
//                   <Input
//                     id="r_value"
//                     type="number"
//                     value={peftSettings.r}
//                     onChange={(e) => handlePeftChange('r', parseInt(e.target.value))}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="lora_alpha">lora_alpha</Label>
//                   <Input
//                     id="lora_alpha"
//                     type="number"
//                     value={peftSettings.lora_alpha}
//                     onChange={(e) => handlePeftChange('lora_alpha', parseInt(e.target.value))}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="lora_dropout">lora_dropout</Label>
//                   <Input
//                     id="lora_dropout"
//                     type="number"
//                     step="0.1"
//                     min="0"
//                     max="1"
//                     value={peftSettings.lora_dropout}
//                     onChange={(e) => handlePeftChange('lora_dropout', parseFloat(e.target.value))}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="bias">bias</Label>
//                   <Select value={peftSettings.bias} onValueChange={(value) => handlePeftChange('bias', value)}>
//                     <SelectTrigger id="bias">
//                       <SelectValue placeholder="Select bias" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="none">None</SelectItem>
//                       <SelectItem value="all">All</SelectItem>
//                       <SelectItem value="lora_only">LoRA only</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             )}
//             {activeSettingsOption === 'useDeepSpeed' && (
//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="deepspeed-stage">Stage</Label>
//                   <Select
//                     value={deepSpeedSettings.stage.toString()}
//                     onValueChange={(value) => handleDeepSpeedChange('stage', parseInt(value))}
//                   >
//                     <SelectTrigger id="deepspeed-stage">
//                       <SelectValue placeholder="Select stage" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="1">Stage 1</SelectItem>
//                       <SelectItem value="2">Stage 2</SelectItem>
//                       <SelectItem value="3">Stage 3</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Switch
//                     id="offload-optimizer"
//                     checked={deepSpeedSettings.offloadOptimizer}
//                     onCheckedChange={(checked) => handleDeepSpeedChange('offloadOptimizer', checked)}
//                   />
//                   <Label htmlFor="offload-optimizer">Offload Optimizer</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Switch
//                     id="contiguous-gradients"
//                     checked={deepSpeedSettings.contiguousGradients}
//                     onCheckedChange={(checked) => handleDeepSpeedChange('contiguousGradients', checked)}
//                   />
//                   <Label htmlFor="contiguous-gradients">Contiguous Gradients</Label>
//                 </div>
//               </div>
//             )}
//             {activeSettingsOption === 'useQuantization' && (
//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="quantization-method">Quantization Method</Label>
//                   <Select
//                     value={quantizationSettings.method}
//                     onValueChange={(value) => handleQuantizationChange('method', value)}
//                   >
//                     <SelectTrigger id="quantization-method">
//                       <SelectValue placeholder="Select method" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="dynamic">Dynamic</SelectItem>
//                       <SelectItem value="static">Static</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label htmlFor="bits-to-use">Bits to Use</Label>
//                   <Slider
//                     id="bits-to-use"
//                     min={4}
//                     max={8}
//                     step={1}
//                     value={[quantizationSettings.bitsToUse]}
//                     onValueChange={(value) => handleQuantizationChange('bitsToUse', value[0])}
//                   />
//                   <span className="text-sm text-gray-500">{quantizationSettings.bitsToUse} bits</span>
//                 </div>
//               </div>
//             )}
//             {activeSettingsOption === 'useHF' && (
//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="hf-token">Hugging Face Token</Label>
//                   <Input
//                     id="hf-token"
//                     type="password"
//                     value={hfToken}
//                     onChange={(e) => setHfToken(e.target.value)}
//                     placeholder="Enter your Hugging Face token"
//                   />
//                 </div>
//               </div>
//             )}
//             {activeSettingsOption === 'useWandB' && (
//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="wandb-token">Weights & Biases Token</Label>
//                   <Input
//                     id="wandb-token"
//                     type="password"
//                     value={wandbToken}
//                     onChange={(e) => setWandbToken(e.target.value)}
//                     placeholder="Enter your Weights & Biases token"
//                   />
//                 </div>
//               </div>
//             )}
//             {!activeSettingsOption && (
//               <p>Select a training option to view its settings.</p>
//             )}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

// export default function TrainingScreen() {
//   const [trainingProgress, setTrainingProgress] = useState(0)
//   const [estimatedTime, setEstimatedTime] = useState("0 minutes")
//   const [isTrainingOptionsOpen, setIsTrainingOptionsOpen] = useState(false)
//   const [isTrainingArgsOpen, setIsTrainingArgsOpen] = useState(false)
//   const [activeSettingsOption, setActiveSettingsOption] = useState<string | null>(null)
//   const [trainingOptions, setTrainingOptions] = useState({
//     usePeft: false,
//     useDeepSpeed: false,
//     useQuantization: false,
//     useHF: false,
//     useWandB: false,
//   })
//   const [trainingArgs, setTrainingArgs] = useState({
//     output_dir: '',
//     num_train_epochs: 3,
//     per_device_train_batch_size: 8,
//     per_device_eval_batch_size: 8,
//     gradient_accumulation_steps: 1,
//     eval_accumulation_steps: 1,
//     save_steps: 500,
//     save_total_limit: 3,
//     eval_strategy: 'steps',
//     eval_steps: 500,
//     logging_strategy: 'steps',
//     logging_steps: 100,
//     load_best_model_at_end: true,
//     greater_is_better: true,
//     metric_for_best_model: '',
//     fp16: false,
//     learning_rate: 5e-5,
//     warmup_steps: 0,
//     weight_decay: 0.01,
//     max_grad_norm: 1.0,
//     gradient_checkpointing: false,
//     report_to: '',
//   })

//   const handleStartTraining = useCallback(() => {
//     // Simulate training process
//     let progress = 0
//     const interval = setInterval(() => {
//       progress += 1
//       setTrainingProgress(progress)
//       setEstimatedTime(`${Math.round((100 - progress) / 2)} minutes`)
//       if (progress >= 100) {
//         clearInterval(interval)
//       }
//     }, 1000)
//   }, [])

//   const handleTrainingOptionChange = useCallback((option: string, value: boolean) => {
//     setTrainingOptions(prev => ({ ...prev, [option]: value }))
//     if (value) {
//       setActiveSettingsOption(option)
//     }
//   }, [])

//   const TrainingArgsModal = useCallback(() => (
//     <Dialog open={isTrainingArgsOpen} onOpenChange={setIsTrainingArgsOpen}>
//       <DialogContent className="sm:max-w-[725px]">
//         <DialogHeader>
//           <DialogTitle>Training Arguments</DialogTitle>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="output-dir">Output Directory</Label>
//               <Input
//                 id="output-dir"
//                 value={trainingArgs.output_dir}
//                 onChange={(e) => setTrainingArgs(prev => ({ ...prev, output_dir: e.target.value }))}
//               />
//             </div>
//             <div>
//               <Label htmlFor="num-train-epochs">Number of Epochs</Label>
//               <Input
//                 id="num-train-epochs"
//                 type="number"
//                 value={trainingArgs.num_train_epochs}
//                 onChange={(e) => setTrainingArgs(prev => ({ ...prev, num_train_epochs: parseInt(e.target.value) }))}
//               />
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="train-batch-size">Train Batch Size</Label>
//               <Input
//                 id="train-batch-size"
//                 type="number"
//                 value={trainingArgs.per_device_train_batch_size}
//                 onChange={(e) => setTrainingArgs(prev => ({ ...prev, per_device_train_batch_size: parseInt(e.target.value) }))}
//               />
//             </div>
//             <div>
//               <Label htmlFor="eval-batch-size">Eval Batch Size</Label>
//               <Input
//                 id="eval-batch-size"
//                 type="number"
//                 value={trainingArgs.per_device_eval_batch_size}
//                 onChange={(e) => setTrainingArgs(prev => ({ ...prev, per_device_eval_batch_size: parseInt(e.target.value) }))}
//               />
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   ), [isTrainingArgsOpen, trainingArgs])

//   return (
//     <div className="container mx-auto p-4 bg-white">
//       <h1 className="text-3xl font-bold mb-6">AI Model Fine-tuning Interface</h1>

//       <Tabs defaultValue="training" className="space-y-4">
//         <TabsList className="grid w-full grid-cols-5 bg-blue-100 p-1 rounded-lg">
//           <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Dashboard</TabsTrigger>
//           <TabsTrigger value="model-config" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Model Config</TabsTrigger>
//           <TabsTrigger value="dataset" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Dataset</TabsTrigger>
//           <TabsTrigger value="training" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Training</TabsTrigger>
//           <TabsTrigger value="evaluation" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Evaluation</TabsTrigger>
//         </TabsList>

//         <TabsContent value="training" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Project Settings</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-3 gap-4">
//                 <div>
//                   <Label htmlFor="main-project">Main Project:</Label>
//                   <Input id="main-project" placeholder="Enter main project" />
//                 </div>
//                 <div>
//                   <Label htmlFor="sub-project">Sub Project:</Label>
//                   <Input id="sub-project" placeholder="Enter sub project" />
//                 </div>
//                 <div>
//                   <Label htmlFor="model-alias">Model Alias:</Label>
//                   <Input id="model-alias" placeholder="Enter model alias" />
//                 </div>
//               </div>
//               <div className="grid grid-cols-3 gap-4">
//                 <div>
//                   <Label htmlFor="model-size">Model Size:</Label>
//                   <Input id="model-size" placeholder="Enter model size" />
//                 </div>
//                 <div>
//                   <Label htmlFor="task-type">Task Type:</Label>
//                   <Input id="task-type" placeholder="Enter task type" />
//                 </div>
//                 <div>
//                   <Label htmlFor="initial-model-name">Initial Model Name:</Label>
//                   <Input id="initial-model-name" placeholder="Enter initial model name" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <div className="grid grid-cols-2 gap-4">
//             <Card className="cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setIsTrainingOptionsOpen(true)}>
//               <CardHeader>
//                 <CardTitle>Training Options</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p>Click to configure training options</p>
//               </CardContent>
//             </Card>

//             <Card className="cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setIsTrainingArgsOpen(true)}>
//               <CardHeader>
//                 <CardTitle>Training Args</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p>Click to configure training arguments</p>
//               </CardContent>
//             </Card>
//           </div>

//           <TrainingOptionsModal 
//             isOpen={isTrainingOptionsOpen}
//             onOpenChange={setIsTrainingOptionsOpen}
//             trainingOptions={trainingOptions}
//             onTrainingOptionChange={handleTrainingOptionChange}
//             activeSettingsOption={activeSettingsOption}
//             setActiveSettingsOption={setActiveSettingsOption}
//           />
//           <TrainingArgsModal />

//           <div className="flex justify-center">
//             <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg rounded-full" onClick={handleStartTraining}>
//               Start Training
//             </Button>
//           </div>

//           <Card>
//             <CardHeader>
//               <CardTitle>Training Progress</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <Label>Progress:</Label>
//                 <span>{trainingProgress}%</span>
//               </div>
//               <Progress value={trainingProgress} className="w-full" />
//               <div className="text-center">
//                 <p>Estimated time remaining: {estimatedTime}</p>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Training Loss</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <ResponsiveContainer width="100%" height={200}>
//                       <LineChart data={trainingLossData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="name" />
//                         <YAxis />
//                         <Tooltip />
//                         <Line type="monotone" dataKey="value" stroke="#8884d8" />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle>GPU Utilization</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <ResponsiveContainer width="100%" height={200}>
//                       <LineChart data={gpuUtilizationData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="name" />
//                         <YAxis />
//                         <Tooltip />
//                         <Line type="monotone" dataKey="value" stroke="#82ca9d" />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   </CardContent>
//                 </Card>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }