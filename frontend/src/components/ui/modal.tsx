import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog"
import { Label } from "./label"
import { Input } from "./input"

interface ModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fields: Array<{
    id: string;
    label: string;
    placeholder?: string;
  }>;
}

export function Modal({ isOpen, onOpenChange, title, fields }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {fields.map((field) => (
            <div key={field.id} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">{field.label}</Label>
              <Input 
                id={field.id} 
                className="col-span-3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder={field.placeholder} 
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}