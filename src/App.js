import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import { ConfirmProvider } from 'material-ui-confirm';
import theme from './ui/styles/mui-theme';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import NavBar from './ui/components/NavBar';
import CreateStakingPool from './pages/CreateStakingPool';
import StakeToKuutamoPool from './pages/StakeToKuutamoPool';
import Home from './pages/Home';
import Pools from './pages/Pools';
import Rewards from './pages/Rewards';
import News from './pages/News';
import Servers from './pages/Servers';
import NavPage from './pages/NavPage';
import Sidebar from './ui/components/Sidebar';

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
          {isSignedIn && <NavBar wallet={wallet} changeTheme={changeTheme} />}

          <Box
            sx={{
              width: 1,
              minHeight: `calc(100vh - 40px)`,
              display: 'flex',
              alignItems: 'stretch',
            }}
          >
            {isSignedIn && <Sidebar wallet={wallet} />}
            <Box
              component="main"
              sx={{
                display: 'flex',
                alignItems: 'stretch',
                width: 1,
                paddingTop: '53px',
              }}
            >
              <Routes>
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
                    <CreateStakingPool
                      isSignedIn={isSignedIn}
                      wallet={wallet}
                    />
                  }
                />
                <Route
                  path="/stake"
                  element={
                    <StakeToKuutamoPool
                      isSignedIn={isSignedIn}
                      wallet={wallet}
                    />
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
                  path="/navpage"
                  element={<NavPage isSignedIn={isSignedIn} wallet={wallet} />}
                />
              </Routes>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'center', width: '100%', height: '40px' }}>
            © 2023 kuutamo. All rights reserved
          </Box>
        </ConfirmProvider>
      </BrowserRouter>
      <CssBaseline />
    </ThemeProvider>
  );
}
