import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🇩🇿</span>
            <span className="font-bold text-primary">عون الجزائر</span>
          </div>
          <p className="mt-3 text-sm text-muted leading-6">
            منصة جزائرية للتضامن تربط بين من يحتاج المساعدة ومن يستطيع تقديمها، عبر خريطة تفاعلية لكل ولايات الوطن.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">روابط سريعة</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/help" className="hover:text-primary">أحتاج مساعدة</Link></li>
            <li><Link href="/help-others" className="hover:text-primary">أنا أساعد</Link></li>
            <li><Link href="/map" className="hover:text-primary">الخريطة التفاعلية</Link></li>
            <li><Link href="/campaigns" className="hover:text-primary">الحملات الإغاثية</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">المنصة</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/collection-points" className="hover:text-primary">نقاط الاستقبال</Link></li>
            <li><Link href="/storage-points" className="hover:text-primary">نقاط التخزين</Link></li>
            <li><Link href="/distribution-points" className="hover:text-primary">نقاط التوزيع</Link></li>
            <li><Link href="/organizations" className="hover:text-primary">الجمعيات</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">الخصوصية</h4>
          <p className="text-sm text-muted leading-6">
            نحمي خصوصية المحتاجين للمساعدة: لا نعرض أرقام الهواتف أو العناوين الدقيقة للعامة.
          </p>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} عون الجزائر — منصة تضامنية غير ربحية
      </div>
    </footer>
  );
}
