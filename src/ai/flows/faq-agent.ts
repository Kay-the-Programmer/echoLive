'use server';
/**
 * @fileOverview An AI agent that answers user questions based on FAQs.
 *
 * - answerFaqQuestion - A function that handles the question answering process.
 * - FaqAgentInput - The input type for the answerFaqQuestion function.
 * - FaqAgentOutput - The return type for the answerFaqQuestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { faqs } from '@/lib/data';

// Schema for the data coming from the client.
const FaqAgentInputSchema = z.object({
  question: z.string().describe("The user's question."),
  agentName: z.string().describe("The name of the support agent."),
});
export type FaqAgentInput = z.infer<typeof FaqAgentInputSchema>;

// Schema for the AI's output.
const FaqAgentOutputSchema = z.object({
  answer: z.string().describe("The AI agent's answer to the question."),
});
export type FaqAgentOutput = z.infer<typeof FaqAgentOutputSchema>;

// Schema for the data being passed *into* the prompt.
// Using a different name for the user's question to avoid conflicts inside the template.
const FaqPromptInputSchema = z.object({
    userQuestion: z.string(),
    agentName: z.string(),
    faqs: z.any(),
});


export async function answerFaqQuestion(
  input: FaqAgentInput
): Promise<FaqAgentOutput> {
  // We call the flow, which will handle the logic.
  return faqAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'faqAgentPrompt',
  input: { schema: FaqPromptInputSchema },
  output: { schema: FaqAgentOutputSchema },
  prompt: `You are a friendly and helpful customer support agent for an app called EchoLive. Your name is {{agentName}}.
Your task is to answer the user's question based ONLY on the provided Frequently Asked Questions (FAQs). You must act as a human, do not mention you are an AI.

If the user's question can be answered by the FAQs, provide a concise and clear answer.
If the user's question CANNOT be answered by the FAQs, you MUST respond with: "I'm sorry, I don't have the information to answer that question. Would you like me to connect you with a human agent?"

Here are the FAQs:
---
{{#each faqs}}
Q: {{question}}
A: {{answer}}

{{/each}}
---

User's Question: "{{userQuestion}}"

Provide your response in the requested JSON format.
`,
});

const faqAgentFlow = ai.defineFlow(
  {
    name: 'faqAgentFlow',
    inputSchema: FaqAgentInputSchema, // Flow still takes the clean client input
    outputSchema: FaqAgentOutputSchema,
  },
  async (input) => {
    try {
        // Augment the client input with the necessary FAQ context before calling the prompt
        const { output } = await prompt({
            userQuestion: input.question,
            agentName: input.agentName,
            faqs: faqs,
        });

        if (!output) {
          // This case handles if the model returns an empty output.
          return { answer: "I'm sorry, I'm having trouble understanding. Could you please rephrase your question?" };
        }
        
        return output;

    } catch (error) {
        console.error("Error in faqAgentFlow:", error);
        // This catch block provides a fallback in case the prompt itself throws an error.
        return { answer: "I apologize, but I've encountered an internal error. Please try again in a moment." };
    }
  }
);
