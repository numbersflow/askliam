import React, { useState } from 'react'
import { ChatInterface } from './ChatInterface'
import InferenceSettings from './InferenceSettings'
import PerformanceMonitoring from './PerformanceMonitoring'
import { Card, CardContent } from "../ui/card"

type InferenceSettingsType = {
  temperature: number;
  top_k: number;
  top_p: number;
  min_p: number;
  n_predict: number;
  n_keep: number;
  stream: boolean;
  tfs_z: number;
  typical_p: number;
  repeat_penalty: number;
  repeat_last_n: number;
  penalize_nl: boolean;
  presence_penalty: number;
  frequency_penalty: number;
  mirostat: number;
  mirostat_tau: number;
  mirostat_eta: number;
  seed: number;
  ignore_eos: boolean;
  cache_prompt: boolean;
}

const AskLiam: React.FC = () => {
  const [inferenceSettings, setInferenceSettings] = useState<InferenceSettingsType>({
    temperature: 0.8,
    top_k: 40,
    top_p: 0.95,
    min_p: 0.05,
    n_predict: -1,
    n_keep: 0,
    stream: false,
    tfs_z: 1.0,
    typical_p: 1.0,
    repeat_penalty: 1.1,
    repeat_last_n: 64,
    penalize_nl: true,
    presence_penalty: 0.0,
    frequency_penalty: 0.0,
    mirostat: 0,
    mirostat_tau: 5.0,
    mirostat_eta: 0.1,
    seed: -1,
    ignore_eos: false,
    cache_prompt: false
  })

  const handleInferenceSettingsChange = (newSettings: Partial<InferenceSettingsType>) => {
    setInferenceSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }))
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 space-y-4">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-0">
              <ChatInterface disabled={false} />
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg">
            <CardContent>
              <PerformanceMonitoring />
            </CardContent>
          </Card>
        </div>

        <div className="col-span-2">
          <InferenceSettings 
            settings={inferenceSettings} 
            onSettingsChange={handleInferenceSettingsChange}
            disabled={false}
          />
        </div>
      </div>
    </div>
  )
}

export default AskLiam