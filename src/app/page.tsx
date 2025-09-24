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
} from 'lucide-react';
import { ImageUpload } from '@/components/image-upload';
import { fuseImagesAction } from './actions';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const [fusedImage, setFusedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!personImage || !productImage) {
      toast({
        variant: 'destructive',
        title: 'Missing Images',
        description: 'Please upload both a person and a product image.',
      });
      return;
    }

    setIsLoading(true);
    setFusedImage(null);

    const result = await fuseImagesAction({
      personImageDataUri: personImage,
      productImageDataUri: productImage,
      backgroundImageDataUri: backgroundImage ?? undefined,
    });

    setIsLoading(false);

    if (result.success) {
      setFusedImage(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: result.error,
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="font-headline text-2xl font-bold tracking-tight">
            Image Fusion Studio
          </h1>
          <p className="text-muted-foreground">
            Create stunning visuals by merging products onto people with AI.
          </p>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Upload Your Images</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <ImageUpload
                value={personImage}
                onChange={setPersonImage}
                label="Person"
              />
              <ImageUpload
                value={productImage}
                onChange={setProductImage}
                label="Product"
              />
              <ImageUpload
                value={backgroundImage}
                onChange={setBackgroundImage}
                label="Background (Optional)"
              />
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full sm:w-auto"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-5 w-5" />
                )}
                Fuse Images
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Generated Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                {isLoading ? (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-muted/30">
                    <Skeleton className="absolute h-full w-full" />
                    <div className="z-10 flex flex-col items-center gap-4">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      <p className="font-semibold text-foreground">
                        AI is working its magic...
                      </p>
                    </div>
                  </div>
                ) : fusedImage ? (
                  <Image
                    src={fusedImage}
                    alt="Fused image"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-muted/20">
                    <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
                    <p className="mt-4 text-center text-muted-foreground">
                      Your fused image will appear here.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            {fusedImage && !isLoading && (
              <CardFooter>
                <a
                  href={fusedImage}
                  download="fused-image.png"
                  className="w-full sm:w-auto"
                >
                  <Button className="w-full sm:w-auto" size="lg">
                    <Download className="mr-2 h-5 w-5" />
                    Download Image
                  </Button>
                </a>
              </CardFooter>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
