import React, { useContext, useState } from "react";
import {
  ImagePlus,
  ArrowLeft,
  Check,
  RotateCcw,
  ColumnsSettings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../components/UserContext";
import axios from "axios";
function Customize() {
    const [loading, setLoading] = useState(false)
  const {
    serverURL,
    user,
    setUser,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);
  const navigate = useNavigate();
  const [assistantName, setAssistantName] = useState(user?.assistantName || "");

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
      setSelectedImage("");
    }
  };

  const handleDeafultImage = () => {
    setBackendImage(null);
    setSelectedImage(
      "https://img.magnific.com/free-photo/portrait-robot-scifi_23-2151843187.jpg?semt=ais_hybrid&w=740&q=80",
    );
    setFrontendImage(
      "https://img.magnific.com/free-photo/portrait-robot-scifi_23-2151843187.jpg?semt=ais_hybrid&w=740&q=80",
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      let formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendImage) {
        formData.append("Img", backendImage);
      } else {
        formData.append("Img", selectedImage || user.Img);
      }

      const result = await axios.post(
        `${serverURL}/api/user/update`,
        formData,
        { withCredentials: true },
      );

      console.log(result.data);
      navigate("/");
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-t from-gray-800 to-white flex justify-center items-center p-4">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col items-center gap-7">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Customize Your <span className="text-blue-700">AI Assistant</span>
          </h1>

          <p className="text-gray-600 text-sm mt-2">
            Give your assistant a unique identity.
          </p>
        </div>

        <form
          className="w-full max-w-md flex flex-col gap-5"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-800">
              Assistant Name
            </label>

            <input
              type="text"
              placeholder="Enter assistant name"
              onChange={(e) => setAssistantName(e.target.value)}
              value={assistantName}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/40 border border-white/50 text-gray-800 placeholder-gray-600 outline-none focus:ring-2 focus:ring-gray-400 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-800">
              Assistant Image
            </label>

            <div className="w-full border-2 border-dashed border-white/70 bg-white/20 rounded-xl p-6 flex flex-col justify-center items-center gap-3 cursor-pointer hover:bg-white/40 transition-all relative">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                id="assistantImage"
                onChange={handleImage}
              />

              <label
                htmlFor="assistantImage"
                className="w-full flex flex-col justify-center items-center gap-3 cursor-pointer"
              >
                {frontendImage ? (
                  <img
                    src={frontendImage}
                    alt="Selected Assistant"
                    className="w-40 h-40 object-cover rounded-xl"
                  />
                ) : (
                  <>
                    <ImagePlus size={30} className="text-gray-700" />

                    <span className="text-sm font-medium text-gray-700">
                      Upload your assistant image
                    </span>

                    <span className="text-xs text-gray-500">
                      PNG, JPG or WEBP (Max 10MB)
                    </span>
                  </>
                )}
              </label>
            </div>

            <button
              type="button"
              className="flex items-center justify-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 transition-all cursor-pointer"
              onClick={handleDeafultImage}
            >
              <RotateCcw size={16} />
              Set Default Image
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-gray-800 to-gray-600 text-white font-semibold shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {" "}
            {loading ? "Loading..." : "Customized Your Assistant"}
            <Check size={19} />
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full py-3 rounded-xl border border-white/50 bg-white/20 text-gray-800 font-semibold hover:bg-white/40 transition-all flex justify-center items-center gap-2"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </form>
      </div>
    </div>
  );
}

export default Customize;
