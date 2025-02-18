import { Octokit } from "@octokit/rest";
import { NextResponse } from "next/server";

const OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER;
const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
const FILE_PATH = process.env.NEXT_PUBLIC_FILE_PATH;
const TOKEN = process.env.GITHUB_TOKEN; // Usa una variable de entorno para seguridad

const octokit = new Octokit({ auth: TOKEN });

async function getFileSHA() {
  try {
    const { data } = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: FILE_PATH,
    });
    return data.sha;
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

async function readData() {
  try {
    const { data } = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: FILE_PATH,
    });
    return JSON.parse(Buffer.from(data.content, "base64").toString("utf-8"));
  } catch (error) {
    return [];
  }
}

async function writeData(data) {
  const sha = await getFileSHA();
  await octokit.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    path: FILE_PATH,
    message: "Update posts.json",
    content: Buffer.from(JSON.stringify(data, null, 2)).toString("base64"),
    sha,
  });
}

export async function GET() {
  const posts = await readData();
  return NextResponse.json(posts, { status: 200 });
}

export async function POST(req) {
  const { title, description, content } = await req.json();

  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  let posts = await readData();
  if (posts.some((post) => post.title === title)) {
    return NextResponse.json(
      { message: "Title must be unique" },
      { status: 400 }
    );
  }

  const newPost = { id: slug, title, description, content: content || [] };
  posts.push(newPost);
  await writeData(posts);
  return NextResponse.json(newPost, { status: 201 });
}

export async function PUT(req) {
  const { id, title, description, content } = await req.json();
  let posts = await readData();
  const index = posts.findIndex((post) => post.id === id);
  if (index === -1)
    return NextResponse.json({ message: "Post not found" }, { status: 404 });

  posts[index] = { id, title, description, content };
  await writeData(posts);
  return NextResponse.json(posts[index], { status: 200 });
}

export async function DELETE(req) {
  const { id } = await req.json();
  let posts = await readData();
  posts = posts.filter((post) => post.id !== id);
  await writeData(posts);
  return NextResponse.json({ message: "Post deleted" }, { status: 200 });
}
