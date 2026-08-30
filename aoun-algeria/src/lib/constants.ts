export const HELP_TYPE_LABELS: Record<string, { label: string; emoji: string }> = {
  FOOD: { label: "مواد غذائية", emoji: "🍞" },
  WATER: { label: "مياه", emoji: "💧" },
  CLOTHES: { label: "ملابس", emoji: "👕" },
  BLANKETS: { label: "أغطية", emoji: "🛏️" },
  SCHOOL_SUPPLIES: { label: "لوازم مدرسية", emoji: "📚" },
  BABY_SUPPLIES: { label: "مستلزمات أطفال", emoji: "🧸" },
  FURNITURE: { label: "أثاث", emoji: "🏠" },
  TRANSPORT: { label: "نقل", emoji: "🚚" },
  SHELTER: { label: "إيواء", emoji: "🏡" },
  ELDERLY_CARE: { label: "مساعدة كبار السن", emoji: "🧓" },
  DISABILITY_CARE: { label: "مساعدة ذوي الإعاقة", emoji: "♿" },
  OTHER: { label: "أخرى", emoji: "🔹" },
};

export const URGENCY_LABELS: Record<string, { label: string; color: string; emoji: string }> = {
  NORMAL: { label: "عادية", color: "#22c55e", emoji: "🟢" },
  IMPORTANT: { label: "مهمة", color: "#f97316", emoji: "🟠" },
  URGENT: { label: "عاجلة", color: "#ef4444", emoji: "🔴" },
};

export const OFFER_TYPE_LABELS: Record<string, { label: string; emoji: string }> = {
  DONATE_MATERIALS: { label: "أتبرع بمواد", emoji: "📦" },
  PROVIDE_TRANSPORT: { label: "أستطيع توفير النقل", emoji: "🚚" },
  PROVIDE_STORAGE: { label: "أستطيع توفير مكان للتخزين", emoji: "🏠" },
  VOLUNTEER: { label: "أريد التطوع", emoji: "🤝" },
  PROVIDE_WATER: { label: "أستطيع توفير المياه", emoji: "💧" },
  PROVIDE_FOOD: { label: "أستطيع توفير الغذاء", emoji: "🍞" },
  PROVIDE_CLOTHES: { label: "أستطيع توفير الملابس", emoji: "👕" },
  PROVIDE_SCHOOL_SUPPLIES: { label: "أستطيع توفير اللوازم المدرسية", emoji: "📚" },
  PROVIDE_BLANKETS: { label: "أستطيع توفير الأغطية", emoji: "🛏️" },
  PROVIDE_COLLECTION_POINT: { label: "أستطيع توفير نقطة استقبال", emoji: "📍" },
};

export const REQUEST_STATUS_LABELS: Record<string, string> = {
  PENDING_REVIEW: "قيد المراجعة",
  APPROVED: "مقبول",
  IN_PROGRESS: "قيد التنفيذ",
  COMPLETED: "مكتمل",
  REJECTED: "مرفوض",
  CLOSED: "مغلق",
};

export const POINT_STATUS_LABELS: Record<string, string> = {
  ACTIVE: "نشط",
  INACTIVE: "غير نشط",
  FULL: "ممتلئ",
  CLOSED: "مغلق",
};

// Marker colors for the interactive map, per spec:
// 🔴 help requests, 🟢 collection points, 🔵 storage points, 🟡 distribution points, 🟣 volunteers/orgs
export const MAP_COLORS = {
  helpRequest: "#ef4444", // red
  collectionPoint: "#22c55e", // green
  storagePoint: "#3b82f6", // blue
  distributionPoint: "#eab308", // yellow
  volunteerOrg: "#a855f7", // purple
};
