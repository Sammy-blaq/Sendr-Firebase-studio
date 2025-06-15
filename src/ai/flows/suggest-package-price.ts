'use server';

/**
 * @fileOverview AI-powered tool that suggests an optimal price for a package.
 *
 * - suggestPackagePrice - A function that suggests a package price.
 * - SuggestPackagePriceInput - The input type for the suggestPackagePrice function.
 * - SuggestPackagePriceOutput - The return type for the suggestPackagePrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPackagePriceInputSchema = z.object({
  size: z
    .string()
    .describe('The size of the package (e.g., small, medium, large).'),
  weight: z.number().describe('The weight of the package in kilograms.'),
  originCity: z.string().describe('The city where the package is being sent from.'),
  destinationCity: z.string().describe('The city where the package is being sent to.'),
});
export type SuggestPackagePriceInput = z.infer<typeof SuggestPackagePriceInputSchema>;

const SuggestPackagePriceOutputSchema = z.object({
  suggestedPrice: z
    .number()
    .describe('The suggested price for the package in US dollars.'),
  reasoning: z.string().describe('The reasoning behind the suggested price.'),
});
export type SuggestPackagePriceOutput = z.infer<typeof SuggestPackagePriceOutputSchema>;

export async function suggestPackagePrice(
  input: SuggestPackagePriceInput
): Promise<SuggestPackagePriceOutput> {
  return suggestPackagePriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPackagePricePrompt',
  input: {schema: SuggestPackagePriceInputSchema},
  output: {schema: SuggestPackagePriceOutputSchema},
  prompt: `You are a pricing expert for a package delivery service.

  Based on the following information, suggest an optimal price for the package in US dollars.  Also explain the reasoning for the price that you suggested.

  Package Size: {{{size}}}
  Package Weight: {{{weight}}} kg
  Origin City: {{{originCity}}}
  Destination City: {{{destinationCity}}}

  Consider factors such as distance, demand, and typical pricing for similar packages.
  `,
});

const suggestPackagePriceFlow = ai.defineFlow(
  {
    name: 'suggestPackagePriceFlow',
    inputSchema: SuggestPackagePriceInputSchema,
    outputSchema: SuggestPackagePriceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
