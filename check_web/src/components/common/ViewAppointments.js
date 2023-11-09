import {
  Badge,
  Box,
  Button,
  Divider,
  Grid,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { APPOINTMENTS, APPOINTMENT_FEEDBACK } from "../../constants/apiRoutes";
import api from "../../services/api";
import { formattedErrorMessage } from "../../utils/formattedErrorMessage";
import useCustomToastr from "../../utils/useCustomToastr";
import CustomSpinner from "./CustomSpinner";
import Layout from "./Layout";
import * as Yup from "yup";
import { NumberField, TextAreaField } from "../formik";
import { useAuth } from "../../services/auth";

const ViewAppointments = () => {
  const toast = useCustomToastr();
  const { user } = useAuth();

  const [appointments, setAppointments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const formSchema = Yup.object().shape({
    feedback: Yup.string().required("Feedback is required"),
    rating: Yup.number().required("Rating is required"),
  });

  const initialValues = {
    feedback: "",
    rating: 0,
  };

  const fetchAppointments = () => {
    setLoading(true);
    api
      .get(APPOINTMENTS)
      .then((res) => {
        setAppointments(res.data?.message || []);
        setLoading(false);
      })
      .catch((err) => {
        const error = formattedErrorMessage(err);
        toast.error(error);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    fetchAppointments();
  }, []);

  const FeedbackModal = ({ appointment }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const onSubmit = (values, { setSubmitting }) => {
      setSubmitting(true);
      api
        .post(APPOINTMENT_FEEDBACK + "?" + new URLSearchParams({ appoinment_id: appointment.appointment_id }), {
          ...values,
          appointment_attended: true,
        })
        .then((res) => {
          toast.showSuccess("Feedback added successfully");
          setSubmitting(false);
          fetchAppointments();
          onClose();
        })
        .catch((err) => {
          const error = formattedErrorMessage(err);
          toast.showError(error);
          setSubmitting(false);
        });
    };

    return appointment.feedback ? (
      <Badge colorScheme="green">Feedback added</Badge>
    ) : (
      <>
        <Button colorScheme="teal" onClick={onOpen} mr={2}>
          Add feedback
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Feedback</ModalHeader>
            <ModalBody>
              <Box>
                <Formik initialValues={initialValues} validationSchema={formSchema} onSubmit={onSubmit} enableReinitialize={true}>
                  {(props) => (
                    <Form autoComplete="off">
                      <Text fontSize="md" color="blue.500" mb="2">
                        Appointment ID: {appointment.appointment_id}
                      </Text>
                      <Grid templateColumns={["repeat(1, 1fr)"]} gap={6} mb="5">
                        <TextAreaField label="Feedback" name="feedback" placeholder="Enter..." isRequired showHeader={true} {...props} />
                        <NumberField {...props} label="Rating (on 5)" name="rating" isRequired min={0} max={5} />
                        {/* submit button */}
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
                          type="submit"
                          isLoading={props.isSubmitting}
                        >
                          Submit
                        </Button>
                      </Grid>
                    </Form>
                  )}
                </Formik>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  };

  const PaymentModal = ({ appointment }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isPaid, setIsPaid] = React.useState(false);
    return (
      <>
        <Button colorScheme="teal" onClick={onOpen}>
          Pay
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Bill</ModalHeader>
            <ModalBody>
              <Stack>
                <Text fontSize="md" color="blue.500" mb="2">
                  Appointment ID: {appointment.appointment_id}
                </Text>
                <Text fontSize="md" color="blue.500" mb="2">
                  Total Amount: {appointment.duration}hrs * 100/hr = ${appointment.duration * 100}
                </Text>
                <Text fontSize="md" color="blue.500" mb="2">
                  You Pay: ${Math.round(0.2 * appointment.duration * 100)}
                </Text>
                <Text fontSize="md" color="blue.500" mb="2">
                  Insurance Pays: ${Math.round(0.8 * appointment.duration * 100)}
                </Text>
              </Stack>
              {isPaid ? (
                <Badge colorScheme="green">Payment Successful</Badge>
              ) : (
                <Button
                  mt="4"
                  w={"full"}
                  bg={"green.400"}
                  color={"white"}
                  rounded={"xl"}
                  boxShadow={"0 5px 20px 0px rgb(72 187 120 / 43%)"}
                  _hover={{
                    bg: "green.500",
                  }}
                  onClick={() => {
                    setIsPaid(true);
                    toast.showSuccess("Payment Successful");
                    onClose();
                  }}
                >
                  Pay
                </Button>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  };

  return (
    <Layout>
      <Heading>My Appointments</Heading>
      {loading ? (
        <CustomSpinner />
      ) : (
        <Grid templateColumns="repeat(3, 1fr)" gap={6} mt="4">
          {appointments.length <= 0 ? (
            <Box>No appointments</Box>
          ) : (
            appointments.map((appointment) => (
              <Box key={appointment.id} maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
                <Box m="3">
                  <Badge colorScheme={appointment.appointment_attended ? "green" : "red"}>
                    {appointment.appointment_attended ? "Attended" : "Not Attended Yet"}
                  </Badge>
                  <Stack isInline d="flex" alignItems="baseline">
                    <h3>Starts At:</h3>
                    <Box color="gray.500" fontSize="sm" fontWeight="semibold" letterSpacing="wide" textTransform="uppercase" ml="2">
                      {appointment.appointment_start_time}
                    </Box>
                  </Stack>
                  <Stack isInline d="flex" alignItems="baseline">
                    <h3>Appointment ID:</h3>
                    <Box color="gray.500" fontSize="sm" fontWeight="semibold" letterSpacing="wide" textTransform="uppercase" ml="2">
                      {appointment.appointment_id}
                    </Box>
                  </Stack>
                  <Stack isInline d="flex" alignItems="baseline">
                    <h3>Doctor ID:</h3>
                    <Box color="gray.500" fontSize="sm" fontWeight="semibold" letterSpacing="wide" textTransform="uppercase" ml="2">
                      {appointment.doctor_id}
                    </Box>
                  </Stack>
                  <Stack isInline d="flex" alignItems="baseline">
                    <h3>Duration:</h3>
                    <Box color="gray.500" fontSize="sm" fontWeight="semibold" letterSpacing="wide" textTransform="uppercase" ml="2">
                      {appointment.duration}
                    </Box>
                  </Stack>
                  <FeedbackModal appointment={appointment} />
                  {appointment.feedback && user.user_role === "patient" && (
                    <>
                      <Stack isInline d="flex" alignItems="baseline">
                        <h3>Feedback:</h3>
                        <Box color="gray.500" fontSize="sm" fontWeight="semibold" letterSpacing="wide" textTransform="uppercase" ml="2">
                          {appointment.feedback || "Not added yet"}
                        </Box>
                      </Stack>
                      <Stack isInline d="flex" alignItems="baseline">
                        <h3>Rating:</h3>
                        <Box color="gray.500" fontSize="sm" fontWeight="semibold" letterSpacing="wide" textTransform="uppercase" ml="2">
                          {appointment.rating}/5
                        </Box>
                      </Stack>
                      <Box m="2">
                        <Divider />
                      </Box>
                    </>
                  )}
                  {user.user_role === "patient" && <PaymentModal appointment={appointment} />}
                </Box>
              </Box>
            ))
          )}
        </Grid>
      )}
    </Layout>
  );
};

export default ViewAppointments;
