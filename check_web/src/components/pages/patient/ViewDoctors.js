import { Flex, Grid, Heading, Input, Stack, Button } from "@chakra-ui/react";
import React from "react";
import api from "../../../services/api";
import Layout from "../../common/Layout";
import { Card } from "../../doctors";
import * as Yup from "yup";
import { SEARCH_DOCTOR } from "../../../constants/apiRoutes";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import useCustomToastr from "../../../utils/useCustomToastr";
import { CheckBoxField, InputField, SelectField } from "../../formik";
import { Form, Formik } from "formik";

const ViewDoctors = () => {
  const toast = useCustomToastr();
  const [doctors, setDoctors] = React.useState([]);

  const searchSchema = Yup.object().shape({
    search_by: Yup.string().required("Required"),
    search_string: Yup.string().required("Required"),
    covid_support: Yup.string().required("Required"),
  });

  const initialValues = {
    search_by: "name",
    search_string: "",
    covid_support: false,
  };

  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    api
      .post(SEARCH_DOCTOR + "?" + new URLSearchParams(values))
      .then((response) => {
        setSubmitting(false);
        setDoctors(response.data?.doctor_details || []);
      })
      .catch((error) => {
        setSubmitting(false);
        const e = formattedErrorMessage(error);
        toast.showError(e);
      });
  };

  return (
    <Layout>
      <Stack>
        <Heading>Doctors</Heading>
        <Flex p={6}>
          <Formik initialValues={initialValues} validationSchema={searchSchema} onSubmit={onSubmit} enableReinitialize={true}>
            {(props) => (
              <Form autoComplete="off">
                <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]} gap={6} mb="5">
                  <SelectField
                    {...props}
                    name="search_by"
                    label="Search By"
                    placeholder="Select"
                    isRequired
                    options={[
                      { value: "name", label: "Name" },
                      { value: "speciality", label: "Speciality" },
                    ]}
                  />
                  <InputField isInline={false} direction="column" label="Search..." name="search_string" />
                  <CheckBoxField label="Covid Supported?" name="covid_support" isRequired direction="column" showHeader={false} />
                  {/* submit button */}
                  <Button colorScheme="green" type="submit" isLoading={props.isSubmitting}>
                    Search
                  </Button>
                </Grid>
              </Form>
            )}
          </Formik>
        </Flex>
        {doctors.length > 0 ? (
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {doctors.map((x, i) => (
              <Card key={i} doctor={x} />
            ))}
          </Grid>
        ) : (
          <Heading>No Doctors Found</Heading>
        )}
      </Stack>
    </Layout>
  );
};

export default ViewDoctors;
