import axios from 'axios';

const API_URL = 'http://localhost:1337/api';

export async function fetchRepositories() {
  const res = await axios.get(`${API_URL}/repositories`, {
    params: { populate: 'dependencies' },
  });
  return res.data.data;
}