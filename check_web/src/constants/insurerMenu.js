import React from "react";
import { AiFillHome, AiOutlineProfile } from "react-icons/ai";
import { HiOutlineClipboardList } from "react-icons/hi";

const insurerPrimaryMenu = [
  {
    name: "Home",
    link: "/insurer/home",
    icon: <AiFillHome color="white" />,
  },
  {
    name: "Profile",
    link: "/insurer/profile",
    icon: <AiOutlineProfile color="white" />,
  },
  {
    name: "View Plans",
    link: "/insurer/plans",
    icon: <HiOutlineClipboardList color="white" />,
  },
];

export default insurerPrimaryMenu;
