// src/ai/flows/whatsapp-order-processing.ts
'use server';

/**
 * @fileOverview An AI tool that processes WhatsApp messages for order management.
 *
 * - whatsappOrderProcessing - A function that handles the WhatsApp order processing flow.
 * - WhatsappOrderProcessingInput - The input type for the whatsappOrderProcessing function.
 * - WhatsappOrderProcessingOutput - The return type for the whatsappOrderProcessing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WhatsappOrderProcessingInputSchema = z.object({
  message: z.string().describe('The content of the WhatsApp message from the customer.'),
  customerId: z.string().describe('The unique identifier of the customer sending the message.'),
});
export type WhatsappOrderProcessingInput = z.infer<typeof WhatsappOrderProcessingInputSchema>;

const WhatsappOrderProcessingOutputSchema = z.object({
  category: z.enum(['ORDER_INQUIRY', 'DELIVERY_UPDATE', 'COMPLAINT', 'OTHER']).describe('The category of the message.'),
  suggestedAction: z.string().describe('A suggested action to take based on the message category.'),
  confidence: z.number().describe('A confidence score (0-1) indicating the accuracy of the categorization.'),
});
export type WhatsappOrderProcessingOutput = z.infer<typeof WhatsappOrderProcessingOutputSchema>;

export async function whatsappOrderProcessing(input: WhatsappOrderProcessingInput): Promise<WhatsappOrderProcessingOutput> {
  return whatsappOrderProcessingFlow(input);
}

const whatsappOrderProcessingPrompt = ai.definePrompt({
  name: 'whatsappOrderProcessingPrompt',
  input: {schema: WhatsappOrderProcessingInputSchema},
  output: {schema: WhatsappOrderProcessingOutputSchema},
  prompt: `You are an AI assistant for a restaurant that helps to process WhatsApp messages from customers.

You will categorize the messages into one of the following categories: ORDER_INQUIRY, DELIVERY_UPDATE, COMPLAINT, or OTHER.
Based on the category, you will suggest a quick action to take.  You will also assign a confidence score (0-1) indicating the accuracy of the categorization.

Message: {{{message}}}
CustomerId: {{{customerId}}}

Respond in JSON format.
`,
});

const whatsappOrderProcessingFlow = ai.defineFlow(
  {
    name: 'whatsappOrderProcessingFlow',
    inputSchema: WhatsappOrderProcessingInputSchema,
    outputSchema: WhatsappOrderProcessingOutputSchema,
  },
  async input => {
    const {output} = await whatsappOrderProcessingPrompt(input);
    return output!;
  }
);
