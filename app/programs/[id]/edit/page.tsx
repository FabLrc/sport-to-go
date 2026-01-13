"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, ArrowLeft } from "lucide-react";

interface Exercise {
  id?: number;
  name: string;
  sets: number;
  reps: number;
  restTime: number;
  order: number;
}

interface Session {
  id?: number;
  name: string;
  dayInCycle: number;
  exercises: Exercise[];
}

interface Program {
  id: number;
  name: string;
  startDate: string;
  cycleDays: number;
  totalCycles: number;
  sessions: Session[];
}

export default function EditProgramPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [program, setProgram] = useState({
    name: "",
    startDate: "",
    cycleDays: 7,
    totalCycles: 4,
  });
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    fetch(`/api/programs/${params.id}`)
      .then((res) => res.json())
      .then((data: Program) => {
        setProgram({
          name: data.name,
          startDate: new Date(data.startDate).toISOString().split("T")[0],
          cycleDays: data.cycleDays,
          totalCycles: data.totalCycles,
        });
        setSessions(
          data.sessions.map((session) => ({
            id: session.id,
            name: session.name,
            dayInCycle: session.dayInCycle,
            exercises: session.exercises.map((ex) => ({
              id: ex.id,
              name: ex.name,
              sets: ex.sets,
              reps: ex.reps,
              restTime: ex.restTime,
              order: ex.order,
            })),
          }))
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching program:", error);
        setLoading(false);
      });
  }, [params.id]);

  const addSession = () => {
    setSessions([
      ...sessions,
      {
        name: `Séance ${sessions.length + 1}`,
        dayInCycle: sessions.length + 1,
        exercises: [],
      },
    ]);
  };

  const removeSession = (index: number) => {
    setSessions(sessions.filter((_, i) => i !== index));
  };

  const updateSession = (index: number, field: keyof Session, value: string | number) => {
    const updated = [...sessions];
    updated[index] = { ...updated[index], [field]: value };
    setSessions(updated);
  };

  const addExercise = (sessionIndex: number) => {
    const updated = [...sessions];
    const nextOrder = updated[sessionIndex].exercises.length + 1;
    updated[sessionIndex].exercises.push({
      name: "",
      sets: 3,
      reps: 10,
      restTime: 60,
      order: nextOrder,
    });
    setSessions(updated);
  };

  const removeExercise = (sessionIndex: number, exerciseIndex: number) => {
    const updated = [...sessions];
    updated[sessionIndex].exercises = updated[sessionIndex].exercises.filter(
      (_, i) => i !== exerciseIndex
    );
    setSessions(updated);
  };

  const updateExercise = (
    sessionIndex: number,
    exerciseIndex: number,
    field: keyof Exercise,
    value: string | number
  ) => {
    const updated = [...sessions];
    updated[sessionIndex].exercises[exerciseIndex] = {
      ...updated[sessionIndex].exercises[exerciseIndex],
      [field]: value,
    };
    setSessions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/programs/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...program, sessions }),
      });

      if (response.ok) {
        router.push(`/programs/${params.id}`);
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating program:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/programs/${params.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modifier le programme</h1>
          <p className="text-muted-foreground">
            Modifiez les paramètres de votre programme
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
            <CardDescription>
              Définissez les paramètres de base de votre programme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du programme</Label>
                <Input
                  id="name"
                  placeholder="Ex: Push Pull Legs"
                  value={program.name}
                  onChange={(e) =>
                    setProgram({ ...program, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Date de début</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={program.startDate}
                  onChange={(e) =>
                    setProgram({ ...program, startDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cycleDays">Jours par cycle</Label>
                <Input
                  id="cycleDays"
                  type="number"
                  min="1"
                  max="30"
                  value={program.cycleDays}
                  onChange={(e) =>
                    setProgram({ ...program, cycleDays: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalCycles">Nombre de cycles</Label>
                <Input
                  id="totalCycles"
                  type="number"
                  min="1"
                  max="52"
                  value={program.totalCycles}
                  onChange={(e) =>
                    setProgram({ ...program, totalCycles: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Séances</h2>
            <Button type="button" variant="outline" onClick={addSession}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une séance
            </Button>
          </div>

          {sessions.map((session, sessionIndex) => (
            <Card key={sessionIndex}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-5 h-5 text-muted-foreground" />
                    <Input
                      className="font-semibold text-lg border-none p-0 h-auto focus-visible:ring-0"
                      value={session.name}
                      onChange={(e) =>
                        updateSession(sessionIndex, "name", e.target.value)
                      }
                      placeholder="Nom de la séance"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`day-${sessionIndex}`} className="text-sm">
                        Jour
                      </Label>
                      <Input
                        id={`day-${sessionIndex}`}
                        type="number"
                        min="1"
                        max={program.cycleDays}
                        className="w-16"
                        value={session.dayInCycle}
                        onChange={(e) =>
                          updateSession(
                            sessionIndex,
                            "dayInCycle",
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSession(sessionIndex)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {session.exercises.map((exercise, exerciseIndex) => (
                  <div
                    key={exerciseIndex}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <Input
                      className="flex-1"
                      placeholder="Nom de l'exercice"
                      value={exercise.name}
                      onChange={(e) =>
                        updateExercise(
                          sessionIndex,
                          exerciseIndex,
                          "name",
                          e.target.value
                        )
                      }
                    />
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="1"
                        className="w-16"
                        value={exercise.sets}
                        onChange={(e) =>
                          updateExercise(
                            sessionIndex,
                            exerciseIndex,
                            "sets",
                            parseInt(e.target.value)
                          )
                        }
                      />
                      <span className="text-muted-foreground">x</span>
                      <Input
                        type="number"
                        min="1"
                        className="w-16"
                        value={exercise.reps}
                        onChange={(e) =>
                          updateExercise(
                            sessionIndex,
                            exerciseIndex,
                            "reps",
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="0"
                        className="w-20"
                        value={exercise.restTime}
                        onChange={(e) =>
                          updateExercise(
                            sessionIndex,
                            exerciseIndex,
                            "restTime",
                            parseInt(e.target.value)
                          )
                        }
                      />
                      <span className="text-muted-foreground text-sm">sec</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExercise(sessionIndex, exerciseIndex)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => addExercise(sessionIndex)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un exercice
                </Button>
              </CardContent>
            </Card>
          ))}

          {sessions.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">
                  Aucune séance ajoutée
                </p>
                <Button type="button" variant="outline" onClick={addSession}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une séance
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={saving || sessions.length === 0}>
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>
    </div>
  );
}
