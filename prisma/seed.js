const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count();
  if (count > 0) {
    console.log(`Seed skipped (already have ${count} products).`);
    return;
  }
  await prisma.product.createMany({
    data: [
      { barcode: "1234567890123", productCode: "ABC-001", description: "Guantes nitrilo (M)", stockActual: 12, stockMin: 10, orderQty: 0 },
      { barcode: "2345678901234", productCode: "ABC-002", description: "Tubo EDTA 5ml", stockActual: 3, stockMin: 8, orderQty: 5 },
      { barcode: "3456789012345", productCode: "ABC-003", description: "Puntas pipeta 200µl", stockActual: 1, stockMin: 2, orderQty: 10 },
    ],
  });
  console.log("Seeded demo products.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
