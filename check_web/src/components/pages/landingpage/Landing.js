import React from "react";
import { Box, Flex, Text, Spacer, Button, useMediaQuery } from "@chakra-ui/react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../../services/auth";

const Landing = () => {
  const [isLargerThanLG] = useMediaQuery("(min-width: 62em)");
  const { user } = useAuth();

  return user?.user_role ? (
    <Navigate to={`/${user?.user_role}/home`} replace />
  ) : (
    <Flex>
      <Box>
        <Flex h="10vh" alignItems="center" p="6" position="sticky" top="0" zIndex="sticky" w="full">
          <Link to="/">
            <Text fontSize="xl" fontWeight="bold" cursor="pointer">
              CHECK
            </Text>
          </Link>
          <Spacer />
          <Link to="/login">
            <Button colorScheme={"green"} alignItems="center">
              Login
            </Button>
          </Link>
        </Flex>
        <Flex
          alignItems="center"
          w="full"
          px={isLargerThanLG ? "16" : "6"}
          py="16"
          minHeight="90vh"
          justifyContent="space-between"
          flexDirection={isLargerThanLG ? "row" : "column"}
        >
          <Box mr={isLargerThanLG ? "6" : "0"} w={isLargerThanLG ? "60%" : "full"}>
            <Text fontSize={isLargerThanLG ? "5xl" : "4xl"} fontWeight="bold" mb="4">
              CHECK - everything at one place.
            </Text>
            <Text mb="6" fontSize={isLargerThanLG ? "lg" : "base"} opacity={0.7}>
              To provide everyone, everywhere with accessible healthcare and affordable insurance.
            </Text>
            <Link to="/register">
              <Button
                w="200px"
                colorScheme="blue"
                variant="solid"
                h="50px"
                size={isLargerThanLG ? "xlg" : "md"}
                mb={isLargerThanLG ? "0" : "10"}
              >
                Get Started!
              </Button>
            </Link>
          </Box>
          <Spacer />
          <Flex
            w={isLargerThanLG ? "50%" : "full"}
            alignItems="center"
            justifyContent="center"
            // eslint-disable-next-line no-undef
            backgroundImage={`url(${require("../../../assets/WelcomeImage.png")})`}
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize={isLargerThanLG ? "contain" : "cover"}
            d={{ sm: "none", lg: "flex" }}
            p="100"
          ></Flex>
        </Flex>
      </Box>
    </Flex>
  );
};
export default Landing;
