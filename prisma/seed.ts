import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding initial Lapangan data...");

  const existing = await prisma.lapangan.findMany();
  if (existing.length === 0) {
    await prisma.lapangan.createMany({
      data: [
        {
          name: "Lapangan Futsal Vinyl Teraflex 1",
          description: "Vinyl Standar Nasional 6mm • Hall A Indoor AC • Rompi & Bola Match Gratis",
          location: "Hall A - Lantai 1 (Indoor AC)",
          price: 150000,
          picture_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80",
        },
        {
          name: "Mini Soccer Arena Sintetis Pro",
          description: "Rumput Sintetis Monofilament 50mm • Lampu Sorot LED Pro • Tribun 50 Kursi",
          location: "Outdoor Area Selatan",
          price: 350000,
          picture_url: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&auto=format&fit=crop&q=80",
        },
        {
          name: "Lapangan Badminton Karpet BWF 1",
          description: "Karpet Vinyl Hijau BWF Approved • Pencahayaan Anti-Silau • Net PBSI",
          location: "Gedung Olahraga Blok B",
          price: 80000,
          picture_url: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80",
        },
        {
          name: "Lapangan Tenis Outdoor Hard Court",
          description: "Akrilik Hard Court Standar ITF • Kursi Wasit • Lampu Malam",
          location: "Outdoor Area Barat",
          price: 120000,
          picture_url: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&auto=format&fit=crop&q=80",
        },
      ],
    });
    console.log("Seeding Lapangan completed successfully!");
  } else {
    console.log(`Database already has ${existing.length} Lapangan records.`);
  }
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  });
