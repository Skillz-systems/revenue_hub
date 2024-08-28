import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useTokens, useTriggerError } from "../Utils/client";



interface ApiCallOptions {
    endpoint: string;
    method: 'get' | 'post' | 'put' | 'delete' | 'patch';
    params?: any;
    data?: any;
    headers?: any;
  }

  const apiUrl = import.meta.env.VITE_API_URL as string;

  const apiCall = async <T>({
    endpoint,
    method,
    params = {},
    data = {},
    headers = {},
  }: ApiCallOptions): Promise<AxiosResponse<T>> => {
    const {token} = useTokens();
    const baseURL = `${apiUrl}/api`;
  
    const requestConfig: AxiosRequestConfig = {
      baseURL,
      url: endpoint,
      method,
      params,
      data,
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios(requestConfig);
      return response;
    } catch (error) {
       
      //useTriggerError 
      throw error;
    }
  };
  
  export default apiCall;