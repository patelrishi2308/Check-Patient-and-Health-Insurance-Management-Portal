import React from "react";
import { FormControl, FormLabel, Input, FormErrorMessage, Flex, Stack } from "@chakra-ui/react";
import { FastField, getIn } from "formik";
import PropTypes from "prop-types";

function InputField(props) {
  return (
    <FastField name={props.name}>
      {({ field, form }) => {
        return (
          <Flex direction={props.direction} align="center" {...props.containerStyle}>
            <FormControl
              isInvalid={getIn(form.errors, props.name) && getIn(form.touched, props.name)}
              isRequired={props.isRequired}
              w={"100%"}
            >
              <Stack isInline={props.isInline} width="100%" align="center" spacing={0}>
                {props.showHeader && (
                  <FormLabel w={"100%"} htmlFor={props.name} fontSize={17} mx="2" color={props.color}>
                    {props.label}
                  </FormLabel>
                )}
                <Stack w="100%">
                  <Input
                    {...field}
                    id={props.id || props.name}
                    disabled={props.isDisabled}
                    placeholder={props.placeholder || props.label}
                    borderRadius="10px"
                    color={props.color}
                    backgroundColor={props.backgroundColor}
                  />
                  <FormErrorMessage>{getIn(form.errors, props.name)}</FormErrorMessage>
                </Stack>
              </Stack>
            </FormControl>
          </Flex>
        );
      }}
    </FastField>
  );
}

InputField.defaultProps = {
  label: "Label",
  isRequired: false,
  isDisabled: false,
  isInline: true,
  direction: { xs: "column", md: "row" },
  showHeader: true,
  containerStyle: {},
};

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  showHeader: PropTypes.bool,
  containerStyle: PropTypes.object,
  mode: PropTypes.string,
  rightIcon: PropTypes.element,
};

export default InputField;
