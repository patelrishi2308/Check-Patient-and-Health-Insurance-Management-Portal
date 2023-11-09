import { Box, Container, Flex, GridItem, Heading, Text, Grid, Stack } from "@chakra-ui/react";
import React from "react";
import { useAuth } from "../../../services/auth";
import Layout from "../../common/Layout";

const InsurerMain = () => {
  const { user } = useAuth();
  return (
    <Layout>
      <Stack>
        <Heading>{`Welcome ${user.user_name}`}</Heading>
        <iframe src="https://ourworldindata.org/grapher/full-list-cumulative-total-tests-per-thousand" width="100%" height="600px"></iframe>
        <iframe id="iframe1" src="https://ourworldindata.org/grapher/total-cases-covid-19?tab=map" width="100%" height="600px"></iframe>
      </Stack>
    </Layout>
  );
};

export default InsurerMain;
