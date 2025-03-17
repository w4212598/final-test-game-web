import React, { useState, useEffect } from 'react';
import Login from './Views/Login';
import GameList from './Views/GameList';
import './App.css'

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');

  // 检查 sessionStorage 中的登录状态
  useEffect(() => {
    const savedUsername = sessionStorage.getItem('username');
    if (savedUsername) {
      setLoggedIn(true);
      setUsername(savedUsername);
    }
  }, []);

  // 登录
  const handleLogin = (username: string) => {
    setLoggedIn(true);
    setUsername(username);
    sessionStorage.setItem('username', username);
  };

  // 退出登录
  const handleLogout = () => {
    setLoggedIn(false);
    setUsername('');
    sessionStorage.removeItem('username'); // 清除登录状态
  };

  return (
      <div>
        {!loggedIn ? (
            <Login onLogin={handleLogin} />
        ) : (
            <GameList username={username} onLogout={handleLogout} />
        )}
      </div>
  );
};

export default App;
