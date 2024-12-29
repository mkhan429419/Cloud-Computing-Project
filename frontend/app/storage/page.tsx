"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthContext";
import {
  uploadVideo,
  replaceVideo,
  getVideos,
  deleteVideo,
  bulkDeleteVideos,
} from "../utils/storage/storageClient";
import { useRef } from "react";
import { getUserProfile, logoutFromFirebase } from "../utils/auth/authClient";
import Link from "next/link";
import { toast } from "react-toastify";

interface Video {
  _id: string;
  userId: string;
  videoUrl: string;
  publicId: string;
  name: string;
  size: number;
}
interface UserProfile {
  email: string;
  name: string;
  storageUsed: number;
  dailyBandwidthUsed: number;
}

const StoragePage = () => {
  const MAX_DAILY_BANDWIDTH = 100 * 1024 * 1024;
  const MAX_STORAGE = 50 * 1024 * 1024;
  const { token, initialized } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState(""); 
  const [replaceName, setReplaceName] = useState(""); 
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const fetchProfile = async () => {
    setLoadingProfile(true);
    if (token) {
      try {
        const profile = await getUserProfile(token); 
        setUserProfile(profile);
        if (profile.storageUsed > 0.8 * MAX_STORAGE) {
          toast.warn("80% of your storage is consumed. Watch out.");
        }

        if (profile.dailyBandwidthUsed > MAX_DAILY_BANDWIDTH) {
          toast.error("Daily Bandwidth exceeded. Please come back tomorrow.");
        }
        setError(null); 
      } catch (err) {
        console.log("Error fetching user profile:", err);
        setError("Failed to fetch user profile.");
        setUserProfile(null); 
      }
    } else {
      setError("User not logged in.");
      setUserProfile(null); 
    }
    setLoadingProfile(false);
  };
  useEffect(() => {
    if (initialized) {
      fetchProfile(); 
    }
  }, [initialized, token]);
  const fetchVideos = async () => {
    if (!token) return;

    try {
      const fetchedVideos = await getVideos(token);
      setVideos(fetchedVideos);
      setError(null);
    } catch (err) {
      console.log("Error fetching videos:", err);
      setError("Failed to fetch videos.");
      toast.error(`${err}`);
    }
  };

  const handleUpload = async () => {
    if (!token || !file || !name) {
      setError("All fields are required.");
      toast.error("All fields are required.");
      return;
    }

   
    const loadingToast = toast.loading("Uploading video...");

    try {
      await uploadVideo(token, file, name);
      setError(null);
      fetchVideos();
      setFile(null);
      setName(""); 
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.update(loadingToast, {
        render: "Video uploaded successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.log("Error uploading video:", err);
      setError("Failed to upload video.");
      toast.update(loadingToast, {
        render: `${err}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleReplace = async () => {
    if (!token || !file || !selectedVideoId || !replaceName) {
      setError("All fields are required for replacement.");
      toast.error("All fields are required for replacement.");
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading("Replacing video...");

    try {
      await replaceVideo(token, file, selectedVideoId, replaceName);
      setError(null);
      fetchVideos();
      setIsModalOpen(false);
      toast.update(loadingToast, {
        render: "Video replaced successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.log("Error replacing video:", err);
      setError("Failed to replace video.");
      toast.update(loadingToast, {
        render: `${err}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;

    try {
      await deleteVideo(token, id);
      fetchVideos();
      toast.success("Video deleted successfully!");
    } catch (err) {
      console.log("Error deleting video:", err);
      toast.error("Failed to delete video.");
    }
  };

  const handleBulkDelete = async () => {
    const videoIds = videos.map((video) => video._id);
    if (!token || videoIds.length === 0) return;

    try {
      await bulkDeleteVideos(token, videoIds);
      fetchVideos();
      toast.success("Videos deleted successfully!");
    } catch (err) {
      console.log("Error bulk deleting videos:", err);
      toast.error("Failed to bulk delete videos.");
    }
  };
  const handleLogout = async () => {
    try {
      await logoutFromFirebase();
      window.location.href = "/login";
    } catch (error) {
      console.log("Failed to log out:", error);
    }
  };
  useEffect(() => {
    fetchVideos();
  }, [token]);

  return (
    <div className="animate-gradient-x w-full mx-auto min-h-screen bg-animated-gradient">
      <div className="px-10 py-5 w-full bg-black flex justify-between items-baseline">
        <div>
          {error && <p className="text-center text-red-500 mb-4">{error}</p>}
          {loadingProfile ? (
            <p className="text-center">Loading user profile...</p>
          ) : userProfile ? (
            <div className="text-dark1 mb-6">
              <h1 className="text-3xl font-semibold text-center text-dark1 mb-6">
                Hello {userProfile.name}! Welcome to Vynx
              </h1>
            </div>
          ) : (
            <h2 className="text-center text-xl">No user profile available.</h2>
          )}
        </div>
        <div className="flex items-baseline">
          <Link href="/">
            <h2 className="px-4 text-lg cursor-pointer hover:underline">
              Home
            </h2>
          </Link>
          <Link href="/storage">
            <h2 className="px-4 text-lg cursor-pointer hover:underline">
              Storage
            </h2>
          </Link>
          <Link href="/profile">
            <h2 className="px-4 text-lg cursor-pointer hover:underline">
              View Profile
            </h2>
          </Link>
          <button
            onClick={handleLogout}
            className=" py-3 px-4 bg-darkred text-white text-lg outline-none rounded-3xl hover:bg-maroon "
          >
            Log Out
          </button>
        </div>
      </div>
      <div className="p-10">
        <div className="flex justify-between">
          <h1 className="text-3xl font-semibold">Storage Management</h1>
          <div className="text-center">
            <button
              onClick={handleBulkDelete}
              className="py-2 px-4 bg-red shadow-lg shadow-black text-white rounded-lg hover:bg-darkred"
            >
              Bulk Delete All Videos
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Upload Video Section */}
        <div className="p-3 rounded-lg shadow-xl shadow-black space-y-4">
          <h2 className="text-2xl font-semibold text-center">
            Upload New Video
          </h2>
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Enter Video Name"
              className="p-2 border rounded-lg shadow-sm bg-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="file"
              ref={fileInputRef}
              className="p-2 border rounded-lg"
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
            />
            <button
              onClick={handleUpload}
              className="w-full py-2 bg-red hover:bg-darkred text-white rounded-lg "
            >
              Upload Video
            </button>
          </div>
        </div>

        {/* Video List Section */}
        <div className="p-6 rounded-lg space-y-4">
          <h2 className="text-2xl font-semibold text-center pt-6">Videos</h2>
          <ul className="flex justify-center flex-wrap gap-10">
            {videos.map((video) => (
              <li
                key={video._id}
                className="max-w-sm rounded overflow-hidden shadow-lg shadow-red bg-black"
              >
                <div className="flex flex-col flex-wrap items-center space-y-2 p-5">
                  <video
                    src={video.videoUrl}
                    controls
                    className="aspect-[3/2]"
                  />
                  <p className="font-medium">{video.name}</p>
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="py-1 px-4 bg-red text-white rounded-lg hover:bg-red-700 focus:outline-none"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setSelectedVideoId(video._id);
                        setReplaceName(video.name);
                        setIsModalOpen(true);
                      }}
                      className="py-1 px-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none"
                    >
                      Select for Replace
                    </button>
                    <Link
                      href={`/videos/${video._id}`}
                      className="py-1 px-4 text-center bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Replace Video Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-black p-8 rounded-xl shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-semibold text-center mb-4">
                Replace Selected Video
              </h2>
              {/* {selectedVideoId && (
              <p className="text-sm mb-4">Selected Video ID: {selectedVideoId}</p>
            )} */}
              <div className="flex flex-col space-y-4">
                <input
                  type="text"
                  placeholder="Enter Video Name"
                  className="p-2 border rounded-lg shadow-sm bg-transparent"
                  value={replaceName}
                  onChange={(e) => setReplaceName(e.target.value)}
                />
                <input
                  type="file"
                  className="p-2 border rounded-lg"
                  onChange={(e) =>
                    setFile(e.target.files ? e.target.files[0] : null)
                  }
                />
                <button
                  onClick={handleReplace}
                  className={`w-full py-2 bg-red text-white rounded-lg focus:outline-none ${
                    !file ? "opacity-50 cursor-not-allowed" : "hover:bg-darkred"
                  }`}
                  disabled={!file}
                >
                  Replace Video
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoragePage;
