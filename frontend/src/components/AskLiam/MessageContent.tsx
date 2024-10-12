import React from 'react';
import { Button } from "../ui/button"
import { BarChart2, Image, Table, File } from 'lucide-react'
import { MessageContent } from './types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface MessageContentProps {
  content: MessageContent;
  onContentClick: (content: MessageContent) => void;
}

export function MessageContentComponent({ content, onContentClick }: MessageContentProps) {
  if (typeof content === 'string') {
    return <div>{content}</div>;
  }

  return (
    <Button
      onClick={() => onContentClick(content)}
      variant="outline"
      className="font-semibold text-primary hover:text-primary-dark transition-all duration-300 transform hover:scale-105 hover:shadow-md bg-white border border-primary rounded-lg px-4 py-2 flex items-center space-x-2"
    >
      {content.type === 'graph' && <BarChart2 className="h-4 w-4" />}
      {content.type === 'image' && <Image className="h-4 w-4" />}
      {content.type === 'table' && <Table className="h-4 w-4" />}
      {content.type === 'file' && <File className="h-4 w-4" />}
      <span>View {content.type} content</span>
    </Button>
  );
}

export function renderContentPanel(content: MessageContent) {
  if (typeof content === 'string') return null;

  switch (content.type) {
    case 'graph':
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={content.data || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pv" stroke="#8884d8" />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      );
    case 'image':
      return <img src={content.url} alt="Content" className="max-w-full h-auto" />;
    case 'table':
      if (!content.data || content.data.length === 0) return null;
      return (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Object.keys(content.data[0]).map((key) => (
                <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {content.data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {String(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    case 'file':
      return (
        <div className="flex items-center space-x-2">
          <File className="h-6 w-6" />
          <a href={content.url} download={content.name} className="text-blue-600 hover:underline">
            {content.name}
          </a>
        </div>
      );
    default:
      return null;
  }
}