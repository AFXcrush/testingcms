"use client";

import { useState, useEffect } from "react";

//COMPONENTS
import BlockText from "./components/BlockText";
import BlockImage from "./components/BlockImage";
import BlockYTvideo from "./components/BlockYTvideo";
import BlockMultiSelect from "./components/BlockMultiSelect";

export default function CMS() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem("cms_authenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return; // Si no está autenticado, no intenta cargar los posts

    const url = process.env.NEXT_PUBLIC_BASE_URL
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`
      : "/api/posts"; // Usa una ruta relativa si no existe la variable

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch posts");
        return res.json();
      })
      .then((data) => {
        console.log("Posts obtenidos:", data); // Verifica los datos en consola
        setPosts(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error cargando posts:", error);
        setPosts([]);
      });
  }, [isAuthenticated]); // Siempre mantiene el mismo array de dependencias

  function handleLogin() {
    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("cms_authenticated", "true");
          setIsAuthenticated(true);
        } else {
          alert("Contraseña incorrecta");
        }
      });
  }

  function handleLogout() {
    localStorage.removeItem("cms_authenticated");
    setIsAuthenticated(false);
  }

  if (!isAuthenticated) {
    return (
      <div className="p-4 flex flex-col items-center">
        <h1 className="text-xl font-bold mb-2">Acceso al CMS</h1>
        <input
          type="password"
          placeholder="Ingrese la contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-2 text-gray-700"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Ingresar
        </button>
      </div>
    );
  }

  function handleAddBlock(type) {
    setContent([...content, { type, value: "" }]);
  }

  function handleRemoveBlock(index) {
    setContent(content.filter((_, i) => i !== index));
  }

  function handleCancelEdit() {
    setTitle("");
    setDescription("");
    setContent([]);
    setEditingId(null);
  }

  async function handleSave() {
    const post = { title, description, content };
    const method = editingId ? "PUT" : "POST";
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`;
    const body = JSON.stringify(editingId ? { id: editingId, ...post } : post);

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body,
    });
    if (res.ok) {
      const updatedPost = await res.json();
      setPosts(
        editingId
          ? posts.map((post) => (post.id === editingId ? updatedPost : post))
          : [...posts, updatedPost]
      );

      handleCancelEdit();
    }
  }

  return (
    <div className="p-4 overflow-auto max-h-screen">
      <h1 className="text-xl font-bold">CMS</h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2"
      >
        Cerrar sesión
      </button>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
        className="border p-2 mb-2 w-full text-gray-500"
        required
      />

      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción"
        className="border p-2 mb-2 w-full text-gray-500"
        required
      />

      {/* BOTON AGREGAR TEXTO */}
      <button
        onClick={() => handleAddBlock("text")}
        className="bg-green-500 text-white px-2 py-1 mr-2"
      >
        Add Text
      </button>

      {/* BOTON AGREGAR IMAGEN */}
      <button
        onClick={() => handleAddBlock("image")}
        className="bg-blue-500 text-white px-2 py-1"
      >
        Add Image
      </button>

      {/* BOTON AGREGAR URL DE YOUTUBE */}
      <button
        onClick={() => handleAddBlock("YTvideo")}
        className="bg-purple-500 text-white px-2 py-1"
      >
        Add YouTube URL
      </button>

      {/* BOTON AGREGAR MULTISELECT */}
      <button
        onClick={() => handleAddBlock("multi-select")}
        className="bg-orange-500 text-white px-2 py-1"
      >
        Add Multiselect
      </button>

      <div className="mb-2">
        {content.map((block, index) => {
          const props = {
            value: block.value,
            onChange: (newValue) => {
              const newContent = [...content];
              newContent[index].value = newValue;
              setContent(newContent);
            },
            onRemove: () => handleRemoveBlock(index),
          };

          return (
            <div key={index}>
              {block.type === "text" && <BlockText {...props} />}

              {block.type === "image" && (
                <BlockImage {...props} useCloudinary={true} />
              )}

              {block.type === "YTvideo" && <BlockYTvideo {...props} />}

              {block.type === "multi-select" && <BlockMultiSelect {...props} />}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSave}
        className="bg-green-500 text-white px-4 py-2 mr-2"
      >
        Save
      </button>

      {editingId && (
        <button
          onClick={handleCancelEdit}
          className="bg-gray-500 text-white px-4 py-2"
        >
          Cancel
        </button>
      )}

      <ul>
        {posts.map((post) => (
          <li key={post.id} className="border p-2 mb-2 flex justify-between">
            <span>{post.title}</span>

            <div>
              <button
                onClick={() => {
                  setTitle(post.title);
                  setDescription(post.description);
                  setContent(post.content || []);
                  setEditingId(post.id);
                }}
                className="bg-yellow-500 text-white px-2 py-1 mr-2"
              >
                Editar
              </button>

              <button
                onClick={() => handleDelete(post.id)}
                className="bg-red-500 text-white px-2 py-1"
              >
                Borrar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
