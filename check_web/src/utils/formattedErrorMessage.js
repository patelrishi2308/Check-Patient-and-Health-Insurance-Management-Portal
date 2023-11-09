export const formattedErrorMessage = (serverError) => {
  const errorMessage = {
    title: "Oops!",
    description: "Something went wrong",
  };
  if (typeof serverError === "string") {
    return {
      ...errorMessage,
      description: serverError,
    };
  }
  if (typeof serverError === "object") {
    const error = serverError || {};
    const title = error?.name || errorMessage.title;
    let description;
    if (Array.isArray(error.message)) {
      description = error.message[0].message;
    } else {
      description = error?.error || errorMessage.message;
    }
    return { title, description };
  }
  return errorMessage;
};
