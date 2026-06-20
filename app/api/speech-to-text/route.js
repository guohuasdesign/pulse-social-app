import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const ELEVENLABS_SPEECH_TO_TEXT_URL =
  "https://api.elevenlabs.io/v1/speech-to-text";

export async function POST(request) {
  const currentUser = verifyToken(request);

  if (!currentUser) {
    return NextResponse.json(
      { error: "You must be logged in to transcribe audio." },
      { status: 401 },
    );
  }

  if (!process.env.ELEVENLABS_API_KEY) {
    return NextResponse.json(
      { error: "ELEVENLABS_API_KEY is not configured." },
      { status: 500 },
    );
  }

  const incomingFormData = await request.formData();
  const audioFile = incomingFormData.get("audio");

  if (!audioFile || typeof audioFile === "string") {
    return NextResponse.json(
      { error: "Audio file is required." },
      { status: 400 },
    );
  }

  const elevenLabsFormData = new FormData();
  elevenLabsFormData.append("model_id", "scribe_v2");
  elevenLabsFormData.append("file", audioFile, audioFile.name || "tweet.webm");

  const response = await fetch(ELEVENLABS_SPEECH_TO_TEXT_URL, {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY,
    },
    body: elevenLabsFormData,
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: data.detail?.message ?? data.message ?? "Transcription failed." },
      { status: response.status },
    );
  }

  return NextResponse.json({
    text: data.text ?? "",
    languageCode: data.language_code,
  });
}
