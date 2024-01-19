
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import './styles.css';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import { ToastContainer } from 'react-toastify';
import { useStore } from '../stores/store';
import { useEffect } from 'react';
import LoadingComponents from './LoadingComponents';
import ModalContainer from '../common/modals/ModalContainer';

function App() {
  const location = useLocation();	//ovo je hook koji nam daje informacije o trenutnoj lokaciji
  //kada napravimo router neki tj kada clickenom na njega Outlet ce prikazat ono sto smo klikli

  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore?.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }

  }, [commonStore, userStore])

  if (!commonStore.appLoaded) return <LoadingComponents content='Loading app...' inverted={true} />

  return (
    <>
      { //Conditional Rendering: The component then conditionally renders different components based on the current path. 
        //If the path is '/', it renders the HomePage component. Otherwise, it renders the NavBar and an Outlet inside a Container. 
        //The Outlet component is where the child routes will be rendered.
      }
      <ModalContainer />
      <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
      {location.pathname === '/' ? <HomePage /> : (
        <>
          <NavBar />
          <Container style={{ marginTop: '7em' }}>
            <Outlet />
          </Container>


        </>
      )}
    </>

  )
}

export default observer(App);
