
'use server';

/**
 * @fileOverview An AI flow to moderate text content for violations.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';

const platformRules = [
    { title: "No Pornography or Sexually Explicit Content", description: "Any content depicting pornography, sexual acts, or nudity is strictly forbidden. This includes avatars, backgrounds, and user-generated content." },
    { title: "No Hate Speech or Harassment", description: "Hate speech, bullying, harassment, and any form of discrimination against individuals or groups based on race, ethnicity, religion, gender, sexual orientation, disability, or other protected characteristics will not be tolerated." },
    { title: "No Illegal Activities", description: "Do not use the platform to conduct or promote illegal activities, including but not limited to drug trafficking, fraud, and terrorism." },
    { title: "No Spam or Scams", description: "Spamming, phishing, and attempting to scam other users out of their coins, points, or personal information is strictly prohibited." },
    { title: "Respect Intellectual Property", description: "Do not stream, post, or share content that infringes on the copyrights, trademarks, or other intellectual property rights of others." },
    { title: "No Impersonation", description: "Do not impersonate other users, streamers, platform staff, or any other individual or entity." },
    { title: "Maintain a Safe Environment", description: "Content that promotes self-harm, violence, or dangerous acts is not allowed. We strive to maintain a positive and safe community for everyone." },
    { title: "No Underage Users", description: "You must be 18 years or older to use this platform. Do not stream or interact with minors in an inappropriate manner." },
    { title: "Protect Private Information", description: "Do not share private information of other users without their explicit consent. This includes phone numbers, addresses, and other personal data." },
    { title: "Do Not Exploit the System", description: "Abusing bugs, manipulating platform features, or using automated scripts to gain an unfair advantage is strictly forbidden." }
];

// Define Zod schemas for internal use with Genkit
const ModerateTextInputSchema = z.object({
  text: z.string().describe('The text content to moderate.'),
});

const ModerationResultSchema = z.object({
  isViolation: z.boolean().describe('Whether the text violates any rule.'),
  ruleTitle: z.string().optional().describe('The title of the rule that was broken, if any.'),
  reason: z.string().optional().describe('A brief explanation for why the text is a violation.'),
});

// Manually define interfaces for export to avoid module boundary issues
export interface ModerateTextInput {
  text: string;
}

export interface ModerationResult {
  isViolation: boolean;
  ruleTitle?: string;
  reason?: string;
}

// Define the prompt
const moderationPrompt = ai.definePrompt({
  name: 'textModerationPrompt',
  model: 'googleai/gemini-pro',
  input: { schema: z.object({ text: z.string(), rules: z.any() }) },
  output: { schema: ModerationResultSchema },
  prompt: `You are an expert content moderator for a livestreaming app called EchoLive.
  Your task is to determine if a given text violates any of the platform's rules.

  Here are the platform rules:
  ---
  {{#each rules}}
  - **{{title}}**: {{description}}
  {{/each}}
  ---

  Analyze the following text sent by a user:
  Text: "{{text}}"

  Based on the rules, determine if the text constitutes a violation.
  If it is a violation, set isViolation to true and provide the exact title of the rule that was broken in the ruleTitle field.
  If it is not a violation, set isViolation to false.
  Provide your response in the requested JSON format.`,
});

// The main flow
export async function moderateTextFlow(input: ModerateTextInput): Promise<ModerationResult | undefined> {
    const { output } = await moderationPrompt({ text: input.text, rules: platformRules });
    return output;
}
