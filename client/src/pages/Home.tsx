import {useUser} from "../context/UserContext";

function Home() {
    const { user, resetUser } = useUser();

  return (
    <div>
      <h1 className="text-3xl font-bold">Home Page {user?.id}{user?.username}{user?.dob} {user?.email}</h1>
     <button onClick={resetUser}>SignOut</button>
    </div>
  )
}

export default Home
