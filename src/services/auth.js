import getClient from "./baseAPI";

export const getReqToken= async () => {
    try {
        const response = await getClient.get("authentication/token/new");
        return response;
    } catch (error) {
        
    }
}