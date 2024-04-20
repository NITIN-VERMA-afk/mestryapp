import { Message } from "@/models/User";
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const prompt =
      " create a list of threee open-ended and engaging questions formatted as a single string.Each question should be seprated by '||'.These question are for an anpnymous social messaging platform, kike qooh.me,and should be suitable for a diverse audience.Avoid personal or sensitive topics,focusing insted on universla themes that encourage friendly interaction.For example, your output should be sructured like this:'whats hobby youve recently started?|| if you could have dinner with any historical figure,who would it be?|| whats a simple thing that makes you happy?.Ensure the question are intriguing,foster curosity,and contributing to a positive and welcome conversational envioronment.";

    const response = await openai.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      max_tokens: 20,
      prompt,
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json(
        {
          name,
          status,
          headers,
          message,
        },
        { status }
      );
    } else {
      console.log("An unexpected error occured");
      throw error;
    }
  }
}
