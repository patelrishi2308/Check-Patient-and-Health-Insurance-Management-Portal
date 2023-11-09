import { Button, Flex, Grid, Heading, Input, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { INSURER_ALL_PLANS, PROFILE } from "../../../constants/apiRoutes";
import api from "../../../services/api";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import useCustomToastr from "../../../utils/useCustomToastr";
import { CustomSpinner } from "../../common";
import Layout from "../../common/Layout";
import { Card } from "../../patient";

const ManagePlans = () => {
  const toast = useCustomToastr();
  const [plans, setPlans] = React.useState([]);
  const [currentPlan, setCurrentPlan] = React.useState("");

  const fetchCurrentPlan = () => {
    api.get(PROFILE).then((response) => {
      setCurrentPlan(response.data.patient?.health_plan_id);
    });
  };

  const fetchPlans = () => {
    api
      .get(INSURER_ALL_PLANS)
      .then((response) => {
        setPlans(response.data.plans);
      })
      .catch((err) => {
        const errorMessage = formattedErrorMessage(err);
        toast.showError(errorMessage);
      });
  };

  React.useEffect(() => {
    fetchPlans();
    fetchCurrentPlan();
  }, []);

  return (
    <Layout>
      {plans.length <= 0 ? (
        <CustomSpinner />
      ) : (
        <Stack>
          <Stack isInline py={5} gap="4" p="4" border="1px" borderColor="gray.300" borderRadius="5px">
            <Heading as={"h3"}>Current Plan:</Heading>
            <Text fontSize={"3xl"} fontWeight={"bold"}>
              {plans.find((x) => x.plan_id == currentPlan)?.plan_display_name}
            </Text>
            <Heading as={"h3"}>Premium:</Heading>
            <Text fontSize={"3xl"} fontWeight={"bold"}>
              ${plans.find((x) => x.plan_id == currentPlan)?.premium}
            </Text>
          </Stack>
          <Heading>Browse Plans</Heading>
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {plans.map((x, i) => (
              <Card key={i} plan={x} refresher={fetchCurrentPlan} />
            ))}
          </Grid>
        </Stack>
      )}
    </Layout>
  );
};

export default ManagePlans;
