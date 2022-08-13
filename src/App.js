import { Route, Routes } from 'react-router-dom';
import Home from './view/home';
import MainLayout from './layouts/main';
import Avatars from './view/avatars';
import Avatar from './view/avatar';

function App() {
  return (
    <>
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/avatars" element={<Avatars />}/>
        <Route path="/avatars/:tokenId" element={<Avatar />}/>
      </Routes>
    </MainLayout>
    </>
  );
}

export default App;