"use client";

import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getEmployeeDocuments } from "@/services/mock/employees";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { UploadZone } from "@/components/shared/UploadZone";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { FileText } from "lucide-react";

const docTypes = [
  "National ID",
  "Passport",
  "Driver's License",
  "Employment Contract",
  "Certificate",
  "Other HR Document",
];

export default function EmployeeDocumentsPage() {
  const { user } = useAuth();
  const employeeId = user?.employeeId ?? "EMP-1042";
  const documents = getEmployeeDocuments(employeeId);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Documents" description="Upload and manage HR documents" />

      <SectionCard title="Upload Document">
        <div className="mb-4 space-y-2">
          <label className="text-sm font-medium">Document type</label>
          <select className="flex h-10 w-full rounded-xl border border-border bg-card px-3 text-sm">
            {docTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <UploadZone
          onFileSelect={() => toast.success("Document preview ready — confirm to upload")}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <Button className="mt-4" onClick={() => toast.success("Document uploaded successfully")}>
          Confirm upload
        </Button>
      </SectionCard>

      <SectionCard title="My Documents">
        <ul className="space-y-3">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center justify-between rounded-xl border border-border p-4"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.type} · {doc.size} · {formatDate(doc.uploadedAt)}
                  </p>
                </div>
              </div>
              <Badge variant="outline">Uploaded</Badge>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
