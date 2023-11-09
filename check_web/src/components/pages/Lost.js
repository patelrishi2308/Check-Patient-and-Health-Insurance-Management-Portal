import { Text, Button, Stack, Heading } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import { BiUnlink } from "react-icons/bi";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";

const Lost = () => {
  return (
    <>
      <Heading>
        <title>Lost</title>
      </Heading>
      <Stack align="center" justifyContent="center" minHeight="90vh" w="100%">
        <Text fontSize={48} fontWeight="semibold" color="red.500" textAlign="-webkit-center">
          <BiUnlink />
          Broken link!
        </Text>
        <Link to={"/"}>
          <Button colorScheme="green" leftIcon={<BsFillArrowLeftCircleFill />}>
            Back Home
          </Button>
        </Link>
      </Stack>
    </>
  );
};

export default Lost;
