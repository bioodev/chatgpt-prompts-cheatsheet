import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL =
  "https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/README.md";

const App = () => {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => transformData(res.data))
      .then((items) => setItems(items));
  }, []);

  const transformData = (data) => {
    // Split data by line breaks to get individual lines
    const lines = data.split("\n");

    // Initialize empty array for transformed data
    const transformedData = [];

    // Initialize temporary variables to hold current item data
    let currentItem = {};
    let currentTitle = "";
    let currentBody = "";

    // Use regular expression to match lines that begin with "##" or ">"
    const titleRegex = /^##/;
    const bodyRegex = /^>/;

    // Loop through lines of data
    lines.forEach((line) => {
      // If line matches title regex, it is the title of the item
      if (titleRegex.test(line)) {
        // If current item has a title and body, push it to transformed data array
        if (currentTitle && currentBody) {
          transformedData.push({
            title: currentTitle,
            body: currentBody,
          });
        }

        // Reset current item data and set new title
        currentItem = {};
        currentTitle = line.replace(titleRegex, "");
        currentBody = line.replace(titleRegex, "");
      }
      // If line matches body regex, it is part of the body of the item
      else if (bodyRegex.test(line)) {
        // Add line to current item body
        currentBody += line.replace(bodyRegex, "") + "\n" + "";
      }
    });

    // Return transformed data array
    return transformedData;
  };

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase());
  };

  const handleOnClick = (body) => {
    // Copia el contenido del elemento al portapapeles
    navigator.clipboard.writeText(body);
    // Muestra una notificación al usuario
    toast(`PROMPT COPIED: ${body.substring(0, 60)} ...`);
  };

  return (
    <div className="min-h-screen p-4 transition-all ease-in-out bg-gradient-to-br from-blue-gray-100 to-blue-gray-200">
      <div className="container gap-4 mx-auto ">
        <nav className="flex items-center justify-center">
          <h1 className="font-black text-gray-800">
            CHATGPT PROMPS CHEATSHEETS TO CLIPBOARD
          </h1>
        </nav>
        <input
          className="w-full px-4 py-2 my-4 border-2 rounded shadow-sm placeholder:italic border-blue-gray-300 active:border-emerald-300 focus:shadow-lg focus:outline-none focus:border-emerald-300 focus:ring-emerald-300 focus:ring-1"
          placeholder="Search a awesome chatgpt promp"
          value={search}
          onChange={handleSearch}
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {items
            .filter((item) => item.title.toLowerCase().includes(search))
            .map((item, i) => (
              <div
                className="gap-4 p-4 transition-all ease-in-out bg-white rounded-lg shadow-md cursor-pointer select-none opacity-60 hover:shadow-xl hover:opacity-100 active:opacity-100 card active:bg-gradient-to-br active:from-emerald-100 active:to-teal-200"
                key={i}
                // Añade un manejador de eventos para el evento click
                onClick={() => handleOnClick(item.body)}
              >
                <h3 className="text-xl font-bold text-black">
                  {item.title}
                </h3>
                <p className="py-2 font-mono text-xs italic text-gray-800">
                  {item.body}
                </p>
              </div>
            ))}
        </div>
        <div className="flex items-center justify-center p-4 p-8 text-xs">
          <p>
            Desarrollado por <a href="https://github.com/bioodev">Bioodev</a>{" "}
            con Chatgpt y{" "}
            <a href="https://github.com/f/awesome-chatgpt-prompts">
              Awesome Chatgpt Prompts
            </a>
          </p>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default App;
