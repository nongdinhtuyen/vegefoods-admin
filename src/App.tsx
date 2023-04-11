import './bootstrap';
import 'common/extend_dayjs';
import AppProvider from 'components/AppProvider';
import Layout from 'components/Layout';
import { Route, Routes } from 'react-router-dom';

import 'App.scss';

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path='/' element={<Layout />}></Route>
      </Routes>
    </AppProvider>
  );
}

export default App;
