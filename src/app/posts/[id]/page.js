"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";

function getRandomColor() {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default function PostPage() {
  const { id } = useParams();

  const [post, setPost] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const posts = await res.json();
      const foundPost = posts.find((p) => p.id === id);
      setPost(foundPost);
      setLoading(false);
    }

    if (id) fetchPost();
  }, [id]);

  if (loading) return <h1 className="to-gray-500 text-xl">Loading...</h1>;

  if (!post) {
    return notFound();
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <div className="mt-2 text-gray-600">
        {post.content.map((block, index) => (
          <div key={index} className="mb-4">
            {block.type === "text" && (
              <p className="text-gray-700">{block.value}</p>
            )}

            {block.type === "image" && (
              <img
                src={block.value}
                alt="Image"
                className="max-w-full h-auto"
              />
            )}

            {block.type === "YTvideo" && (
              <iframe
                width="560"
                height="315"
                src={block.value.replace("watch?v=", "embed/")}
                title="YouTube video player"
                className="border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}

            {block.type === "multi-select" && (
              <div className="flex gap-2 mt-2">
                {block.value.map((option, idx) => (
                  <div
                    key={idx}
                    className={`text-white px-3 py-1 rounded ${getRandomColor()}`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
