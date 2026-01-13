import Link from "next/link";
import { Dumbbell, Calendar, BarChart3, User, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { calculateCurrentDay } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getTodaySession() {
  const programs = await prisma.program.findMany({
    include: { sessions: true },
  });

  for (const program of programs) {
    const { dayInCycle, currentCycle } = calculateCurrentDay(
      program.startDate,
      program.cycleDays
    );

    if (currentCycle < program.totalCycles) {
      const session = program.sessions.find((s) => s.dayInCycle === dayInCycle);
      if (session) {
        return { session, program };
      }
    }
  }
  return null;
}

export default async function Home() {
  const todayData = await getTodaySession();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
          <Dumbbell className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Sport To Go</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Suivez vos entraînements, gérez vos programmes et progressez jour
          après jour.
        </p>
      </div>

      {todayData ? (
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary mb-1">
                Séance du jour
              </p>
              <h2 className="text-2xl font-bold">{todayData.session.name}</h2>
              <p className="text-muted-foreground">
                {todayData.program.name} - Jour {todayData.session.dayInCycle}
              </p>
            </div>
            <Link
              href={`/workout/${todayData.session.id}`}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Commencer
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-muted/50 rounded-2xl p-6 text-center">
          <p className="text-muted-foreground mb-4">
            Aucune séance prévue aujourd&apos;hui
          </p>
          <Link
            href="/programs/new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Créer un programme
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/programs"
          className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-all hover:border-primary/50"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Dumbbell className="w-6 h-6 text-blue-500" />
          </div>
          <span className="font-medium">Programmes</span>
        </Link>

        <Link
          href="/calendar"
          className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-all hover:border-primary/50"
        >
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Calendar className="w-6 h-6 text-green-500" />
          </div>
          <span className="font-medium">Calendrier</span>
        </Link>

        <Link
          href="/dashboard"
          className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-all hover:border-primary/50"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <BarChart3 className="w-6 h-6 text-purple-500" />
          </div>
          <span className="font-medium">Dashboard</span>
        </Link>

        <Link
          href="/profile"
          className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-all hover:border-primary/50"
        >
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <User className="w-6 h-6 text-orange-500" />
          </div>
          <span className="font-medium">Profil</span>
        </Link>
      </div>
    </div>
  );
}
