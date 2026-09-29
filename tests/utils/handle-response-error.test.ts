import { beforeEach, describe, expect, it, vi } from "vitest";

const { toastError } = vi.hoisted(() => ({
  toastError: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: toastError,
  },
}));

import handleResError from "@/utils/handleResponseError";

describe("handleResError", () => {
  beforeEach(() => {
    toastError.mockReset();
  });

  it("shows every validation message returned by the API", () => {
    const error = {
      isAxiosError: true,
      response: {
        data: {
          errors: {
            email: ["Email is required.", "Email is invalid."],
            password: "Password is required.",
          },
        },
      },
    };

    handleResError(error);

    expect(toastError).toHaveBeenCalledTimes(3);
    expect(toastError).toHaveBeenNthCalledWith(1, "Email is required.", {
      autoClose: 5000,
    });
    expect(toastError).toHaveBeenNthCalledWith(2, "Email is invalid.", {
      autoClose: 5000,
    });
    expect(toastError).toHaveBeenNthCalledWith(3, "Password is required.", {
      autoClose: 5000,
    });
  });

  it("shows a single API message when there are no validation errors", () => {
    handleResError({
      isAxiosError: true,
      response: {
        data: {
          message: "The request could not be completed.",
        },
      },
    });

    expect(toastError).toHaveBeenCalledTimes(1);
    expect(toastError).toHaveBeenCalledWith(
      "The request could not be completed.",
      { autoClose: 5000 }
    );
  });

  it("ignores non-Axios errors", () => {
    handleResError(new Error("network failure"));

    expect(toastError).not.toHaveBeenCalled();
  });

  it("ignores Axios errors without a response payload", () => {
    handleResError({
      isAxiosError: true,
      response: undefined,
    });

    expect(toastError).not.toHaveBeenCalled();
  });
});
