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

function extractVideoId(value: string): string {
    if (!value) {
        return "";
    }

    if (value.includes("youtu.be/")) {
        return value.split("/").filter(Boolean).pop()?.split("?")[0] || "";
    }

    try {
        const parsed = new URL(value);
        const videoId = parsed.searchParams.get("v");
        return videoId || "";
    } catch {
        return value;
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

        const videoId = extractVideoId(url);

        if (!videoId) {
            return NextResponse.json(
                { message: "Could not determine the YouTube video ID." },
                { status: 400 }
            );
        }

        const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId, {
            fetch: globalThis.fetch,
        });
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
