import { createContext, useContext, useState } from "react";

const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
  const [selectedData, setSelectedData] = useState({});

  return (
    <DataContext.Provider value={{ selectedData, setSelectedData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
