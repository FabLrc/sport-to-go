"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Dumbbell, Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface BodyMetric {
  id: number;
  date: string;
  weight: number | null;
}

interface WorkoutLog {
  id: number;
  date: string;
  completed: boolean;
  session: {
    name: string;
    program: {
      name: string;
    };
  };
  performance: Array<{
    exerciseId: number;
    weight: number | null;
    repsCompleted: number;
    exercise: {
      name: string;
    };
  }>;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<BodyMetric[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/metrics").then((res) => res.json()),
      fetch("/api/workout-logs").then((res) => res.json()),
    ])
      .then(([metricsData, logsData]) => {
        setMetrics(metricsData);
        setWorkoutLogs(logsData);
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, []);

  const weightData = metrics
    .filter((m) => m.weight)
    .map((m) => ({
      date: new Date(m.date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
      }),
      poids: m.weight,
    }))
    .reverse()
    .slice(-30);

  const workoutsPerWeek = () => {
    const weeks: { [key: string]: number } = {};
    workoutLogs.forEach((log) => {
      const date = new Date(log.date);
      const week = `${date.getFullYear()}-S${Math.ceil(
        (date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7
      )}`;
      weeks[week] = (weeks[week] || 0) + 1;
    });
    return Object.entries(weeks)
      .slice(-8)
      .map(([week, count]) => ({ semaine: week.split("-")[1], séances: count }));
  };

  const totalWorkouts = workoutLogs.length;
  const latestWeight = metrics.find((m) => m.weight)?.weight;
  const totalExercises = workoutLogs.reduce(
    (sum, log) => sum + new Set(log.performance.map((p) => p.exerciseId)).size,
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visualisez vos progrès et statistiques
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalWorkouts}</p>
              <p className="text-sm text-muted-foreground">Séances totales</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalExercises}</p>
              <p className="text-sm text-muted-foreground">Exercices réalisés</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{latestWeight || "-"} kg</p>
              <p className="text-sm text-muted-foreground">Poids actuel</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{metrics.length}</p>
              <p className="text-sm text-muted-foreground">Mesures prises</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="weight" className="space-y-6">
        <TabsList>
          <TabsTrigger value="weight">Poids corporel</TabsTrigger>
          <TabsTrigger value="workouts">Séances</TabsTrigger>
        </TabsList>

        <TabsContent value="weight">
          <Card>
            <CardHeader>
              <CardTitle>Évolution du poids</CardTitle>
              <CardDescription>
                Suivi de votre poids corporel sur les 30 derniers jours
              </CardDescription>
            </CardHeader>
            <CardContent>
              {weightData.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  Aucune donnée de poids enregistrée
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <YAxis
                      domain={["dataMin - 2", "dataMax + 2"]}
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.75rem",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="poids"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workouts">
          <Card>
            <CardHeader>
              <CardTitle>Séances par semaine</CardTitle>
              <CardDescription>
                Nombre de séances réalisées par semaine
              </CardDescription>
            </CardHeader>
            <CardContent>
              {workoutsPerWeek().length === 0 ? (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  Aucune séance enregistrée
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={workoutsPerWeek()}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="semaine"
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.75rem",
                      }}
                    />
                    <Bar
                      dataKey="séances"
                      fill="hsl(var(--primary))"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Séances récentes */}
      <Card>
        <CardHeader>
          <CardTitle>Dernières séances</CardTitle>
        </CardHeader>
        <CardContent>
          {workoutLogs.length === 0 ? (
            <p className="text-muted-foreground">Aucune séance enregistrée</p>
          ) : (
            <div className="space-y-3">
              {workoutLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{log.session.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {log.session.program.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {new Date(log.date).toLocaleDateString("fr-FR")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {log.performance.length} séries
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
