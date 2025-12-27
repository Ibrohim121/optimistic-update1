import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProduct } from "./api";

export default function ProductForm() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addProduct,
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousProducts = queryClient.getQueryData(["products"]);

      queryClient.setQueryData(["products"], (old = []) => [
        ...old,
        {
          id: Date.now(),
          title: newProduct.title,
          price: newProduct.price,
          optimistic: true,
        },
      ]);

      return { previousProducts };
    },
    onError: (err, newProduct, context) => {
      queryClient.setQueryData(["products"], context.previousProducts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !price.trim()) return;
    mutation.mutate({ title, price });
    setTitle("");
    setPrice("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Product title"
          style={{
            padding: "0.5rem",
            flex: 1,
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Product price"
          type="number"
          style={{
            padding: "0.5rem",
            width: "120px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add Product
        </button>
      </div>
    </form>
  );
}