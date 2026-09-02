import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create or update default workshop
  const workshop = await prisma.workshop.upsert({
    where: { id: "default-workshop" },
    update: {},
    create: {
      id: "default-workshop",
      title: "Full-Stack Web Development Workshop",
      description:
        "Learn how to build and deploy modern full-stack applications using React, Next.js, APIs, databases, authentication, and payments. This comprehensive workshop covers industry best practices and real-world implementation patterns.",
      price: 199900, // ₹1999 (in paisa)
      currency: "INR",
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      startTime: "09:00 AM",
      endTime: "05:00 PM",
      location: "Virtual (Online via Zoom)",
      capacity: 100,
      active: true,
    },
  });

  console.log(`✅ Workshop created/updated: ${workshop.title}`);

  // Create admin users if ADMIN_EMAILS is configured
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  for (const email of adminEmails) {
    const adminUser = await prisma.user.upsert({
      where: { email },
      update: { role: "ADMIN" },
      create: {
        email,
        name: email.split("@")[0],
        role: "ADMIN",
      },
    });

    console.log(`✅ Admin user configured: ${adminUser.email}`);
  }

  console.log("✨ Database seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
