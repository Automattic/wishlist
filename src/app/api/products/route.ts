import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import axios from "axios";
import { findProducts } from '@/queries/product';

export async function GET(request: Request) {
    try {
        const hash = request.nextUrl.searchParams.get('hash');
        const res = await axios.get(`https://api.gravatar.com/v3/profiles/${hash}`);
        const products = await findProducts(["Tech", "Dad", "Baker", "Runner"]);
        console.log(123, products);
        return NextResponse.json(products);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}
