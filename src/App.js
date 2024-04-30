// src/App.js
import React from 'react';
import { Layout } from 'antd';
import PostTable from './components/PostTable';

const { Header, Content } = Layout;

const App = () => (
  <Layout>
    <Header>
      <h1 style={{ color: 'white' }}>Posts with Filters and Pagination</h1>
    </Header>
    <Content style={{ padding: '20px' }}>
      <PostTable />
    </Content>
  </Layout>
);

export default App;