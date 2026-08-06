import 'dotenv/config';
import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const initialProducts = [
    { no: 1, name: "Black Pink Jumbo", sellPrice: 199900, buyPrice: 139930 },
    { no: 2, name: "Black Pink Botol Pink Jumbo", sellPrice: 125900, buyPrice: 88130 },
    { no: 3, name: "Black Pink Botol Hitam Jumbo", sellPrice: 125900, buyPrice: 88130 },
    { no: 4, name: "Black Pink Mini", sellPrice: 99900, buyPrice: 69930 },
    { no: 5, name: "Black Pink Mini Botol Pink", sellPrice: 59900, buyPrice: 41930 },
    { no: 6, name: "Black Pink Mini Botol Hitam", sellPrice: 59900, buyPrice: 41930 },
    { no: 7, name: "Vocal Booster", sellPrice: 57000, buyPrice: 39900 },
    { no: 8, name: "Ngurak Pro NGP", sellPrice: 175000, buyPrice: 122500 },
    { no: 9, name: "G24 Umi Kasum", sellPrice: 157000, buyPrice: 109900 },
    { no: 10, name: "Shampo Sakti", sellPrice: 29900, buyPrice: 20930 },
    { no: 11, name: "Shampo Sakti 2 BTL", sellPrice: 59900, buyPrice: 39130 },
    { no: 12, name: "Jabost Jangkrik Booster", sellPrice: 35000, buyPrice: 24500 },
    { no: 13, name: "Sangkar Burung Murai Water Decal No 2", sellPrice: 2755000, buyPrice: 1599000 },
    { no: 14, name: "Sangkar Sakti PVC No 2", sellPrice: 2499000, buyPrice: 1599000 },
    { no: 15, name: "Tas Tebok Motif Murai", sellPrice: 175000, buyPrice: 122500 },
    { no: 16, name: "Tas Sangkar Premium", sellPrice: 178000, buyPrice: 124600 },
    { no: 17, name: "Tas Gendong", sellPrice: 89000, buyPrice: 62300 },
    { no: 18, name: "Moncer Go", sellPrice: 345000, buyPrice: 241500 },
    { no: 19, name: "Speaker Moncer Go", sellPrice: 175000, buyPrice: 122500 },
    { no: 20, name: "Memory card Moncer Go", sellPrice: 185000, buyPrice: 99000 },
    { no: 21, name: "Air Sakti Feat Escobar", sellPrice: 59900, buyPrice: 23900 },
    { no: 22, name: "Air Sakti Umi Kasum X Avatar 1 Liter", sellPrice: 124900, buyPrice: 87430 },
    { no: 23, name: "Voer Sakti Umi Kasum", sellPrice: 20900, buyPrice: 13300 },
    { no: 24, name: "Voer Sakti Umi Kasum 30 + 3 Sachet", sellPrice: 59000, buyPrice: 41300 },
    { no: 25, name: "Voer Sakti Umi Kasum Hijau 1 Pouch (10 Sachet)", sellPrice: 23900, buyPrice: 16730 },
    { no: 26, name: "Voer Sakti Umi Kasum Hijau 1 Bag (30 + 3 Sachet)", sellPrice: 79000, buyPrice: 55300 },
    { no: 27, name: "Kerodong Jendela Single Layer Murai Batu", sellPrice: 107000, buyPrice: 74900 },
    { no: 28, name: "Kerodong Jendela Double Layer Murai Batu", sellPrice: 134900, buyPrice: 94430 },
    { no: 29, name: "Kerodong Polos Double Layer Murai Batu", sellPrice: 109000, buyPrice: 76300 },
    { no: 30, name: "Kerodong Jas Hujan Single Layer", sellPrice: 142900, buyPrice: 100030 },
    { no: 31, name: "Kerodong Jas Hujan Double Layer", sellPrice: 157900, buyPrice: 110530 },
    { no: 32, name: "Kerodong Murai Batu", sellPrice: 202900, buyPrice: 142030 },
    { no: 33, name: "Tangkringan Premium", sellPrice: 54999, buyPrice: 38499 },
    { no: 34, name: "Tangkringan Regular", sellPrice: 28900, buyPrice: 20230 },
    { no: 35, name: "Ultimate Podium", sellPrice: 99000, buyPrice: 69300 }
];

async function main() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@umikasum.com' },
        update: {},
        create: {
            email: 'admin@umikasum.com',
            password: hashedPassword,
            name: 'Admin Umi Kasum',
            role: 'admin',
        },
    });

    console.log('✅ Admin user created');

    // Create reseller user
    const resellerPassword = await bcrypt.hash('reseller123', 10);

    const reseller = await prisma.user.upsert({
        where: { email: 'reseller@umikasum.com' },
        update: {},
        create: {
            email: 'reseller@umikasum.com',
            password: resellerPassword,
            name: 'Reseller Umi Kasum',
            role: 'reseller',
        },
    });

    console.log('✅ Reseller user created');

    // Create products
    for (const product of initialProducts) {
        await prisma.product.upsert({
            where: { no: product.no },
            update: {
                ...product,
                userId: admin.id,
            },
            create: {
                ...product,
                userId: admin.id,
            },
        });
    }

    console.log(`✅ ${initialProducts.length} products created`);
    console.log('🌱 Seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

/*
# Generate Prisma Client
npx prisma generate

# Push schema ke database (tanpa migration)
npx prisma db push

# Atau buat migration (recommended)
npx prisma migrate dev --name init

# Jalankan seed
npx prisma db seed
*/