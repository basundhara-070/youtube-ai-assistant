import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

function isTranscriptBlockedError(error: unknown): boolean {
    if (!(error instanceof Error)) {
        return false;
    }

    const message = error.message.toLowerCase();
    return (
        message.includes("transcript is disabled") ||
        message.includes("transcript unavailable") ||
        message.includes("video unavailable") ||
        message.includes("too many requests") ||
        message.includes("failed to fetch")
    );
}

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
        const stack = error instanceof Error ? error.stack : undefined;

        console.error("Transcript route error:", {
            message,
            stack,
        });

        if (isTranscriptBlockedError(error)) {
            return NextResponse.json(
                {
                    message:
                        "Transcript retrieval is blocked for this video from the hosting environment. Please try a different public video with captions enabled.",
                    details: message,
                    stack,
                },
                { status: 502 }
            );
        }

        return NextResponse.json(
            {
                message: message || "Transcript API failure.",
                details: message,
                stack,
            },
            { status: 502 }
        );
    }
}
