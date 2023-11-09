import {
  Box,
  Button,
  Flex,
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
import { NEW_SCHEDULE, SCHEDULES } from "../../constants/apiRoutes";
import api from "../../services/api";
import { formattedErrorMessage } from "../../utils/formattedErrorMessage";
import useCustomToastr from "../../utils/useCustomToastr";
import { CustomSpinner, Layout } from "../common";
import { DatePickerField } from "../formik";
import * as Yup from "yup";

const ViewSchedules = () => {
  const toast = useCustomToastr();
  const [schedules, setSchedules] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchSchedules = () => {
    setLoading(true);
    api
      .get(SCHEDULES)
      .then((res) => {
        setSchedules(res.data?.message || []);
        setLoading(false);
      })
      .catch((err) => {
        const error = formattedErrorMessage(err);
        toast.showError(error);
        setLoading(false);
      });
  };

  const formattedTimestamp = ({ timestamp = new Date().toISOString(), timeformat = "do MMM yyyy, hh:mm:ss aa", convert = false }) => {
    if (convert) {
      const formatInTimeZone = (date, tz) => format(utcToZonedTime(date, tz), timeformat, { timeZone: tz });
      return formatInTimeZone(parseISO(timestamp), process.env.NEXT_PUBLIC_TZ);
    } else {
      return format(parseISO(timestamp), timeformat);
    }
  };

  const formSchema = Yup.object().shape({
    schedule_start_date_time: Yup.date().required("Appointment Start Time is required"),
    schedule_end_date_time: Yup.date().required("Appointment Start Time is required"),
  });

  const initialValues = {
    schedule_id: Math.floor(10000000 + Math.random() * 90000000),
    schedule_start_date_time: new Date(),
    schedule_end_date_time: new Date(),
    is_available: true,
  };

  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    api
      .post(NEW_SCHEDULE, {
        ...values,
        schedule_start_date_time: formattedTimestamp({
          timestamp: values.schedule_start_date_time.toISOString(),
          timeformat: "yyyy-MM-dd HH:mm",
        }),
        schedule_end_date_time: formattedTimestamp({
          timestamp: values.schedule_start_date_time.toISOString(),
          timeformat: "yyyy-MM-dd HH:mm",
        }),
      })
      .then((res) => {
        toast.showSuccess(res.data?.message);
        fetchSchedules();
        setSubmitting(false);
        onClose();
      })
      .catch((err) => {
        const error = formattedErrorMessage(err);
        toast.showError(error);
        setSubmitting(false);
      });
  };

  React.useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <Layout>
      {loading ? (
        <CustomSpinner />
      ) : (
        <Box>
          <Heading>Schedules</Heading>
          <Stack>
            <Flex justifyContent="space-between">
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
                Add schedule
              </Button>
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Add schedule</ModalHeader>
                  <ModalBody>
                    <Formik initialValues={initialValues} validationSchema={formSchema} onSubmit={onSubmit} enableReinitialize={true}>
                      {(props) => (
                        <Form autoComplete="off">
                          <Grid templateColumns={["repeat(1, 1fr)"]} gap={6} mb="5">
                            <DatePickerField
                              dateFormat="yyyy/MM/dd hh:mm aa"
                              label="Start time"
                              name="schedule_start_date_time"
                              isRequired
                              showTimeSelect
                              minDate={new Date()}
                              {...props}
                            />
                            <DatePickerField
                              dateFormat="yyyy/MM/dd hh:mm aa"
                              label="End time"
                              name="schedule_end_date_time"
                              showTimeSelect
                              isRequired
                              minDate={new Date()}
                              {...props}
                            />
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
                              Add
                            </Button>
                          </Grid>
                        </Form>
                      )}
                    </Formik>
                  </ModalBody>
                </ModalContent>
              </Modal>
            </Flex>
            {schedules?.length <= 0 ? (
              <Box>No schedules</Box>
            ) : (
              <Grid templateColumns={["repeat(2, 1fr)"]} gap={6} mb="5">
                {schedules.map((schedule) => (
                  <Box key={schedule.schedule_id} p={5} shadow="md" borderWidth="1px">
                    <Heading fontSize="xl">{schedule.schedule_id}</Heading>
                    <Text mt={4}>Start time: {formattedTimestamp({ timestamp: schedule.schedule_start_date_time, convert: true })}</Text>
                    <Text mt={4}>End time: {formattedTimestamp({ timestamp: schedule.schedule_end_date_time, convert: true })}</Text>
                  </Box>
                ))}
              </Grid>
            )}
          </Stack>
        </Box>
      )}
    </Layout>
  );
};

export default ViewSchedules;
