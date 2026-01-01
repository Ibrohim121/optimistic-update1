import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProduct } from "./api";

export default function ProductForm() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState([]);
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
          categoryId: newProduct.categoryId,
          description: newProduct.description,
          images: newProduct.images,
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
    if (!title.trim() || price === "") return;

    const pendingUrl = imageUrl.trim();
    const imgs = images.length
      ? pendingUrl
        ? [...images, pendingUrl]
        : images
      : pendingUrl
      ? [pendingUrl]
      : [];

    if (!imgs.length) {
      alert("Iltimos, kamida bitta rasm URL qo'shing");
      return;
    }

    mutation.mutate({
      title,
      price: Number(price),
      description: description || "No description",
      categoryId: Number(categoryId) || 1,
      images: imgs,
    });
    setTitle("");
    setPrice("");
    setCategoryId("");
    setDescription("");
    setImages([]);
    setImageUrl("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
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
          <input
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            placeholder="Category id"
            type="number"
            style={{
              padding: "0.5rem",
              width: "120px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Product description"
          style={{ width: "100%", padding: "0.5rem", minHeight: "60px", border: "1px solid #ccc", borderRadius: "4px" }}
        />

        <div style={{ display: "flex", gap: "0.5rem", width: "100%", alignItems: "center" }}>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const url = imageUrl.trim();
                if (!url) return;
                setImages((arr) => [...arr, url]);
                setImageUrl("");
              }
            }}
            placeholder="Image URL (press Enter to add)"
            style={{ padding: "0.5rem", flex: 1, border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        {images.length > 0 && (
          <div style={{ display: "flex", gap: "0.5rem", width: "100%", flexWrap: "wrap", marginTop: "0.5rem" }}>
            {images.map((src, i) => (
              <div key={i} style={{ position: "relative" }}>
                <img src={src} alt={`img-${i}`} style={{ width: 72, height: 52, objectFit: "cover", borderRadius: 4, border: "1px solid #ddd" }} />
                <button
                  type="button"
                  onClick={() => setImages((arr) => arr.filter((_, idx) => idx !== i))}
                  style={{ position: "absolute", top: -6, right: -6, backgroundColor: "red", color: "white", border: "none", borderRadius: "50%", width: 20, height: 20, cursor: "pointer" }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", width: "100%" }}>
          <button
            type="submit"
            disabled={mutation.isLoading}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: mutation.isLoading ? "#6cb0ff" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: mutation.isLoading ? "not-allowed" : "pointer",
            }}
          >
            {mutation.isLoading ? "Adding..." : "Add Product"}
          </button>
        </div>
        {mutation.isError && (
          <div style={{ color: "red", marginTop: "0.5rem" }}>
            Error adding product: {mutation.error?.message || "Unknown error"}
          </div>
        )}
      </div>
    </form>
  );
}