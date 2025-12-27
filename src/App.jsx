import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <h1>Tanstack with optimistic update </h1>
      <ProductForm />
      <ProductList />
    </QueryClientProvider>
  );
}
