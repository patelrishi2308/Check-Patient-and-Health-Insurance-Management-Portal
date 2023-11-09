import React from "react";
import { Box, Flex, Text, Button, Stack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { InputField, PasswordField } from "../../formik";
import * as Yup from "yup";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import { useAuth } from "../../../services/auth";
import useCustomToastr from "../../../utils/useCustomToastr";
import { REQUEST_RESET, RESET_PASSWORD } from "../../../constants/apiRoutes";
import api from "../../../services/api";

const ResetCredentials = () => {
  const { user } = useAuth();
  const toast = useCustomToastr();
  const navigate = useNavigate();
  const [isReset, setIsReset] = React.useState(false);
  const [resetDetails, setResetDetails] = React.useState({});

  const requestResetFormSchema = Yup.object().shape({
    user_id: Yup.string().min(2, "Too Short!").required("Required"),
  });

  const resetRequestFormSchema = Yup.object().shape({
    user_password: Yup.string().min(2, "Too Short!").required("Required"),
    confirmPassword: Yup.string().min(2, "Too Short!").required("Required"),
    reset_code: Yup.string().min(2, "Too Short!").required("Required"),
  });

  const initialValues = {
    user_id: "",
  };

  const initialResetValues = {
    user_password: "",
    confirmPassword: "",
    reset_code: "",
  };

  const onRequestSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    api
      .get(REQUEST_RESET + "?" + new URLSearchParams(values))
      .then((response) => {
        setResetDetails({ user_id: values.user_id });
        toast.showSuccess("Reset code sent to mail successfully!");
        setIsReset(true);
        setSubmitting(false);
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
        setSubmitting(false);
      });
  };

  const onResetSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    if (values.user_password != values.confirmPassword) {
      setSubmitting(false);
      return toast.showError({ description: "Please enter the same password!" });
    }
    api
      .post(RESET_PASSWORD + "?" + new URLSearchParams(resetDetails), {
        user_password: values.user_password,
        reset_code: values.reset_code,
        updated_at: new Date(),
      })
      .then((response) => {
        toast.showSuccess("Reset successfully!");
        setIsReset(true);
        setSubmitting(false);
        navigate("/login");
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
        setSubmitting(false);
      });
  };

  return user?.user_role ? (
    <Navigate to={`/${user?.user_role}/home`} replace />
  ) : (
    <Flex pos="fixed" top="0" left="0" right="0" bottom="0" zIndex={2}>
      <Link to="/">
        <Text fontSize="xl" fontWeight="bold" cursor="pointer" p="6">
          CHECK
        </Text>
      </Link>
      <Flex
        w={"50%"}
        // eslint-disable-next-line no-undef
        backgroundImage={`url(${require("../../../assets/WelcomeImage.png")})`}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        d={{ sm: "none", lg: "flex" }}
        m="10"
      ></Flex>
      <Flex w={{ base: "100%", lg: "50%" }} direction="column" align="center" justify="center">
        <Text fontSize="2xl" fontWeight="600" textAlign="left">
          Reset Credentials!
        </Text>
        <Box w={"60%"} mt={10}>
          {isReset ? (
            <Formik
              initialValues={initialResetValues}
              validationSchema={resetRequestFormSchema}
              onSubmit={onResetSubmit}
              enableReinitialize={true}
            >
              {(props) => (
                <Form autoComplete="off">
                  <Stack mx="3" spacing={5}>
                    <InputField isInline={false} direction="column" label="Reset Code" name="reset_code" isRequired />
                    <PasswordField isInline={false} direction="column" label="Password" name="user_password" isRequired />
                    <PasswordField isInline={false} direction="column" label="Confirm Password" name="confirmPassword" isRequired />
                    {/* submit button */}
                    <Button colorScheme="green" type="submit" isLoading={props.isSubmitting}>
                      Reset Credentials
                    </Button>
                    <Link to="/login">
                      <Text fontSize="sm">Login?</Text>
                    </Link>
                    <Link to="/register">
                      <Text fontSize="sm">New User?</Text>
                    </Link>
                  </Stack>
                </Form>
              )}
            </Formik>
          ) : (
            <Formik
              initialValues={initialValues}
              validationSchema={requestResetFormSchema}
              onSubmit={onRequestSubmit}
              enableReinitialize={true}
            >
              {(props) => (
                <Form autoComplete="off">
                  <Stack mx="3" spacing={5}>
                    <InputField isInline={false} direction="column" label="Email" name="user_id" isRequired {...props} />
                    {/* submit button */}
                    <Button colorScheme="green" type="submit" isLoading={props.isSubmitting}>
                      Reset Credentials
                    </Button>
                    <Link to="/login">
                      <Text fontSize="sm">Login?</Text>
                    </Link>
                    <Link to="/register">
                      <Text fontSize="sm">New User?</Text>
                    </Link>
                  </Stack>
                </Form>
              )}
            </Formik>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default ResetCredentials;
