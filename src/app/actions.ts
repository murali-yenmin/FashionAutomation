'use server';

import {
  generateFusedImage,
  type GenerateFusedImageInput,
} from '@/ai/flows/generate-fused-image';

import {
  generateVideo,
  type GenerateVideoInput,
} from '@/ai/flows/generate-video';

export async function fuseImagesAction(
  input: GenerateFusedImageInput
): Promise<{ success: true; data: string } | { success: false; error: string }> {
  try {
    if (!input.personImageDataUri) {
      return { success: false, error: 'A person image is required.' };
    }
    if (!input.productImageDataUri) {
      return { success: false, error: 'A product image is required.' };
    }

    const result = await generateFusedImage(input);

    if (!result.fusedImageDataUri) {
      throw new Error('AI failed to generate an image. Please try again.');
    }

    return { success: true, data: result.fusedImageDataUri };
  } catch (error) {
    console.error('Image fusion failed:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}

export async function generateVideoAction(
  input: GenerateVideoInput
): Promise<{ success: true; data: string } | { success: false; error: string }> {
  try {
    if (!input.imageDataUri) {
      return { success: false, error: 'An image is required.' };
    }

    const result = await generateVideo(input);

    if (!result.videoDataUri) {
      throw new Error('AI failed to generate a video. Please try again.');
    }

    return { success: true, data: result.videoDataUri };
  } catch (error) {
    console.error('Video generation failed:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}
