import {
  Button,
  Flex,
  Grid,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { INSURER_PLANS } from "../../../constants/apiRoutes";
import api from "../../../services/api";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import useCustomToastr from "../../../utils/useCustomToastr";
import { CustomSpinner } from "../../common";
import Layout from "../../common/Layout";
import InsurerCard from "../../insurer/Card";
import PlanForm from "./PlanForm";

const ViewPlans = () => {
  const toast = useCustomToastr();
  const [plans, setPlans] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchPlans = () => {
    api
      .get(
        INSURER_PLANS +
          "?" +
          new URLSearchParams({
            insurer_id: localStorage.getItem("insurer_id"),
          })
      )
      .then((response) => {
        setPlans(response.data.plans);
        setLoading(false);
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <Layout>
      <Stack>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading>Plans</Heading>
          <Button colorScheme={"blue"} onClick={onOpen}>
            + Create Plan
          </Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent minW="80vw">
              <ModalHeader>Modal Title</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <PlanForm fetchPlans={fetchPlans} onClose={onClose} />
              </ModalBody>
            </ModalContent>
          </Modal>
        </Flex>
        {loading ? (
          <CustomSpinner />
        ) : (
          <>
            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
              {plans.map((p, i) => (
                <InsurerCard key={i} plan={p} fetchPlans={fetchPlans} />
              ))}
            </Grid>
          </>
        )}
      </Stack>
    </Layout>
  );
};

export default ViewPlans;
