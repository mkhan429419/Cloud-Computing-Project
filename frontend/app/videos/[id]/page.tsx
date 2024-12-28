"use client";
import { useEffect, useState } from "react";
import { getVideoById, getVideos } from "../../api/storage/route";
import { useAuth } from "@/providers/AuthContext";
import Link from "next/link"
interface Video {
  _id: string;
  userId: string;
  videoUrl: string;
  publicId: string;
  name: string;
  size: number;
  createdAt:string;
}
interface VideoDetailPageProps {
  params: Promise<{ id: string }>;
}

const VideoDetailPage = ({ params }: VideoDetailPageProps) => {
  const [video, setVideo] = useState<Video | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { token, initialized } = useAuth();
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);

  const fetchVideos = async () => {
    if (!token) return;

    try {
      const fetchedVideos = await getVideos(token);
      console.log(fetchedVideos)
      setVideos(fetchedVideos as Video[]);
      setError(null);
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError("Failed to fetch videos.");
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [token]);

  useEffect(() => {
    params.then(({ id }) => setVideoId(id)).catch(() => {
      setError("Failed to load video ID.");
    });
  }, [params]);

  useEffect(() => {
    if (!initialized || !videoId) {
      return;
    }
    const fetchVideo = async () => {
      try {
        if (videoId && token) {
          const fetchedVideo = await getVideoById(token, videoId);
          setVideo(fetchedVideo as Video);
          setError(null);
        } else {
          setError("Video ID or token is missing.");
        }
      } catch (err) {
        console.error("Error fetching video:", err);
        setError("Failed to fetch video.");
      }
    };
    fetchVideo();
  }, [videoId, token, initialized]);

  if (error) return <div>Error: {error}</div>;
  if (!video)
    return (
      <div
        className="flex justify-center items-center h-screen"
        role="status"
      >
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        >
          <span
            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >
            Loading...
          </span>
        </div>
      </div>
    );  

  const filteredVideos = videos.filter((v) => v._id !== videoId);

  return (
    <div className="w-full animate-gradient-x video-detail-container p-8 bg-animated-gradient min-h-screen flex gap-5 flex-wrap sm:flex-wrap lg:flex-nowrap">
      <div className="lg:w-3/4 sm:w-full md:w-full">
        <div>
          <video
            controls
            src={video.videoUrl}
            className="w-full h-[670px] object-cover rounded-lg"
            style={{
              clipPath: "inset(0px)",
            }}
          />
        </div>
        <div className="pt-5 flex items-baseline justify-between">
          <h1 className="text-xl text-white">{video.name}</h1>
          <div className="flex gap-4">
          <h2 className="text-lg text-white">Size: {video.size} Bytes</h2>
          <h3 className="text-lg">Uploaded At: {new Date(video.createdAt).toLocaleString()}</h3>
          </div>
        </div>
      </div>
      <div className="lg:w-1/4 sm:w-full md:w-full">
        <ul className="flex flex-col gap-10 sm:items-center">
          {filteredVideos.map((video) => (
            <li
              key={video._id}
              className="max-w-sm rounded overflow-hidden shadow-lg shadow-red bg-black"
            >
              <div className="flex flex-col flex-wrap items-center space-y-2 p-5">
              <Link
                     href={`/videos/${video._id}`}
                  >
                <video
                  src={video.videoUrl}
                  controls
                  className="w-full h-[300px] object-cover"
                  style={{
                    clipPath: "inset(0px)",
                  }}
                />
                <p className="font-medium">{video.name}</p>
                <p className="font-medium">{new Date(video.createdAt).toLocaleString()}</p>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VideoDetailPage;
