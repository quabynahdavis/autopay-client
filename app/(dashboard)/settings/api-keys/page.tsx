"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { SettingsLayout } from "@/features/settings/SettingsLayout";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchApiKeys, revokeApiKey } from "@/services/api/settings";
import { useApiData } from "@/hooks/useApiData";
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ApiKeysSettingsPage() {
  const { data: apiKeys, loading, refetch } = useApiData(fetchApiKeys, []);
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null);

  const handleRevoke = async () => {
    if (!selectedKeyId) return;
    try {
      await revokeApiKey(selectedKeyId);
      toast.success("API key revoked");
      setRevokeOpen(false);
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Revoke failed");
    }
  };

  return (
    <SettingsLayout>
      <PageHeader
        title="API Keys"
        description="Manage API keys for integrations"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Settings", href: "/settings" },
          { label: "API Keys" },
        ]}
        actions={
          <Button onClick={() => toast.info("Use POST /settings/api-keys from the API")}>
            <Plus className="h-4 w-4" />
            Create Key
          </Button>
        }
      />
      <SectionCard title="Active Keys">
        {loading ? (
          <Skeleton className="h-48 w-full rounded-xl" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(apiKeys ?? []).map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="font-medium">{key.name}</TableCell>
                  <TableCell className="font-mono text-sm">{key.prefix}</TableCell>
                  <TableCell>{formatDate(key.createdAt)}</TableCell>
                  <TableCell>{key.lastUsed ? formatDate(key.lastUsed) : "—"}</TableCell>
                  <TableCell>
                    <Badge variant={key.status === "active" ? "success" : "danger"}>
                      {key.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {key.status === "active" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedKeyId(key.id);
                          setRevokeOpen(true);
                        }}
                        aria-label={`Revoke ${key.name}`}
                      >
                        <Trash2 className="h-4 w-4 text-danger" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>

      <ConfirmationDialog
        open={revokeOpen}
        onOpenChange={setRevokeOpen}
        title="Revoke API Key"
        description="This action cannot be undone. Applications using this key will lose access."
        confirmLabel="Revoke Key"
        variant="destructive"
        onConfirm={handleRevoke}
      />
    </SettingsLayout>
  );
}
