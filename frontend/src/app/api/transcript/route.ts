import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

function isValidYouTubeUrl(value: string): boolean {
    try {
        const parsed = new URL(value);
        return parsed.hostname.includes("youtube.com") || parsed.hostname.includes("youtu.be");
    } catch {
        return false;
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const url = typeof body?.url === "string" ? body.url.trim() : "";

        if (!url) {
            return NextResponse.json(
                { message: "A YouTube URL is required." },
                { status: 400 }
            );
        }

        if (!isValidYouTubeUrl(url)) {
            return NextResponse.json(
                { message: "Invalid YouTube URL." },
                { status: 400 }
            );
        }

        const transcriptItems = await YoutubeTranscript.fetchTranscript(url);
        const transcript = transcriptItems
            .map((item) => item.text)
            .join(" ")
            .trim();

        if (!transcript) {
            return NextResponse.json(
                { message: "Transcript unavailable for this video." },
                { status: 404 }
            );
        }

        return NextResponse.json({ transcript });
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "Transcript API failure.";

        return NextResponse.json(
            { message: message || "Transcript API failure." },
            { status: 502 }
        );
    }
}
