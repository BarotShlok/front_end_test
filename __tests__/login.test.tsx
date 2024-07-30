import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPage from "@/pages/login";
import { login } from "@/service";
import { useRouter } from "next/router";

// Mock the login function
jest.mock('@/service', () => ({
  login: jest.fn()
}));

// Mock useRouter from next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

describe("Login Page", () => {
  const push = jest.fn(); // Mock function for router.push
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });
  });

  it("redirects to /products on successful login", async () => {
    (login as jest.Mock).mockResolvedValueOnce({});

    render(<LoginPage />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Username/i), {
        target: { value: "user" }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: "password" }
      });
      fireEvent.click(screen.getByRole("button", { name: /Login/i }));
    });

    expect(push).toHaveBeenCalledWith("/products");
  });

  it("displays error message on invalid credentials", async () => {
    (login as jest.Mock).mockRejectedValueOnce(new Error("Invalid credentials"));

    render(<LoginPage />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Username/i), {
        target: { value: "wrong" }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: "wrong" }
      });
      fireEvent.click(screen.getByRole("button", { name: /Login/i }));
    });

    expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();
  });
});
