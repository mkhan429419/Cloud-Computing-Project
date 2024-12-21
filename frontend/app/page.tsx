"use client";
import { useAuth } from "@/providers/AuthContext";
import { getUserProfile, logoutFromFirebase } from "./api/route";
import { useEffect, useState } from "react";
import { getVideos, replaceVideo, deleteVideo } from "./api/storage/route";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
const MAX_STORAGE = 50 * 1024 * 1024;
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

const HomePage = () => {
  const { token, initialized } = useAuth(); // Wait for Firebase to initialize
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [replaceName, setReplaceName] = useState(""); // Name for replace modal
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [videos, setVideos] = useState<Video[]>([]);
  const router = useRouter(); //
  const fetchVideos = async () => {
    if (!token) return;

    try {
      const fetchedVideos = await getVideos(token);
      setVideos(fetchedVideos);
      setError(null);
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError("Failed to fetch videos.");
      toast.error("Failed to fetch videos.");
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
      fetchProfile();
      setIsModalOpen(false);
      toast.update(loadingToast, {
        render: "Video replaced successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error replacing video:", err);
      setError("Failed to replace video.");
      toast.update(loadingToast, {
        render: "Failed to replace video.",
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
      fetchProfile();
      toast.success("Video deleted successfully!");
    } catch (err) {
      console.error("Error deleting video:", err);
      toast.error("Failed to delete video.");
    }
  };
  const fetchProfile = async () => {
    setLoadingProfile(true);
    if (token) {
      try {
        const profile = await getUserProfile(token); // Fetch profile from backend
        setUserProfile(profile);
        setError(null); // Clear error if fetching succeeds
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to fetch user profile.");
        setUserProfile(null); // Reset profile state on error
        toast.error("Failed to fetch videos.");
      }
    } else {
      setError("User not logged in.");
      setUserProfile(null); // Reset profile state if no token
    }
    setLoadingProfile(false);
  };

  useEffect(() => {
    if (initialized && !token) {
      router.push("/login"); // Redirect to login if user is not authenticated
    } else if (initialized) {
      fetchProfile();
      fetchVideos();
    }
  }, [initialized, token]); // Re-run when token or initialized state changes

  const handleLogout = async () => {
    try {
      await logoutFromFirebase();
      window.location.href = "/login";
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };
  // Calculate used and remaining storage
  const usedStorage = userProfile?.storageUsed || 0;
  const remainingStorage = MAX_STORAGE - usedStorage;

  // Pie chart data
  const storageData = [
    { name: "Used", value: usedStorage },
    { name: "Remaining", value: remainingStorage },
  ];
  if (!initialized) {
    return (
      <div className="flex justify-center items-center h-screen" role="status">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    ); // Show loading while Firebase initializes
  }
  return (
    <div>
      <div className="animate-gradient-x px-10 py-5 w-full bg-animated-gradient flex justify-between items-baseline">
        <div>
          {error && <p className="text-center text-red-500 mb-4">{error}</p>}
          {loadingProfile ? (
            <p className="text-center">Loading user profile...</p>
          ) : userProfile ? (
            <div className="text-dark1 mb-6">
              <h1 className="text-3xl font-semibold text-center text-dark1 mb-6">
                Hello {userProfile.name}!
              </h1>
            </div>
          ) : (
            <h2 className="text-center text-xl">No user profile available.</h2>
          )}
        </div>
        <div className="flex items-baseline">
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
            className=" py-3 px-4 bg-black text-white text-lg outline-none rounded-3xl hover:bg-maroon "
          >
            Log Out
          </button>
        </div>
      </div>
      <div className="mt-10 w-full h-64">
        <h2 className="text-center text-2xl mb-4">Storage Usage</h2>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={storageData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={60}
              paddingAngle={5}
              startAngle={90}
              endAngle={450}
            >
              <Cell name="Used" fill="red" />
              <Cell name="Remaining" fill="#000000" />
              <Label
                position="center"
                fontSize={16}
                fontWeight="bold"
                fill="white"
              >
                {((usedStorage / MAX_STORAGE) * 100).toFixed(2)}%
              </Label>
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <h1 className="text-center text-2xl pt-10">
        Recently uploaded videos...
      </h1>
      <ul className="flex flex-wrap justify-center gap-10 my-10">
        {videos.map((video) => (
          <li
            key={video._id}
            className="max-w-sm rounded overflow-hidden shadow-lg shadow-red bg-black"
          >
            <div className="flex flex-col flex-wrap items-center space-y-2 p-5">
              <video src={video.videoUrl} controls className="aspect-[3/2]" />
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
                    setReplaceName(video.name); // Set replace name here
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
      {/* Replace Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-black p-8 rounded-xl shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold text-center mb-4">
              Replace Selected Video
            </h2>
            {/* {selectedVideoId && (
              <p className="text-sm mb-4">
                Selected Video ID: {selectedVideoId}
              </p>
            )} */}
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                placeholder="Enter Video Name"
                className="p-2 border rounded-lg shadow-sm bg-transparent"
                value={replaceName} // Use replaceName here
                onChange={(e) => setReplaceName(e.target.value)} // Update replaceName here
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
  );
};

export default HomePage;
