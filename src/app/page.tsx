'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Download,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Video,
} from 'lucide-react';
import { ImageUpload } from '@/components/image-upload';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

export default function Home() {

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="font-headline text-2xl font-bold tracking-tight">
            Creative Studio
          </h1>
          <p className="text-muted-foreground">
            Fuse images and generate videos with the power of AI.
          </p>
        </div>
      </header>

      <main className="container mx-auto grid auto-rows-max gap-8 p-4 md:p-8">
        
      </main>
    </div>
  );
}
