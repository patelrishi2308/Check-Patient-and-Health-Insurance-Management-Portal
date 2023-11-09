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
import { format, parseISO } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import {
  APPOINTMENT_FEEDBACK,
  COVID_QUESTIONNAIRE,
  GET_COVID_QUESTIONNAIRE,
  GET_COVID_TEST,
  SCHEDULE_COVID_TEST,
} from "../../../constants/apiRoutes";
import api from "../../../services/api";
import { useAuth } from "../../../services/auth";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import useCustomToastr from "../../../utils/useCustomToastr";
import { Layout } from "../../common";
import { DatePickerField, InputField, NumberField, SelectField, TextAreaField } from "../../formik";

const CovidQuestionnaire = (props) => {
  const toast = useCustomToastr();
  const { user } = useAuth();
  const [questionnaire, setQuestionnaire] = React.useState(null);
  const [covidTest, setCovidTest] = React.useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const formattedTimestamp = ({ timestamp = new Date().toISOString(), timeformat = "do MMM yyyy, hh:mm:ss aa", convert = false }) => {
    if (convert) {
      const formatInTimeZone = (date, tz) => format(utcToZonedTime(date, tz), timeformat, { timeZone: tz });
      return formatInTimeZone(parseISO(timestamp), process.env.NEXT_PUBLIC_TZ);
    } else {
      return format(parseISO(timestamp), timeformat);
    }
  };

  const covidTestSchema = Yup.object().shape({
    appointment_start_time: Yup.date().required("Appointment Start Time is required"),
    duration: Yup.string().required("Duration is required"),
  });

  const covidTestInitialValues = {
    appointment_start_time: new Date(),
    duration: "30",
  };

  const onCovidTestSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    api
      .post(SCHEDULE_COVID_TEST, {
        ...values,
        appointment_start_time: formattedTimestamp({
          timestamp: values.appointment_start_time.toISOString(),
          timeformat: "yyyy-MM-dd HH:mm",
        }),
      })
      .then((res) => {
        toast.showSuccess(res.data?.message);
        setSubmitting(false);
        getCovidTest();
        onClose();
      })
      .catch((err) => {
        const error = formattedErrorMessage(err);
        toast.showError(error);
        setSubmitting(false);
      });
  };

  const questionnaireSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    email: Yup.string().required("Required"),
    age: Yup.number().required("Required"),
    has_cold: Yup.number().required("Required"),
    has_fever: Yup.number().required("Required"),
    has_cough: Yup.number().required("Required"),
    has_weakness: Yup.number().required("Required"),
    has_sour_throat: Yup.number().required("Required"),
    has_body_pains: Yup.number().required("Required"),
    covid_test: Yup.number().required("Required"),
    other_symptoms: Yup.string(),
  });

  const initialValues = {
    name: "",
    email: "",
    age: "",
    has_cold: 1,
    has_fever: 1,
    has_cough: 1,
    has_weakness: 1,
    has_sour_throat: 1,
    has_body_pains: 1,
    other_symptoms: "",
    covid_test: 0,
    ...questionnaire?.message,
  };

  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    const data = {
      updated_at: new Date().toISOString(),
      user_id: user.user_id,
      ...values,
    };
    api
      .post(COVID_QUESTIONNAIRE, data)
      .then((response) => {
        toast.showSuccess("Success! Questionnaire submitted!");
        setSubmitting(false);
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
        setSubmitting(false);
      });
  };

  const getCovidQuestionnaire = () => {
    api
      .get(GET_COVID_QUESTIONNAIRE)
      .then((response) => {
        const { data } = response;
        setQuestionnaire(data);
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
      });
  };

  const getCovidTest = () => {
    api
      .get(GET_COVID_TEST)
      .then((res) => {
        setCovidTest(res.data?.message);
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
      });
  };

  const FeedbackModal = ({ appointment }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const formSchema = Yup.object().shape({
      feedback: Yup.string().required("Feedback is required"),
      rating: Yup.number().required("Rating is required"),
    });

    const initialValues = {
      feedback: "",
      rating: 0,
    };
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
          getCovidTest();
          onClose();
        })
        .catch((err) => {
          const error = formattedErrorMessage(err);
          toast.showError(error);
          setSubmitting(false);
        });
    };

    return (
      <>
        <Button colorScheme="teal" onClick={onOpen} m={2}>
          {appointment.feedback ? "Update" : "Add"} feedback
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
                  Total Amount: {appointment.duration} minutes * 100/hr = ${(appointment.duration / 60).toFixed(2) * 100}
                </Text>
                <Text fontSize="md" color="blue.500" mb="2">
                  You Pay: ${Math.round(0.2 * (appointment.duration / 60).toFixed(2) * 100)}
                </Text>
                <Text fontSize="md" color="blue.500" mb="2">
                  Insurance Pays: ${Math.round(0.8 * (appointment.duration / 60).toFixed(2) * 100)}
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

  React.useEffect(() => {
    getCovidQuestionnaire();
    getCovidTest();
  }, []);

  return (
    <Layout>
      {questionnaire?.message?.user_id === user.user_id && (
        <Stack>
          <Stack isInline d="flex" alignItems="baseline">
            <Heading mb="5">You have already submitted the questionnaire</Heading>
            <Button
              my={5}
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
              Book a covid test
            </Button>
          </Stack>
          <Grid templateColumns={["repeat(1, 1fr)", "repeat(3, 1fr)", "repeat(3, 1fr)"]} gap={6}>
            {covidTest.map((appointment) => (
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
            ))}
          </Grid>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Book appointment</ModalHeader>
              <ModalBody>
                <Formik
                  initialValues={covidTestInitialValues}
                  validationSchema={covidTestSchema}
                  onSubmit={onCovidTestSubmit}
                  enableReinitialize={true}
                >
                  {(props) => (
                    <Form autoComplete="off">
                      <Grid templateColumns={["repeat(1, 1fr)"]} gap={6} mb="5">
                        <DatePickerField
                          dateFormat="yyyy/MM/dd hh:mm"
                          label="Start time"
                          name="appointment_start_time"
                          isRequired
                          minDate={new Date()}
                          {...props}
                        />
                        <NumberField {...props} label="Duration in minutes" name="duration" />
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
                          Book
                        </Button>
                      </Grid>
                    </Form>
                  )}
                </Formik>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Stack>
      )}
      <Divider my="10" />
      <Formik initialValues={initialValues} validationSchema={questionnaireSchema} onSubmit={onSubmit} enableReinitialize={true}>
        {(props) => (
          <Form autoComplete="off">
            <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]} gap={6} my="5">
              <InputField isInline={false} direction="column" label="Name" name="name" isRequired />
              <InputField isInline={false} direction="column" label="Email" name="email" isRequired />
              <NumberField {...props} label="Age" name="age" isRequired />
              <SelectField
                {...props}
                name="has_cold"
                label="Has Cold?"
                placeholder="Select"
                isRequired
                options={[
                  { value: 1, label: "Yes" },
                  { value: 0, label: "No" },
                ]}
              />
              <SelectField
                {...props}
                name="has_fever"
                label="Has Fever?"
                placeholder="Select"
                isRequired
                options={[
                  { value: 1, label: "Yes" },
                  { value: 0, label: "No" },
                ]}
              />
              <SelectField
                {...props}
                name="has_cough"
                label="Has Cough?"
                placeholder="Select"
                isRequired
                options={[
                  { value: 1, label: "Yes" },
                  { value: 0, label: "No" },
                ]}
              />
              <SelectField
                {...props}
                name="has_weakness"
                label="Has Weakness?"
                placeholder="Select"
                isRequired
                options={[
                  { value: 1, label: "Yes" },
                  { value: 0, label: "No" },
                ]}
              />
              <SelectField
                {...props}
                name="has_sour_throat"
                label="Has Sour Throat?"
                placeholder="Select"
                isRequired
                options={[
                  { value: 1, label: "Yes" },
                  { value: 0, label: "No" },
                ]}
              />
              <SelectField
                {...props}
                name="has_body_pains"
                label="Has Body Pains?"
                placeholder="Select"
                isRequired
                options={[
                  { value: 1, label: "Yes" },
                  { value: 0, label: "No" },
                ]}
              />
              <SelectField
                {...props}
                name="covid_test"
                label="Covid Test"
                placeholder="Select"
                isRequired
                options={[
                  { value: 1, label: "Yes" },
                  { value: 0, label: "No" },
                ]}
              />
              <InputField isInline={false} direction="column" label="Other Symptoms" name="other_symptoms" />
              {/* submit button */}
              <Button
                colorScheme="green"
                type="submit"
                isLoading={props.isSubmitting}
                disabled={questionnaire?.message?.user_id === user.user_id}
              >
                Save
              </Button>
            </Grid>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default CovidQuestionnaire;
