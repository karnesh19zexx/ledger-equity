import '../styles/globals.css';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';
import useWeb3Store from '../store/useWeb3Store';

function MyApp({ Component, pageProps }) {
  const checkConnection = useWeb3Store((state) => state.checkConnection);

  useEffect(() => {
    // Check for existing wallet connection on app mount
    checkConnection();
  }, [checkConnection]);

  return (
    <>
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default MyApp;
