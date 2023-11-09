import { Button, Grid, Stack, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import Layout from "../../common/Layout";
import { InputField, MultiTextField, NumberField, SelectField } from "../../formik";
import * as Yup from "yup";
import { useAuth } from "../../../services/auth";
import api from "../../../services/api";
import { FETCH_PROFILE_PIC, PROFILE } from "../../../constants/apiRoutes";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import useCustomToastr from "../../../utils/useCustomToastr";
import { CustomSpinner } from "../../common";
import FileUploader from "../../common/FileUploader";
import { BsTrashFill } from "react-icons/bs";

const Profile = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = React.useState({});
  const toast = useCustomToastr();
  const [loading, setLoading] = React.useState(false);
  const [profilePic, setProfilePic] = React.useState(null);

  const patientProfileFormSchema = Yup.object().shape({
    user_id: Yup.string(),
    allergies: Yup.array().of(Yup.string()),
    blood_pressure: Yup.string(),
    blood_type: Yup.string(),
    contact_email: Yup.string().email("Invalid email"),
    dob: Yup.string(),
    gender: Yup.string(),
    health_plan_id: Yup.string(),
    height: Yup.number(),
    medications: Yup.array().of(Yup.string()),
    monthly_medical_expense: Yup.string(),
    preexist_conditions: Yup.array().of(Yup.string()),
    vaccinations: Yup.array().of(Yup.string()),
    weight: Yup.number(),
  });

  const doctorProfileFormSchema = Yup.object().shape({
    user_id: Yup.string(),
    contact_email: Yup.string().email("Invalid email"),
    contact_phone: Yup.string(),
    gender: Yup.string(),
    dob: Yup.string(),
    experience: Yup.number(),
    hospital_name: Yup.string(),
    hospital_address: Yup.string(),
    speciality: Yup.string(),
    is_hosp_covid_supported: Yup.number().required("Required"),
    num_covid_beds_available: Yup.number(),
    insurance_accepted: Yup.number().required("Required"),
  });

  const insurerProfileFormSchema = Yup.object().shape({
    user_id: Yup.string(),
    contact_email: Yup.string().email("Invalid email"),
    insurance_name: Yup.string(),
    insurer_id: Yup.string(),
    plan_id: Yup.string(),
  });

  const patientInitialValues =
    user?.user_role == "patient" &&
    React.useMemo(
      () => ({
        user_id: userProfile?.user_id || "",
        allergies: userProfile?.allergies || [],
        blood_pressure: userProfile?.blood_pressure || "",
        blood_type: userProfile?.blood_type || "",
        contact_email: userProfile?.contact_email || "",
        dob: userProfile?.dob || "",
        gender: userProfile?.gender || "",
        health_plan_id: userProfile?.health_plan_id || "",
        height: userProfile?.height || 0,
        medications: userProfile?.medications || [],
        monthly_medical_expense: userProfile?.monthly_medical_expense || "",
        preexist_conditions: userProfile?.preexist_conditions || [],
        vaccinations: userProfile?.vaccinations || [],
        weight: userProfile?.weight || 0,
      }),
      [userProfile]
    );

  const doctorInitialValues =
    user?.user_role == "doctor" &&
    React.useMemo(
      () => ({
        user_id: userProfile?.user_id || "",
        contact_email: userProfile?.contact_email || "",
        contact_phone: userProfile?.contact_phone || "",
        gender: userProfile?.gender || "",
        dob: userProfile?.dob || "",
        experience: userProfile?.experience || 0,
        hospital_name: userProfile?.hospital_name || "",
        hospital_address: userProfile?.hospital_address || "",
        speciality: userProfile?.speciality || "",
        is_hosp_covid_supported: userProfile?.is_hosp_covid_supported || "",
        num_covid_beds_available: userProfile?.num_covid_beds_available || 0,
        insurance_accepted: userProfile?.insurance_accepted || "",
      }),
      [userProfile]
    );

  const insurerInitialValues =
    user?.user_role == "insurer" &&
    React.useMemo(
      () => ({
        user_id: userProfile?.user_id || "",
        contact_email: userProfile?.contact_email || "",
        insurance_name: userProfile?.insurance_name || "",
        insurer_id: userProfile?.insurer_id || "",
        plan_id: userProfile?.plan_id || "",
      }),
      [userProfile]
    );

  const fetchProfile = () => {
    api
      .get(
        PROFILE +
          "?" +
          new URLSearchParams({
            user_id: user?.user_id,
            user_role: user?.user_role,
          })
      )
      .then((response) => {
        setUserProfile(response.data[user?.user_role]);
        if (user?.user_role == "insurer") localStorage.setItem("insurer_id", response.data[user?.user_role].insurer_id);
        setLoading(false);
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
        setLoading(false);
      });
  };

  const fetchProfilePic = () => {
    api
      .get(FETCH_PROFILE_PIC)
      .then((response) => {
        setProfilePic(response);
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
        setProfilePic("");
      });
  };

  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    api
      .post(
        PROFILE +
          "?" +
          new URLSearchParams({
            user_id: user?.user_id,
            user_role: user?.user_role,
          }),
        { [user?.user_role]: values }
      )
      .then((response) => {
        toast.showSuccess("Updated successfully!");
        fetchProfile();
        setSubmitting(false);
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
        setSubmitting(false);
      });
  };

  const RenderProfile = () => {
    switch (user?.user_role) {
      case "patient":
        return (
          <Formik
            initialValues={patientInitialValues}
            validationSchema={patientProfileFormSchema}
            onSubmit={onSubmit}
            enableReinitialize={true}
          >
            {(props) => (
              <Form autoComplete="off">
                <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]} gap={6} mb="5">
                  <InputField isInline={false} direction="column" label="User ID" name="user_id" />
                  <MultiTextField
                    label="Allergies"
                    name="allergies"
                    options={props.patientInitialValues?.allergies?.map((a) => ({ value: a, label: a }))}
                    {...props}
                  />
                  <InputField {...props} isInline={false} direction="column" label="Blood Pressure" name="blood_pressure" />
                  <InputField {...props} isInline={false} direction="column" label="Blood Type" name="blood_type" />
                  <InputField {...props} isInline={false} direction="column" label="Contact Email" name="contact_email" />
                  <InputField {...props} isInline={false} direction="column" label="DOB" name="dob" />
                  <SelectField
                    {...props}
                    name="gender"
                    label="Gender"
                    placeholder="Select gender"
                    options={[
                      { value: "MALE", label: "Male" },
                      { value: "FEMALE", label: "Female" },
                      { value: "OTHERS", label: "Others" },
                    ]}
                  />
                  <InputField {...props} isInline={false} direction="column" label="Health Plan ID" name="health_plan_id" />
                  <NumberField {...props} label="Height" name="height" />
                  <NumberField {...props} label="Weight" name="weight" />
                  <MultiTextField
                    {...props}
                    label="Medications"
                    name="medications"
                    options={props.patientInitialValues?.medications?.map((a) => ({ value: a, label: a }))}
                  />
                  <InputField
                    {...props}
                    isInline={false}
                    direction="column"
                    label="Monthly Medical Expense"
                    name="monthly_medical_expense"
                  />
                  <MultiTextField
                    {...props}
                    label="Preexisting Conditions"
                    name="preexist_conditions"
                    options={props.patientInitialValues?.preexist_conditions?.map((a) => ({ value: a, label: a }))}
                  />
                  <MultiTextField
                    {...props}
                    label="Vaccinations"
                    name="vaccinations"
                    options={props.patientInitialValues?.vaccinations?.map((a) => ({ value: a, label: a }))}
                  />
                  {/* submit button */}
                  <Button colorScheme="green" type="submit" isLoading={props.isSubmitting}>
                    Save
                  </Button>
                </Grid>
              </Form>
            )}
          </Formik>
        );
      case "doctor":
        return (
          <Formik
            initialValues={doctorInitialValues}
            validationSchema={doctorProfileFormSchema}
            onSubmit={onSubmit}
            enableReinitialize={true}
          >
            {(props) => (
              <Form autoComplete="off">
                <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]} gap={6} mb="5">
                  <InputField isInline={false} direction="column" label="User ID" name="user_id" />
                  <InputField isInline={false} direction="column" label="Contact Email" name="contact_email" />
                  <InputField isInline={false} direction="column" label="Contact Phone" name="contact_phone" />
                  <SelectField
                    {...props}
                    name="gender"
                    label="Gender"
                    placeholder="Select gender"
                    options={[
                      { value: "MALE", label: "Male" },
                      { value: "FEMALE", label: "Female" },
                      { value: "OTHERS", label: "Others" },
                    ]}
                  />
                  <InputField {...props} isInline={false} direction="column" label="DOB" name="dob" />
                  <NumberField {...props} label="Experience" name="experience" />
                  <InputField {...props} isInline={false} direction="column" label="Hospital Name" name="hospital_name" />
                  <InputField {...props} isInline={false} direction="column" label="Hospital Address" name="hospital_address" />
                  <InputField {...props} isInline={false} direction="column" label="Speciality" name="speciality" />
                  <SelectField
                    {...props}
                    name="is_hosp_covid_supported"
                    label="Covid Supported?"
                    placeholder="Select"
                    isRequired
                    options={[
                      { value: 1, label: "Yes" },
                      { value: 0, label: "No" },
                    ]}
                  />
                  <NumberField {...props} label="Covid beds available" name="num_covid_beds_available" />
                  <SelectField
                    {...props}
                    name="insurance_accepted"
                    label="Insurance Accepted?"
                    placeholder="Select"
                    isRequired
                    options={[
                      { value: 1, label: "Yes" },
                      { value: 0, label: "No" },
                    ]}
                  />
                  {/* submit button */}
                  <Button colorScheme="green" type="submit" isLoading={props.isSubmitting}>
                    Save
                  </Button>
                </Grid>
              </Form>
            )}
          </Formik>
        );
      case "insurer":
        return (
          <Formik
            initialValues={insurerInitialValues}
            validationSchema={insurerProfileFormSchema}
            onSubmit={onSubmit}
            enableReinitialize={true}
          >
            {(props) => (
              <Form autoComplete="off">
                <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]} gap={6} mb="5">
                  <InputField isInline={false} direction="column" label="User ID" name="user_id" />
                  <InputField isInline={false} direction="column" label="Contact Email" name="contact_email" />
                  <InputField isInline={false} direction="column" label="Insurance Name" name="insurance_name" />
                  <InputField isInline={false} direction="column" label="Insurer ID" name="insurer_id" />
                  <InputField isInline={false} direction="column" label="Plan ID" name="plan_id" />
                  {/* submit button */}
                  <Button colorScheme="green" type="submit" isLoading={props.isSubmitting}>
                    Save
                  </Button>
                </Grid>
              </Form>
            )}
          </Formik>
        );
    }
  };

  React.useEffect(() => {
    setLoading(true);
    fetchProfile();
    fetchProfilePic();
  }, []);

  return (
    <Layout>
      {loading ? (
        <CustomSpinner />
      ) : (
        <Stack>
          <Stack isInline align="center">
            {profilePic && (
              <Stack isInline align="center">
                <Text fontWeight={600} color={"gray.500"}>
                  Profile Picture
                </Text>
                <img height="300px" width="300px" src={"data:image/jpg;base64," + profilePic} />
                <Button size="sm" onClick={() => setProfilePic("")} colorScheme="red">
                  <BsTrashFill />
                </Button>
              </Stack>
            )}
            <FileUploader pageRefresher={fetchProfilePic} />
          </Stack>
          <RenderProfile />
        </Stack>
      )}
    </Layout>
  );
};

export default Profile;
