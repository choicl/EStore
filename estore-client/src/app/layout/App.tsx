import Catalog from '../features/catalog/Catalog';
import { Container, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import Header from './Header';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../features/home/HomePage';
import ProductDetails from '../features/catalog/ProductDetails';
import AboutPage from '../features/about/AboutPage';
import ContactPage from '../features/contact/ContactPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ServerError from '../errors/ServerErrors';
import NotFound from '../errors/NotFound';
import BasketPage from '../features/basket/BasketPage';
import { useStoreContext } from '../../context/StoreContext';
import { getCookie } from '../utils/util';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';
import CheckoutPage from '../features/checkout/CheckoutPage';

function App() {
const {setBasket} = useStoreContext();
const[loading, setLoading] = useState(true);

useEffect(() => {
  const buyerId = getCookie('buyerId');
  if(buyerId){
    agent.Basket.get()
    .then(basket => setBasket(basket))
    .catch(error=> console.log(error))
    .finally(() => setLoading(false));
  } else{
    setLoading(false);
  }
}, [setBasket])
  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === 'light' ? '#eaeaea' : '#121212'
      }
    }
  })

function handleThemeChange(){
  setDarkMode(!darkMode);
}

if(loading) return <LoadingComponent message='Initialising app...'/>

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position='bottom-right' hideProgressBar/>
      <CssBaseline/>
        <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
          <Container>
            <Routes>
              <Route path='/' element={<HomePage/>}/>
              <Route path='/catalog' element={<Catalog/>}/>
              <Route path='/catalog/:id' element={<ProductDetails/>}/>
              <Route path='/about' element={<AboutPage/>}/>
              <Route path='/contact' element={<ContactPage/>}/>
              <Route path='/basket' element={<BasketPage/>}/>
              <Route path='/checkout' element={<CheckoutPage/>}/>
              <Route element={<NotFound/>}/>
            </Routes>
          </Container>
    </ThemeProvider>
  );
}

export default App;
