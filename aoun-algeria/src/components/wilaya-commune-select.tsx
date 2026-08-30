"use client";

import { useEffect, useState } from "react";

type Commune = { id: string; nameAr: string };
type Wilaya = { id: string; code: string; nameAr: string; communes: Commune[] };

export function WilayaCommuneSelect({
  wilayaId,
  communeId,
  onChange,
}: {
  wilayaId: string;
  communeId: string;
  onChange: (val: { wilayaId: string; communeId: string }) => void;
}) {
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/wilayas")
      .then((r) => r.json())
      .then((data: Wilaya[]) => setWilayas(data))
      .finally(() => setLoading(false));
  }, []);

  const selectedWilaya = wilayas.find((w) => w.id === wilayaId);

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1.5">الولاية</label>
        <select
          required
          disabled={loading}
          value={wilayaId}
          onChange={(e) => onChange({ wilayaId: e.target.value, communeId: "" })}
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
        >
          <option value="">{loading ? "جاري التحميل..." : "اختر الولاية"}</option>
          {wilayas.map((w) => (
            <option key={w.id} value={w.id}>
              {w.code} - {w.nameAr}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">البلدية</label>
        <select
          required
          disabled={!selectedWilaya}
          value={communeId}
          onChange={(e) => onChange({ wilayaId, communeId: e.target.value })}
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm focus:border-primary focus:outline-none disabled:opacity-50"
        >
          <option value="">اختر البلدية</option>
          {selectedWilaya?.communes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameAr}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
