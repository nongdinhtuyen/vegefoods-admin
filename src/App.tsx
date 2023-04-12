import './bootstrap';
import 'common/extend_dayjs';
import AppProvider from 'components/AppProvider';
import LayoutContainer from 'layout/LayoutContainer';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from 'redux/store';
import Login from 'screens/Login';
import ProductDetail from 'screens/ProductDetail';
import Receipt from 'screens/Receipt';

import './scss/index.scss';
import 'App.scss';

type Router = {
  children: React.ReactNode;
};

function RequireAuth({ children }: Router) {
  const { isLogin } = useAppSelector((state) => state.accountReducer);
  const location = useLocation();
  if (!isLogin) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

function LoginRouter({ children }: Router) {
  const { isLogin } = useAppSelector((state) => state.accountReducer);
  if (isLogin) {
    return <Navigate to='/' />;
  }
  return <>{children}</>;
}

function App() {
  window.navigate = useNavigate();
  return (
    <AppProvider>
      <Routes>
        <Route
          path='/'
          element={
            <RequireAuth>
              <LayoutContainer />
            </RequireAuth>
          }
        >
          <Route index element={<Receipt />} />
          {/* <Route path='/product/:id' element={<ProductDetail />} /> */}
        </Route>
        <Route
          path='/login'
          element={
            <LoginRouter>
              <Login />
            </LoginRouter>
          }
        />
      </Routes>
    </AppProvider>
  );
}

export default App;
