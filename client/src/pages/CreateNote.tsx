import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import {toast} from 'react-toastify';

const CreateNote: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSave = async (): Promise<void> => {
    if (!title.trim() || !content.trim()) {
      alert("Please provide both title and content.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/note/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        toast.error(data.message || "Failed to create note");
        return;
      }
      setLoading(false);
      navigate("/"); // ✅ navigate back home after success
    } catch (error) {
      setLoading(false);
      console.error(error);
      alert("Error saving note. Try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-screen">

       <Header />

        <div className="flex flex-col w-screen border-t border-gray-300 h-[80vh]">  


                {/* Title Input */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setTitle(e.target.value)
        }
        className="w-full text-xl p-4 outline-none border-b border-gray-400"
      />

      {/* Content Input */}
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setContent(e.target.value)
        }
        className="flex-1 w-full p-4 text-base outline-none resize-none"
      />

      
     </div>
     {/* Save Button */}
      <div className="mx-auto">
         <button
        onClick={handleSave}
        className={`px-6 py-2 bg-blue-500 text-white text-lg font-semibold hover:bg-blue-600  rounded-lg ${loading ? "opacity-50 cursor-not-allowed" : " cursor-pointer"}`}
        disabled={loading}
      >
        Save
      </button></div>


    </div>
  );
};

export default CreateNote;
