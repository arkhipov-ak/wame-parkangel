import { enqueueSnackbar } from "notistack";

export const showErrorSnackbar = ({ message, tryAgain = true }) => {
	if (tryAgain) message += ", пожалуйста, повторите попытку.";
	enqueueSnackbar(message, { variant: "error" });
};