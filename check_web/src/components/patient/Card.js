import { Box, Button, Center, CheckboxIcon, List, ListIcon, ListItem, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { ENROLL_PLAN } from "../../constants/apiRoutes";
import api from "../../services/api";
import { formattedErrorMessage } from "../../utils/formattedErrorMessage";
import useCustomToastr from "../../utils/useCustomToastr";

const InsurerCard = (props) => {
  const toast = useCustomToastr();
  const { plan, refresher } = props;

  const handlePlanSelection = () => {
    api
      .post(ENROLL_PLAN + "?" + new URLSearchParams({ plan_id: plan.plan_id }))
      .then((response) => {
        toast.showSuccess("Plan selected successfully");
        refresher();
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
      });
  };

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
            {plan.plan_display_name || "-"}
          </Text>
          <Stack direction={"row"} align={"center"} justify={"center"}>
            <Text fontSize={"3xl"}>$</Text>
            <Text fontSize={"6xl"} fontWeight={800}>
              {plan.premium}
            </Text>
            <Text color={"gray.500"}>/month</Text>
          </Stack>
        </Stack>
        <Box bg={useColorModeValue("gray.50", "gray.900")} p={6}>
          <List spacing={3}>
            <ListItem>Plan ID: {plan.plan_id}</ListItem>
            <ListItem>Description: {plan.plan_description}</ListItem>
            <ListItem>Coverage: ${plan.coverage}</ListItem>
            <ListItem>Deductible: ${plan.deductible_amt}</ListItem>
            <ListItem>Duration: {plan.duration_years} years</ListItem>
            <ListItem>Insured By: {plan.insurer_id}</ListItem>
            <ListItem>Exceptions: {plan.plan_exceptions.join(", ")}</ListItem>
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
            onClick={() => handlePlanSelection()}
          >
            Select Plan
          </Button>
        </Box>
      </Box>
    </Center>
  );
};

export default InsurerCard;
