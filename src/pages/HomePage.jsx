import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllVideos, GetAllVideos } from "../store/videoDux";
import { Play } from "lucide-react";
import VideoCard from "../components/VideoCard";
import LoadingSpinner from "../components/LoadingSpinner";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const allVideos = GetAllVideos();

  console.log("allVideos", allVideos);

  useEffect(() => {
    dispatch(
      getAllVideos({ page: 1, limit: 10, sortBy: "views", sortType: "desc" })
    );
  }, [dispatch]);

  useEffect(() => {
    if (allVideos?.length > 0) {
      setIsLoading(false);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, [allVideos]);

  return (
    <>
      <LoadingSpinner isLoading={isLoading} />
      <div className="bg-black">
        {/* Main content area - pushed right to make room for sidebar */}
        <main className="">
          <div className="flex items-center justify-center p-4">
            {allVideos?.length === 0 ? (
              <div className="w-full max-w-sm text-center text-white">
                <p className="mb-3 w-full flex justify-center">
                  <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                    <Play color="#ffffff" />
                  </span>
                </p>
                <h5 className="mb-2 font-semibold">No videos available</h5>
                <p>
                  There are no videos here available. Please try to search some
                  thing else.
                </p>
              </div>
            ) : (
              <section className="w-full h-full items-center">
                {allVideos?.length > 0 && <VideoCard data={allVideos} />}
              </section>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default HomePage;
