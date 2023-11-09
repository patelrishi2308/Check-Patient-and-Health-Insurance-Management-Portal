import React from "react";
import { AiFillHome, AiOutlineProfile } from "react-icons/ai";
import { GiHospitalCross } from "react-icons/gi";
import { HiOutlineClipboardList } from "react-icons/hi";

const patientPrimaryMenu = [
  {
    name: "Dashboard",
    link: "/patient/home",
    icon: <AiFillHome color="white" />,
  },
  {
    name: "Profile",
    link: "/patient/profile",
    icon: <AiOutlineProfile color="white" />,
  },
  {
    name: "Search for doctors",
    link: "/patient/find-doctors",
    icon: <GiHospitalCross color="white" />,
  },
  {
    name: "Manage Plans",
    link: "/patient/plans",
    icon: <HiOutlineClipboardList color="white" />,
  },
  {
    name: "COVID Questionnaire",
    link: "/patient/questionnaire",
    icon: <HiOutlineClipboardList color="white" />,
  },
  {
    name: "Appointments",
    link: "/patient/appointments",
    icon: <HiOutlineClipboardList color="white" />,
  },
];

export default patientPrimaryMenu;
