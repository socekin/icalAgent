"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, Check, Calendar, Sparkles, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/types";
import { t } from "@/i18n";

type DemoScenario = {
    query: string;
    result: {
        title: string;
        feedUrl: string;
        icon: React.ElementType;
    };
};

function getScenarios(locale: Locale): DemoScenario[] {
    return [
        {
            query: t(locale, "demo.scenario1.query"),
            result: {
                title: t(locale, "demo.scenario1.title"),
                feedUrl: "nba-lakers-schedule.ics",
                icon: Calendar,
            },
        },
        {
            query: t(locale, "demo.scenario2.query"),
            result: {
                title: t(locale, "demo.scenario2.title"),
                feedUrl: "nolan-movies-release.ics",
                icon: Calendar,
            },
        },
        {
            query: t(locale, "demo.scenario3.query"),
            result: {
                title: t(locale, "demo.scenario3.title"),
                feedUrl: "spacex-launches.ics",
                icon: Calendar,
            },
        },
    ];
}

type AgentState = "idle" | "typing" | "thinking" | "searching" | "working" | "success";

export function AgentDemo({ locale }: { locale: Locale }) {
    const scenarios = getScenarios(locale);
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [state, setState] = useState<AgentState>("idle");
    const [displayedQuery, setDisplayedQuery] = useState("");

    const currentScenario = scenarios[scenarioIndex];

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const playSequence = async () => {
            setState("typing");
            setDisplayedQuery("");

            const query = currentScenario.query;
            for (let i = 0; i <= query.length; i++) {
                setDisplayedQuery(query.slice(0, i));
                await new Promise((resolve) => setTimeout(resolve, 50));
            }

            await new Promise((resolve) => setTimeout(resolve, 800));

            setState("thinking");
            await new Promise((resolve) => setTimeout(resolve, 1500));

            setState("searching");
            await new Promise((resolve) => setTimeout(resolve, 1200));

            setState("working");
            await new Promise((resolve) => setTimeout(resolve, 1200));

            setState("success");
            await new Promise((resolve) => setTimeout(resolve, 4000));

            setState("idle");
            setDisplayedQuery("");
            setScenarioIndex((prev) => (prev + 1) % scenarios.length);
        };

        if (state === "idle") {
            timeoutId = setTimeout(playSequence, 500);
        }

        return () => clearTimeout(timeoutId);
    }, [state, currentScenario, scenarioIndex, scenarios.length]);

    return (
        <div className="relative mx-auto w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-200/60 bg-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm">
            {/* Search Bar Area */}
            <div className="relative flex items-center border-b border-zinc-100 bg-white/80 px-4 py-3">
                <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100">
                    {state === "typing" || state === "idle" ? (
                        <div className="h-2 w-2 rounded-full bg-zinc-400" />
                    ) : state === "success" ? (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-emerald-500 text-white">
                            <Check className="h-4 w-4" />
                        </div>
                    ) : (
                        <Sparkles className="h-4 w-4 animate-pulse text-violet-500" />
                    )}
                </div>
                <div className="flex-1 text-left text-sm font-medium text-zinc-900">
                    {displayedQuery}
                    {state === "typing" && <span className="animate-pulse text-zinc-400">|</span>}
                </div>
            </div>

            {/* Content Area */}
            <div className="relative h-32 px-4 py-4">
                {/* States Display */}
                {(state === "thinking" || state === "searching" || state === "working") && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <div className="relative flex h-10 w-10 items-center justify-center">
                            <div className="absolute inset-0 animate-ping rounded-full bg-violet-100 opacity-75"></div>
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                                {state === "thinking" && <BrainCircuit className="h-5 w-5 animate-pulse" />}
                                {state === "searching" && <Search className="h-5 w-5 animate-pulse" />}
                                {state === "working" && <Loader2 className="h-5 w-5 animate-spin" />}
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-sm font-medium text-zinc-700">
                                {state === "thinking" && t(locale, "demo.state.thinking")}
                                {state === "searching" && t(locale, "demo.state.searching")}
                                {state === "working" && t(locale, "demo.state.working")}
                            </span>
                            <span className="text-xs text-zinc-400">iCalAgent is working</span>
                        </div>
                    </div>
                )}

                {/* Success Result */}
                {state === "success" && (
                    <div className="animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-500 flex h-full flex-col justify-center">
                        <div className="flex items-start gap-4 rounded-xl border border-zinc-100 bg-white p-4 shadow-sm">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-50 text-zinc-900">
                                <currentScenario.result.icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="mb-0.5 flex items-center gap-2">
                                    <h3 className="truncate font-semibold text-zinc-900">{currentScenario.result.title}</h3>
                                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600">
                                        {t(locale, "demo.badge.active")}
                                    </span>
                                </div>
                                <p className="mb-2 text-xs text-zinc-500">{t(locale, "demo.result.description")}</p>
                                <div className="flex items-center gap-2 rounded-md bg-zinc-50 px-2 py-1.5">
                                    <code className="flex-1 truncate text-[10px] text-zinc-500 font-mono">
                                        https://icalagent.com/f/{currentScenario.result.feedUrl}
                                    </code>
                                    <span className="flex h-4 w-4 items-center justify-center rounded bg-white shadow-sm ring-1 ring-zinc-200">
                                        <Check className="h-2.5 w-2.5 text-zinc-400" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
