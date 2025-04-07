import { useState } from 'react';
import axios from 'axios';

const useFetch = (url, method = 'GET') => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async (body = {}) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios({
        method: method,
        url: url,
        data: body
      });
      setData(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, fetchData };
};

export default useFetch;
