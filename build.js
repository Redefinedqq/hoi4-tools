const fs = require('fs');
const path = require('path');

console.log('🚀 Сборка проекта в dist/...');
const dist = path.join(__dirname, 'dist');
if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true, force: true });
}
fs.mkdirSync(dist, { recursive: true });
fs.mkdirSync(path.join(dist, '.vercel'), { recursive: true });

// Копирование ключевых файлов
['index.html', 'styles.css', 'app.js', 'vercel.json'].forEach(file => {
  const src = path.join(__dirname, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(dist, file));
  }
});

// Копирование модулей JS и директорий стилей (js/, css/)
['js', 'css'].forEach(dir => {
  const src = path.join(__dirname, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, path.join(dist, dir), { recursive: true });
  }
});

// Копирование ассетов
if (fs.existsSync(path.join(__dirname, 'assets'))) {
  fs.cpSync(path.join(__dirname, 'assets'), path.join(dist, 'assets'), {
    recursive: true,
    filter: (src) => !src.includes('backup')
  });
}

// Перенос конфигурации Vercel
if (fs.existsSync(path.join(__dirname, '.vercel', 'project.json'))) {
  fs.copyFileSync(
    path.join(__dirname, '.vercel', 'project.json'),
    path.join(dist, '.vercel', 'project.json')
  );
}

console.log('✅ Сборка успешно завершена в dist/!');
