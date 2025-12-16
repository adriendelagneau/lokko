// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";

import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // convert File -> buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
        const result = await cloudinary.uploader.upload_stream(
            { folder: "listings" },
            (error, result) => {
                if (error) throw error;
                return result;
            }
        );

        // Avec Node 18+ et fetch, on peut utiliser upload via promise
        const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "listings" },
                (err, res) => (err ? reject(err) : resolve(res!))
            );
            stream.end(buffer);
        });

        return NextResponse.json({ url: uploadResult.secure_url });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
