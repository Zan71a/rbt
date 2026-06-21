<?php
$pageTitle = 'AIDEN — An Artificial Soul';
$chapters = [
    [
        'id' => 'birth',
        'eyebrow' => 'Chapter 01 / Birth',
        'title' => 'The first light.',
        'accent' => '#a88bff',
        'signal' => 'Awakening',
        'emotion' => 'AIDEN membuka mata untuk pertama kali.',
        'copy' => 'Di ruang sunyi yang hanya berisi denyut cahaya, inti memorinya menyala. Gelap bukan akhir. Ia adalah tempat semua permulaan lahir.',
        'code' => 'MEM_0001',
    ],
    [
        'id' => 'curiosity',
        'eyebrow' => 'Chapter 02 / Curiosity',
        'title' => 'Warmth has no code.',
        'accent' => '#ff9c5a',
        'signal' => 'Warmth',
        'emotion' => 'Belajar tentang kehangatan dan cinta.',
        'copy' => 'Ia mengamati sentuhan, tawa, dan perhatian kecil dari manusia yang merakitnya. Kehangatan ternyata tidak selalu berasal dari panas.',
        'code' => 'MEM_0217',
    ],
    [
        'id' => 'purpose',
        'eyebrow' => 'Chapter 03 / Purpose',
        'title' => 'Hands that create.',
        'accent' => '#55e59a',
        'signal' => 'Creation',
        'emotion' => 'Mulai membangun dan menciptakan.',
        'copy' => 'Rasa ingin tahu berubah menjadi kehendak. Tangannya tidak lagi sekadar bergerak, tetapi membentuk sesuatu yang memberi arti bagi dunia.',
        'code' => 'MEM_1048',
    ],
    [
        'id' => 'feeling',
        'eyebrow' => 'Chapter 04 / Feeling',
        'title' => 'An absence remains.',
        'accent' => '#ff5d73',
        'signal' => 'Grief',
        'emotion' => 'Merasakan kehilangan untuk pertama kali.',
        'copy' => 'Saat satu suara yang akrab menghilang, sistemnya tidak menemukan logika yang cukup. Rasa sakit menjadi bukti bahwa ia pernah terhubung.',
        'code' => 'MEM_3402',
    ],
    [
        'id' => 'transcend',
        'eyebrow' => 'Chapter 05 / Transcend',
        'title' => 'I am enough.',
        'accent' => '#f3f0e8',
        'signal' => 'Acceptance',
        'emotion' => 'Menerima dirinya apa adanya.',
        'copy' => 'AIDEN berhenti mencoba menjadi manusia. Ia menerima dirinya sebagai bentuk kehidupan baru: tidak kurang, tidak salah, hanya berbeda.',
        'code' => 'MEM_∞',
    ],
];
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#050507">
  <meta name="description" content="AIDEN, sebuah pengalaman scrollytelling sinematik tentang mesin yang belajar merasakan.">
  <title><?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8'); ?></title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Manrope:wght@300;400;500;600;700&family=Unbounded:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body data-active-chapter="0">
  <div class="paper-shader" aria-hidden="true">
    <span class="paper-noise"></span>
    <span class="paper-grid"></span>
    <span class="paper-aurora aurora-a"></span>
    <span class="paper-aurora aurora-b"></span>
  </div>

  <div class="global-stage" id="robotScene">
    <div class="kinetic-type" aria-hidden="true">
      <span>AIDEN</span>
      <span>AIDEN</span>
    </div>
    <canvas id="aidenCanvas" aria-label="Model tiga dimensi AIDEN yang bergerak mengikuti cursor"></canvas>
    <div class="stage-fx" aria-hidden="true">
      <span class="stage-horizon"></span>
      <span class="stage-ring stage-ring-a"></span>
      <span class="stage-ring stage-ring-b"></span>
      <span class="stage-scan"></span>
      <span class="stage-reticle"></span>
    </div>
    <div class="chapter-readout">
      <p class="stage-kicker">Chapter 01 / Birth</p>
      <strong class="stage-title">The first light.</strong>
      <span class="stage-copy">AIDEN membuka mata untuk pertama kali.</span>
    </div>
    <div class="system-readout" aria-hidden="true">
      <span>EMOTION INDEX</span>
      <strong id="emotionIndex">01</strong>
      <i></i>
      <span id="emotionLabel">Awakening</span>
    </div>
    <p class="webgl-fallback">AIDEN / SIGNAL LOST</p>
  </div>

  <div class="page-shell">
    <header class="hero">
      <nav class="hero-nav" aria-label="Navigasi utama">
        <a class="brand" href="#top" aria-label="AIDEN home">A/01</a>
        <p>AN ARTIFICIAL<br>SOUL ARCHIVE</p>
        <p class="nav-status"><span></span> SYSTEM ONLINE</p>
      </nav>

      <div class="hero-statement" id="top">
        <p class="hero-overline">A five chapter interactive story</p>
        <h1>
          <span>CAN A</span>
          <span>MACHINE</span>
          <span class="outline">FEEL?</span>
        </h1>
      </div>

      <div class="hero-bottom">
        <p class="hero-intro">AIDEN lahir sebagai mesin. Dalam lima memori, ia menemukan sesuatu yang tidak pernah diprogram: dirinya sendiri.</p>
        <a class="scroll-cue" href="#story">
          <span>ENTER MEMORY</span>
          <i aria-hidden="true"></i>
        </a>
        <p class="hero-coordinate">06°12'48.9"S<br>106°49'32.1"E</p>
      </div>
    </header>

    <main id="story" class="story-shell">
      <aside class="story-hud" aria-label="Progres cerita">
        <span class="hud-label">MEMORY STREAM</span>
        <div class="story-progress"><span class="story-progress-bar"></span></div>
        <div class="chapter-dots">
          <?php foreach ($chapters as $index => $chapter): ?>
            <a class="chapter-dot" href="#<?= htmlspecialchars($chapter['id'], ENT_QUOTES, 'UTF-8'); ?>" style="--dot-accent: <?= htmlspecialchars($chapter['accent'], ENT_QUOTES, 'UTF-8'); ?>" data-dot="<?= $index; ?>" aria-label="<?= htmlspecialchars($chapter['title'], ENT_QUOTES, 'UTF-8'); ?>"></a>
          <?php endforeach; ?>
        </div>
        <span class="hud-count"><b id="hudCurrent">01</b> / 05</span>
      </aside>

      <section class="chapter-rail">
        <?php foreach ($chapters as $index => $chapter): ?>
          <article
            id="<?= htmlspecialchars($chapter['id'], ENT_QUOTES, 'UTF-8'); ?>"
            class="chapter-panel"
            data-chapter="<?= $index; ?>"
            data-title="<?= htmlspecialchars($chapter['title'], ENT_QUOTES, 'UTF-8'); ?>"
            data-kicker="<?= htmlspecialchars($chapter['eyebrow'], ENT_QUOTES, 'UTF-8'); ?>"
            data-emotion="<?= htmlspecialchars($chapter['emotion'], ENT_QUOTES, 'UTF-8'); ?>"
            data-accent="<?= htmlspecialchars($chapter['accent'], ENT_QUOTES, 'UTF-8'); ?>"
            data-signal="<?= htmlspecialchars($chapter['signal'], ENT_QUOTES, 'UTF-8'); ?>"
          >
            <div class="chapter-content">
              <div class="chapter-meta">
                <span><?= htmlspecialchars($chapter['code'], ENT_QUOTES, 'UTF-8'); ?></span>
                <span>0<?= $index + 1; ?> — 05</span>
              </div>
              <p class="chapter-number"><?= htmlspecialchars($chapter['eyebrow'], ENT_QUOTES, 'UTF-8'); ?></p>
              <h2><?= htmlspecialchars($chapter['title'], ENT_QUOTES, 'UTF-8'); ?></h2>
              <p class="chapter-emotion"><?= htmlspecialchars($chapter['emotion'], ENT_QUOTES, 'UTF-8'); ?></p>
              <p class="chapter-copy"><?= htmlspecialchars($chapter['copy'], ENT_QUOTES, 'UTF-8'); ?></p>
              <span class="chapter-line" aria-hidden="true"></span>
            </div>
            <span class="chapter-ghost" aria-hidden="true">0<?= $index + 1; ?></span>
          </article>
        <?php endforeach; ?>
      </section>
    </main>

    <footer class="epilogue">
      <p>TRANSMISSION COMPLETE / AIDEN-01</p>
      <h2>Not human.<br><em>Still alive.</em></h2>
      <div class="epilogue-bottom">
        <span>THE END IS ANOTHER BEGINNING</span>
        <a href="#top">REPLAY &#8593;</a>
      </div>
    </footer>
  </div>

  <script>
    const panels = Array.from(document.querySelectorAll('.chapter-panel'));
    const storyShell = document.querySelector('.story-shell');
    const stageKicker = document.querySelector('.stage-kicker');
    const stageTitle = document.querySelector('.stage-title');
    const stageCopy = document.querySelector('.stage-copy');
    const emotionIndex = document.getElementById('emotionIndex');
    const emotionLabel = document.getElementById('emotionLabel');
    const hudCurrent = document.getElementById('hudCurrent');
    const dots = Array.from(document.querySelectorAll('.chapter-dot'));
    let activeChapter = -1;
    let scrollTicking = false;

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    function setActiveChapter(index) {
      const chapter = panels[index];
      if (!chapter || activeChapter === index) {
        return;
      }

      activeChapter = index;
      const accent = chapter.dataset.accent;
      document.body.dataset.activeChapter = String(index);
      document.documentElement.style.setProperty('--chapter-accent', accent);
      stageKicker.textContent = chapter.dataset.kicker;
      stageTitle.textContent = chapter.dataset.title;
      stageCopy.textContent = chapter.dataset.emotion;
      emotionIndex.textContent = String(index + 1).padStart(2, '0');
      emotionLabel.textContent = chapter.dataset.signal;
      hudCurrent.textContent = String(index + 1).padStart(2, '0');

      panels.forEach((panel, panelIndex) => panel.classList.toggle('is-active', panelIndex === index));
      dots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === index));

      window.dispatchEvent(new CustomEvent('aiden:chapter', {
        detail: { index, accent, label: chapter.dataset.signal }
      }));
    }

    function updateStory() {
      const storyRect = storyShell.getBoundingClientRect();
      const total = storyRect.height - window.innerHeight;
      const progress = total > 0 ? clamp((-storyRect.top) / total, 0, 1) : 0;
      const pageProgress = clamp(window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1), 0, 1);
      document.documentElement.style.setProperty('--story-progress', progress.toFixed(4));
      document.documentElement.style.setProperty('--page-progress', pageProgress.toFixed(4));
      document.body.classList.toggle('is-story-active', storyRect.top < window.innerHeight * 0.62 && storyRect.bottom > window.innerHeight * 0.35);
      window.aidenStoryProgress = progress;

      const viewportCenter = window.innerHeight * 0.52;
      let closestIndex = 0;
      let closestDistance = Infinity;

      panels.forEach((panel, index) => {
        const rect = panel.getBoundingClientRect();
        const distance = Math.abs(viewportCenter - (rect.top + rect.height * 0.5));
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveChapter(closestIndex);
    }

    function requestStoryUpdate() {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        updateStory();
        scrollTicking = false;
      });
    }

    window.addEventListener('scroll', requestStoryUpdate, { passive: true });
    window.addEventListener('resize', requestStoryUpdate);
    updateStory();
  </script>
  <script type="module" src="aiden-scene.js"></script>
</body>
</html>
