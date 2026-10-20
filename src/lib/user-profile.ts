import { TeacherProfile, SchoolProfile } from "@/types";
import { getActiveUserId, setActiveUserId } from "@/lib/document-vault";

const TEACHER_KEY_PREFIX = "guru_teacher_profile_";
const SCHOOL_KEY_PREFIX = "guru_school_profile_";
const ACTIVE_TEACHER_KEY = "guru_teacher_profile";
const ACTIVE_SCHOOL_KEY = "guru_school_profile";

export const DEFAULT_SCHOOL_TEMPLATE: Partial<SchoolProfile> = {
  government_agency: "KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI",
  education_office: "DINAS PENDIDIKAN",
  school_name: "Nama Satuan Pendidikan Belum Diatur",
  npsn: "-",
  accreditation: "-",
  address: "Silakan lengkapi profil sekolah Anda di menu Profil Sekolah",
  postal_code: "-",
  phone: "-",
  email: "-",
  website: "",
  left_logo_url: "",
  right_logo_url: "",
};

export function resolveUserId(userId?: string): string {
  if (userId && userId.trim() && userId !== "guest") {
    return userId.trim();
  }
  const active = getActiveUserId();
  if (active && active.trim() && active !== "guest") {
    return active.trim();
  }
  return "guest";
}

/**
 * Mengambil profil guru yang diisolasi khusus untuk akun yang sedang aktif.
 */
export function getTeacherProfile(userId?: string, fallbackName?: string): Partial<TeacherProfile> {
  if (typeof window === "undefined") {
    return { teacher_name: fallbackName || "Pendidik ModulKu", teacher_nip: "-" };
  }

  const uid = resolveUserId(userId);

  try {
    // 1. Coba baca profil spesifik untuk ID pengguna ini
    if (uid !== "guest") {
      const userScopedKey = `${TEACHER_KEY_PREFIX}${uid}`;
      const rawUser = localStorage.getItem(userScopedKey);
      if (rawUser) {
        return JSON.parse(rawUser);
      }
    }

    // 2. Jika belum ada profil tersimpan untuk user ini, buat profil baru khusus user ini
    const initialName = fallbackName || (uid !== "guest" ? `Pendidik (${uid.slice(0, 6)})` : "Pendidik ModulKu");
    const newProfile: Partial<TeacherProfile> = {
      teacher_name: initialName,
      teacher_nip: "-",
      user_id: uid !== "guest" ? uid : undefined,
    };

    if (uid !== "guest") {
      localStorage.setItem(`${TEACHER_KEY_PREFIX}${uid}`, JSON.stringify(newProfile));
      localStorage.setItem(ACTIVE_TEACHER_KEY, JSON.stringify(newProfile));
    }

    return newProfile;
  } catch {
    return { teacher_name: fallbackName || "Pendidik ModulKu", teacher_nip: "-" };
  }
}

/**
 * Menyimpan profil guru yang diisolasi khusus untuk akun yang sedang aktif.
 */
export function saveTeacherProfile(profile: Partial<TeacherProfile>, userId?: string): void {
  if (typeof window === "undefined") return;

  const uid = resolveUserId(userId || profile.user_id);

  try {
    const current = getTeacherProfile(uid);
    const updated = {
      ...current,
      ...profile,
      user_id: uid !== "guest" ? uid : profile.user_id,
      updated_at: new Date().toISOString(),
    };

    if (uid !== "guest") {
      localStorage.setItem(`${TEACHER_KEY_PREFIX}${uid}`, JSON.stringify(updated));
    }
    localStorage.setItem(ACTIVE_TEACHER_KEY, JSON.stringify(updated));

    window.dispatchEvent(new CustomEvent("modulku-profile-changed", { detail: updated }));
  } catch {
    // ignore
  }
}

/**
 * Mengambil profil sekolah yang diisolasi khusus untuk akun yang sedang aktif.
 */
export function getSchoolProfile(userId?: string): Partial<SchoolProfile> {
  if (typeof window === "undefined") {
    return DEFAULT_SCHOOL_TEMPLATE;
  }

  const uid = resolveUserId(userId);

  try {
    if (uid !== "guest") {
      const userScopedKey = `${SCHOOL_KEY_PREFIX}${uid}`;
      const raw = localStorage.getItem(userScopedKey);
      if (raw) {
        return JSON.parse(raw);
      }
    }

    // Jika belum ada, buat default untuk user ini
    const initialSchool: Partial<SchoolProfile> = {
      ...DEFAULT_SCHOOL_TEMPLATE,
      user_id: uid !== "guest" ? uid : undefined,
    };

    if (uid !== "guest") {
      localStorage.setItem(`${SCHOOL_KEY_PREFIX}${uid}`, JSON.stringify(initialSchool));
      localStorage.setItem(ACTIVE_SCHOOL_KEY, JSON.stringify(initialSchool));
    }

    return initialSchool;
  } catch {
    return DEFAULT_SCHOOL_TEMPLATE;
  }
}

/**
 * Menyimpan profil sekolah yang diisolasi khusus untuk akun yang sedang aktif.
 */
export function saveSchoolProfile(school: Partial<SchoolProfile>, userId?: string): void {
  if (typeof window === "undefined") return;

  const uid = resolveUserId(userId || school.user_id);

  try {
    const current = getSchoolProfile(uid);
    const updated = {
      ...current,
      ...school,
      user_id: uid !== "guest" ? uid : school.user_id,
      updated_at: new Date().toISOString(),
    };

    if (uid !== "guest") {
      localStorage.setItem(`${SCHOOL_KEY_PREFIX}${uid}`, JSON.stringify(updated));
    }
    localStorage.setItem(ACTIVE_SCHOOL_KEY, JSON.stringify(updated));

    window.dispatchEvent(new CustomEvent("modulku-profile-changed", { detail: updated }));
  } catch {
    // ignore
  }
}

/**
 * Membersihkan cache profil aktif saat pengguna melakukan logout.
 * Profil per-user tetap aman di guru_teacher_profile_{userId},
 * namun cermin aktif dibersihkan agar akun berikutnya tidak mewarisi data lama.
 */
export function clearCurrentSessionProfile(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACTIVE_TEACHER_KEY);
    localStorage.removeItem(ACTIVE_SCHOOL_KEY);
    localStorage.removeItem("guru_auth_token");
    setActiveUserId(null);

    if (typeof document !== "undefined") {
      document.cookie = "sb_access_token=; path=/; max-age=0; SameSite=Lax";
    }

    window.dispatchEvent(new CustomEvent("modulku-profile-changed"));
    window.dispatchEvent(new CustomEvent("modulku-vault-changed"));
  } catch {
    // ignore
  }
}
