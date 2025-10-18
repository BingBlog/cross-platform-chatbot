import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:sessionId" element={<ChatPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
