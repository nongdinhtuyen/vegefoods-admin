import SplashScreen from './SplashScreen';
import React from 'react';
import { useSelector } from 'react-redux';
import { useAppSelector } from 'redux/store';

type Props = {
  children: React.ReactNode;
};

export default function NeedInitComponent({ children }: Props) {
  const { inited } = useAppSelector((state) => state.initReducer);
  return inited ? <>{children}</> : <SplashScreen />;
}
