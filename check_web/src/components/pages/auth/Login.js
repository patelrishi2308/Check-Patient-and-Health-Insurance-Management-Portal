import React, { useState } from "react";
import { Box, Flex, Text, Button, Stack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { InputField, PasswordField } from "../../formik";
import * as Yup from "yup";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../../services/auth";
import api from "../../../services/api";
import { LOGIN } from "../../../constants/apiRoutes";
import useCustomToastr from "../../../utils/useCustomToastr";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useCustomToastr();
  const [verified, setVerified] = useState(false);

  const loginFormSchema = Yup.object().shape({
    user_id: Yup.string().min(2, "Too Short!").required("Required"),
    user_password: Yup.string().min(2, "Too Short!").required("Required"),
  });

  const initialValues = {
    user_id: "",
    user_password: "",
  };

  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    api
      .post(LOGIN, values)
      .then((response) => {
        setSubmitting(false);
        const { token = "122334", user_id, user_name, user_role } = response.data;
        localStorage.setItem("auth", JSON.stringify({ user: { user_id, user_role, user_name }, token }));
        navigate(`/${user_role}/home`);
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
        setSubmitting(false);
      });
  };

  const onChange = (value) => {
    if (value) setVerified(true);
  };

  return user?.user_role ? (
    <Navigate to={`/${user.user_role}/home`} replace />
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
          Dashboard Login!
        </Text>
        <Box w={"60%"} mt={10}>
          <Formik initialValues={initialValues} validationSchema={loginFormSchema} onSubmit={onSubmit} enableReinitialize={true}>
            {(props) => (
              <Form autoComplete="off">
                <Stack mx="3" spacing={5}>
                  <InputField isInline={false} direction="column" label="Email" name="user_id" isRequired />
                  <PasswordField isInline={false} direction="column" label="Password" name="user_password" isRequired />
                  <ReCAPTCHA sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" onChange={onChange} />
                  {/* submit button */}
                  <Button colorScheme="green" type="submit" disabled={!verified} isLoading={props.isSubmitting}>
                    Login
                  </Button>
                  <Link to="/reset-credentials">
                    <Text fontSize="sm">Reset Credentials?</Text>
                  </Link>
                  <Link to="/register">
                    <Text fontSize="sm">New User?</Text>
                  </Link>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Login;
