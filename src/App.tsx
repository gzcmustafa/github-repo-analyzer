import { Provider } from "react-redux"
import { store } from "./redux/store"
import SearchBar from "./components/SearchBar"


function App() {

  return (
    <>
     <Provider store={store} >
          <div className="min-h-screen bg-gray-100 py-8 px-4">
          <SearchBar/>
          </div>
     </Provider>
    </>
  )
}

export default App
