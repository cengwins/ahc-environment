import React, {createContext, useContext, useState} from 'react';
import {MainStore} from '../stores/MainStore';

const MainStoreContext = createContext();

export const MainStoreProvider = ({children}) => {
  const [mainStore] = useState(() => new MainStore());
  return (
    <MainStoreContext.Provider value={mainStore}>
      {children}
    </MainStoreContext.Provider>
  );
};

export const useMainStore = () => useContext(MainStoreContext);
