import React, { useState,useRef,useEffect } from "react";
import "./App.css";
import SearchDataJSON from "./searchData.json";
function App() {
  const scrollContainerRef = useRef(null); 
  const [searchData, setSearchData] = useState([...SearchDataJSON]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredSearchData, setFilteredData] = useState([]);


  useEffect(() => {
    const handleKeyDown = (event) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const { keyCode } = event;
      const scrollStep = 50; 

      switch (keyCode) {
        case 38: // Up arrow key
          container.scrollTop -= scrollStep;
          break;
        case 40: // Down arrow key
          container.scrollTop += scrollStep;
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearchInputChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchInput(searchValue);

    const filtered = searchData.filter((item) => {
        return searchItems(item, searchValue);
    });
    setFilteredData(filtered);
};

const searchItems = (obj, searchValue) => {
    if (typeof obj === "string" && obj.toLowerCase().includes(searchValue)) {
        return true;
    }
    // Recursively check nested objects
    if (typeof obj === "object" && obj !== null) {
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                if (searchItems(obj[key], searchValue)) {
                    return true;
                }
            }
        }
    }

    return false;
};


  const handleCardHover = (index) => {
    const cardElement = document.getElementById(`card-${index}`); // Get the card element by index
    cardElement.scrollIntoView({ behavior: "smooth", block: "nearest" }); // Scroll the card into view
  };

  const highlightSearchTerm = (text) => {
    if (!searchInput) return text; // returns the original text without any highlighting.
    const regex = new RegExp(`(${searchInput})`, "gi");
    return text.toString().split(regex).map((part, index) => {
      return index % 2 === 0 ? part : <span style={{ color: "blue" }}>{part} Found in items</span>;
    });
  };
  return (
    <div className="container">
      <div>
        <b>Parspec Assignment</b>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          style={{width:'100%',borderRadius:'10px',padding:'10px'}}
          onChange={handleSearchInputChange}
        />
      </div>
      <div style={{width:'50%',height:'400px',overflow:'scroll'}} ref={scrollContainerRef}>
        {filteredSearchData.length ? (
           filteredSearchData.map((item, index) => (
            <div key={index} id={`card-${index}`} onMouseEnter={() => handleCardHover(index)}>
              <div className="card-container">
                {Object.entries(item).map(([key, value]) => (
                 <p key={key}>{highlightSearchTerm(value)}</p>
                ))}
              </div>
            </div>
          ))
        ):(
          <div>No Results Found</div>
        )}
       
      </div>
    </div>
  );
}

export default App;
