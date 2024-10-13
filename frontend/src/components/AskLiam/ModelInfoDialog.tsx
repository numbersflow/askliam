import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ModelInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const quantizedPerformance = {
  "Math": [76.2, -4.5],
  "MATH": [32.7, -4.9],
  "Average": [54.3, -4.9],
  "HumanEval": [68.5, -4.9],
  "MBPP": [45.1, -4.9],
  "ARC-C": [60.6, -4.9],
  "GPQA": [9.6, -5.0],
};


export function ModelInfoDialog({ isOpen, onClose }: ModelInfoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-700">모델 정보: EXAONE-3.0-7.8B-Instruct</DialogTitle>
          <DialogDescription className="text-purple-600">
            현재 AI 모델 및 양자화 버전에 대한 상세 정보
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-600">EXAONE-3.0-7.8B-Instruct</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                EXAONE-3.0-7.8B-Instruct는 78억 개의 매개변수를 가진 대규모 언어 모델입니다. 다양한 자연어 처리 작업과 지시 따르기에 최적화되어 있습니다.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-600">양자화 비교 (Float32 → Q4_K_S):</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-100">
                    <TableHead className="font-semibold">측면</TableHead>
                    <TableHead className="font-semibold">원본 (Float32)</TableHead>
                    <TableHead className="font-semibold">양자화 (Q4_K_S)</TableHead>
                    <TableHead className="font-semibold">변화</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>모델 크기</TableCell>
                    <TableCell>31.2GB</TableCell>
                    <TableCell>4.5GB</TableCell>
                    <TableCell className="text-green-600">↓ 85.6%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>추론 시간</TableCell>
                    <TableCell>12.7초</TableCell>
                    <TableCell>4.5초</TableCell>
                    <TableCell className="text-green-600">↑ 182% (2.82배 빠름)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>가중치당 비트</TableCell>
                    <TableCell>32 비트</TableCell>
                    <TableCell>4.58 비트</TableCell>
                    <TableCell className="text-green-600">↓ 85.7%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="text-xs text-gray-500 mt-2">참고: 추론 시간은 하드웨어 및 입력에 따라 다를 수 있습니다.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-600">일반 벤치마크 성능 비교:</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-100">
                    <TableHead className="font-semibold">벤치마크</TableHead>
                    <TableHead className="font-semibold">EXAONE 3.0 7.8B Inst.</TableHead>
                    <TableHead className="font-semibold">양자화 버전</TableHead>
                    <TableHead className="font-semibold">성능 변화</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>KMMLU</TableCell>
                    <TableCell>44.5</TableCell>
                    <TableCell>42.1</TableCell>
                    <TableCell className="text-red-600">-2.4%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>KoBEST-BoolQ</TableCell>
                    <TableCell>91.5</TableCell>
                    <TableCell>87.8</TableCell>
                    <TableCell className="text-red-600">-3.7%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>KoBEST-COPA</TableCell>
                    <TableCell>85.0</TableCell>
                    <TableCell>80.8</TableCell>
                    <TableCell className="text-red-600">-4.2%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>KoBEST-WiC</TableCell>
                    <TableCell>71.2</TableCell>
                    <TableCell>68.1</TableCell>
                    <TableCell className="text-red-600">-3.1%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>KoBEST-HellaSwag</TableCell>
                    <TableCell>49.1</TableCell>
                    <TableCell>46.9</TableCell>
                    <TableCell className="text-red-600">-2.2%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>KoBEST-SentiNeg</TableCell>
                    <TableCell>98.7</TableCell>
                    <TableCell>94.3</TableCell>
                    <TableCell className="text-red-600">-4.4%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Belebele</TableCell>
                    <TableCell>78.6</TableCell>
                    <TableCell>74.7</TableCell>
                    <TableCell className="text-red-600">-3.9%</TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell>평균</TableCell>
                    <TableCell>74.1</TableCell>
                    <TableCell>70.7</TableCell>
                    <TableCell className="text-red-600">-3.4%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="text-xs text-gray-500 mt-2">
              참고: 벤치마크 성능 서버의 자원현황에 따라 수치가 변할 수 있습니다.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-blue-600">추가 벤치마크 성능 비교:</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow className="bg-blue-100">
                    <TableHead className="font-semibold">카테고리</TableHead>
                    <TableHead className="font-semibold">벤치마크</TableHead>
                    <TableHead className="font-semibold">EXAONE 3.0 7.8B Inst.</TableHead>
                    <TableHead className="font-semibold">양자화 버전 (추정)</TableHead>
                    <TableHead className="font-semibold">성능 변화</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                    <TableCell rowSpan={3}>Math</TableCell>
                    <TableCell>GSM8K</TableCell>
                    <TableCell>79.8</TableCell>
                    <TableCell>72.2</TableCell>
                    <TableCell className="text-red-600">-7.6%</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell>MATH</TableCell>
                    <TableCell>34.4</TableCell>
                    <TableCell>28.7</TableCell>
                    <TableCell className="text-red-600">-5.7%</TableCell>
                    </TableRow>
                    <TableRow className="font-semibold">
                    <TableCell>Average</TableCell>
                    <TableCell>57.1</TableCell>
                    <TableCell>50.5</TableCell>
                    <TableCell className="text-red-600">-6.6%</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell rowSpan={3}>Coding</TableCell>
                    <TableCell>HumanEval</TableCell>
                    <TableCell>72.0</TableCell>
                    <TableCell>71.5</TableCell>
                    <TableCell className="text-red-600">-0.5%</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell>MBPP</TableCell>
                    <TableCell>47.4</TableCell>
                    <TableCell>42.1</TableCell>
                    <TableCell className="text-red-600">-3.3%</TableCell>
                    </TableRow>
                    <TableRow className="font-semibold">
                    <TableCell>Average</TableCell>
                    <TableCell>59.7</TableCell>
                    <TableCell>56.8</TableCell>
                    <TableCell className="text-red-600">-2.9%</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell rowSpan={3}>Reasoning</TableCell>
                    <TableCell>ARC-C</TableCell>
                    <TableCell>63.7</TableCell>
                    <TableCell>60.6</TableCell>
                    <TableCell className="text-red-600">-3.1%</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell>GPQA</TableCell>
                    <TableCell>10.1</TableCell>
                    <TableCell>9.6</TableCell>
                    <TableCell className="text-red-600">-0.5%</TableCell>
                    </TableRow>
                    <TableRow className="font-semibold">
                    <TableCell>Average</TableCell>
                    <TableCell>36.9</TableCell>
                    <TableCell>35.1</TableCell>
                    <TableCell className="text-red-600">-1.8%</TableCell>
                    </TableRow>
                </TableBody>
                </Table>
                <p className="text-xs text-gray-500 mt-2">
                참고: 벤치마크 성능 서버의 자원현황에 따라 수치가 변할 수 있습니다.
                </p>
            </CardContent>
            </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}