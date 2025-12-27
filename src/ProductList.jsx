import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, deleteProduct, updateProduct } from "./api";

export default function ProductList() {
  const queryClient = useQueryClient();

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousProducts = queryClient.getQueryData(["products"]);

      queryClient.setQueryData(["products"], (old = []) =>
        old.filter((p) => p.id !== id)
      );

      return { previousProducts };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(["products"], context.previousProducts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onMutate: async (updatedProduct) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousProducts = queryClient.getQueryData(["products"]);

      queryClient.setQueryData(["products"], (old = []) =>
        old.map((p) =>
          p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p
        )
      );

      return { previousProducts };
    },
    onError: (err, updatedProduct, context) => {
      queryClient.setQueryData(["products"], context.previousProducts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {products.map((p) => (
        <li
          key={p.id}
          style={{
            marginBottom: "1rem",
            padding: "0.5rem",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        >
          <p style={{ margin: "0 0 0.5rem 0", fontWeight: "bold" }}>
            {p.title} — <span style={{ color: "green" }}>${p.price}</span>
          </p>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              value={p.title}
              onChange={(e) =>
                updateMutation.mutate({ ...p, title: e.target.value })
              }
              style={{ flex: 1, padding: "0.3rem" }}
            />
            <button
              onClick={() => deleteMutation.mutate(p.id)}
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "0.4rem 0.8rem",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}