import Link from "next/link";

async function getPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Home</h1>
      {posts.lenght === 0 ? (
        <p className="text-gray-500">No hay posts disponibles</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="border p-2 mb-2">
              <Link
                href={`/posts/${post.id}`}
                className="text-blue-500 underline"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
