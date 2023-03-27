import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfirmProvider } from 'material-ui-confirm';
import theme from './ui/styles/mui-theme';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import CreateStakingPool from './pages/CreateStakingPool';
import StakeToKuutamoPool from './pages/StakeToKuutamoPool';
import Home from './pages/Home';
import Pools from './pages/Pools';
import Rewards from './pages/Rewards';
import News from './pages/News';
import Servers from './pages/Servers';
import NavPage from './pages/NavPage';
import Layout from './ui/components/Layout';
import NavPageLayout from './ui/components/NavPageLayout';
import AddServer from './pages/AddServer';
import Keys from './pages/Keys';

export default function App({ isSignedIn, wallet }) {
  const [isDarkTheme, setIsDarkTheme] = useState(
    localStorage.getItem('isDarkTheme') || ''
  );

  const changeTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    localStorage.setItem('isDarkTheme', isDarkTheme ? '' : 'true');
  };

  return (
    <ThemeProvider theme={theme(isDarkTheme)}>
      <BrowserRouter>
        <ConfirmProvider>
          <Routes>
            <Route
              path="/"
              element={
                <Layout
                  isSignedIn={isSignedIn}
                  wallet={wallet}
                  changeTheme={changeTheme}
                />
              }
            >
              <Route
                index
                element={<Home isSignedIn={isSignedIn} wallet={wallet} />}
              />
              <Route
                path="/pools"
                element={<Pools isSignedIn={isSignedIn} wallet={wallet} />}
              />
              <Route
                path="/pools/create"
                element={
                  <CreateStakingPool isSignedIn={isSignedIn} wallet={wallet} />
                }
              />
              <Route
                path="/stake"
                element={
                  <StakeToKuutamoPool isSignedIn={isSignedIn} wallet={wallet} />
                }
              />
              <Route path="/news" element={<News />} />
              <Route
                path="/rewards"
                element={<Rewards isSignedIn={isSignedIn} wallet={wallet} />}
              />
              <Route
                path="/servers"
                element={<Servers isSignedIn={isSignedIn} wallet={wallet} />}
              />
              <Route
                path="/servers/add"
                element={<AddServer isSignedIn={isSignedIn} wallet={wallet} />}
              />
              <Route
                path="/keys"
                element={<Keys isSignedIn={isSignedIn} wallet={wallet} />}
              />
            </Route>
            <Route
              path="/navpage"
              element={
                <NavPageLayout
                  isSignedIn={isSignedIn}
                  wallet={wallet}
                  changeTheme={changeTheme}
                />
              }
            >
              <Route
                index
                element={<NavPage isSignedIn={isSignedIn} wallet={wallet} />}
              />
            </Route>
          </Routes>
        </ConfirmProvider>
      </BrowserRouter>
      <CssBaseline />
    </ThemeProvider>
  );
}
