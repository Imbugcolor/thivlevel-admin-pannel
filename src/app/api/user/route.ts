import { cookies } from "next/headers";

export async function GET(request: Request) {
    try {
        const token = request.headers.get('Authorization')
        if (!token) {
            cookies().delete('refreshtoken')
            return new Response(JSON.stringify({ message: "Logged out."}), {
                status: 200,
            });
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/logout`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
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
        cookies().delete('refreshtoken')
        return new Response(JSON.stringify({ message: "Logged out."}), {
            status: 200,
        });

    } catch (error: any) {
        return new Response(JSON.stringify({
            status: 500,
            message: error.message  || 'An unexpected error occurred.',
        }), {
            status: 500,
        });
    }
}