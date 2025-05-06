import { Routes, Route } from 'react-router-dom';
import PageContainer from '../pages/Page-container.jsx';
import LandingPage from '../pages/LandingPage.jsx';
import SignupForm from '../Components/Auth/SignupForm.jsx';
import MainLayout from '../pages/Mainlayout.jsx';

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<SignupForm />} />
      <Route path="/landingpage" element={<LandingPage />} />

      {/* Main Layout with Outlet for nested routes */}
      
      <Route path="/sites" element={<MainLayout />}>
  <Route path=":siteId/:pageName/:tabKey" element={<PageContainer />} />
</Route>
    </Routes>
  );
};

export default RoutesComponent;
