import React from "react";
import { Flex, FormControl, FormLabel, FormErrorMessage, Input, Stack } from "@chakra-ui/react";
import { FastField, getIn } from "formik";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";

function DatePickerField(props) {
  return (
    <FastField name={props.name}>
      {({ field, form }) => (
        <Flex direction={props.direction} align={props.align} {...props.containerStyle}>
          <FormControl
            isInvalid={getIn(form.errors, props.name) && getIn(form.touched, props.name)}
            w={props.w}
            isRequired={props.isRequired}
          >
            <Stack isInline={props.isInline} width="100%" align="center">
              {props.showHeader && (
                <FormLabel htmlFor={props.name} w={props.w}>
                  {props.label}
                </FormLabel>
              )}
              <Stack w="100%">
                <DatePicker
                  {...props}
                  onChange={(time) => {
                    form.setFieldValue(props.name, time);
                  }}
                  selected={field.value || null}
                  customInput={<Input autoComplete="off" {...field} />}
                  w={"100%"}
                />
                <FormErrorMessage>{getIn(form.errors, props.name)}</FormErrorMessage>
              </Stack>
            </Stack>
          </FormControl>
        </Flex>
      )}
    </FastField>
  );
}

DatePickerField.defaultProps = {
  label: "Label",
  isRequired: false,
  direction: { xs: "column", md: "row" },
  showHeader: true,
  containerStyle: {},
  dateFormat: "dd/MM/yyyy",
  timeFormat: "hh:mm a",
  showTimeSelect: false,
};

DatePickerField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  showHeader: PropTypes.bool,
  containerStyle: PropTypes.object,
};

export default DatePickerField;
