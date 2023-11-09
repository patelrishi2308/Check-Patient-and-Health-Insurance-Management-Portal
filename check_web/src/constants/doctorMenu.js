import React from "react";
import { AiFillHome, AiOutlineProfile } from "react-icons/ai";
import { BsClockHistory, BsFillCalendarWeekFill } from "react-icons/bs";

const doctorPrimaryMenu = [
  {
    name: "Home",
    link: "/doctor/home",
    icon: <AiFillHome color="white" />,
  },
  {
    name: "Profile",
    link: "/doctor/profile",
    icon: <AiOutlineProfile color="white" />,
  },
  {
    name: "Manage schedule",
    link: "/doctor/manage-schedule",
    icon: <BsFillCalendarWeekFill color="white" />,
  },
  {
    name: "Appointments",
    link: "/doctor/appointment-history",
    icon: <BsClockHistory color="white" />,
  },
];

export default doctorPrimaryMenu;
