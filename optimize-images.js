const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const FOTOS_DIR = path.join(__dirname, 'FOTOS');

async function optimizeImages() {
  console.log('🖼️  Iniciando optimización de imágenes...\n');

  try {
    // 1. Optimizar mateogurmet.JPG → WebP (max 300KB)
    console.log('1️⃣  Optimizando mateogurmet.JPG (5.8MB → WebP ~300KB)...');
    await sharp(path.join(FOTOS_DIR, 'mateogurmet.JPG'))
      .resize(1920, 1440, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(FOTOS_DIR, 'mateogurmet.webp'));
    console.log('✅ mateogurmet.webp creado\n');

    // 2. Convertir PNGs a WebP
    const pngFiles = [
      'chef_fire_hero.png',
      'chef_portrait.png',
      'mateo_hero.png'
    ];

    for (const pngFile of pngFiles) {
      const filePath = path.join(FOTOS_DIR, pngFile);
      if (fs.existsSync(filePath)) {
        const baseName = path.basename(pngFile, path.extname(pngFile));
        console.log(`2️⃣  Convirtiendo ${pngFile} → WebP...`);
        await sharp(filePath)
          .resize(1920, 1440, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(path.join(FOTOS_DIR, `${baseName}.webp`));
        console.log(`✅ ${baseName}.webp creado\n`);
      }
    }

    // 3. Optimizar carrusel JPEGs
    for (let i = 1; i <= 3; i++) {
      const jpegFile = `carrusel ${i}.jpeg`;
      const filePath = path.join(FOTOS_DIR, jpegFile);
      if (fs.existsSync(filePath)) {
        console.log(`3️⃣  Optimizando ${jpegFile} (JPEG optimizado)...`);
        await sharp(filePath)
          .resize(1080, 1080, { fit: 'cover' })
          .jpeg({ quality: 75, progressive: true })
          .toFile(path.join(FOTOS_DIR, `carrusel ${i}-opt.jpeg`));
        console.log(`✅ carrusel ${i}-opt.jpeg creado\n`);
      }
    }

    console.log('🎉 ¡Optimización completada!\n');
    console.log('📊 Resumen:');
    console.log('✅ mateogurmet.webp (reemplaza mateogurmet.JPG)');
    console.log('✅ chef_fire_hero.webp (reemplaza chef_fire_hero.png)');
    console.log('✅ chef_portrait.webp (reemplaza chef_portrait.png)');
    console.log('✅ mateo_hero.webp (reemplaza mateo_hero.png)');
    console.log('✅ carrusel 1-opt.jpeg, carrusel 2-opt.jpeg, carrusel 3-opt.jpeg');
    console.log('\n⚠️  Próximo paso: Actualizar rutas en index.html\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

optimizeImages();
