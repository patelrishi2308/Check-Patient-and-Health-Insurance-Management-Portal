import React, { useState } from "react";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import { Flex, Box, CloseButton, Text, Stack, Spinner, Button } from "@chakra-ui/react";
import { BsUpload } from "react-icons/bs";
import { GrDocument } from "react-icons/gr";
import useCustomToastr from "../../utils/useCustomToastr";
import { UPLOAD } from "../../constants/apiRoutes";
import api from "../../services/api";

function FileUploader(props) {
  const [uploadedFile, setUploadedFile] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const toast = useCustomToastr();
  const {
    path = UPLOAD,
    accept = {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
  } = props;

  const onSubmit = () => {
    if (!uploadedFile.file) {
      return toast.showError({ description: "Please select a file to upload" });
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", uploadedFile.file);
    api
      .post(path, formData, { "Content-Type": "multipart/form-data" })
      .then((r) => {
        toast.showSuccess({ description: "File added successfully" });
        setIsUploading(false);
        props.pageRefresher && props.pageRefresher();
        handleRemoveFile();
      })
      .catch(() => {
        toast.showError({ description: "Error in Uploading" });
        setIsUploading(false);
      });
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onabort = () => toast.showError({ description: "Could not read file!" });
    reader.onerror = () => toast.showError({ description: "Error on reading file!" });
    reader.readAsDataURL(file);
    setUploadedFile({ status: "success", file, name: file.name, mimeType: file.type });
  };

  const handleRemoveFile = () => {
    setUploadedFile({});
  };

  return (
    <Stack isInline w="100%" justifyContent={"center"} align="center">
      <Flex my="2em" justifyContent="center" alignItems="center">
        {uploadedFile.mimeType ? (
          <Box pos="relative" align="center" maxW="16em" justifySelf="center">
            <Box pos="absolute" top="1" right="1" m="1" rounded="lg" background="red.500">
              <CloseButton onClick={() => handleRemoveFile()} />
            </Box>
            {uploadedFile.mimeType && <GrDocument size="12em" />}
            <Text>{uploadedFile.name}</Text>
            <Text
              fontSize="sm"
              color="darkBlue.500"
              _hover={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => handleRemoveFile()}
            >
              Remove File
            </Text>
          </Box>
        ) : isUploading ? (
          <Spinner />
        ) : (
          <Dropzone onDrop={onDrop} useFsAccessApi={false} accept={accept}>
            {({ getRootProps, getInputProps }) => (
              <Flex
                align="center"
                justify="center"
                {...getRootProps()}
                border="1px"
                borderRadius="md"
                borderColor="blue.300"
                borderStyle="dashed"
                height="10em"
                cursor="pointer"
                maxW="16em"
              >
                <input {...getInputProps()} />
                <Stack align="center" justifyContent="center">
                  <BsUpload size="2em" />
                  <Text mx="2" textAlign="center">
                    Drag and drop OR Click here to Upload a file
                  </Text>
                </Stack>
              </Flex>
            )}
          </Dropzone>
        )}
      </Flex>
      <Button colorScheme={"teal"} isLoading={isUploading} onClick={() => onSubmit()}>
        Upload
      </Button>
    </Stack>
  );
}

FileUploader.propTypes = {
  label: PropTypes.string,
};

export default FileUploader;
