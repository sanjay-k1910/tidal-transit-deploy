import { apiRoutes } from '../config/apiRoutes';
import { envConfig } from '../config/envConfig';
import API from './api';
import { reCallAPI } from './auth';
import axios from 'axios'

const baseURL: string = envConfig.PUBLIC_BASE_URL || process.env.PUBLIC_BASE_URL as string;
export const DownloadCsvTemplate = async (credDefId: string) => {
	const orgId = await envConfig.PUBLIC_ORGID;
	const token = await localStorage.getItem('session') || "";
	const url = `${apiRoutes.org}/${orgId}/${credDefId}${apiRoutes.downloadTemplate}`;

	try {
		const response = await axios.get(
			baseURL + url, {
			headers: {
				'Authorization': `bearer ${token}`
			}
		})
		return response?.data;
	} catch (error) {
		const err = error as Error;
		console.error("DOWNLOAD CSV ERROR:::", error);
		return reCallAPI(err, DownloadCsvTemplate)
	}
};

export const uploadCsvFile = async (token: string, payload: { file: Uint8Array | Blob, fileName: string }, credefId: string): Promise<any> => {
	const orgId = await envConfig.PUBLIC_ORGID;
	const url = `${apiRoutes.org}/${orgId}${apiRoutes.bulk.uploadCsv}?credDefId=${credefId}`;
	try {
		const response = await axios.post(
			baseURL + url, payload, {
			headers: {
				'Authorization': `bearer ${token}`,
				'Content-Type': 'multipart/form-data'
			}
		})
		return response?.data;
	} catch (error: any) {
		console.error("UPLOAD CSV ERROR:::", error);
		return reCallAPI(error?.response?.data, uploadCsvFile, [payload, credefId])
	}
};

export const getCsvFileData = async (
	token: string,
	requestId: any
) => {
	const orgId = await envConfig.PUBLIC_ORGID;
	const url = `${apiRoutes.org}/${orgId}/${requestId}${apiRoutes.bulk.preview}?pageNumber=1&pageSize=500&search=`;

	try {
		const response = await API({
			url,
			method: 'GET',
			token,
			headerData: {}
		});
		console.log(3342, response);
		return response
	} catch (error) {
		const err = error as Error;
		console.error("UPLOAD CSV ERROR:::", error);
		return reCallAPI(err, getCsvFileData, [requestId])
	}
};

export const issueBulkCredential = async (token: string, requestId: string, clientId: string) => {
	const orgId = await envConfig.PUBLIC_ORGID;
	const url = `${apiRoutes.org}/${orgId}/${requestId}${apiRoutes.bulk.bulk}`;
	
	try {
		const response = await API({
			url,
			method: 'POST',
			token,
			headerData: {},
			payload: {
				clientId
			}
		});
		console.log(334298798, response);
		return response
	} catch (error) {
		const err = error as Error;
		console.error("UPLOAD CSV ERROR:::", error);
		return reCallAPI(err, getCsvFileData)
	}
};
