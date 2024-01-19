import { envConfig } from "../config/envConfig";

interface IProps {
	token?: string;
	url: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	payload?: any;
	headerData?: any;
}

const API = async ({ token, url, method, payload, headerData = {} }: IProps) => {
	try {
		const headers = {
			...headerData,
			'Content-Type': headerData['Content-Type'] ? headerData['Content-Type'] : 'application/json',
		}

		console.log("headers", headers);
		if (token) {
			headers["Authorization"] = `Bearer ${token}`
		}
		
		const config = {
			headers,
			method,
			body: JSON.stringify(payload),
		};
		const baseURL = envConfig.PUBLIC_BASE_URL || process.env.PUBLIC_BASE_URL;
		const apiURL = baseURL + url;
		const res = await fetch(apiURL, {
			...config,
		});
		const response = (await res.json()) || {};
		if (res.ok) {
			return response;
		}
		throw response
	} catch (err) {
		console.error('ERROR::', err);
		throw err;
	}
};

export default API;
