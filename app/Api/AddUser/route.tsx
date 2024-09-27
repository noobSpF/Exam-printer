import { createClient } from "@/utils/supabase/client";

const supabase = createClient()

export async function POST(Req:Request,Res:Response){
    const {username,Tel,Email,Password,Role} = await Req.json()
    const { data, error } = await supabase
  .from('Users')
  .insert([
    { username: username, Tel: Tel , Email: Email, Password:Password,Role:Role},
  ])
  .select()
  if (error) {
    console.error("Error inserting user:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
}
    return new Response(JSON.stringify(data), { status: 200 });
}