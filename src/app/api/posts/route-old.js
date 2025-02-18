import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const dataFilePath = path.join(process.cwd(), "public/data/posts.json");

function readData() {
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
}

function writeData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

export async function GET() {
  const posts = readData();
  return NextResponse.json(posts, { status: 200 });
}

export async function POST(req) {
  const { title, description, content } = await req.json();

  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Elimina tildes y diacríticos
    .replace(/[^a-z0-9\s-]/g, "") // Elimina caracteres que no sean letras, números o espacios
    .trim()
    .replace(/\s+/g, "-"); // Reemplaza espacios por guiones

  let posts = readData();
  if (posts.some((post) => post.title === title)) {
    return NextResponse.json(
      { message: "Title must be unique" },
      { status: 400 }
    );
  }

  const newPost = { id: slug, title, description, content: content || [] };
  posts.push(newPost);
  writeData(posts);
  return NextResponse.json(newPost, { status: 201 });
}

export async function PUT(req) {
  const { id, title, description, content } = await req.json();
  let posts = readData();
  const index = posts.findIndex((post) => post.id === id);
  if (index === -1)
    return NextResponse.json({ message: "Post not found" }, { status: 404 });

  posts[index] = { id, title, description, content };
  writeData(posts);
  return NextResponse.json(posts[index], { status: 200 });
}

export async function DELETE(req) {
  const { id } = await req.json();
  let posts = readData();
  posts = posts.filter((post) => post.id !== id);
  writeData(posts);
  return NextResponse.json({ message: "Post deleted" }, { status: 200 });
}
