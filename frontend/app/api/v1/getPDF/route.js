import { NextResponse } from 'next/server';

export async function GET(req) {
    return NextResponse.json({ message: "Hello from Next.js" }, { status: 200 });
};

export async function POST(req) {
    return NextResponse.json({ status: 200, "sdfsdf" : "dsfdfdf"})
}