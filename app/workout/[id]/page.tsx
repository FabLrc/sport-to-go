"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Timer } from "@/components/timer";
import { ArrowLeft, Check, Dumbbell } from "lucide-react";

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  restTime: number;
  order: number;
}

interface Session {
  id: number;
  name: string;
  dayInCycle: number;
  program: {
    id: number;
    name: string;
  };
  exercises: Exercise[];
}

interface SetData {
  exerciseId: number;
  setNumber: number;
  repsCompleted: number;
  weight: number | null;
  completed: boolean;
}

export default function WorkoutPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [showTimer, setShowTimer] = useState(false);
  const [setsData, setSetsData] = useState<SetData[]>([]);

  useEffect(() => {
    fetch(`/api/sessions/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setSession(data);
        // Initialiser les données des séries
        const initialSetsData: SetData[] = [];
        data.exercises.forEach((exercise: Exercise) => {
          for (let i = 1; i <= exercise.sets; i++) {
            initialSetsData.push({
              exerciseId: exercise.id,
              setNumber: i,
              repsCompleted: exercise.reps,
              weight: null,
              completed: false,
            });
          }
        });
        setSetsData(initialSetsData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching session:", error);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Séance non trouvée</p>
        <Link href="/programs">
          <Button className="mt-4">Retour aux programmes</Button>
        </Link>
      </div>
    );
  }

  const currentExercise = session.exercises[currentExerciseIndex];
  const totalSets = session.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const completedSets = setsData.filter((s) => s.completed).length;
  const progress = (completedSets / totalSets) * 100;

  const getCurrentSetData = () => {
    return setsData.find(
      (s) =>
        s.exerciseId === currentExercise.id &&
        s.setNumber === currentSetIndex + 1
    );
  };

  const updateSetData = (field: "repsCompleted" | "weight", value: number | null) => {
    setSetsData((prev) =>
      prev.map((s) =>
        s.exerciseId === currentExercise.id && s.setNumber === currentSetIndex + 1
          ? { ...s, [field]: value }
          : s
      )
    );
  };

  const completeSet = () => {
    setSetsData((prev) =>
      prev.map((s) =>
        s.exerciseId === currentExercise.id && s.setNumber === currentSetIndex + 1
          ? { ...s, completed: true }
          : s
      )
    );

    // Vérifier s'il y a plus de séries ou d'exercices
    if (currentSetIndex < currentExercise.sets - 1) {
      setCurrentSetIndex(currentSetIndex + 1);
      setShowTimer(true);
    } else if (currentExerciseIndex < session.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
      setShowTimer(true);
    } else {
      // Entraînement terminé
      setShowTimer(false);
    }
  };

  const handleTimerComplete = () => {
    setShowTimer(false);
  };

  const finishWorkout = async () => {
    setSaving(true);
    try {
      await fetch("/api/workout-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          performance: setsData.filter((s) => s.completed),
        }),
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error saving workout:", error);
    } finally {
      setSaving(false);
    }
  };

  const isWorkoutComplete = completedSets === totalSets;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/programs/${session.program.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{session.name}</h1>
          <p className="text-muted-foreground">{session.program.name}</p>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progression</span>
          <span className="font-medium">{completedSets}/{totalSets} séries</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {showTimer ? (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Temps de repos</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <Timer
              duration={currentExercise.restTime}
              onComplete={handleTimerComplete}
              autoStart={true}
            />
          </CardContent>
        </Card>
      ) : isWorkoutComplete ? (
        <Card className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="flex flex-col items-center py-12">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Séance terminée !</h2>
            <p className="text-muted-foreground mb-6">
              Félicitations, vous avez complété toutes les séries.
            </p>
            <Button onClick={finishWorkout} disabled={saving} size="lg">
              {saving ? "Enregistrement..." : "Enregistrer la séance"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Current exercise */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{currentExercise.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Exercice {currentExerciseIndex + 1}/{session.exercises.length}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    Série {currentSetIndex + 1}/{currentExercise.sets}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Objectif: {currentExercise.reps} reps
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Répétitions</label>
                  <Input
                    type="number"
                    min="0"
                    value={getCurrentSetData()?.repsCompleted || currentExercise.reps}
                    onChange={(e) =>
                      updateSetData("repsCompleted", parseInt(e.target.value) || 0)
                    }
                    className="text-center text-lg font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Poids (kg)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="Optionnel"
                    value={getCurrentSetData()?.weight || ""}
                    onChange={(e) =>
                      updateSetData(
                        "weight",
                        e.target.value ? parseFloat(e.target.value) : null
                      )
                    }
                    className="text-center text-lg font-medium"
                  />
                </div>
              </div>

              <Button onClick={completeSet} className="w-full" size="lg">
                <Check className="w-5 h-5 mr-2" />
                Valider la série
              </Button>
            </CardContent>
          </Card>

          {/* Liste des exercices */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Exercices restants
            </h3>
            {session.exercises.slice(currentExerciseIndex + 1).map((exercise) => (
              <div
                key={exercise.id}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
              >
                <span>{exercise.name}</span>
                <span className="text-sm text-muted-foreground">
                  {exercise.sets} x {exercise.reps}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
