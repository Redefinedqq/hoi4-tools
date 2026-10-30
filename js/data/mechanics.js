/**
 * Curated Mechanics and Competitive Tricks (Atom) - 24 Cards
 */

// Centralized toggle: Switch to false to instantly restore authentic game screenshots in 1 click
export const USE_AI_PLACEHOLDER_GRAPHICS = true;

// 24 Curated Mechanics and Competitive Tricks (Shuffled deck order)
export const MECHANICS = [
  {
    id: 'trick-46-stack-general-buffs',
    title: 'СТАКАТЬ БАФЫ ОТ ГЕНЕРАЛОВ',
    desc: 'Можно стакать бафы от вынужденной атаки переназначая генералов пока не закончится командный ресурс.',
    nativeImg: 'assets/cards/card-20-bad-field-marshal.webp',
    placeholderImg: 'assets/cards/placeholders/trick-46-stack-general-buffs.svg'
  },
  {
    id: 'trick-04-hull-conversion',
    title: 'КОНВЕРСИЯ',
    nativeImg: 'assets/cards/card-05b-bad-templates-tanks.webp',
    placeholderImg: 'assets/cards/placeholders/trick-04-hull-conversion.svg'
  },
  {
    id: 'trick-31-gypsy-family',
    title: '«ЦЫГАНСКАЯ СЕМЬЯ» АЙДИМА',
    desc: 'Ультимативный шаблон на 22 каски пехоты с огромным запасом HP и 700 софт-атаки, продавливающий фронт за счёт чистой массы без техники.',
    nativeImg: 'assets/cards/card-07-zero-stability.webp',
    placeholderImg: 'assets/cards/placeholders/trick-31-gypsy-family.svg'
  },
  {
    id: 'trick-45-optimization-mods',
    title: 'МОДЫ НА ОПТИМИЗАЦИЮ',
    desc: 'FPS Map Mod',
    nativeImg: 'assets/cards/card-04-forgot-building.webp',
    placeholderImg: 'assets/cards/placeholders/trick-45-optimization-mods.svg'
  },
  {
    id: 'trick-03-naval-drops',
    title: 'МОРСКИЕ ДРОПЫ',
    nativeImg: 'assets/cards/card-17-no-naval-invasion.webp',
    placeholderImg: 'assets/cards/placeholders/trick-03-naval-drops.svg'
  },
  {
    id: 'trick-47-special-forces-cap-abuse',
    title: 'АБУЗ СПЕЦНАЗА',
    desc: 'Дропать кучу однокасок, переформировать их в жирный шаблон (лимит спецназа раздувается), ставить на обучение спецназ и удалить новые раздутые дивки.',
    nativeImg: 'assets/cards/card-33-wrong-special-forces.webp',
    placeholderImg: 'assets/cards/placeholders/trick-47-special-forces-cap-abuse.svg'
  },
  {
    id: 'trick-10-space-marines',
    title: 'КОСМОДЕСАНТ',
    nativeImg: 'assets/cards/card-40-tanks-in-mountains.webp',
    placeholderImg: 'assets/cards/placeholders/trick-10-space-marines.svg'
  },
  {
    id: 'trick-44-marine-tank-template',
    title: 'СПЕЦНАЗ В ТАНКОВЫЕ ДИВИЗИИ',
    desc: 'Для бафа пробития реки или высадки в порт, а также бафа местности — например, горы, форсирование реки или порт.',
    nativeImg: 'assets/cards/card-31-attack-river-forts.webp',
    placeholderImg: 'assets/cards/placeholders/trick-44-marine-tanks.svg'
  },
  {
    id: 'trick-29-anti-air-piercing',
    title: 'ПВО ВМЕСТО ПТ',
    nativeImg: 'assets/cards/card-05d-bad-templates-navy.webp',
    placeholderImg: 'assets/cards/placeholders/trick-29-anti-air-piercing.svg'
  },
  {
    id: 'trick-43-garrison-law',
    title: 'ВЫСТАВИТЬ ПРАВИЛЬНО ГАРНИЗОНЫ',
    desc: 'Принудительный труд для выкачивания ресурсов, жесткие нормы для заводов, а в остальных случаях военное положение.',
    nativeImg: 'assets/cards/card-41-garrison-cavalry-loss.webp',
    placeholderImg: 'assets/cards/placeholders/trick-43-garrison-law.svg'
  },
  {
    id: 'trick-12-manual-naval-strike',
    title: 'МОРБОБРЫ',
    nativeImg: 'assets/cards/card-11-naval-bombers-no-fleet.webp',
    placeholderImg: 'assets/cards/placeholders/trick-12-manual-naval-strike.svg'
  },
  {
    id: 'trick-34-single-helmet-spam',
    title: 'СПАМ 1-КАСОЧНЫХ ДИВИЗИЙ',
    nativeImg: 'assets/cards/card-14-uncovered-front.webp',
    placeholderImg: 'assets/cards/placeholders/trick-34-single-helmet-spam.svg'
  },
  {
    id: 'trick-09-air-transports-supply',
    title: 'СНАБЖЕНИЕ С ВОЗДУХА',
    nativeImg: 'assets/cards/card-18-tanks-no-supply.webp',
    placeholderImg: 'assets/cards/placeholders/trick-09-air-transports-supply.svg'
  },
  {
    id: 'trick-18-refit-cruiser-armor',
    title: 'МОДЕРНИЗАЦИЯ ФЛОТА',
    nativeImg: 'assets/cards/card-27-no-dockyards-repair.webp',
    placeholderImg: 'assets/cards/placeholders/trick-18-refit-cruiser-armor.svg'
  },
  {
    id: 'trick-22-sub-pack-tactics',
    title: 'ВОЛЧЬИ СТАИ НА МЕЛКОВОДЬЕ',
    desc: 'Спам дешёвых подлодок на мелководье (типа Ла-Манша или Балтики), где штраф к скрытности не важен из-за мгновенного перехвата конвоев и огромного урона торпедами.',
    nativeImg: 'assets/cards/card-56-no-sub-repair.webp',
    placeholderImg: 'assets/cards/placeholders/trick-22-sub-pack-tactics.svg'
  },
  {
    id: 'trick-16-scorch-earth-retreat',
    title: 'ВЫЖЖЕННАЯ ЗЕМЛЯ',
    nativeImg: 'assets/cards/card-52-fort-line-flanked.webp',
    placeholderImg: 'assets/cards/placeholders/trick-16-scorch-earth-retreat.svg'
  },
  {
    id: 'trick-40-vdv-rail-cut',
    title: 'ВДВ НА Ж/Д РАЗВЯЗКИ',
    nativeImg: 'assets/cards/card-45-lost-capital-paratroopers.webp',
    placeholderImg: 'assets/cards/placeholders/trick-40-vdv-rail-cut.svg'
  },
  {
    id: 'trick-11-licence-production',
    title: 'ЛИЦЕНЗИИ',
    nativeImg: 'assets/cards/card-04-forgot-building.webp',
    placeholderImg: 'assets/cards/placeholders/trick-11-licence-production.svg'
  },
  {
    id: 'trick-26-railway-guns-barrage',
    title: 'ЮЗАНИЕ ОРУДИЙ НАПОДОБИЕ ДОРЫ',
    nativeImg: 'assets/cards/card-15-guns-deficit.webp',
    placeholderImg: 'assets/cards/placeholders/trick-26-railway-guns-barrage.svg'
  },
  {
    id: 'trick-19-carrier-overcrowding',
    title: 'ПЕРЕГРУЗ АВИАНОСЦЕВ',
    nativeImg: 'assets/cards/card-05c-bad-templates-air.webp',
    placeholderImg: 'assets/cards/placeholders/trick-19-carrier-overcrowding.svg',
    locked: true
  },
  {
    id: 'trick-27-midget-sub-mines',
    title: 'МИННЫЕ ПОЛЯ В ПРОЛИВАХ',
    nativeImg: 'assets/cards/card-48-english-channel-convoy.webp',
    placeholderImg: 'assets/cards/placeholders/trick-27-midget-sub-mines.svg'
  },
  {
    id: 'trick-17-paradrop-victory-points',
    title: 'ДРОП В ПОБЕДНЫЕ ОЧКИ',
    nativeImg: 'assets/cards/card-45-lost-capital-paratroopers.webp',
    placeholderImg: 'assets/cards/placeholders/trick-17-paradrop-victory-points.svg'
  },
  {
    id: 'trick-39-destroyer-swarm',
    title: 'ДЕЛАТЬ ВЕСЬ ФЛОТ ТОЛЬКО ИЗ ТОРПЕДНЫХ ЭСМИНЦЕВ',
    nativeImg: 'assets/cards/card-10-fleet-sunk-one-battle.webp',
    placeholderImg: 'assets/cards/placeholders/trick-39-destroyer-swarm.svg'
  }
];

// Resolve active image based on centralized toggle
MECHANICS.forEach(card => {
  card.img = (USE_AI_PLACEHOLDER_GRAPHICS && card.placeholderImg) ? card.placeholderImg : card.nativeImg;
});
