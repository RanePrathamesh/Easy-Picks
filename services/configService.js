import { httpAxios } from "@/utils/httpHelper";

export const updateConfigKeys = async ({ openaiapikey, nextauthsecret }) => {
    try {
      await httpAxios.post('/api/config', { openaiapikey, nextauthsecret });
    } catch (error) {
      throw new Error('Error updating keys in the service function.');
    }
  };

export const getConfigKeys = async () => {
    try {
      // Make a GET request to your API route to fetch the keys from the database
      const response = await httpAxios.get('/api/config');
      return response.data;
    } catch (error) {
      throw new Error('Error fetching keys in the service function.');
    }
  };