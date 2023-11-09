import React from "react";
import { FormControl, FormLabel, Textarea, FormErrorMessage, Flex, Stack } from "@chakra-ui/react";
import { FastField, getIn } from "formik";
import PropTypes from "prop-types";

function TextArea(props) {
  const { placeholder = "Enter the description.." } = props;
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
                  <FormLabel w={"100%"} htmlFor={props.name} mx="2">
                    {props.label}
                  </FormLabel>
                )}
                <Textarea {...field} id="description" width="100%" borderRadius="10px" placeholder={placeholder} backgroundColor="white" />
                <FormErrorMessage>{getIn(form.errors, props.name)}</FormErrorMessage>
              </Stack>
            </FormControl>
          </Flex>
        );
      }}
    </FastField>
  );
}

TextArea.defaultProps = {
  label: "Label",
  isRequired: false,
  direction: { xs: "column", md: "row" },
  showHeader: true,
  containerStyle: {},
};

TextArea.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  showHeader: PropTypes.bool,
  containerStyle: PropTypes.object,
};

export default TextArea;
