import { useState ,useEffect} from "react";

// components/Header.js
const Header=()=> {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

    return (
      <div className="bg-white shadow p-0 flex justify-between items-center">
        <div  className="px-6">
          <img
            src="/Noki.png"
            alt="Nokia Logo"
            className="h-20 w-30 object-contain "
          />
        </div>
        <div className="flex justify-center items-center gap-2"> 
        <h1 className="text-xl font-extrabold">SEE Survey</h1>
        <div className="flex items-center justify-center">
          <span className=" font-bold text-black-500">Alfa v2</span>
        </div>
        </div>
        <div className="flex justify-center items-center gap-3">
          <p className="font-semibold">
            Welcome, <span className="font-bold">{username}</span>
          </p>
          <img
            src="https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?ga=GA1.1.1906641478.1741525422&semt=ais_hybrid&w=740"
            alt="Profile of Amgad Salem"
            className="h-10 w-10 rounded-full object-cover"
          />
        </div>
      </div>
    );
  }
  export default Header;