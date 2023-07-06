import type { PublicFunction } from '@shared';
import { z } from 'zod';
import { openai } from './openai';
import { shortenURL } from './url-shortener';
import axios from 'axios';

function getCurrentLocation(): string {
  return 'Singapore';
}
getCurrentLocation.description = `Returns user's current location`;

function getCurrentDateTime(): string {
  return new Date().toString();
}
getCurrentDateTime.description = `Returns user's current date and time`;

function getWeather(params: { location: string }): string {
  return `The weather in ${params.location} is 30 degrees`;
}
getWeather.description = `Returns the weather in a given location`;
getWeather.argsSchema = z.object({ location: z.string() });
getWeather.parameters = {
  type: 'object',
  properties: {
    location: {
      type: 'string',
      description: 'The location to get the weather for',
    },
  },
  required: ['location'],
};

async function drawImagesFromPrompt(params: {
  prompt: string;
  userId: string;
  amount: number;
}): Promise<string[]> {
  const response = await openai.createImage({
    prompt: params.prompt,
    n: params.amount || 1,
    size: '1024x1024',
    user: params.userId,
  });
  return response.data.data.map(image => shortenURL(image.url!));
}
drawImagesFromPrompt.description = `Uses OpenAI Dall-e AI to draw images from a prompt and returns an array of URLs.`;
drawImagesFromPrompt.argsSchema = z.object({
  prompt: z.string(),
  userId: z.string(),
  amount: z.number().min(1).max(10).optional(),
});
drawImagesFromPrompt.parameters = {
  type: 'object',
  properties: {
    prompt: {
      type: 'string',
      description: 'The prompt to generate the image from',
    },
    amount: {
      type: 'number',
      description: "The number of images to generate. By default it's 1. Max is 10.",
    },
  },
  required: ['prompt'],
};

async function wolfram_alpha_calculator(params: {
  equation: string;
}): Promise<string[]> {
    const url = 'https://www.wolframalpha.com/api/v1/llm-api'
    const response = await axios.get('https://www.wolframalpha.com/api/v1/llm-api', {
      params: {
      input: params.equation,
      appid: 'TW3A2W-V3EPQUQVQ9',
      output: 'json',
      },
    });
    return response.data

}


wolfram_alpha_calculator.description = 'Do Math Calculations with the Wolfram Alpha API. Only call this function for direct calculations, direct numerical calculations. You can call this function using LaTex. Break down a problem into simpler steps before calling this function'
wolfram_alpha_calculator.argsSchema = z.object({
  equation: z.string(),
});
wolfram_alpha_calculator.parameters = {
  type: 'object',
  properties: {
    equation: {
      type: 'string',
      description: 'The equation to send to Wolfram Alpha.',
    },
  },
  required: ['equation']

}
export const functions: PublicFunction[] = [
  getCurrentDateTime,
  getCurrentLocation,
  getWeather,
  drawImagesFromPrompt,
  wolfram_alpha_calculator,
];
