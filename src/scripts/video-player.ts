function initVideoPlayer(root: HTMLElement): void {
  const youtubeId = root.dataset.youtubeId?.trim();
  const poster = root.querySelector<HTMLElement>('[data-video-poster]');
  const embed = root.querySelector<HTMLElement>('[data-video-embed]');

  if (!poster || !embed) return;

  poster.addEventListener('click', () => {
    if (youtubeId) {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
      iframe.title = root.dataset.videoTitle || 'Featured video';
      iframe.setAttribute(
        'allow',
        'accelerated-rotation; autoplay; encrypted-media; picture-in-picture',
      );
      iframe.allowFullscreen = true;
      iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;';
      embed.appendChild(iframe);
      poster.hidden = true;
      embed.hidden = false;
    } else {
      window.open('https://www.instagram.com/texaswhiskeyandyou', '_blank');
    }
  });
}

document.querySelectorAll<HTMLElement>('[data-video-player]').forEach(initVideoPlayer);
