'use client';

import type { ChangeEvent } from 'react';
import React, { useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ImageUp, X } from 'lucide-react';

interface ImageUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  label,
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label className="font-semibold">{label}</Label>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {value ? (
            <div className="relative aspect-square w-full">
              <Image
                src={value}
                alt={label}
                fill
                className="rounded-md object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2 h-7 w-7 rounded-full shadow-md"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove image</span>
              </Button>
            </div>
          ) : (
            <div
              className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/30 bg-muted/20 transition-colors hover:border-primary hover:bg-muted/30"
              onClick={() => inputRef.current?.click()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        onChange(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                }
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <ImageUp className="h-10 w-10 text-muted-foreground/50" />
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Click or drag to upload
              </p>
              <Input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
