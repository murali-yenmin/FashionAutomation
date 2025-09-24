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
import { fuseImagesAction, generateVideoAction } from './actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

export default function Home() {
  // State for Image Fusion
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [fusedImage, setFusedImage] = useState<string | null>(null);
  const [isFusing, setIsFusing] = useState(false);

  // State for Video Generation
  const [videoSourceImage, setVideoSourceImage] = useState<string | null>(null);
  const [videoPrompt, setVideoPrompt] = useState('');
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  const { toast } = useToast();

  const handleFuseImages = async () => {
    if (!personImage || !productImage) {
      toast({
        variant: 'destructive',
        title: 'Missing Images',
        description: 'Please upload both a person and a product image.',
      });
      return;
    }

    setIsFusing(true);
    setFusedImage(null);

    const result = await fuseImagesAction({
      personImageDataUri: personImage,
      productImageDataUri: productImage,
      backgroundImageDataUri: backgroundImage ?? undefined,
    });

    setIsFusing(false);

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

  const handleGenerateVideo = async () => {
    if (!videoSourceImage) {
      toast({
        variant: 'destructive',
        title: 'Missing Image',
        description: 'Please upload an image to generate a video from.',
      });
      return;
    }

    setIsGeneratingVideo(true);
    setGeneratedVideo(null);

    const result = await generateVideoAction({
      imageDataUri: videoSourceImage,
      prompt: videoPrompt,
    });

    setIsGeneratingVideo(false);

    if (result.success) {
      setGeneratedVideo(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Video Generation Failed',
        description: result.error,
      });
    }
  };

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
        {/* Image Fusion Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Image Fusion</CardTitle>
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
                onClick={handleFuseImages}
                disabled={isFusing}
                className="w-full sm:w-auto"
                size="lg"
              >
                {isFusing ? (
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
                {isFusing ? (
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
            {fusedImage && !isFusing && (
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
        
        {/* Video Generation Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Video Generation</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6">
               <ImageUpload
                value={videoSourceImage}
                onChange={setVideoSourceImage}
                label="Source Image"
              />
              <div>
                <Textarea
                  placeholder="Describe how the video should be generated... (optional)"
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  className="resize-none"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleGenerateVideo}
                disabled={isGeneratingVideo}
                className="w-full sm:w-auto"
                size="lg"
              >
                {isGeneratingVideo ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Video className="mr-2 h-5 w-5" />
                )}
                Generate Video
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Generated Video</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                {isGeneratingVideo ? (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-muted/30">
                    <Skeleton className="absolute h-full w-full" />
                    <div className="z-10 flex flex-col items-center gap-4">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      <p className="text-center font-semibold text-foreground">
                        AI is generating your video...
                        <br />
                        This may take a minute.
                      </p>
                    </div>
                  </div>
                ) : generatedVideo ? (
                  <video
                    src={generatedVideo}
                    controls
                    autoPlay
                    loop
                    muted
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-muted/20">
                    <Video className="h-16 w-16 text-muted-foreground/30" />
                    <p className="mt-4 text-center text-muted-foreground">
                      Your generated video will appear here.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            {generatedVideo && !isGeneratingVideo && (
              <CardFooter>
                <a
                  href={generatedVideo}
                  download="generated-video.mp4"
                  className="w-full sm:w-auto"
                >
                  <Button className="w-full sm:w-auto" size="lg">
                    <Download className="mr-2 h-5 w-5" />
                    Download Video
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
