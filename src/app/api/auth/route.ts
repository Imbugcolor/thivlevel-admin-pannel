import { LoginRequest } from "@/libs/interfaces/auth.interface";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    const payload: LoginRequest = await request.json()

    const { email, password } = payload;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        if (!res.ok) {
            const errorData = await res.json();
            return new Response(JSON.stringify({
                status: res.status,
                message: errorData.message || res.statusText,
            }), {
                status: res.status,
                statusText: res.statusText,
            });
        }
        const cookie = res.headers.get('set-cookie') as string
        const data = await res.json()

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Set-Cookie': cookie,
            },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({
            status: 500,
            message: 'Internal Server Error',
            details: error.message || 'An unexpected error occurred.',
        }), {
            status: 500,
        });
    }

}

export async function GET(request: Request) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/refreshtoken`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
               Cookie: cookies().toString()
            },
            credentials: 'include'
        })
        if (!res.ok) {
            const errorData = await res.json();
            return new Response(JSON.stringify({
                status: res.status,
                message: errorData.message || res.statusText,
            }), {
                status: res.status,
                statusText: res.statusText,
            });
        }
        const data = await res.json()
        const accessToken = data.accessToken

        return new Response(JSON.stringify(accessToken), {
            status: 200,
        });

    } catch (error: any) {
        return new Response(JSON.stringify({
            status: 500,
            message: 'Internal Server Error',
            details: error.message  || 'An unexpected error occurred.',
        }), {
            status: 500,
        });
    }
}