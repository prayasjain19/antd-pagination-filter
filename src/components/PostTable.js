// src/components/PostTable.js
import React, { useEffect, useState } from 'react';
import { Table, Input, Tag, Pagination, Spin, Alert } from 'antd';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import FilterSelect from './FilterSelect';

const fetchPosts = async (skip, limit, search, tags) => {
  let endpoint = `https://dummyjson.com/posts?skip=${skip}&limit=${limit}`;
  if (search) {
    endpoint += `&q=${search}`;
  }
  if (tags.length) {
    endpoint += `&tags=${tags.join(',')}`;
  }
  const response = await axios.get(endpoint);
  return response.data;
};

const PostTable = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const updateURL = (page, search, tags) => {
    const query = queryString.stringify({
      page,
      search,
      tags: tags.join(',')
    });
    navigate({ search: `?${query}` });
  };

  const parseQuery = () => {
    const params = queryString.parse(location.search);
    const page = parseInt(params.page) || 1;
    const search = params.search || '';
    const tags = params.tags ? params.tags.split(',') : [];
    return { page, search, tags };
  };

  const fetchAndSetData = async (page, search, tags) => {
    setLoading(true);
    setError(null);
    const skip = (page - 1) * limit;

    try {
      const data = await fetchPosts(skip, limit, search, tags);
      setPosts(data.posts);
      setTotal(data.total);
    } catch (error) {
      setError('Failed to fetch posts.');
    } finally {
      setLoading(false);
    }
  };

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    updateURL(page, value, selectedTags);
  };

  const onTagChange = (tags) => {
    setSelectedTags(tags);
    updateURL(page, search, tags);
  };

  useEffect(() => {
    const { page, search, tags } = parseQuery();
    setPage(page);
    setSearch(search);
    setSelectedTags(tags);
    fetchAndSetData(page, search, tags);
  }, [location.search]);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Body',
      dataIndex: 'body',
      key: 'body',
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) => (
        <>
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
  ];

  return (
    <div>
      <Input
        placeholder="Search by body text"
        value={search}
        onChange={onSearchChange}
        style={{ marginBottom: '20px' }}
      />
      <FilterSelect selectedTags={selectedTags} onChange={onTagChange} />
      {loading ? (
        <Spin />
      ) : error ? (
        <Alert message={error} type="error" />
      ) : (
        <>
          <Table
            dataSource={posts}
            columns={columns}
            rowKey="id"
            pagination={false}
          />
          <Pagination
            current={page}
            total={total}
            pageSize={limit}
            onChange={(p) => {
              setPage(p);
              updateURL(p, search, selectedTags);
            }}
          />
        </>
      )}
    </div>
  );
};

export default PostTable;