"use client"; // Marca este componente como un Client Component

import React, { useState, useEffect } from "react";

const CMS = () => {
  const [posts, setPosts] = useState([]);
  const [editPost, setEditPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/api/posts")
      .then((response) => response.json())
      .then((data) => setPosts(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editPost ? "PUT" : "POST";
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: editPost?.id, title, content }),
    });
    const updatedPosts = await response.json();
    setPosts(updatedPosts);
    setTitle("");
    setContent("");
    setEditPost(null);
  };

  const handleEdit = (post) => {
    setEditPost(post);
    setTitle(post.title);
    setContent(post.content);
  };

  const handleDelete = async (id) => {
    const response = await fetch("/api/posts", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const updatedPosts = await response.json();
    setPosts(updatedPosts);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Contenido"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">{editPost ? "Actualizar" : "Crear"}</button>
      </form>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <button onClick={() => handleEdit(post)}>Editar</button>
            <button onClick={() => handleDelete(post.id)}>Borrar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CMS;
