import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

//------------------------------------style
import './App.css';

//------------------------------------pages
const Cryptos = lazy(() => import('./pages/cryptos/cryptos'))
const CryptoDetails = lazy(() => import('./pages/cryptoDetails/cryptoDetails'))


function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes >
        <Route path='/*' element={<Cryptos />} />
        <Route path={`/cryptos/:cryptoId`} element={<CryptoDetails />} />
      </Routes >
    </Suspense>
  );
}

export default App;
