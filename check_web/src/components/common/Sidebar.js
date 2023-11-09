import React from "react";
import { Box, Divider, Flex } from "@chakra-ui/react";
import patientMenu from "../../constants/patientMenu";
import insurerMenu from "../../constants/insurerMenu";
import doctorMenu from "../../constants/doctorMenu";
import { Link } from "react-router-dom";
import { useAuth, useLogout } from "../../services/auth";
import { BiLogOut } from "react-icons/bi";

function Sidebar(props) {
  const { isExpanded } = props;
  const logout = useLogout();
  const { user } = useAuth();

  const menuSelector = {
    patient: patientMenu,
    doctor: doctorMenu,
    insurer: insurerMenu,
  };

  const menu = menuSelector[user?.user_role];

  const isActive = (link) => {
    const currentPath = window.location.pathname;
    return currentPath.includes(link);
  };

  const Entry = ({ onClick, children, link, name }) => (
    <Box
      py={3}
      px={isExpanded ? 3 : 2}
      my={1}
      fontSize={15}
      textAlign="center"
      backgroundColor={isActive(link) ? "secondary" : "transparent"}
      color="white"
      cursor="pointer"
      _hover={{ bg: "secondary" }}
      borderRadius={4}
      onClick={() => onClick && onClick()}
      title={name}
    >
      <Flex align="center" gap={2} justifyContent={!isExpanded && "center"}>
        {children}
      </Flex>
    </Box>
  );

  return (
    <>
      {menu.map((m) => (
        <React.Fragment key={m.link}>
          <Link to={m.link}>
            <Entry link={m.link} name={m.name}>
              {m.icon}
              {isExpanded && m.name}
            </Entry>
          </Link>
        </React.Fragment>
      ))}
      <Box position="absolute" bottom="0" w={isExpanded ? "9%" : "2%"}>
        <Divider />
        <Entry onClick={() => logout()} name={"Logout"}>
          <BiLogOut />
          {isExpanded && "Logout"}
        </Entry>
      </Box>
    </>
  );
}

export default Sidebar;
