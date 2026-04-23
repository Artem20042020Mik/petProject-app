import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from './pages/RegisterPage';
import ProjectsPage from './pages/ProjectsPage';
import PrivateRoute from './components/PrivateRoute';
import ProfilePage from "./pages/ProfilePage.jsx";
import LandingPage from "./pages/LandingPage.jsx";


function App(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage/>} />
                <Route path="/login" element={ <LoginPage />}/>
                <Route path="/register" element={<RegisterPage />}/>
                <Route path="/projects" element={
                    <PrivateRoute>
                        <ProjectsPage/>
                    </PrivateRoute>}>
                </Route>
                <Route path="/profile" element=

                    {<PrivateRoute>
                        <ProfilePage/>
                    </PrivateRoute>}>
                </Route>
                <Route path="*" element={<Navigate to="/login"/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
