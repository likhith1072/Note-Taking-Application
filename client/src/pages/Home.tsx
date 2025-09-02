import  { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { FiTrash2 } from "react-icons/fi";
import Header from "../components/Header";
import {HiOutlineExclamationCircle} from 'react-icons/hi'


interface Note {
  _id: string;
  title: string;
  content: string;
}

interface NotesResponse {
  notes: Note[];
}

export default function Dashboard() {
  const { user } = useUser();
  const [notes, setNotes] = useState<Note[]>([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchNotes = async () => {
      try {
        const res = await fetch("/api/note/getnotes", { credentials: "include" });
        const data: NotesResponse = await res.json();
        if (res.ok) {
          setNotes(data.notes);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/note/deletenote/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setNotes((prev) => prev.filter((note) => note._id !== id));
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col w-full">
      {/* Top Navbar */}
      <Header />
      {/* Main Content */}
      <div className="min-h-[90vh] ">
        {user?.id ? (
          <>
            <div className="text-center text-gray-700 min-h-[87vh] w-full flex flex-col p-4 gap-2 ">
              {/* User Info Card */}
              <div className="bg-white border border-gray-300 rounded-lg shadow-lg mb-4 px-4 py-8 flex flex-col items-center gap-1 ">
                <h2 className="font-bold text-lg">
                  Welcome, {user.username} !
                </h2>
                <p className="text-gray-600 text-sm overflow-x-auto"><span className="font-semibold">Email:</span> {user.email}</p>
              </div>

              {/* Create Note Button */}
              <div className="w-full sm:mx-auto px-4">
                <button
                  onClick={() => navigate("/createNote")}
                  className=" bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 mb-4 cursor-pointer py-2 px-6 sm:w-[150px]  w-full "
                >
                  Create Note
                </button></div>


              {/* Notes List */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Notes</h3>
                {notes.length === 0 ? (
                  <p className="text-gray-500 text-sm">No notes yet.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {notes.map((note) => (
                      <div
                        key={note._id}
                        className="flex items-center bg-white border border-gray-400 shadow-md rounded-lg p-1 "
                      >
                        <Link
                          to={`/note/${note._id}`}
                          className="font-semibold text-gray-800 text-md w-full hover:cursor-pointer flex justify-start p-3"
                        >
                          {note.title}
                        </Link>
                        <button
                          onClick={() => {setShowModal(true); setNoteToDelete(note._id)}}
                          className="text-red-500 hover:text-red-700 cursor-pointer  p-3 "
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </>
        ) : (
          <div className="text-center text-gray-700 min-h-[87vh] w-full flex flex-col items-center justify-center gap-2 ">
            <h2 className="text-2xl font-semibold">Welcome to Note Taker Website</h2>
            <p className="text-lg text-gray-500">
              To use this website and manage your notes, please sign in to your account.
            </p>
            <Link to='/signin'>
              <div className=' h-10 w-20  bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-1 rounded-md px-2 text-white text-sm sm:text-md font-semibold cursor-pointer flex justify-center items-center'>Sign In</div>
            </Link>

          </div>
        )}</div>
       {showModal && <div className='bg-black/50 fixed top-0 left-0 w-full h-screen flex justify-center items-center text-md' onClick={()=>setShowModal(false)}>
                <div className='bg-white  p-5 rounded-md w-90 h-60 flex flex-col justify-center items-center 'onClick={(e)=>e.stopPropagation()}>
                  <HiOutlineExclamationCircle className='text-gray-400  w-20 h-20'/>
                  <div className='text-center text-xl'>Are you sure you want to delete this Note?</div>
                  <div className='flex justify-center gap-10 item-center w-full mt-5'> 
                    <button className='bg-red-500 text-white rounded-sm  p-1 cursor-pointer' onClick={()=>{handleDelete(noteToDelete!); setShowModal(false);}}>Yes,I'm sure</button>
                  <button className='bg-gray-100 text-black rounded-sm p-1 cursor-pointer' onClick={()=>setShowModal(false)}>No,cancel</button></div>
                 
                </div>
              </div>
              }
    </div>
  );
}
