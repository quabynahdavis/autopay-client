import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentsLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-24 rounded-xl" />
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}
