import React from "react";
import { FormControl, FormLabel, FormErrorMessage, Flex, Stack, Box } from "@chakra-ui/react";
import { FastField, ErrorMessage, getIn } from "formik";
import PropTypes from "prop-types";
import CreatableSelect from "react-select/creatable";

const components = {
  DropdownIndicator: null,
};

function MultiText(props) {
  return (
    <FastField name={props.name}>
      {({ field, form }) => (
        <Flex direction={props.direction} align="center" {...props.containerStyle}>
          <FormControl
            isInvalid={getIn(form.errors, props.name) && getIn(form.touched, props.name)}
            w={"100%"}
            isRequired={props.isRequired}
          >
            <Stack isInline={props.isInline} align="center">
              {props.showHeader && (
                <FormLabel w={"100%"} htmlFor={props.name} m={0} mx="2">
                  {props.label}
                </FormLabel>
              )}
              <Box w="100%">
                <CreatableSelect
                  components={components}
                  instanceId={props.name}
                  isClearable
                  isMulti
                  name={props.name}
                  options={props.options}
                  onChange={(selectedValues) => {
                    form.setFieldValue(props.name, (selectedValues && selectedValues.map((el) => el.value)) || []);
                  }}
                  value={field.value.map((v) => ({ value: v, label: v }))}
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
              </Box>
            </Stack>
            <FormErrorMessage>{getIn(form.errors, props.name)}</FormErrorMessage>
          </FormControl>
        </Flex>
      )}
    </FastField>
  );
}

MultiText.defaultProps = {
  label: "Label",
  isRequired: false,
  options: [],
  direction: { xs: "column", md: "row" },
  showHeader: true,
  containerStyle: {},
  isInline: true,
};

MultiText.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  options: PropTypes.array.isRequired,
  showHeader: PropTypes.bool,
  containerStyle: PropTypes.object,
};

export default MultiText;
