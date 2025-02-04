import React, { createContext, useContext, useState, ReactNode, useEffect, Children } from 'react';

type Theme = 'light' | 'dark';
type ThemeContextType = {
    theme: Theme;
    toggleTheme:()=>void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined); //context

export const ThemeProvider = ({children}: {children:ReactNode}) => { // this provides context 

    const [theme,setTheme]=useState<Theme>('light');

    useEffect(()=>{
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme) setTheme(savedTheme)
    },[])

    useEffect(()=>{
        localStorage.setItem('theme',theme);
        document.documentElement.className=theme;
    },[theme])

    const toggleTheme = ()=>{
        setTheme((prev)=> (prev === 'light' ? 'dark':'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          {children}
        </ThemeContext.Provider>
      );

};


export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
  };