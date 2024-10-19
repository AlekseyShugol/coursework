import axios from 'axios';

const url = 'http://192.168.0.107:8080/api/v1/nodes';

export const fetchData = async () => {
  const response = await axios.get(url);
  console.log(response.data)
  return response.data;
};

export const createNode = async (node) => {
  const response = await axios.post(url, node);
  return response.data;
};

export const deleteNode = async (id) => {
  await axios.delete(`${url}/${id}`);
};