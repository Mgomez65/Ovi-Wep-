const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient();

async function main() {
  await prisma.usuario.upsert({
    where: { Email: 'Ovi@gmail.com' }, 
    update: {}, 
    create: {  
        Num_empleado:1, 
        Nombre: 'Ovi',
        Apellido:'Administrador',
        Email: 'Ovi@gmail.com',
        Password: await bcrypt.hash('ovi123.', 10),
        CUIL:'20-12345678-9',
        Dirrecion:'coquimbito',
        rol:'admin'
    }
    ,
  });
  await prisma.usuario.upsert({
    where: { Email: 'OviUsario@gmail.com' }, 
    update: {}, 
    create: {  
        Num_empleado:2, 
        Nombre: 'Ovi',
        Apellido:'Usuario',
        Email: 'OviUsario@gmail.com',
        Password: await bcrypt.hash('ovi123.', 10),
        CUIL:'20-12345678-8',
        Dirrecion:'coquimbito',
        rol:'Usuario'
    },
  });
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
