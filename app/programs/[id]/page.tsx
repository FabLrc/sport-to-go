import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, Calendar, RotateCcw, Dumbbell } from "lucide-react";
import { DeleteProgramButton } from "./delete-button";

export const dynamic = "force-dynamic";

async function getProgram(id: number) {
  return await prisma.program.findUnique({
    where: { id },
    include: {
      sessions: {
        include: {
          exercises: {
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { dayInCycle: 'asc' }
      }
    }
  });
}

export default async function ProgramPage({ params }: { params: { id: string } }) {
  const program = await getProgram(parseInt(params.id));

  if (!program) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/programs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{program.name}</h1>
          <p className="text-muted-foreground">
            Démarré le {new Date(program.startDate).toLocaleDateString('fr-FR')}
          </p>
        </div>
        <Link href={`/programs/${program.id}/edit`}>
          <Button variant="outline">
            Modifier
          </Button>
        </Link>
        <DeleteProgramButton programId={program.id} programName={program.name} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{program.cycleDays}</p>
              <p className="text-sm text-muted-foreground">jours par cycle</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <RotateCcw className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{program.totalCycles}</p>
              <p className="text-sm text-muted-foreground">cycles prévus</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{program.sessions.length}</p>
              <p className="text-sm text-muted-foreground">séances</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Séances du programme</h2>
        
        {program.sessions.map((session) => (
          <Card key={session.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{session.name}</CardTitle>
                  <CardDescription>Jour {session.dayInCycle} du cycle</CardDescription>
                </div>
                <Link href={`/workout/${session.id}`}>
                  <Button>
                    <Play className="w-4 h-4 mr-2" />
                    Démarrer
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {session.exercises.length === 0 ? (
                <p className="text-muted-foreground text-sm">Aucun exercice</p>
              ) : (
                <div className="space-y-2">
                  {session.exercises.map((exercise, index) => (
                    <div
                      key={exercise.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">
                          {index + 1}
                        </span>
                        <span className="font-medium">{exercise.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {exercise.sets} x {exercise.reps} • {exercise.restTime}s repos
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
