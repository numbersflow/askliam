import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Switch } from "../ui/switch"
import { Slider } from "../ui/slider"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { InfoCircledIcon } from '@radix-ui/react-icons'

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

type BooleanSetting = 'stream' | 'penalize_nl' | 'ignore_eos' | 'cache_prompt';
type NumberSetting = 'temperature' | 'top_k' | 'top_p' | 'min_p' | 'n_predict' | 'n_keep' | 'tfs_z' | 'typical_p' | 'repeat_penalty' | 'repeat_last_n' | 'presence_penalty' | 'frequency_penalty' | 'mirostat' | 'mirostat_tau' | 'mirostat_eta' | 'seed';

interface InferenceSettingsProps {
  settings: InferenceSettingsType;
  onSettingsChange: (newSettings: Partial<InferenceSettingsType>) => void;
  disabled: boolean;
}

const defaultSettings: InferenceSettingsType = {
  temperature: 0.8,
  top_k: 40,
  top_p: 0.95,
  min_p: 0.05,
  n_predict: -1,
  n_keep: 0,
  stream: true,
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
  cache_prompt: true
}

export default function InferenceSettingsComponent({ settings, onSettingsChange, disabled }: InferenceSettingsProps) {
  const [localSettings, setLocalSettings] = useState<InferenceSettingsType>({ ...defaultSettings, ...settings });

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSettingChange = (setting: keyof InferenceSettingsType, value: boolean | number) => {
    const newSettings = { ...localSettings, [setting]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: NumberSetting, min: number, max: number) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= min && value <= max) {
      handleSettingChange(key, value);
    }
  }

  const tooltips: Record<keyof InferenceSettingsType, string> = {
    temperature: "0.0에서 1.0 사이의 값으로, 높을수록 더 창의적인 출력을 생성합니다. 기본값은 0.8입니다.",
    top_k: "다음 토큰 선택을 상위 K개의 토큰으로 제한합니다. 기본값은 40이며, 0은 비활성화를 의미합니다.",
    top_p: "누적 확률이 P를 초과하는 토큰 부분집합으로 다음 토큰 선택을 제한합니다. 기본값은 0.95입니다.",
    min_p: "가장 가능성 높은 토큰의 확률에 대한 상대적인 최소 확률입니다. 기본값은 0.05입니다.",
    n_predict: "생성할 최대 토큰 수입니다. 기본값은 -1로, 무한대를 의미합니다.",
    n_keep: "컨텍스트 크기 초과 시 프롬프트에서 유지할 토큰 수입니다. 기본값은 0입니다.",
    stream: "실시간으로 각 예측 토큰을 받을지 여부를 설정합니다. 기본값은 true입니다.",
    tfs_z: "꼬리 자유 샘플링 파라미터입니다. 기본값은 1.0으로, 비활성화를 의미합니다.",
    typical_p: "지역적으로 전형적인 샘플링 파라미터입니다. 기본값은 1.0으로, 비활성화를 의미합니다.",
    repeat_penalty: "토큰 시퀀스 반복을 제어합니다. 기본값은 1.1입니다.",
    repeat_last_n: "반복 페널티를 적용할 마지막 n개 토큰입니다. 기본값은 64입니다.",
    penalize_nl: "개행 토큰에 페널티를 적용할지 여부입니다. 기본값은 true입니다.",
    presence_penalty: "반복 알파 존재 페널티입니다. 기본값은 0.0으로, 비활성화를 의미합니다.",
    frequency_penalty: "반복 알파 빈도 페널티입니다. 기본값은 0.0으로, 비활성화를 의미합니다.",
    mirostat: "Mirostat 샘플링을 활성화합니다. 0은 비활성화, 1은 Mirostat, 2는 Mirostat 2.0을 의미합니다.",
    mirostat_tau: "Mirostat 목표 엔트로피입니다. 기본값은 5.0입니다.",
    mirostat_eta: "Mirostat 학습률입니다. 기본값은 0.1입니다.",
    seed: "난수 생성기 시드입니다. 기본값은 -1로, 랜덤 시드를 의미합니다.",
    ignore_eos: "EOS 토큰을 무시하고 계속 생성할지 여부입니다. 기본값은 false입니다.",
    cache_prompt: "이전 요청의 KV 캐시를 재사용할지 여부입니다. 기본값은 false입니다."
  }

  const getSettingProps = (key: NumberSetting) => {
    switch (key) {
      case 'temperature':
        return { min: 0, max: 1, step: 0.1 };
      case 'top_k':
        return { min: 0, max: 100, step: 1 };
      case 'top_p':
      case 'min_p':
      case 'typical_p':
        return { min: 0, max: 1, step: 0.01 };
      case 'n_predict':
        return { min: -1, max: 2048, step: 1 };
      case 'n_keep':
        return { min: 0, max: 2048, step: 1 };
      case 'tfs_z':
        return { min: 0, max: 2, step: 0.1 };
      case 'repeat_penalty':
        return { min: 1, max: 2, step: 0.1 };
      case 'repeat_last_n':
        return { min: 0, max: 2048, step: 1 };
      case 'presence_penalty':
      case 'frequency_penalty':
        return { min: 0, max: 2, step: 0.1 };
      case 'mirostat':
        return { min: 0, max: 2, step: 1 };
      case 'mirostat_tau':
        return { min: 0, max: 10, step: 0.1 };
      case 'mirostat_eta':
        return { min: 0, max: 1, step: 0.01 };
      case 'seed':
        return { min: -1, max: 1000000, step: 1 };
      default:
        return { min: 0, max: 1, step: 0.1 };
    }
  }

  const renderNumberSetting = (key: NumberSetting) => {
    const { min, max, step } = getSettingProps(key);
    const value = localSettings[key];
    return (
      <div key={key} className="space-y-2 bg-gray-50 p-2 sm:p-3 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Label htmlFor={key} className="flex items-center cursor-help text-base sm:text-lg mb-1 sm:mb-0">
                  {key} <InfoCircledIcon className="ml-1 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </Label>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-popover text-popover-foreground text-sm sm:text-base">
                <p>{tooltips[key]}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Input
            type="number"
            id={`${key}-input`}
            value={value.toString()}
            onChange={(e) => handleInputChange(e, key, min, max)}
            className="w-full sm:w-[4.146rem] text-right bg-gray-200 border-gray-300 text-base sm:text-lg" 
            step={step}
            min={min}
            max={max}
            disabled={disabled}
          />
        </div>
        <Slider
          id={key}
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={([newValue]) => handleSettingChange(key, newValue)}
          className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary [&_[role=slider]]:focus:ring-primary"
          disabled={disabled}
        />
      </div>
    );
  }

  const renderBooleanSetting = (key: BooleanSetting) => (
    <div key={key} className="flex items-center justify-between space-x-2 sm:space-x-4 bg-gray-50 p-2 sm:p-4 rounded-lg">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Label htmlFor={key} className="flex items-center cursor-help text-base sm:text-lg">
              {key} <InfoCircledIcon className="ml-1 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            </Label>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-popover text-popover-foreground text-sm sm:text-base">
            <p>{tooltips[key]}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Switch
        id={key}
        checked={localSettings[key]}
        onCheckedChange={(checked) => handleSettingChange(key, checked)}
        className="data-[state=checked]:bg-primary h-6 w-11 sm:h-8 sm:w-14 [&>span]:h-5 [&>span]:w-5 sm:[&>span]:h-7 sm:[&>span]:w-7"
        disabled={disabled}
      />
    </div>
  )

  return (
    <Card className="bg-gray-100 text-card-foreground w-full max-w-3xl mx-auto">
      <CardHeader className="bg-white">
        <CardTitle className="text-xl sm:text-2xl font-bold">AI Text Generation Settings</CardTitle>
      </CardHeader>
      <CardContent className="bg-white p-2 sm:p-4">
        <Tabs defaultValue="sampling" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 max-w-2xl mx-auto mb-4">
            <TabsTrigger value="sampling" className="text-sm sm:text-base">Sampling</TabsTrigger>
            <TabsTrigger value="tokens" className="text-sm sm:text-base">Tokens</TabsTrigger>
            <TabsTrigger value="repetition" className="text-sm sm:text-base">Repetition</TabsTrigger>
            <TabsTrigger value="misc" className="text-sm sm:text-base">Misc</TabsTrigger>
          </TabsList>
          <div className="h-[60vh] sm:h-[600px] overflow-y-auto">
            <TabsContent value="sampling" className="space-y-2 sm:space-y-4 mt-2 sm:mt-4">
              {renderNumberSetting('temperature')}
              {renderNumberSetting('top_k')}
              {renderNumberSetting('top_p')}
              {renderNumberSetting('min_p')}
              {renderNumberSetting('tfs_z')}
              {renderNumberSetting('typical_p')}
            </TabsContent>
            <TabsContent value="tokens" className="space-y-2 sm:space-y-4 mt-2 sm:mt-4">
              {renderNumberSetting('n_predict')}
              {renderNumberSetting('n_keep')}
              {renderBooleanSetting('ignore_eos')}
            </TabsContent>
            <TabsContent value="repetition" className="space-y-2 sm:space-y-4 mt-2 sm:mt-4">
              {renderNumberSetting('repeat_penalty')}
              {renderNumberSetting('repeat_last_n')}
              {renderNumberSetting('presence_penalty')}
              {renderNumberSetting('frequency_penalty')}
              {renderBooleanSetting('penalize_nl')}
            </TabsContent>
            <TabsContent value="misc" className="space-y-2 sm:space-y-4 mt-2 sm:mt-4">
              {renderNumberSetting('mirostat')}
              {renderNumberSetting('mirostat_tau')}
              {renderNumberSetting('mirostat_eta')}
              {renderNumberSetting('seed')}
              {renderBooleanSetting('stream')}
              {renderBooleanSetting('cache_prompt')}
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}