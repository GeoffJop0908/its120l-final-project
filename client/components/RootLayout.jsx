import React from 'react';
import Input from './Input';
import { Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-10">
      <Outlet />
      <Input />
    </div>
  );
}
