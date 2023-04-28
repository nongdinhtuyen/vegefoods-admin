import './bootstrap';
import 'common/extend_dayjs';
import AppProvider from 'components/AppProvider';
import LayoutContainer from 'layout/LayoutContainer';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from 'redux/store';
import Bills from 'screens/Bills';
import Customer from 'screens/Customer';
import Login from 'screens/Login';
import Product from 'screens/Product';
import ProductType from 'screens/ProductType';
import Promotion from 'screens/Promotion';
import Provider from 'screens/Provider';
import Rank from 'screens/Rank';
import Warehouse from 'screens/Warehouse';

import './scss/index.scss';
import 'App.scss';
import 'react-phone-number-input/style.css';

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
          <Route index element={<Bills />} />
          <Route path='product' element={<Product />} />
          <Route path='productType' element={<ProductType />} />
          <Route path='provider' element={<Provider />} />
          <Route path='rank' element={<Rank />} />
          <Route path='warehouse' element={<Warehouse />} />
          <Route path='customer' element={<Customer />} />
          <Route path='promotion' element={<Promotion />} />
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
