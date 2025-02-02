import axios from "axios";
export const REST_URL = 'http://my-api'


export const DefaultInstance = axios.create({
	baseURL: REST_URL, // URL de base
});


export const useClient = () => {
	return DefaultInstance;
}
