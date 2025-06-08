import prismaCLT from "../../prismaClient";
import { faker } from "@faker-js/faker";
import colors from "colors";

async function seed() {
  console.log(colors.cyan("\n🌱 Seeding started..."));

  // 1. Clear Existing Data
  console.log(colors.yellow(" Clearing existing data..."));
  await prismaCLT.stockLog.deleteMany({});
  await prismaCLT.stockRequestItem.deleteMany({});
  await prismaCLT.stockRequest.deleteMany({});
  await prismaCLT.ingredient.deleteMany({});
  await prismaCLT.order.deleteMany({});
  await prismaCLT.plate.deleteMany({});
  await prismaCLT.item.deleteMany({});
  console.log(colors.green("✅ All existing data cleared."));

  const unitValues = ["KG", "PLATE", "LITRE", "PIECE"] as const;

  // 2. Generate Fake Items
  console.log(colors.yellow(" Generating items..."));
  const items = await Promise.all(
    Array.from({ length: 50 }).map(async () =>
      prismaCLT.item.create({
        data: {
          name: faker.commerce.productName(),
          unit: faker.helpers.arrayElement(unitValues),
          price: faker.number.float({ min: 5, max: 200, fractionDigits: 2 }),
          stock: faker.number.float({ min: 20, max: 500, fractionDigits: 1 }),
          minStock: faker.helpers.arrayElement([
            faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
            faker.number.float({ min: 50, max: 200, fractionDigits: 1 }),
          ]),
          createdAt: faker.date.past({ years: 1 }),
        },
      })
    )
  );
  console.log(colors.green(`✅ ${items.length} items generated.`));

  // 3. Generate Fake Plates
  console.log(colors.yellow(" Generating plates..."));
  const plates = await Promise.all(
    Array.from({ length: 20 }).map(async () =>
      prismaCLT.plate.create({
        data: {
          name: faker.commerce.productName(),
          price: faker.number.float({ min: 20, max: 100, fractionDigits: 2 }),
          createdAt: faker.date.past({ years: 1 }),
        },
      })
    )
  );
  console.log(colors.green(`✅ ${plates.length} plates generated.`));

  // 4. Generate Fake Ingredients
  console.log(colors.yellow(" Generating ingredients..."));
  await Promise.all(
    Array.from({ length: 100 }).map(async () =>
      prismaCLT.ingredient.create({
        data: {
          plateId: faker.helpers.arrayElement(plates).id,
          itemId: faker.helpers.arrayElement(items).id,
          quantity: faker.number.float({ min: 0.5, max: 5, fractionDigits: 1 }),
          createdAt: faker.date.past({ years: 1 }),
        },
      })
    )
  );
  console.log(colors.green("✅ Ingredients generated."));

  // 5. Generate Fake Orders
  console.log(colors.yellow(" Generating orders..."));
  const orders = await Promise.all(
    Array.from({ length: 100 }).map(async () =>
      prismaCLT.order.create({
        data: {
          plateId: faker.helpers.arrayElement(plates).id,
          quantity: faker.number.int({ min: 1, max: 10 }),
          createdAt: faker.date.recent({ days: 30 }),
        },
      })
    )
  );
  console.log(colors.green(`✅ ${orders.length} orders generated.`));

  // 6. Generate Legit Stock Requests (50%)
  console.log(colors.yellow(" Generating legit stock requests (50%)..."));
  const legitOrders = faker.helpers.arrayElements(orders, 50);

  await Promise.all(
    legitOrders.map(async (order) => {
      const stockRequest = await prismaCLT.stockRequest.create({
        data: {
          requester: faker.person.fullName(),
          status: faker.helpers.arrayElement(["APPROVED", "COMPLETED"]),
          createdAt: order.createdAt,
        },
      });

      const ingredients = await prismaCLT.ingredient.findMany({
        where: { plateId: order.plateId },
      });

      await Promise.all(
        ingredients.map((ingredient) =>
          prismaCLT.stockRequestItem.create({
            data: {
              requestId: stockRequest.id,
              itemId: ingredient.itemId,
              requestedQuantity: ingredient.quantity * order.quantity,
              approvedQuantity: faker.helpers.maybe(() =>
                faker.number.float({ min: 1, max: 20, fractionDigits: 1 })
              ),
              issuedQuantity: faker.helpers.maybe(() =>
                faker.number.float({ min: 1, max: 20, fractionDigits: 1 })
              ),
              createdAt: order.createdAt,
            },
          })
        )
      );
    })
  );
  console.log(colors.green("✅ Legit stock requests generated."));

  // 7. Generate Fake (Problematic) Stock Requests (50%)
  console.log(
    colors.yellow(" Generating fake stock requests (stealing, 50%)...")
  );
  const fakeRequestsCount = 50;

  await Promise.all(
    Array.from({ length: fakeRequestsCount }).map(async () => {
      const stockRequest = await prismaCLT.stockRequest.create({
        data: {
          requester: faker.person.fullName(),
          status: "PENDING", // suspicious stuck state
          createdAt: faker.date.recent({ days: 30 }),
        },
      });

      const randomItems = faker.helpers.arrayElements(
        items,
        faker.number.int({ min: 2, max: 5 })
      );

      await Promise.all(
        randomItems.map((item) =>
          prismaCLT.stockRequestItem.create({
            data: {
              requestId: stockRequest.id,
              itemId: item.id,
              requestedQuantity: faker.number.float({
                min: 100, // exaggerate
                max: 500,
                fractionDigits: 1,
              }),
              approvedQuantity: null,
              issuedQuantity: null,
              createdAt: faker.date.recent({ days: 30 }),
            },
          })
        )
      );
    })
  );
  console.log(colors.green("✅ Fake stock requests generated."));

  // 8. Generate Stock Logs (more adjustments)
  console.log(colors.yellow(" Generating stock logs..."));
  await Promise.all(
    Array.from({ length: 300 }).map(async () => {
      const changeType = faker.helpers.arrayElement(
        // 50% adjustments
        ["RECEIVED", "ISSUED", "ADJUSTMENT", "ADJUSTMENT", "ADJUSTMENT"]
      );
      const quantity =
        changeType === "ISSUED"
          ? -faker.number.float({ min: 1, max: 20, fractionDigits: 1 })
          : changeType === "ADJUSTMENT"
          ? -faker.number.float({ min: 1, max: 30, fractionDigits: 1 }) // negative loss
          : faker.number.float({ min: 1, max: 50, fractionDigits: 1 });

      return prismaCLT.stockLog.create({
        data: {
          itemId: faker.helpers.arrayElement(items).id,
          quantity,
          changeType,
          actionBy: faker.person.firstName(),
          date: faker.date.recent({ days: 90 }),
        },
      });
    })
  );
  console.log(colors.green("✅ Stock logs generated."));

  console.log(colors.cyan("🎉 Seeding completed successfully!\n"));
}

seed()
  .catch((e) => {
    console.error(colors.red("❌ Error seeding database:"), e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaCLT.$disconnect();
  });
