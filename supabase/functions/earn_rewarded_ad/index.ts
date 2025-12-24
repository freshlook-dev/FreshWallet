// supabase/functions/earn_rewarded_ad/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405 }
      );
    }

    const { user_id, amount } = await req.json();

    if (!user_id || !amount) {
      return new Response(
        JSON.stringify({ error: "Missing user_id or amount" }),
        { status: 400 }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    /* 1️⃣ Insert transaction */
    const { error: txError } = await supabase
      .from("transactions")
      .insert({
        user_id,
        amount,
        type: "rewarded_ad",
        description: "Rewarded ad watched",
      });

    if (txError) {
      console.error("TRANSACTION ERROR:", txError);
      return new Response(
        JSON.stringify({ error: "Failed to insert transaction", details: txError }),
        { status: 500 }
      );
    }

    /* 2️⃣ Increment wallet */
    const { error: walletError } = await supabase.rpc(
      "increment_wallet_balance",
      {
        p_user_id: user_id,
        p_amount: amount,
      }
    );

    if (walletError) {
      console.error("WALLET ERROR:", walletError);
      return new Response(
        JSON.stringify({ error: "Failed to update wallet", details: walletError }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (err) {
    console.error("EDGE FUNCTION CRASH:", err);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500 }
    );
  }
});
