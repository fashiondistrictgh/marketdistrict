import { Construction } from "lucide-react";

export function ComingSoon({ feature }: { feature: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Construction className="h-7 w-7" />
      </div>
      <h2 className="text-lg font-semibold">{feature} — coming soon</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        This feature is on the way. Check back shortly.
      </p>
    </div>
  );
}
