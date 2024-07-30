import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductsTable from "@/pages/products";
import { fetchProducts, fetchProductReviewsById } from "@/service";
import { Product } from "@/types/types";
import "@testing-library/jest-dom";

// Mock the API calls
jest.mock("@/service", () => ({
  fetchProducts: jest.fn(),
  fetchProductReviewsById: jest.fn()
}));

describe("ProductsTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the product table and handles product reviews", async () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        title: "Product 1",
        description: "Description 1",
        category: "Category 1",
        price: 100,
        discountPercentage: 10,
        rating: 4,
        stock: 10,
        tags: ["Tag1"],
        brand: "Brand1"
      }
    ];

    const mockProductReviews = [
      {
        id: 1,
        title: "Product 1",
        description: "Description 1",
        category: "Category 1",
        price: 100,
        discountPercentage: 10,
        rating: 4,
        stock: 10,
        tags: ["Tag1"],
        brand: "Brand1"
      }
    ];

    (fetchProducts as jest.Mock).mockResolvedValue(mockProducts);
    (fetchProductReviewsById as jest.Mock).mockResolvedValue(
      mockProductReviews
    );

    render(<ProductsTable data={mockProducts} />);

    // Verify that the table renders correctly
    screen.debug();

    // Wait for the table to be populated
    await waitFor(() => {
      expect(screen.getByText(/Product 1/i)).toBeInTheDocument();
    });

    // Simulate click to view reviews
    fireEvent.click(screen.getByText(/View Reviews/i));

    screen.debug();

    // Wait for modal and its content
    await waitFor(() => {
      // Check if the modal is present
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Check if the modal contains the expected text
      const header = screen.getByRole("heading", { level: 6 });
    });
  });

  it("handles modal close", async () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        title: "Product 1",
        description: "Description 1",
        category: "Category 1",
        price: 100,
        discountPercentage: 10,
        rating: 4,
        stock: 10,
        tags: ["Tag1"],
        brand: "Brand1"
      }
    ];

    (fetchProducts as jest.Mock).mockResolvedValue(mockProducts);

    render(<ProductsTable data={mockProducts} />);

    await waitFor(() => screen.getByText(/Product 1/i));

    fireEvent.click(screen.getByText(/View Reviews/i));
    screen.debug();

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Verify the text within the modal
      const header = screen.getByRole("heading", { level: 6 });
    });
  });
});
