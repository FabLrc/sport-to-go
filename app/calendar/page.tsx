"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkoutLog {
  id: number;
  date: string;
  session: {
    name: string;
  };
}

interface Program {
  id: number;
  name: string;
  startDate: string;
  cycleDays: number;
  totalCycles: number;
  sessions: Array<{
    id: number;
    name: string;
    dayInCycle: number;
  }>;
}

interface ScheduledSession {
  date: Date;
  session: {
    id: number;
    name: string;
  };
  program: {
    name: string;
  };
}

export default function CalendarPage() {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [scheduledSessions, setScheduledSessions] = useState<ScheduledSession[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/workout-logs").then((res) => res.json()),
      fetch("/api/programs").then((res) => res.json()),
    ])
      .then(([logsData, programsData]) => {
        setWorkoutLogs(logsData);
        setPrograms(programsData);
        
        // Calculer les séances programmées
        const scheduled: ScheduledSession[] = [];
        programsData.forEach((program: Program) => {
          const startDate = new Date(program.startDate);
          const today = new Date();
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + (program.cycleDays * program.totalCycles));
          
          // Afficher uniquement les séances programmées si le programme est toujours actif
          if (today <= endDate) {
            for (let cycle = 0; cycle < program.totalCycles; cycle++) {
              program.sessions.forEach((session) => {
                const sessionDate = new Date(startDate);
                sessionDate.setDate(sessionDate.getDate() + (cycle * program.cycleDays) + (session.dayInCycle - 1));
                
                if (sessionDate >= today && sessionDate <= endDate) {
                  scheduled.push({
                    date: sessionDate,
                    session: {
                      id: session.id,
                      name: session.name,
                    },
                    program: {
                      name: program.name,
                    },
                  });
                }
              });
            }
          }
        });
        setScheduledSessions(scheduled);
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, []);

  const workoutDates = new Set(
    workoutLogs.map((log) =>
      new Date(log.date).toISOString().split("T")[0]
    )
  );

  const scheduledDates = new Map<string, ScheduledSession[]>();
  scheduledSessions.forEach((scheduled) => {
    const dateStr = scheduled.date.toISOString().split("T")[0];
    if (!scheduledDates.has(dateStr)) {
      scheduledDates.set(dateStr, []);
    }
    scheduledDates.get(dateStr)!.push(scheduled);
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay() || 7; // Lundi = 1

    const days = [];

    // Jours du mois précédent
    const prevMonth = new Date(year, month, 0);
    for (let i = startingDay - 1; i > 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonth.getDate() - i + 1),
        isCurrentMonth: false,
      });
    }

    // Jours du mois actuel
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Jours du mois suivant
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const hasWorkout = (date: Date) => {
    return workoutDates.has(date.toISOString().split("T")[0]);
  };

  const hasScheduled = (date: Date) => {
    return scheduledDates.has(date.toISOString().split("T")[0]);
  };

  const getWorkoutsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return workoutLogs.filter(
      (log) => new Date(log.date).toISOString().split("T")[0] === dateStr
    );
  };

  const getScheduledForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return scheduledDates.get(dateStr) || [];
  };

  const workoutsThisMonth = workoutLogs.filter((log) => {
    const logDate = new Date(log.date);
    return (
      logDate.getMonth() === currentDate.getMonth() &&
      logDate.getFullYear() === currentDate.getFullYear()
    );
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendrier</h1>
        <p className="text-muted-foreground">
          Visualisez vos séances d&apos;entraînement
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="capitalize">{monthName}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const dateKey = day.date.toISOString();
                const workout = hasWorkout(day.date);
                const scheduled = hasScheduled(day.date);

                return (
                  <div
                    key={`${dateKey}-${index}`}
                    className={`
                      relative aspect-square flex items-center justify-center rounded-xl text-sm
                      ${!day.isCurrentMonth ? "text-muted-foreground/50" : ""}
                      ${isToday(day.date) ? "bg-primary text-primary-foreground font-bold" : ""}
                      ${workout && !isToday(day.date) ? "bg-green-500/20 text-green-700 font-medium" : ""}
                      ${scheduled && !workout && !isToday(day.date) ? "bg-blue-500/10 text-blue-700" : ""}
                      ${day.isCurrentMonth && !isToday(day.date) && !workout && !scheduled ? "hover:bg-muted" : ""}
                    `}
                  >
                    {day.date.getDate()}
                    {workout && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      </div>
                    )}
                    {scheduled && !workout && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ce mois-ci</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <p className="text-2xl font-bold">{workoutsThisMonth}</p>
                <p className="text-sm text-muted-foreground">Séances effectuées</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Légende
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Séance effectuée</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span>Séance programmée</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Prochaines séances
              </p>
              {scheduledSessions
                .filter((s) => s.date >= new Date())
                .slice(0, 3)
                .map((scheduled, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-blue-500/10 text-sm"
                  >
                    <p className="font-medium">{scheduled.session.name}</p>
                    <p className="text-muted-foreground">
                      {scheduled.date.toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                      })} • {scheduled.program.name}
                    </p>
                  </div>
                ))}
              {scheduledSessions.filter((s) => s.date >= new Date()).length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Aucune séance programmée
                </p>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Historique récent
              </p>
              {workoutLogs.slice(0, 3).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-green-500/10 text-sm"
                >
                  <p className="font-medium">{log.session.name}</p>
                  <p className="text-muted-foreground">
                    {new Date(log.date).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              ))}
              {workoutLogs.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Aucune séance enregistrée
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
