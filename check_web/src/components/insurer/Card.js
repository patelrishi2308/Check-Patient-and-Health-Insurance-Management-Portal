import {
  Box,
  Button,
  Center,
  List,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import PlanForm from "../pages/insurer/PlanForm";

const InsurerCard = (props) => {
  const { plan, fetchPlans } = props;
  const {
    coverage = "",
    deductible_amt = "",
    duration_years = "",
    is_monthly = "",
    plan_description = "-",
    plan_display_name = "",
    plan_exceptions = [],
    plan_id = "",
    premium = "",
  } = plan;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Center py={6}>
      <Box maxW={"330px"} w={"full"} bg={useColorModeValue("white", "gray.800")} boxShadow={"2xl"} rounded={"md"} overflow={"hidden"}>
        <Stack textAlign={"center"} p={6} color={useColorModeValue("gray.800", "white")} align={"center"}>
          <Text
            fontSize={"xl"}
            fontWeight={500}
            bg={useColorModeValue("green.50", "green.900")}
            p={2}
            px={3}
            color={"green.500"}
            rounded={"full"}
          >
            {plan_display_name}
          </Text>
          <Stack direction={"row"} align={"center"} justify={"center"}>
            <Text fontSize={"3xl"}>$</Text>
            <Text fontSize={"6xl"} fontWeight={800}>
              {premium}
            </Text>
            <Text color={"gray.500"}>{is_monthly ? "/ month" : "/ year"}</Text>
          </Stack>
        </Stack>
        <Box bg={useColorModeValue("gray.50", "gray.900")} p={6}>
          <List spacing={3}>
            <Text fontSize={"sm"} color={"gray.500"}>
              Plan Description: {plan_description}
            </Text>
            <Stack isInline align="center">
              <Text fontWeight={600} color={"gray.500"}>
                Plan ID
              </Text>
              <Box>{plan_id}</Box>
            </Stack>
            <Stack isInline align="center">
              <Text fontWeight={600} color={"gray.500"}>
                Coverage
              </Text>
              <Box>${coverage}</Box>
            </Stack>
            <Stack isInline align="center">
              <Text fontWeight={600} color={"gray.500"}>
                Plan Exceptions
              </Text>
              <Box>{plan_exceptions.join(", ")}</Box>
            </Stack>
            <Stack isInline align="center">
              <Text fontWeight={600} color={"gray.500"}>
                Deductible Amount
              </Text>
              <Box>${deductible_amt}</Box>
            </Stack>
            <Stack isInline align="center">
              <Text fontWeight={600} color={"gray.500"}>
                Duration Years
              </Text>
              <Box>{duration_years}</Box>
            </Stack>
          </List>
          <Button
            mt={10}
            w={"full"}
            bg={"green.400"}
            color={"white"}
            rounded={"xl"}
            boxShadow={"0 5px 20px 0px rgb(72 187 120 / 43%)"}
            _hover={{
              bg: "green.500",
            }}
            _focus={{
              bg: "green.500",
            }}
            onClick={onOpen}
          >
            Edit
          </Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent minW="80vw">
              <ModalHeader>Modal Title</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <PlanForm fetchPlans={fetchPlans} onClose={onClose} plan={plan} />
              </ModalBody>
            </ModalContent>
          </Modal>
        </Box>
      </Box>
    </Center>
  );
};

export default InsurerCard;
