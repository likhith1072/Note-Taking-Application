import { useEffect, useState } from "react"


function App() {

  const [notes, setNotes] = useState<string>("fd");

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      const response = await fetch("/api");
      const data = await response.json();
      console.log(data);
      setNotes(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold">
        App 
        {notes}
      </h1>
    </div>
  )
}

export default App
