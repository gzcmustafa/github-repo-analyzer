
import SearchBar from "./components/SearchBar"
import RepositoryStats from "./components/RepositoryStats"
import { PRMetrics } from "./components/PrMetrics"





function App() {


  return (
    <>
    
          <div className="min-h-screen  py-8 px-4">
            <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-black mb-2">Github Repository Analysis</h1>
              <p className="text-gray-400">Enter a GitHub username to explore and get information their repositories</p>
            </div>

            <div className="flex justify-center">
            <SearchBar/>
            </div>

            <div>
            <RepositoryStats/>
            </div>

            <div className="">
              <PRMetrics/>
            </div>

            
            </div>
        
          </div>
    
    </>
  )
}

export default App
