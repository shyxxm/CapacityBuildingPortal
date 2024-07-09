import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Buttons from "./pages/Buttons";
import Alerts from "./pages/Alerts";
import Cards from "./pages/Cards";
import Forms from "./pages/Forms";
import Sample from "./pages/Sample";
import Typography from "./pages/Typography";
import Icon from "./pages/Icon";
import CreateProject from "./pages/CreateProject";
import ProjectDetails from "./pages/ProjectDetails";
import AddTrainer from "./pages/AddTrainer";
import AddManager from "./pages/AddManager";
import ViewManager from "./pages/ViewManager";
import ViewTrainer from "./pages/ViewTrainer";
import ViewTrainee from "./pages/ViewTrainee";
import SampleNew from "./pages/SampleNew";
import ProjectConfig from "./pages/ProjectConfig";
import TextAnalysis from "./pages/TextAnalysis";
import AddTrainee from "./pages/AddTrainee";
import CenterConfig from "./pages/CenterConfig";

import { UserProvider } from "./services/UserContext"; // Import UserProvider from UserContext
import PrivateRoutes from "./services/PrivateRoutes";

function App() {
  return (
    <div className="App">
      <Router>
        <UserProvider>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route element={<PrivateRoutes />}>
              <Route path="/Dashboard" element={<Index />} />
              <Route path="/Buttons" element={<Buttons />} />
              <Route path="/Alerts" element={<Alerts />} />
              <Route path="/Cards" element={<Cards />} />
              <Route path="/Forms" element={<Forms />} />
              <Route path="/Sample" element={<Sample />} />
              <Route path="/Typography" element={<Typography />} />
              <Route path="/Icon" element={<Icon />} />
              <Route path="/CreateProject" element={<CreateProject />} />
              <Route path="/ProjectDetails" element={<ProjectDetails />} />
              <Route path="/AddTrainer" element={<AddTrainer />} />
              <Route path="/AddManager" element={<AddManager />} />
              <Route path="/ViewManager" element={<ViewManager />} />
              <Route path="/ViewTrainer" element={<ViewTrainer />} />
              <Route path="/SampleNew" element={<SampleNew />} />
              <Route path="/ProjectConfig" element={<ProjectConfig />} />
              <Route path="/TextAnalysis" element={<TextAnalysis />} />
              <Route path="/AddTrainee" element={<AddTrainee />} />
              <Route path="/CenterConfig" element={<CenterConfig />} />
              <Route path="/ViewTrainee" element={<ViewTrainee />} />
            </Route>
          </Routes>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
