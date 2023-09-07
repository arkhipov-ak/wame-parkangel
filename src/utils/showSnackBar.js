import { enqueueSnackbar } from "notistack";

export const showErrorSnackbar = ({ message, tryAgain = false }) => {
	if (tryAgain) message += ", пожалуйста, повторите попытку.";
	enqueueSnackbar(message, { variant: "error" });
};

export const showSuccessSnackbar = ({ message }) => {
	enqueueSnackbar(message, { variant: "success" });
};