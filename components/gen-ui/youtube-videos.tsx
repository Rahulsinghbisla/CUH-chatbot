import React from 'react'

export interface YoutubeVideoData {
    video_id: string,
    link: string,
    title: string,
    channelName: string,
    views: number,
    thumbnail: string,
    length: string,
}

export interface YoutubeVideosProps {
    query: string;
    list: YoutubeVideoData[];
    error?: string;
}

// 🔥 helper function
function getYoutubeVideoId(url: string): string | null {
    try {
        const parsedUrl = new URL(url);

        if (parsedUrl.hostname.includes("youtube.com")) {
            return parsedUrl.searchParams.get("v");
        }

        if (parsedUrl.hostname.includes("youtu.be")) {
            return parsedUrl.pathname.slice(1);
        }

        return null;
    } catch {
        return null;
    }
}

function YoutubeVideos(props: YoutubeVideosProps) {
    return (
        <div>
            <h1>{props.query}</h1>

            <div>
                {props.list.map((video) => {
                    const videoId = getYoutubeVideoId(video.link);

                    if (!videoId) return null;

                    return (
                        <div key={video.video_id}>
                            <iframe
                                width="560"
                                height="315"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title={video.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default YoutubeVideos