import React from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
} from "@chakra-ui/react";
import { FastField, ErrorMessage, getIn } from "formik";
import PropTypes from "prop-types";

function InputField(props) {
  return (
    <FastField name={props.name}>
      {({ field, form }) => (
        <Flex direction={props.direction} align="center" {...props.containerStyle}>
          <FormControl
            isInvalid={getIn(form.errors, props.name) && getIn(form.touched, props.name)}
            w={"100%"}
            isRequired={props.isRequired}
          >
            <Stack isInline={props.isInline} width="100%" justify="space-between">
              {props.showHeader && (
                <FormLabel htmlFor={props.name} mx="2">
                  {props.label}
                </FormLabel>
              )}

              <NumberInput
                {...field}
                {...props}
                height="100%"
                onChange={(value) => {
                  form.setFieldValue(props.name, value);
                }}
              >
                <NumberInputField type="number" {...props} />
                {props.showStepper && (
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                )}
              </NumberInput>
            </Stack>
            <FormErrorMessage>{getIn(form.errors, props.name)}</FormErrorMessage>
          </FormControl>
        </Flex>
      )}
    </FastField>
  );
}

InputField.defaultProps = {
  label: "Label",
  isRequired: false,
  direction: { xs: "column", md: "row" },
  showHeader: true,
  containerStyle: {},
  min: 0,
  borderRadius: "10px",
  showStepper: true,
  isInline: true,
};

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  showHeader: PropTypes.bool,
  containerStyle: PropTypes.object,
  showStepper: PropTypes.bool,
};

export default InputField;
