import { AssemblyAI } from "assemblyai";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLY_AI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("audio");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Invalid file uploaded" }, { status: 400 });
    }

    console.log("Received audio file:", file.name, file.size, file.type);

    // Convert File to Buffer and save in /public/audio for persistent storage
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `audio-${Date.now()}.wav`;
    const audioDir = path.join(process.cwd(), "public", "audio");

    // Ensure /public/audio exists
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    const audioPath = path.join(audioDir, filename);
    fs.writeFileSync(audioPath, buffer);
    console.log("Saved audio file at:", audioPath);

    // Audio URL for download
    const audioUrl = `/audio/${filename}`;

    console.log("Uploading to AssemblyAI...");
    const fileStream = fs.createReadStream(audioPath);
    const uploadResponse = await client.files.upload(fileStream);

    console.log("Upload response:", uploadResponse);
    if (!uploadResponse) {
      console.error("Upload failed, received response:", uploadResponse);
      return NextResponse.json({ error: "Failed to upload file to AssemblyAI" }, { status: 500 });
    }

    console.log("Upload successful, URL:", uploadResponse);

    // Request transcription
    console.log("Requesting transcription...");
    const transcription = await client.transcripts.transcribe({
      audio: uploadResponse,
    });

    console.log("Transcription requested, ID:", transcription);

    // Poll for transcription results
    console.log("Polling for results...");
    let result;
    let status = transcription.status;

    while (status === "processing" || status === "queued") {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
      result = await client.transcripts.get(transcription.id);
      status = result.status;
      console.log("Current status:", status);

      if (status === "error") {
        console.error("Transcription error:", result.error);
        return NextResponse.json(
          { error: "Transcription failed: " + result.error },
          { status: 500 }
        );
      }
    }

    console.log("Transcription complete:", transcription.text + "...");

    return NextResponse.json({
      transcript: transcription?.text,
      words: transcription?.words,
      confidence: transcription?.confidence,
      audioUrl, // Send audio download URL
    });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Failed to process audio: " + (error as Error).message },
      { status: 500 }
    );
  }
}
