import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { service } from "service";
import wrapper from "test/hookWrapper";
import { assertErrorAlert, t } from "test/utils";

import { EMAIL_USERNAME } from "./constants";
import Login from "./Login";

const checkUsernameMock = service.auth.checkUsername as jest.MockedFunction<
  typeof service.auth.checkUsername
>;

it("shows the known gRPC error from the API", async () => {
  const errorMessage = "Couldn't find that user.";
  checkUsernameMock.mockRejectedValue({
    code: 5,
    message: errorMessage,
  });
  render(<Login />, { wrapper });

  userEvent.type(await screen.findByLabelText(EMAIL_USERNAME), "invalid");
  userEvent.click(screen.getByRole("button", { name: t("global:continue") }));

  await assertErrorAlert(errorMessage);
});

it("shows the fatal error message for unknown errors", async () => {
  checkUsernameMock.mockRejectedValue({
    message: "unknown error",
  });
  render(<Login />, { wrapper });

  userEvent.type(await screen.findByLabelText(EMAIL_USERNAME), "invalid");
  userEvent.click(screen.getByRole("button", { name: t("global:continue") }));

  await assertErrorAlert(t("global:fatal_error_message"));
});
