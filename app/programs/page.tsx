import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Calendar, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

async function getPrograms() {
  return await prisma.program.findMany({
    include: {
      sessions: {
        include: {
          _count: {
            select: { exercises: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Programmes</h1>
          <p className="text-muted-foreground">Gérez vos programmes d&apos;entraînement</p>
        </div>
        <Link href="/programs/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau programme
          </Button>
        </Link>
      </div>

      {programs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Aucun programme</h3>
            <p className="text-muted-foreground text-center mb-4">
              Créez votre premier programme pour commencer à vous entraîner
            </p>
            <Link href="/programs/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Créer un programme
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <Link key={program.id} href={`/programs/${program.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>{program.name}</CardTitle>
                  <CardDescription>
                    Démarré le {new Date(program.startDate).toLocaleDateString('fr-FR')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{program.cycleDays} jours/cycle</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <RotateCcw className="w-4 h-4" />
                      <span>{program.totalCycles} cycles</span>
                    </div>
                  </div>
                  <div className="mt-3 text-sm">
                    <span className="font-medium">{program.sessions.length}</span> séances
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
