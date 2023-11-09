import { useToast } from "@chakra-ui/react";

const DEFAULT_TOAST_OPTIONS = {
  duration: 3000,
  position: "bottom",
  isClosable: true,
  variant: "custom",
  containerStyle: {
    background: "#3d4266",
    color: "white",
    borderRadius: "5px",
  },
};

const useCustomToastr = () => {
  const toast = useToast();

  const showSuccess = (options = DEFAULT_TOAST_OPTIONS) => {
    if (typeof options === "string") {
      options = { description: options };
    }
    toast({
      title: "Success",
      description: "Operation success",
      status: "success",
      ...options,
      ...DEFAULT_TOAST_OPTIONS,
    });
  };

  const showError = ({ title = "Error", description = "Operation failed" }) => {
    toast({
      title: title,
      description: description,
      position: "bottom",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const showNetworkError = () => {
    toast({
      title: "Error",
      description: "Internet error! Check your connection.",
      position: "bottom",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const showSomethingWentWrongError = () => {
    toast({
      title: "Error",
      description: "Something went wrong.",
      position: "bottom",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  return {
    showSuccess,
    showError,
    showNetworkError,
    showSomethingWentWrongError,
  };
};

export default useCustomToastr;
