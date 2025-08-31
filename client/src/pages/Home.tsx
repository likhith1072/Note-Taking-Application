import { useSignup } from "../context/SignupContext";
import {useUser} from "../context/UserContext";

function Home() {
    const { signup } = useSignup();
    const { user } = useUser();

  return (
    <div>
      <h1 className="text-3xl font-bold">Home Page {signup.name}{user!.id}</h1>
    </div>
  )
}

export default Home
