'use server';

import {
  generateImageFlow,
  GenerateImageInput,
  GenerateImageOutput,
} from '@/ai/flows/generate-image-flow';

export async function generateImage(
  input: GenerateImageInput
): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}
