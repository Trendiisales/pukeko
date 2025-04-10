import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import SocialMediaPoster from "../components/SocialMediaPoster";
import { AuthProvider } from "../contexts/AuthContext";

// Minimal AuthContext for testing; if not needed, you can remove the provider.
const TestAuthProvider = ({ children }) => <>{children}</>;

describe("SocialMediaPoster Component", () => {
  beforeAll(() => {
    window.alert = jest.fn();
  });

  test("renders textarea, updates content, and submits the form", () => {
    render(
      <TestAuthProvider>
        <SocialMediaPoster />
      </TestAuthProvider>
    );

    const contentArea = screen.getByPlaceholderText(/Write your post here.../i);
    expect(contentArea).toBeInTheDocument();

    fireEvent.change(contentArea, { target: { value: "Test post content" } });
    expect(contentArea.value).toBe("Test post content");

    const submitButton = screen.getByRole("button", { name: /Submit Post/i });
    fireEvent.click(submitButton);
    expect(window.alert).toHaveBeenCalledWith("Post submitted (placeholder)");
  });
});
