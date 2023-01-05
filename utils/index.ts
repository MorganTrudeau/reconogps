const errorHasMessage = (error: unknown): error is { message: string } => {
  return typeof error === "object" && error !== null && "message" in error;
};

export const errorToMessage = (error: unknown): string => {
  if (errorHasMessage(error)) {
    return error.message;
  } else {
    return "Something went wrong. Please try again.";
  }
};
