import axios from 'axios';

export async function fetchCosmicData(url: string): Promise<any> {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.error('Failed to fetch cosmic data', err);
    throw err;
  }
}

