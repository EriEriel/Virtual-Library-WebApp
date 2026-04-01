import { v2 as cloudinary, UploadApiResponse } from "cloudinary"
import { NextRequest, NextResponse } from "next/server"

cloudinary.config({
  cloud_name: process.env.NEXT_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get("file") as File

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "terminal-shelf" },
      (error, result) => {
        if (error || !result) reject(error)
        else resolve(result)
      }
    ).end(buffer)
  })

  return NextResponse.json({
    url: (result as UploadApiResponse).secure_url,
    publicId: (result as UploadApiResponse).public_id
  })
}
