import axiosClient from "./api.config";

const URL = '/level';

export async function getLevels() {
    try {
        const response = await axiosClient.get(`${URL}`)
        return response.data.data;

    } catch (error) {
        throw error;
    }
}
