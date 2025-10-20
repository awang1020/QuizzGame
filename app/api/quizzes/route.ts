import { NextResponse } from "next/server";
import { quizzes } from "@/data/quizzes";

export async function GET() {
  return NextResponse.json({ quizzes });
}
