import { Box, Button, Flex, Text, useColorMode, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuth } from "../../services/auth";
import Sidebar from "./Sidebar";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const Layout = ({ children }) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = React.useState(true);
  const { colorMode, toggleColorMode } = useColorMode();
  const color = useColorModeValue("tertiary", "gray.800");

  return (
    <Flex flexDirection={["column", "column", "row", "row"]} w="100%" minH="100vh">
      <Box bg="primary" display={["none", "none", "block", "block"]} w={isExpanded ? "10%" : "3%"} pl={[0, 0, 0, 1]} pr={1}>
        <Flex
          position="relative"
          top="0"
          align={isExpanded ? "right" : "center"}
          fontSize={20}
          color="white"
          fontWeight="bold"
          p="2"
          justifyContent={isExpanded ? "space-between" : "center"}
        >
          {isExpanded && "CHECK"}
          <Box onClick={() => setIsExpanded(!isExpanded)} cursor="pointer" alignSelf="center" position="relative" right="0">
            <GiHamburgerMenu color="white" />
          </Box>
        </Flex>
        <Sidebar isExpanded={isExpanded} />
      </Box>
      <Box display="block" bg={color} w={isExpanded ? ["100%", "100%", "90%", "90%"] : ["100%", "100%", "97%", "97%"]} p="4">
        <Flex justify="flex-end" align="center" mb="4">
          <Text>{user?.user_name || "Guest"}</Text>
          <Box w="0.1em" h="1em" mx="0.7em" background="primary" />
          <Text>{user?.user_role || "User"}</Text>
          <Button ml="6" onClick={toggleColorMode}>
            {colorMode === "light" ? <MdDarkMode /> : <MdLightMode />}
          </Button>
        </Flex>
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;
