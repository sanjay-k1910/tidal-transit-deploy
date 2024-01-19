import { apiRoutes } from "../config/apiRoutes";
import { envConfig } from "../config/envConfig";
import API from "./api";
import { reCallAPI } from "./auth";

export const fetchCredentialOption = async (token: string) => {
    const orgId = envConfig.PUBLIC_ORGID;
    console.log("ORG_ID::", orgId)
    const url = `${apiRoutes.org}/${orgId}${apiRoutes.getCredentialOptions}`;
    try {
        const response = await API({
            url,
            method: 'GET',
            token
        });
        console.log(234245, response);
        return response?.data
    }
    catch (error) {
        const err = error as Error
        console.log("CREDENTIAL OPTIONS:::", error);
        return reCallAPI(err, fetchCredentialOption)
    }
}