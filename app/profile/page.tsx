"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Scale, Ruler } from "lucide-react";

interface BodyMetric {
  id: number;
  date: string;
  weight: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  arms: number | null;
  thighs: number | null;
  notes: string | null;
}

export default function ProfilePage() {
  const [metrics, setMetrics] = useState<BodyMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    weight: "",
    chest: "",
    waist: "",
    hips: "",
    arms: "",
    thighs: "",
    notes: "",
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch("/api/metrics");
      const data = await res.json();
      setMetrics(data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setFormData({
        weight: "",
        chest: "",
        waist: "",
        hips: "",
        arms: "",
        thighs: "",
        notes: "",
      });

      fetchMetrics();
    } catch (error) {
      console.error("Error saving metric:", error);
    } finally {
      setSaving(false);
    }
  };

  const latestMetric = metrics[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
          <p className="text-muted-foreground">
            Suivez vos mensurations et votre poids
          </p>
        </div>
      </div>

      <Tabs defaultValue="add" className="space-y-6">
        <TabsList>
          <TabsTrigger value="add">Ajouter une mesure</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-6">
          {latestMetric && (
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Scale className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {latestMetric.weight || "-"} kg
                    </p>
                    <p className="text-sm text-muted-foreground">Dernier poids</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Ruler className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {latestMetric.waist || "-"} cm
                    </p>
                    <p className="text-sm text-muted-foreground">Tour de taille</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Ruler className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {latestMetric.arms || "-"} cm
                    </p>
                    <p className="text-sm text-muted-foreground">Tour de bras</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Nouvelle mesure</CardTitle>
              <CardDescription>
                Enregistrez vos mensurations du jour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Poids (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="75.5"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chest">Poitrine (cm)</Label>
                    <Input
                      id="chest"
                      type="number"
                      step="0.5"
                      placeholder="100"
                      value={formData.chest}
                      onChange={(e) =>
                        setFormData({ ...formData, chest: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="waist">Taille (cm)</Label>
                    <Input
                      id="waist"
                      type="number"
                      step="0.5"
                      placeholder="80"
                      value={formData.waist}
                      onChange={(e) =>
                        setFormData({ ...formData, waist: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hips">Hanches (cm)</Label>
                    <Input
                      id="hips"
                      type="number"
                      step="0.5"
                      placeholder="95"
                      value={formData.hips}
                      onChange={(e) =>
                        setFormData({ ...formData, hips: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arms">Bras (cm)</Label>
                    <Input
                      id="arms"
                      type="number"
                      step="0.5"
                      placeholder="35"
                      value={formData.arms}
                      onChange={(e) =>
                        setFormData({ ...formData, arms: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="thighs">Cuisses (cm)</Label>
                    <Input
                      id="thighs"
                      type="number"
                      step="0.5"
                      placeholder="55"
                      value={formData.thighs}
                      onChange={(e) =>
                        setFormData({ ...formData, thighs: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    placeholder="Optionnel..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historique des mesures</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Chargement...</p>
              ) : metrics.length === 0 ? (
                <p className="text-muted-foreground">Aucune mesure enregistrée</p>
              ) : (
                <div className="space-y-4">
                  {metrics.map((metric) => (
                    <div
                      key={metric.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">
                          {new Date(metric.date).toLocaleDateString("fr-FR", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        {metric.notes && (
                          <p className="text-sm text-muted-foreground">
                            {metric.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-4 text-sm">
                        {metric.weight && (
                          <span className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-600">
                            {metric.weight} kg
                          </span>
                        )}
                        {metric.waist && (
                          <span className="px-2 py-1 rounded-lg bg-green-500/10 text-green-600">
                            Taille: {metric.waist} cm
                          </span>
                        )}
                        {metric.arms && (
                          <span className="px-2 py-1 rounded-lg bg-purple-500/10 text-purple-600">
                            Bras: {metric.arms} cm
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
