import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type EmailLogRow = {
  id: string;
  messageId: string | null;
  templateName: string;
  recipientEmail: string;
  status: string;
  errorMessage: string | null;
  createdAt: string;
};

/** Journal des envois d'e-mails (dédoublonné par message_id), réservé au staff. */
export const getEmailLog = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<EmailLogRow[]> => {
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (!(roles ?? []).length) throw new Response("Forbidden", { status: 403 });

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await (supabaseAdmin as any)
      .from("email_send_log")
      .select("id,message_id,template_name,recipient_email,status,error_message,created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(String(error.message ?? error));

    const rows = (data ?? []) as {
      id: string;
      message_id: string | null;
      template_name: string;
      recipient_email: string;
      status: string;
      error_message: string | null;
      created_at: string;
    }[];

    // Une même expédition produit plusieurs lignes (pending → sent/failed) :
    // on ne garde que la plus récente par message_id.
    const seen = new Set<string>();
    const out: EmailLogRow[] = [];
    for (const r of rows) {
      const key = r.message_id ?? r.id;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        id: r.id,
        messageId: r.message_id,
        templateName: r.template_name,
        recipientEmail: r.recipient_email,
        status: r.status,
        errorMessage: r.error_message,
        createdAt: r.created_at,
      });
    }
    return out;
  });
