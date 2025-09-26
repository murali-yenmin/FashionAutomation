'use server';
/**
 * @fileOverview A flow for generating an image from multiple input images and a pose.
 *
 * - generateImageFlow - A function that handles the image generation process.
 * - GenerateImageInput - The input type for the generateImageFlow function.
 * - GenerateImageOutput - The return type for the generateImageFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateImageInputSchema = z.object({
  model: z
    .string()
    .describe(
      "The model image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  clothing: z
    .string()
    .describe(
      "The clothing image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  background: z
    .string()
    .describe(
      "The background image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  pose: z
    .enum(['standing', 'sitting', 'walking'])
    .describe('The desired pose of the model.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  url: z
    .string()
    .describe(
      "The generated image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

const prompt = ai.definePrompt({
  name: 'generateImagePrompt',
  input: { schema: GenerateImageInputSchema },
  output: { schema: z.string() },
  prompt: `You are an expert image editor. Create a photorealistic image based on the following inputs.

- The main subject is the person from the model image.
- The subject should be wearing the clothes from the clothing image.
- The final scene should use the background from the background image.
- The model's pose should be '{{{pose}}}'.

Model Image:
{{media url=model}}

Clothing Image:
{{media url=clothing}}

Background Image:
{{media url=background}}

Generate a new image that seamlessly combines these elements.`,
});

export const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {
          text: `You are an expert image editor. Create a photorealistic image based on the following inputs.

- The main subject is the person from the model image.
- The subject should be wearing the clothes from the clothing image.
- The final scene should use the background from the background image.
- The model's pose should be '${input.pose}'.

Model Image:`,
        },
        { media: { url: input.model } },
        { text: 'Clothing Image:' },
        { media: { url: input.clothing } },
        { text: 'Background Image:' },
        { media: { url: input.background } },
        {
          text: 'Generate a new image that seamlessly combines these elements.',
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed.');
    }

    return { url: media.url };
  }
);
