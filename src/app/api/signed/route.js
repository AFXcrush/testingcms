import { v2 as cloudinary } from "cloudinary";

export async function POST(request) {
  const body = await request.json();
  const { paramsToSign } = body;

  paramsToSign.folder = "Testing";

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );

  return Response.json({ signature });
}
