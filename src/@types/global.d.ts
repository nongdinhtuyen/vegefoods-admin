import { Axios } from 'axios';
import { NavigateFunction } from 'react-router-dom';

export {};

declare global {
  interface Window {
    axios: Axios;
    navigate: NavigateFunction;
    $dispatch: Dispatch<AnyAction>;
  }
}
