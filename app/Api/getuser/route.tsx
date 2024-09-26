// app/Api/getuser/route.tsx

import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function GET(req: Request) {
    try {
        console.log("Received request:", req);
        let { data: Users, error } = await supabase
            .from('Users')
            .select('*');
        
        if (error) {
            console.error("Error fetching users:", error);
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return new Response(JSON.stringify(Users), { status: 200 });
    } catch (error) {
        console.error("Unexpected error:", error);
        return new Response(JSON.stringify({ error }), { status: 500 });
    }
}
