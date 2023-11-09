import { Button, Grid } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { INSURER_PLANS, INSURER_PLAN_UPDATE } from "../../../constants/apiRoutes";
import api from "../../../services/api";
import { useAuth } from "../../../services/auth";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import useCustomToastr from "../../../utils/useCustomToastr";
import { CheckBoxField, InputField, MultiTextField, NumberField } from "../../formik";

const PlanForm = (props) => {
  const toast = useCustomToastr();
  const {
    user: { user_id: insurer_id = "" },
  } = useAuth();
  const { plan } = props;

  const planSchema = Yup.object().shape({
    plan_name: Yup.string().required("Required"),
    plan_display_name: Yup.string().required("Required"),
    plan_description: Yup.string().required("Required"),
    plan_exceptions: Yup.array().of(Yup.string()).required("Required"),
    premium: Yup.number().required("Required"),
    coverage: Yup.number().required("Required"),
    duration_years: Yup.number().required("Required"),
    deductible_amt: Yup.number().required("Required"),
    is_monthly: Yup.boolean().required("Required"),
  });

  let initialValues = {
    plan_name: "",
    plan_display_name: "",
    plan_description: "",
    plan_exceptions: [],
    premium: 0,
    coverage: 0,
    duration_years: 0,
    deductible_amt: 0,
    is_monthly: true,
  };

  if (plan) initialValues = { initialValues, ...plan };

  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    let apiCall = api.post(INSURER_PLANS + "?" + new URLSearchParams({ insurer_id }), { insurer_id, ...values });
    if (plan)
      apiCall = api.post(INSURER_PLAN_UPDATE + "?" + new URLSearchParams({ insurer_id, plan_name: plan.plan_name }), {
        insurer_id,
        ...values,
      });
    apiCall
      .then((response) => {
        toast.showSuccess("Success!");
        setSubmitting(false);
        props.fetchPlans && props.fetchPlans();
        props.onClose && props.onClose();
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
        setSubmitting(false);
      });
  };

  return (
    <Formik initialValues={initialValues} validationSchema={planSchema} onSubmit={onSubmit} enableReinitialize={true}>
      {(props) => (
        <Form autoComplete="off">
          <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]} gap={6} mb="5">
            <InputField isInline={false} direction="column" label="Plan Name" name="plan_name" />
            <InputField isInline={false} direction="column" label="Plan Display Name" name="plan_display_name" />
            <InputField isInline={false} direction="column" label="Plan Description" name="plan_description" />
            <MultiTextField
              {...props}
              label="Exceptions"
              name="plan_exceptions"
              options={props.initialValues.plan_exceptions.map((a) => ({ value: a, label: a }))}
            />
            <NumberField {...props} label="Premium" name="premium" />
            <NumberField {...props} label="Coverage" name="coverage" />
            <NumberField {...props} label="Duration (Years)" name="duration_years" />
            <NumberField {...props} label="Deductible Amount" name="deductible_amt" />
            <CheckBoxField label="Is Monthly" name="is_monthly" isRequired direction="column" showHeader={false} />
            {/* submit button */}
            <Button colorScheme="green" type="submit" isLoading={props.isSubmitting}>
              Save
            </Button>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default PlanForm;
