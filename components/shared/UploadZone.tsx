"use client";

import { useCallback, useState } from "react";
import { Upload, FileSpreadsheet, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  className?: string;
}

export function UploadZone({
  onFileSelect,
  accept = ".csv,.xlsx,.xls",
  className,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setSelectedFile(file);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clearFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 transition-colors duration-150",
          isDragging ? "border-primary bg-primary/5" : "border-border bg-muted/30"
        )}
      >
        <div className="rounded-full bg-primary/10 p-4 text-primary">
          <Upload className="h-8 w-8" aria-hidden="true" />
        </div>
        <p className="mt-4 text-sm font-medium">
          Drag and drop your file here, or{" "}
          <label className="cursor-pointer text-primary hover:underline">
            browse
            <input
              type="file"
              accept={accept}
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </label>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Supports CSV and Excel files</p>
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-5 w-5 text-primary" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={clearFile} aria-label="Remove file">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
