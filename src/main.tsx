import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'  
import { store } from './redux/store' 
import { ThemeProvider } from './context/ThemeContext.tsx'

createRoot(document.getElementById('root')!).render(
  
    <Provider store={store}>  
      <ThemeProvider>
          <App />
      </ThemeProvider>
        
    </Provider>

)
