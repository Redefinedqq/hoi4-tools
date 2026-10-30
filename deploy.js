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

// Копирование модулей JS и директорий стилей (js/, css/)
['js', 'css'].forEach(dir => {
  const src = path.join(__dirname, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, path.join(dist, dir), { recursive: true });
  }
});

// Копирование ассетов (исключая внутренние папки бэкапов)
if (fs.existsSync(path.join(__dirname, 'assets'))) {
  fs.cpSync(path.join(__dirname, 'assets'), path.join(dist, 'assets'), {
    recursive: true,
    filter: (src) => !src.includes('backup')
  });
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
  execSync('npx vercel deploy dist --prod --yes', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Vercel деплой успешно завершен!');
} catch (e) {
  console.error('❌ Ошибка деплоя Vercel:', e.message);
}

console.log('🚀 Синхронизация с GitHub (ветки main и gh-pages)...');
try {
  let gitCmd = 'git';
  const gitPaths = [
    'git',
    'C:\\Program Files\\Git\\cmd\\git.exe',
    'C:\\Program Files\\Git\\bin\\git.exe'
  ];
  for (const p of gitPaths) {
    try {
      execSync(`"${p}" --version`, { stdio: 'ignore' });
      gitCmd = `"${p}"`;
      break;
    } catch (_) {}
  }
  
  // Автоматическая фиксация всех изменений
  execSync(`${gitCmd} add -A`, { stdio: 'inherit', cwd: __dirname });
  try {
    const commitMsg = `feat: update site, header redesign, deck sync (${new Date().toISOString().replace('T', ' ').substring(0, 19)})`;
    execSync(`${gitCmd} commit -m "${commitMsg}"`, { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Изменения закоммичены в git.');
  } catch (_) {
    console.log('ℹ️ Нет новых изменений для коммита.');
  }

  execSync(`${gitCmd} push origin main`, { stdio: 'inherit', cwd: __dirname });
  execSync(`${gitCmd} push origin HEAD:gh-pages --force`, { stdio: 'inherit', cwd: __dirname });
  console.log('✅ GitHub Pages успешно обновлен!');
} catch (e) {
  console.error('❌ Ошибка синхронизации с GitHub Pages:', e.message);
}

console.log('🎉 Все деплои завершены!');
