"use client";

import { useEffect, useState } from "react";
import { supabase } from "./client";

// Hook to get current authenticated user
export function useSupabaseUser() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    return { user, loading };
}

// Hook to get user profile with role and details
export function useUserProfile() {
    const { user, loading: authLoading } = useSupabaseUser();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            setProfile(null);
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const { data, error } = await supabase
                    .from("users")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                if (error) throw error;
                setProfile(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();

        // Subscribe to profile changes (realtime)
        const channel = supabase
            .channel(`profile-${user.id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "users",
                    filter: `id=eq.${user.id}`,
                },
                (payload) => {
                    if (payload.eventType === "UPDATE") {
                        setProfile(payload.new);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, authLoading]);

    return { profile, loading: authLoading || loading, error };
}

// Hook to fetch logbook stats for current user
export function useLogbookStats() {
    const { user } = useSupabaseUser();
    const [stats, setStats] = useState({
        disetujui: 0,
        pending: 0,
        ditolak: 0,
        total: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchStats = async () => {
            try {
                const { data: sessionData } = await supabase.auth.getSession();
                const token = sessionData?.session?.access_token;
                const headers: Record<string, string> = token
                    ? { Authorization: `Bearer ${token}` }
                    : {};
                const res = await fetch("/api/dashboard/siswa", { headers });
                if (!res.ok) throw new Error("Gagal memuat statistik logbook");
                const payload = await res.json();
                const apiStats = payload?.data?.stats;

                setStats({
                    disetujui: apiStats?.reviewed ?? 0,
                    pending: apiStats?.submitted ?? 0,
                    ditolak: apiStats?.rejected ?? 0,
                    total: apiStats?.total_logbook ?? 0,
                });
            } catch (err) {
                console.error("Error fetching logbook stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();

        // Subscribe to logbook changes (realtime)
        const channel = supabase
            .channel(`logbook-stats-${user.id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "logbooks",
                    filter: `siswa_id=eq.${user.id}`,
                },
                () => {
                    // Refetch stats when logbook changes
                    fetchStats();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    return { stats, loading };
}

// Hook to fetch DUDI list
export function useDudiList(searchQuery: string = "") {
    const { user, loading: authLoading } = useSupabaseUser();
    const [dudis, setDudis] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            setDudis([]);
            setLoading(false);
            setError("Sesi belum tersedia. Silakan login ulang.");
            return;
        }

        const fetchDudis = async () => {
            try {
                setLoading(true);
                setError(null);
                const url = new URL("/api/dudi", window.location.origin);
                if (searchQuery) url.searchParams.set("search", searchQuery);

                const { data: sessionData } = await supabase.auth.getSession();
                let token: string | undefined = sessionData?.session?.access_token;
                if (!token) {
                    const { data: refreshed } = await supabase.auth.refreshSession();
                    token = refreshed?.session?.access_token;
                }
                if (!token) {
                    throw new Error("Sesi tidak valid. Silakan login ulang.");
                }

                const res = await fetch(url.toString(), {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) {
                    const errPayload = await res.json().catch(() => null);
                    throw new Error(errPayload?.message || "Gagal memuat data DUDI");
                }

                const payload = await res.json();
                const items = Array.isArray(payload?.data) ? payload.data : [];

                const mapped = items.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    location: item.address ?? item.location ?? null,
                    field: item.bidang ?? item.field ?? null,
                    pic: item.contact_name ?? item.pic ?? null,
                    quota_total: item.quota_total ?? null,
                    quota_filled: item.quota_filled ?? null,
                    is_applied: item.is_applied ?? false,
                }));

                setDudis(mapped);
            } catch (err: any) {
                console.error("Error fetching DUDI:", err);
                setError(err?.message || "Gagal memuat data DUDI");
            } finally {
                setLoading(false);
            }
        };

        fetchDudis();
    }, [searchQuery, user, authLoading]);

    return { dudis, loading, error };
}

// Hook to fetch student logbook entries
export function useLogbookEntries(filterStatus: string = "all") {
    const { user } = useSupabaseUser();
    const [entries, setEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchEntries = async () => {
            try {
                let query = supabase
                    .from("logbook")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false });

                if (filterStatus !== "all") {
                    query = query.eq("status", filterStatus);
                }

                const { data, error } = await query;

                if (error) throw error;
                setEntries(data || []);
            } catch (err) {
                console.error("Error fetching logbook entries:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEntries();

        // Subscribe to logbook changes (realtime)
        const channel = supabase
            .channel(`logbook-entries-${user.id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "logbook",
                    filter: `user_id=eq.${user.id}`,
                },
                () => {
                    fetchEntries();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, filterStatus]);

    return { entries, loading };
}
