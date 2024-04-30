// src/components/FilterSelect.js
import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

const FilterSelect = ({ selectedTags, onChange }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTags = async () => {
    try {
      const response = await axios.get('https://dummyjson.com/posts');
      const allTags = response.data.posts.reduce((acc, post) => {
        return [...acc, ...post.tags];
      }, []);
      const uniqueTags = [...new Set(allTags)];
      setTags(uniqueTags);
    } catch (error) {
      console.error('Failed to fetch tags', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <Select
      mode="multiple"
      placeholder="Select tags"
      loading={loading}
      value={selectedTags}
      onChange={onChange}
      style={{ marginBottom: '20px', width: '100%' }}
    >
      {tags.map((tag) => (
        <Option key={tag} value={tag}>
          {tag}
        </Option>
      ))}
    </Select>
  );
};

export default FilterSelect;