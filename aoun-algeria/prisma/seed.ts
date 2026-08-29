import { PrismaClient, HelpType, UrgencyLevel, RequestStatus, OfferType, PointStatus, OrganizationStatus, Role } from "@prisma/client";
import { WILAYAS, WILAYA_COORDS } from "./data/wilayas";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 بدء الزراعة (seeding)...");

  // 1) Wilayas + one demo commune (wilaya center) each
  for (const w of WILAYAS) {
    const wilaya = await prisma.wilaya.upsert({
      where: { code: w.code },
      update: {},
      create: { code: w.code, nameAr: w.nameAr, nameFr: w.nameFr },
    });

    const existingCommune = await prisma.commune.findFirst({
      where: { wilayaId: wilaya.id },
    });
    if (!existingCommune) {
      await prisma.commune.create({
        data: { nameAr: `${w.nameAr} المركز`, nameFr: `${w.nameFr} centre`, wilayaId: wilaya.id },
      });
    }
  }
  console.log(`✅ تم إنشاء ${WILAYAS.length} ولاية`);

  // 2) Admin + demo users
  const passwordHash = await bcrypt.hash("Admin@2026", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@aoun-algeria.dz" },
    update: {},
    create: {
      name: "مدير المنصة",
      email: "admin@aoun-algeria.dz",
      passwordHash,
      role: Role.SUPER_ADMIN,
      isDemo: true,
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: "demo.user@aoun-algeria.dz" },
    update: {},
    create: {
      name: "مستخدم تجريبي",
      email: "demo.user@aoun-algeria.dz",
      passwordHash: await bcrypt.hash("Demo@2026", 10),
      role: Role.USER,
      isDemo: true,
    },
  });

  // 3) Pick a handful of wilayas for richer demo data
  const alger = await prisma.wilaya.findUnique({ where: { code: "16" } });
  const jijel = await prisma.wilaya.findUnique({ where: { code: "18" } });
  const oran = await prisma.wilaya.findUnique({ where: { code: "31" } });
  const tizi = await prisma.wilaya.findUnique({ where: { code: "15" } });

  const demoWilayas = [alger, jijel, oran, tizi].filter(Boolean) as NonNullable<typeof alger>[];

  for (const wilaya of demoWilayas) {
    const commune = await prisma.commune.findFirst({ where: { wilayaId: wilaya.id } });
    if (!commune) continue;
    const center = WILAYA_COORDS[wilaya.code] ?? { lat: 36.75, lng: 3.05 };
    const jitter = () => (Math.random() - 0.5) * 0.15;

    // Help requests
    await prisma.helpRequest.create({
      data: {
        userId: demoUser.id,
        wilayaId: wilaya.id,
        communeId: commune.id,
        helpType: HelpType.FOOD,
        description: `عائلة محتاجة لمواد غذائية في ${wilaya.nameAr} (بيانات تجريبية DEMO)`,
        urgency: UrgencyLevel.URGENT,
        approxLat: center.lat + jitter(),
        approxLng: center.lng + jitter(),
        contactMethod: "0555-000-000 (تجريبي)",
        status: RequestStatus.APPROVED,
        isDemo: true,
      },
    });

    await prisma.helpRequest.create({
      data: {
        wilayaId: wilaya.id,
        communeId: commune.id,
        helpType: HelpType.BLANKETS,
        description: `حاجة لأغطية شتوية في ${wilaya.nameAr} (DEMO)`,
        urgency: UrgencyLevel.IMPORTANT,
        approxLat: center.lat + jitter(),
        approxLng: center.lng + jitter(),
        contactMethod: "0555-000-001 (تجريبي)",
        status: RequestStatus.PENDING_REVIEW,
        isDemo: true,
      },
    });

    // Help offer
    await prisma.helpOffer.create({
      data: {
        userId: demoUser.id,
        wilayaId: wilaya.id,
        communeId: commune.id,
        offerType: OfferType.DONATE_MATERIALS,
        capacity: "200 كغ",
        description: `متبرع بمواد غذائية وملابس في ${wilaya.nameAr} (DEMO)`,
        contactMethod: "0555-000-002 (تجريبي)",
        isDemo: true,
      },
    });

    // Collection point
    await prisma.collectionPoint.create({
      data: {
        name: `نقطة استقبال ${wilaya.nameAr} (DEMO)`,
        wilayaId: wilaya.id,
        communeId: commune.id,
        address: `وسط مدينة ${wilaya.nameAr}`,
        lat: center.lat + jitter(),
        lng: center.lng + jitter(),
        workingHours: "08:00 - 17:00",
        neededHelp: [HelpType.FOOD, HelpType.CLOTHES],
        status: PointStatus.ACTIVE,
        isDemo: true,
      },
    });

    // Storage point
    await prisma.storagePoint.create({
      data: {
        name: `مستودع ${wilaya.nameAr} (DEMO)`,
        wilayaId: wilaya.id,
        communeId: commune.id,
        address: `المنطقة الصناعية - ${wilaya.nameAr}`,
        lat: center.lat + jitter(),
        lng: center.lng + jitter(),
        storageCapacity: "50 طن",
        acceptedMaterials: [HelpType.FOOD, HelpType.BLANKETS, HelpType.FURNITURE],
        acceptsTrucks: true,
        workingHours: "24/7",
        status: PointStatus.ACTIVE,
        isDemo: true,
      },
    });

    // Distribution point
    await prisma.distributionPoint.create({
      data: {
        name: `نقطة توزيع ${wilaya.nameAr} (DEMO)`,
        wilayaId: wilaya.id,
        communeId: commune.id,
        address: `الحي الشعبي - ${wilaya.nameAr}`,
        lat: center.lat + jitter(),
        lng: center.lng + jitter(),
        helpTypes: [HelpType.FOOD, HelpType.WATER],
        beneficiaryGroup: "العائلات المتضررة",
        distributionTimes: "كل يوم سبت 10:00",
        status: PointStatus.ACTIVE,
        isDemo: true,
      },
    });

    // Volunteer (needs its own user)
    const volUser = await prisma.user.upsert({
      where: { email: `volunteer.${wilaya.code}@aoun-algeria.dz` },
      update: {},
      create: {
        name: `متطوع ${wilaya.nameAr}`,
        email: `volunteer.${wilaya.code}@aoun-algeria.dz`,
        passwordHash: await bcrypt.hash("Volunteer@2026", 10),
        role: Role.VOLUNTEER,
        isDemo: true,
      },
    });
    await prisma.volunteer.upsert({
      where: { userId: volUser.id },
      update: {},
      create: {
        userId: volUser.id,
        wilayaId: wilaya.id,
        communeId: commune.id,
        helpTypes: [HelpType.TRANSPORT, HelpType.FOOD],
        canTransport: true,
        canStore: false,
        canDistribute: true,
        available: true,
        isDemo: true,
      },
    });
  }

  // 4) Demo organization
  const orgUser = await prisma.user.upsert({
    where: { email: "org.hilal@aoun-algeria.dz" },
    update: {},
    create: {
      name: "جمعية الهلال للتضامن",
      email: "org.hilal@aoun-algeria.dz",
      passwordHash: await bcrypt.hash("Org@2026", 10),
      role: Role.ORGANIZATION,
      isDemo: true,
    },
  });
  const organization = await prisma.organization.upsert({
    where: { userId: orgUser.id },
    update: {},
    create: {
      userId: orgUser.id,
      name: "جمعية الهلال للتضامن (DEMO)",
      wilayaId: alger!.id,
      activityField: "الإغاثة والتضامن الاجتماعي",
      contactMethods: "contact@hilal-demo.dz",
      status: OrganizationStatus.VERIFIED,
      isDemo: true,
    },
  });

  // 5) Demo campaign
  if (jijel) {
    await prisma.campaign.create({
      data: {
        title: "حملة إغاثة المتضررين من الحرائق (DEMO)",
        description: "حملة تضامنية لمساعدة العائلات المتضررة من حرائق الغابات في ولاية جيجل.",
        wilayaId: jijel.id,
        organizationId: organization.id,
        helpTypes: [HelpType.WATER, HelpType.FOOD, HelpType.BLANKETS, HelpType.CLOTHES],
        targetAmount: 1000,
        fulfilledAmount: 420,
        unit: "طرد مساعدات",
        isActive: true,
        isDemo: true,
      },
    });
  }

  console.log("✅ تمت الزراعة بنجاح");
  console.log("──────────────────────────────");
  console.log("🔑 حساب Admin تجريبي:");
  console.log("   Email: admin@aoun-algeria.dz");
  console.log("   Password: Admin@2026");
  console.log("──────────────────────────────");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
