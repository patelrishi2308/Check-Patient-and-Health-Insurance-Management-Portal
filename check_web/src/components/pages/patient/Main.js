import { Divider, Heading, ListItem, Stack, UnorderedList } from "@chakra-ui/react";
import React from "react";
import { useAuth } from "../../../services/auth";
import Layout from "../../common/Layout";

const Main = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <Stack>
        <Heading>{`Welcome ${user.user_name}`}</Heading>
        <Divider />
        <Heading>COVID Precautions</Heading>
        <UnorderedList px={10} py={5}>
          <ListItem>Assessing employees&apos; potential exposure to COVID-19 and strategies for dealing with that.</ListItem>
          <ListItem>
            The identification of a COVID-19 monitor to monitor guidance and address workplace safety issues as they arise.
          </ListItem>
          <ListItem>Policies around workplace flexibility, including permitting telework and sick leave whenever possible.</ListItem>
          <ListItem>Hand hygiene and respiratory etiquette, such as sneezing and coughing etiquette.</ListItem>
          <ListItem>
            Cleaning and disinfection, particularly in areas with high touch or high-traffic or that are open to customers or visitors.
          </ListItem>
          <ListItem>
            Social distancing of at least six feet between people, including reconfiguring spaces, directing traffic and limiting occupancy
            and access to ensure that distancing.
          </ListItem>
          <ListItem>The importance of wearing face coverings, especially where social distancing cannot be maintained.</ListItem>
          <ListItem>A system for identifying and isolating sick employees.</ListItem>
          <ListItem>
            Management of persons exhibiting symptoms in the workplace, including keeping records of how and where a sick person was
            isolated, cleaning and disinfecting any spaces occupied by the sick employee, and a system for identifying contacts to be
            traced.
          </ListItem>
          <ListItem>The latest guidance on returning to work following illness or exposure.</ListItem>
          <ListItem>Engineering and administrative controls, such as physical barriers or shields or enhanced ventilation.</ListItem>
          <ListItem>Safe work practices, and personal protective equipment (PPE) tailored to the worksite and/or each job duty.</ListItem>
          <ListItem>
            Training for employees on how to identify the signs, symptoms, and risks of COVID-19, including how they can be exposed in the
            workplace, how they can work to minimize its spread, and safety protocols.
          </ListItem>
          <ListItem>Training on proper usage of PPE or the use of cloth face coverings.</ListItem>
          <ListItem>
            Anti-retaliation policies to ensure no adverse or retaliatory action is taken against an employee who raises workplace safety
            and health concerns.
          </ListItem>
          <ListItem>
            Strategies for preventing, monitoring for, and responding to the emergence or resurgence of COVID-19 in the workplace or
            community.
          </ListItem>{" "}
        </UnorderedList>
        <iframe src="https://ourworldindata.org/grapher/full-list-cumulative-total-tests-per-thousand" width="100%" height="600px"></iframe>
        <iframe id="iframe1" src="https://ourworldindata.org/grapher/total-cases-covid-19?tab=map" width="100%" height="600px"></iframe>
      </Stack>
    </Layout>
  );
};

export default Main;
