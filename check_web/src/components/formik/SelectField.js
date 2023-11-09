import React from "react";
import { FormControl, FormLabel, FormErrorMessage, Flex, Stack } from "@chakra-ui/react";
import { Field, getIn } from "formik";
import PropTypes from "prop-types";
import ReactSelect from "react-select";

function SelectField(props) {
  return (
    <Field name={props.name}>
      {({ field, form }) => {
        let value;
        if (props.options) {
          value = props.options.find((o) => o.value === field.value);
        }
        return (
          <Flex direction={props.direction} align="center" {...props.containerStyle}>
            <FormControl
              isInvalid={getIn(form.errors, props.name) && getIn(form.touched, props.name)}
              w={"100%"}
              isRequired={props.isRequired}
            >
              <Stack isInline={props.isInline} width="100%" align="center">
                {props.showHeader && (
                  <FormLabel w={"100%"} htmlFor={props.name} fontSize={17} mx="2" color={props.color}>
                    {props.label}
                  </FormLabel>
                )}
                <Stack width="100%">
                  <ReactSelect
                    value={value || ""}
                    instanceId={props.name}
                    name={props.name}
                    options={props.options}
                    isDisabled={props.disabled}
                    onChange={(selectedOption) => {
                      props.resetOnChange && props.resetForm();
                      form.setFieldValue(props.name, selectedOption.value);
                      props.onChange && props.onChange(selectedOption);
                    }}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        backgroundColor: props.backgroundColor,
                      }),
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 3,
                        color: "black",
                      }),
                    }}
                  />
                  <FormErrorMessage>{getIn(form.errors, props.name)}</FormErrorMessage>
                </Stack>
              </Stack>
            </FormControl>
          </Flex>
        );
      }}
    </Field>
  );
}

SelectField.defaultProps = {
  label: "Label",
  isRequired: false,
  options: [],
  direction: { xs: "column", md: "row" },
  showHeader: true,
  containerStyle: {},
  defaultValue: {},
  disabled: false,
  isInline: true,
};

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  options: PropTypes.array.isRequired,
  showHeader: PropTypes.bool,
  containerStyle: PropTypes.object,
  onChange: PropTypes.func,
};

export default SelectField;
