"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteProgramButtonProps {
  programId: number;
  programName: string;
}

export function DeleteProgramButton({ programId, programName }: DeleteProgramButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le programme "${programName}" ?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/programs/${programId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/programs");
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting program:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash2 className="w-4 h-4 text-destructive" />
    </Button>
  );
}
