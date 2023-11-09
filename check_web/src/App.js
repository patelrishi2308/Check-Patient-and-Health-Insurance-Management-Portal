import React from "react";

// CSS Imports
import "./App.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "react-datepicker/dist/react-datepicker.css";
import customTheme from "./styles/theme";

//Other Imports
import { ChakraProvider } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import { Login, UserRegistration, ResetCredentials } from "./components/pages/auth";
import { Lost } from "./components/pages";
import { useAuth } from "./services/auth";
import { ResponseInterceptor } from "./utils/ResponseInterceptor";
import Landing from "./components/pages/landingpage/Landing";
import api from "./services/api";

// HOCs
import WithPatient from "./hocs/WithPatient";
import WithInsurer from "./hocs/WithInsurer";
import WithDoctor from "./hocs/WithDoctor";

// Patient Pages
import { Profile, ViewDoctors, Main, ManagePlans, CovidQuestionnaire } from "./components/pages/patient";
import InsurerMain from "./components/pages/insurer/InsurerMain";
import ViewPlans from "./components/pages/insurer/ViewPlans";
import { DoctorHome } from "./components/pages/doctor";
import { Layout, ViewAppointments } from "./components/common";
import { ViewSchedules } from "./components/doctors";

const App = () => {
  const { token } = useAuth();
  api.setHeader(token);

  return (
    <ChakraProvider resetCSS theme={customTheme}>
      <ResponseInterceptor />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<UserRegistration />} />
        <Route path="reset-credentials" element={<ResetCredentials />} />
        <Route path="patient" element={<WithPatient />}>
          <Route path="home" element={<Main />} />
          <Route path="profile" element={<Profile />} />
          <Route path="find-doctors" element={<ViewDoctors />} />
          <Route path="plans" element={<ManagePlans />} />
          <Route path="questionnaire" element={<CovidQuestionnaire />} />
          <Route path="appointments" element={<ViewAppointments />} />
        </Route>
        <Route path="doctor" element={<WithDoctor />}>
          <Route path="home" element={<DoctorHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="manage-schedule" element={<ViewSchedules />} />
          <Route path="appointment-history" element={<ViewAppointments />} />
        </Route>
        <Route path="insurer" element={<WithInsurer />}>
          <Route path="home" element={<InsurerMain />} />
          <Route path="profile" element={<Profile />} />
          <Route path="plans" element={<ViewPlans />} />
        </Route>
        <Route path="*" element={<Lost />} />
      </Routes>
    </ChakraProvider>
  );
};

export default App;
