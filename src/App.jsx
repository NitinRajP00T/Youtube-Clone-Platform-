import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./components/common/Header";
import Sidebar from "./components/common/Sidebar";
import HomePage from "./pages/HomePage";
import VideoPage from "./pages/VideoPage";
import ChannelPage from "./pages/ChannelPage";
import AuthPage from "./pages/AuthPage";
import UploadPage from "./pages/UploadPage";
import GoogleCallback from "./pages/GoogleCallback";

function App() {
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <Router>
      <div className="flex flex-col h-screen overflow-hidden text-black dark:text-white bg-white dark:bg-yt-bg transition-colors">
        <Header />
        <div className="flex flex-row flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto w-full bg-slate-50 dark:bg-yt-bg p-4 transition-colors">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/google-callback" element={<GoogleCallback />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/video/:videoId" element={<VideoPage />} />
              {/* <Route path="/channel/:channelId" element={<ChannelPage />} /> */}
              <Route path="/channel/u/:userId" element={<ChannelPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
