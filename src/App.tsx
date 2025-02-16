
import SearchBar from "./components/SearchBar"
import RepositoryStats from "./components/RepositoryStats"
import RepoInfos from "./components/RepoInfos"
import TeamAnalysis from "./components/TeamAnalysis"
import { useTheme } from "./context/ThemeContext";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>

      <div className="  dark:bg-gray-800   min-h-screen   px-4">

     <header>
     <div className="w-full border border-transparent rounded-2xl sticky    dark:bg-gray-800 dark:text-white bg-gray-200 p-1 flex justify-between items-center">
          <div className="text-sm">Github Repository Analyzer</div>
          <button
          onClick={toggleTheme}
          className=" cursor-pointer p-2 rounded bg-white dark:bg-gray-800  dark:text-white  text-blacktransition"
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'} Mode
            </button>
        </div>
     </header>

        <div className="max-w-7xl mx-auto mt-24 space-y-8">
          <div>
            <div className="text-center">
              <h1 className="text-3xl font-bold  dark:bg-gray-800 dark:text-white text-black mb-2">Github Repository Analyzer</h1>
              <p className="text-gray-600  dark:bg-gray-800 dark:text-white mb-2">Enter a GitHub username to explore and get information their repositories</p>
            </div>

            <div className="flex justify-center">
              <SearchBar />
            </div>
          </div>

          <div className="">
            <RepoInfos />
          </div>

          <div>
            <RepositoryStats />
          </div>

          <div>
            <TeamAnalysis />
          </div>

        </div>

        <div className="w-full mt-44 grid grid-cols-6 gap-4 place-items-center h-full">

          <div className="  dark:bg-gray-700 dark:text-white text-sm col-span-2  bg-gray-100 w-full p-10  rounded-lg shadow-xl  h-full "><h2>What is Github Repo Analyzer ?</h2>
            <br />
            <p>
            GitHub data is processed using special algorithms, and graphical summaries are created. These are summarized with the support of artificial intelligence. Visual information is provided to help you understand repository activity and team collaboration.            </p>
          </div>

          <div className=" dark:bg-gray-700 dark:text-white text-sm col-span-2 bg-gray-100 w-full h-full p-10 rounded-lg shadow-xl">
            <h2 className="">How it works ?</h2>
            <br />
            <p>

            It fetches data from GitHub API, processes this data through created algorithms, and presents them as visual dashboards to help users understand their repository's performance at a glance. Additionally, some data is interpreted using an artificial intelligence model.

</p>
          </div>
    
          

          <div className="  dark:bg-gray-700 dark:text-white text-sm  col-span-2  bg-gray-100 rounded-lg shadow-xl w-full p-11 h-full">
            <h2 className="">Help Us Improve?</h2>
              <br />
              <p>

              Your feedback and contributions are valuable. Check out our <a href=""> Repository</a> to report issues, suggest features, or contribute to the project! </p>
            
          </div>
     
        
        </div>



      </div>


    </>
  )
}

export default App
