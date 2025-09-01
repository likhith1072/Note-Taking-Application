import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';
import { FiTrash2 } from "react-icons/fi";
import {HiOutlineExclamationCircle} from 'react-icons/hi'

interface Note {
  _id: string;
  title: string;
  content: string;
}

const NotePage = () => {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note>({ _id: "", title: "", content: "" });
  const [editable, setEditable] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      const res = await fetch(`/api/note/getnote/${id}`, { credentials: "include" });
      const data = await res.json();
      setNote(data.note);
    };
    fetchNote();
  }, [id]);

   const handleSave = async (): Promise<void> => {
      if (!note.title.trim() || !note.content.trim()) {
        alert("Please provide both title and content.");
        return;
      }
  
      try {
        setLoading(true);
        const res = await fetch(`/api/note/updatenote/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ title: note.title, content: note.content }),
        });
        const data = await res.json();
  
        if (!res.ok) {
          toast.error(data.message || "Failed to create note");
          setLoading(false);
          return;
        }
        setLoading(false);
  
        navigate("/"); // ✅ navigate back home after success
      } catch (error) {
        console.error(error);
        alert("Error saving note. Try again.");
      }
    };

      const handleDelete = async (id: string) => {
        try {
          const res = await fetch(`/api/note/deletenote/${id}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (res.ok) {
            navigate('/', { replace: true });
          }
        } catch (error) {
          console.error("Error deleting note:", error);
        }
      };

  return (
       <div className="flex flex-col min-h-screen w-screen">
   
          <Header />

          
   
           <div className="flex flex-col w-screen border-t border-gray-300 h-[80vh]">  
   
   <div className="w-full flex justify-between items-center px-5 pt-1">
    <div><input type='checkbox' id='edit' checked={editable} onChange={(e) => setEditable(e.target.checked)} className="w-4 h-4" />
            <label htmlFor='edit' className="text-md text-gray-800 font-semibold">Edit Mode</label></div>
            

         <button
                                  onClick={() => setShowModal(true)}
                                  className="bg-red-500 hover:bg-red-600 text-white flex items-center justify-center cursor-pointer  p-2 rounded-lg  "
                                >
                                  <FiTrash2 size={18} /> Delete
                                </button>
          </div>
                   {/* Title Input */}
         <input
           type="text"
           placeholder="Title"
           value={note.title}
           onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
             setNote((prev) => ({ ...prev, title: e.target.value }))
           }
           className="w-full text-xl p-4 outline-none border-b border-gray-400"
           readOnly={!editable}
         />
   
         {/* Content Input */}
         <textarea
           placeholder="Content"
           value={note.content}
           onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
             setNote((prev) => ({ ...prev, content: e.target.value }))
           }
           className="flex-1 w-full p-4 text-base outline-none resize-none"
           readOnly={!editable}
         />
          
          
        </div>

        {/* Save Button */}
         <div className="mx-auto">
            <button
           onClick={handleSave}
           className="px-6 py-2 bg-blue-500 text-white text-lg font-semibold hover:bg-blue-600  rounded-lg cursor-pointer" hidden={!editable} disabled={loading}
         >
           Save Changes
         </button></div>
   
        {showModal && <div className='bg-black/50 fixed top-0 left-0 w-full h-screen flex justify-center items-center text-md' onClick={()=>setShowModal(false)}>
          <div className='bg-white  p-5 rounded-md w-90 h-60 flex flex-col justify-center items-center 'onClick={(e)=>e.stopPropagation()}>
            <HiOutlineExclamationCircle className='text-gray-400  w-20 h-20'/>
            <div className='text-center text-xl'>Are you sure you want to delete this Note?</div>
            <div className='flex justify-center gap-10 item-center w-full mt-5'> 
              <button className='bg-red-500 text-white rounded-sm  p-1 cursor-pointer' onClick={()=>{handleDelete(note._id); setShowModal(false);}}>Yes,I'm sure</button>
            <button className='bg-gray-100 text-black rounded-sm p-1 cursor-pointer' onClick={()=>setShowModal(false)}>No,cancel</button></div>
           
          </div>
        </div>
        }
       </div>
  );
};

export default NotePage;
