import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { X } from 'lucide-react'
import { MessageContent } from './types';
import { renderContentPanel } from './MessageContent'

interface ContentPanelProps {
  content: MessageContent;
  onClose: () => void;
}

export function ContentPanel({ content, onClose }: ContentPanelProps) {
  return (
    <Card className="w-1/3 h-full ml-4 flex flex-col shadow-lg">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary to-primary-dark flex items-center justify-between relative">
        <CardTitle className="text-2xl font-bold text-gray-800">Content Panel</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-800 hover:text-primary-dark transition-all duration-300 transform hover:scale-110 hover:rotate-90"
        >
          <X className="h-6 w-6" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto p-4">
        {renderContentPanel(content)}
      </CardContent>
    </Card>
  );
}