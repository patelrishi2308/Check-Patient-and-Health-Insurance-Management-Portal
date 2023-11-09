import React from "react";
import { FastField, getIn } from "formik";

import { Box, Flex, FormControl, FormErrorMessage, VisuallyHidden, ControlBox, FormLabel, Stack } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { FaCheck } from "react-icons/fa";

function CheckBox(props) {
  return (
    <FastField name={props.name}>
      {({ field, form }) => (
        <Flex direction={props.direction} align="center" {...props.containerStyle}>
          <FormControl
            isInvalid={getIn(form.errors, props.name) && getIn(form.touched, props.name)}
            isRequired={props.isRequired}
            w={"100%"}
          >
            <Stack isInline width="100%" align="center">
              {props.showHeader && (
                <FormLabel w={"100%"} htmlFor={props.name}>
                  {props.label}
                </FormLabel>
              )}
              <Stack w="100%" isInline justifyContent="center">
                <label>
                  <VisuallyHidden
                    {...field}
                    as="input"
                    type="checkbox"
                    name={props.name}
                    checked={field.value}
                    onChange={form.handleChange}
                  />
                  <ControlBox
                    borderWidth="1px"
                    mt="1"
                    size="24px"
                    rounded="sm"
                    _checked={{
                      bg: "green.500",
                      color: "white",
                      borderColor: "green.500",
                    }}
                  >
                    <FaCheck />
                  </ControlBox>
                  {!props.hideLabel && (
                    <Box as="span" verticalAlign="top" ml={3}>
                      {props.label}
                    </Box>
                  )}
                </label>
                <FormErrorMessage>{getIn(form.errors, props.name)}</FormErrorMessage>
              </Stack>
            </Stack>
          </FormControl>
        </Flex>
      )}
    </FastField>
  );
}

CheckBox.defaultProps = {
  label: "Label",
  isRequired: false,
  direction: { xs: "column", md: "row" },
  showHeader: true,
  containerStyle: {},
};

CheckBox.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  showHeader: PropTypes.bool,
  containerStyle: PropTypes.object,
};

export default CheckBox;
