import axios,{AxiosError} from "axios";


const githubApi = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
    },
  });

  // interceptors for request and response
  githubApi.interceptors.request.use(request => {
    console.log("Starting Request:", request.url);
    return request;
  });
  githubApi.interceptors.response.use(
    response => {
        console.log('Responsoe:',response.config.url,response.status)
    },
    error => {
        if(error.response) {
            console.error("API ERROR:", {
                url:error.config.url,
                status:error.response.status,
                data:error.response.data
            })
        }
        else {
            console.error("API ERROR:",error.message);
        }

        throw error;
    }
    
    
  )

  export const getRepositories = async (username:string) => {
    try{
        const response = await githubApi.get(`/users/${username}/repos`)
        return response.data;
    } catch(error) {
        console.log("Error fetching repositories",error);
        throw error;
    }
  }