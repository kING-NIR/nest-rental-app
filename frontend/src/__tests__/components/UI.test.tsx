import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, TextInput, Badge } from "../components/UI";

describe("UI Components", () => {
  describe("Button Component", () => {
    it("renders button with children", () => {
      render(<Button onClick={() => {}}>Click me</Button>);
      expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("calls onClick handler when clicked", async () => {
      const onClick = jest.fn();
      render(<Button onClick={onClick}>Click me</Button>);

      const button = screen.getByText("Click me");
      await userEvent.click(button);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("handles disabled state", () => {
      const onClick = jest.fn();
      const { container } = render(
        <Button onClick={onClick} disabled>
          Disabled Button
        </Button>
      );

      const button = container.querySelector("button");
      expect(button).toHaveStyle({ opacity: "0.6", cursor: "not-allowed" });
    });
  });

  describe("TextInput Component", () => {
    it("renders input field", () => {
      render(
        <TextInput
          value=""
          onChange={(e) => {}}
          placeholder="Enter text"
        />
      );

      const input = screen.getByPlaceholderText("Enter text");
      expect(input).toBeInTheDocument();
    });

    it("handles text input", async () => {
      const onChange = jest.fn();
      render(
        <TextInput
          value=""
          onChange={(e) => {
            onChange(e.target.value);
          }}
          placeholder="Enter text"
        />
      );

      const input = screen.getByPlaceholderText("Enter text") as HTMLInputElement;
      await userEvent.type(input, "test input");

      expect(onChange).toHaveBeenCalledWith("test input");
    });
  });

  describe("Badge Component", () => {
    it("renders badge with children", () => {
      render(<Badge children="Premium" />);
      expect(screen.getByText("Premium")).toBeInTheDocument();
    });

    it("renders badge with custom style", () => {
      const { container } = render(
        <Badge children="Gold" style={{ background: "#FFD700" }} />
      );

      const badge = container.querySelector("span");
      expect(badge).toHaveStyle({ background: "#FFD700" });
    });
  });
});
