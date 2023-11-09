import {
  Box,
  Button,
  Center,
  Grid,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { NEW_APPOINTMENT } from "../../constants/apiRoutes";
import api from "../../services/api";
import { formattedErrorMessage } from "../../utils/formattedErrorMessage";
import useCustomToastr from "../../utils/useCustomToastr";
import * as Yup from "yup";
import { DatePickerField, NumberField } from "../formik";
import { Form, Formik } from "formik";
import { format, parseISO } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

const Card = (props) => {
  const toast = useCustomToastr();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { doctor } = props;

  const formattedTimestamp = ({ timestamp = new Date().toISOString(), timeformat = "do MMM yyyy, hh:mm:ss aa", convert = false }) => {
    if (convert) {
      const formatInTimeZone = (date, tz) => format(utcToZonedTime(date, tz), timeformat, { timeZone: tz });
      return formatInTimeZone(parseISO(timestamp), process.env.NEXT_PUBLIC_TZ);
    } else {
      return format(parseISO(timestamp), timeformat);
    }
  };

  const formSchema = Yup.object().shape({
    appointment_start_time: Yup.date().required("Appointment Start Time is required"),
    duration: Yup.string().required("Duration is required"),
  });

  const initialValues = {
    appointment_id: Math.floor(10000000 + Math.random() * 90000000),
    doctor_id: doctor.contact_email,
    appointment_start_time: new Date(),
    duration: "30",
    feedback: "",
    rating: 0,
    appointment_attended: false,
  };

  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    api
      .post(NEW_APPOINTMENT, {
        ...values,
        appointment_start_time: formattedTimestamp({
          timestamp: values.appointment_start_time.toISOString(),
          timeformat: "yyyy-MM-dd HH:mm",
        }),
      })
      .then((res) => {
        toast.showSuccess(res.data?.message);
        setSubmitting(false);
        onClose();
      })
      .catch((err) => {
        const error = formattedErrorMessage(err);
        toast.showError(error);
        setSubmitting(false);
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
            {doctor.name || "-"}
          </Text>
          <Stack direction={"row"} align={"center"} justify={"center"}>
            <Text fontSize={"6xl"} fontWeight={800}>
              {doctor.experience}
            </Text>
            <Text color={"gray.500"}>years of experience</Text>
          </Stack>
        </Stack>
        <Box bg={useColorModeValue("gray.50", "gray.900")} p={6}>
          <List spacing={3}>
            <ListItem>Email: {doctor.contact_email}</ListItem>
            <ListItem>Phone: {doctor.contact_phone}</ListItem>
            <ListItem>Gender: {doctor.gender}</ListItem>
            <ListItem>Hospital Name: {doctor.hospital_name}</ListItem>
            <ListItem>Hospital address: {doctor.hospital_address}</ListItem>
            <ListItem>Specialty: {doctor.speciality}</ListItem>
            <ListItem>Covid Supported: {doctor.is_hosp_covid_supported ? "Yes" : "No"}</ListItem>
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
            Book an appointment
          </Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Book appointment</ModalHeader>
              <ModalBody>
                <Formik initialValues={initialValues} validationSchema={formSchema} onSubmit={onSubmit} enableReinitialize={true}>
                  {(props) => (
                    <Form autoComplete="off">
                      <Text fontSize="md" color="blue.500" mb="2">
                        Appointment ID: {props.values.appointment_id}
                      </Text>
                      <Text fontSize="md" color="blue.500" mb="2">
                        Doctor ID: {props.values.doctor_id}
                      </Text>
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
        </Box>
      </Box>
    </Center>
  );
};

export default Card;
