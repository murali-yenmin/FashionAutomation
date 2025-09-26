'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { ImageUpload } from '@/components/image-upload';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { generateImage } from './actions';

export default function Home() {
  const { toast } = useToast();
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [pose, setPose] = useState<string>('standing');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!modelImage || !clothingImage || !backgroundImage) {
      toast({
        title: 'Missing Inputs',
        description: 'Please upload all three images.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);
    try {
      const result = await generateImage({
        model: modelImage,
        clothing: clothingImage,
        background: backgroundImage,
        pose: pose,
      });
      setGeneratedImage(result.url);
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description:
          error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold tracking-tight">
            AI Image Generator
          </h1>
          <p className="text-muted-foreground">
            Create a new image by combining a model, clothing, and a background.
          </p>
        </div>
      </header>

      <main className="container mx-auto grid flex-1 gap-8 p-4 md:grid-cols-2 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Image Configuration</CardTitle>
            <CardDescription>
              Upload your images and select a pose for the model.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <ImageUpload
                value={modelImage}
                onChange={setModelImage}
                label="Model"
              />
              <ImageUpload
                value={clothingImage}
                onChange={setClothingImage}
                label="Clothing"
              />
              <ImageUpload
                value={backgroundImage}
                onChange={setBackgroundImage}
                label="Background"
              />
            </div>

            <div>
              <label
                htmlFor="pose-select"
                className="mb-2 block text-sm font-medium"
              >
                Pose
              </label>
              <Select value={pose} onValueChange={setPose}>
                <SelectTrigger id="pose-select">
                  <SelectValue placeholder="Select a pose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standing">Standing</SelectItem>
                  <SelectItem value="sitting">Sitting</SelectItem>
                  <SelectItem value="walking">Walking</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate Image
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Image</CardTitle>
            <CardDescription>
              Your AI-generated image will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-square w-full">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : generatedImage ? (
                <Image
                  src={generatedImage}
                  alt="Generated"
                  fill
                  className="rounded-md object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-md border-2 border-dashed">
                  <p className="text-muted-foreground">
                    Your result will be shown here
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
