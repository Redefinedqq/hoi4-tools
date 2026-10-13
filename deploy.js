const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Подготовка чистого бандла в dist/...');
const dist = path.join(__dirname, 'dist');
if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true, force: true });
}
fs.mkdirSync(dist, { recursive: true });
fs.mkdirSync(path.join(dist, '.vercel'), { recursive: true });

// Копирование файлов для продакшена
['index.html', 'styles.css', 'app.js', 'vercel.json'].forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    fs.copyFileSync(path.join(__dirname, file), path.join(dist, file));
  }
});

// Копирование ассетов
if (fs.existsSync(path.join(__dirname, 'assets'))) {
  fs.cpSync(path.join(__dirname, 'assets'), path.join(dist, 'assets'), { recursive: true });
}

// Перенос конфигурации Vercel проекта
if (fs.existsSync(path.join(__dirname, '.vercel', 'project.json'))) {
  fs.copyFileSync(
    path.join(__dirname, '.vercel', 'project.json'),
    path.join(dist, '.vercel', 'project.json')
  );
}

console.log('✅ Бандл собран. Быстрый деплой на Vercel (Production)...');
try {
  execSync('npx vercel deploy dist --prod --yes', { stdio: 'inherit' });
  console.log('✅ Vercel деплой успешно завершен!');
} catch (e) {
  console.error('❌ Ошибка деплоя Vercel:', e.message);
}

console.log('🚀 Синхронизация с GitHub Pages (ветка gh-pages)...');
try {
  execSync('git push origin HEAD:gh-pages --force', { stdio: 'inherit' });
  console.log('✅ GitHub Pages успешно обновлен!');
} catch (e) {
  console.error('❌ Ошибка синхронизации с GitHub Pages:', e.message);
}

console.log('🎉 Все деплои завершены!');
