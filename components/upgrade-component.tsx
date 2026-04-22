"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function UpgradeComponent() {
  return (
    <div className="absolute left-1/2 -translate-x-1/2">
      <Button
        onClick={async () => {
          await authClient.checkout({
            // Polar Product IDs
            products: ["e651f46d-ac20-4f26-b769-ad088b123df2"],
            // OR
            // if "products" in passed in the checkout plugin's config, you may pass the slug
            slug: "cuhbot",
          });
        }}
        variant="default"
        className="rounded-full bg-[#373669] border-[#3e3e4a] text-white hover:bg-[#373669]/60 text-[12px] h-8 px-4 font-medium"
      >
        ✦ Get Plus
      </Button>
    </div>
  );
}
