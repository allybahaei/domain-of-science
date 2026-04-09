export interface YouTubeResult {
  videoId: string;
  title: string;
  thumbnail: string;
  channelName: string;
}

export async function fetchYouTubeResult(
  searchQuery: string,
): Promise<YouTubeResult | null> {
  try {
    const res = await fetch(
      `/api/youtube?q=${encodeURIComponent(searchQuery)}`,
    );
    if (!res.ok) return null;
    return (await res.json()) as YouTubeResult;
  } catch {
    return null;
  }
}
