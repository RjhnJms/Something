
onload = () => {
  const c = setTimeout(() => {
    document.body.classList.remove("not-loaded");

    const titles = ('Happy Valentines Day Tin <3').split('')
    const titleElement = document.getElementById('title');
    let index = 0;

    function appendTitle() {
      if (index < titles.length) {
        titleElement.innerHTML += titles[index];
        index++;
        setTimeout(appendTitle, 300);
      }
    }

    appendTitle();

    clearTimeout(c);

    // --- Notes feature: clicking a flower opens a modal to add a custom note ---
    const modal = document.getElementById('note-modal');
    const noteText = document.getElementById('note-text');
    const noteSave = document.getElementById('note-save');
    const noteCancel = document.getElementById('note-cancel');
    const noteClose = document.getElementById('note-modal-close');
    let currentFlower = null;

    function openModal(flowerEl, idx) {
      // open edit modal (keeps textarea visible)
      currentFlower = { el: flowerEl, idx };
      const key = `flower-note-${idx}`;
      noteText.style.display = '';
      document.getElementById('note-edit-actions').style.display = 'flex';
      document.getElementById('note-view').style.display = 'none';
      noteText.value = localStorage.getItem(key) || '';
      document.getElementById('note-modal-title').textContent = `Edit note for flower #${idx}`;
      modal.setAttribute('aria-hidden', 'false');
      noteText.focus();
    }

    function openReadModal(flowerEl, idx) {
      // open read-only modal
      const key = `flower-note-${idx}`;
      const text = localStorage.getItem(key) || 'Hi Tin, I maybe late para mag-greet pero late is better than never BWAAHAHAHAHAHA. I just want to tell you lang nga Happy valenTINes day, stay as you are lang and stay safe always maldita ka daan HAHAHAHHAHA .';
      document.getElementById('note-text').style.display = 'none';
      document.getElementById('note-edit-actions').style.display = 'none';
      const view = document.getElementById('note-view');
      view.style.display = 'block';
      document.getElementById('note-view-text').textContent = text;
      document.getElementById('note-modal-title').textContent = `Note for flower #${idx}`;
      modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
      modal.setAttribute('aria-hidden', 'true');
      currentFlower = null;
    }

    function showFloatingNote(flowerEl, idx, text) {
      if (!text) {
        // remove existing if empty
        const existing = document.querySelector(`.flower-note[data-flower="${idx}"]`);
        if (existing) existing.remove();
        return;
      }
      let note = document.querySelector(`.flower-note[data-flower="${idx}"]`);
      if (!note) {
        note = document.createElement('div');
        note.className = 'flower-note';
        note.setAttribute('data-flower', idx);
        const closeBtn = document.createElement('button');
        closeBtn.className = 'flower-note__close';
        closeBtn.innerText = '×';
        closeBtn.addEventListener('click', () => {
          localStorage.removeItem(`flower-note-${idx}`);
          note.remove();
        });
        note.appendChild(closeBtn);
        const body = document.createElement('div');
        body.className = 'flower-note__body';
        note.appendChild(body);
        document.body.appendChild(note);
      }
      note.querySelector('.flower-note__body').textContent = text;

      // position near the flower element
      const rect = flowerEl.getBoundingClientRect();
      const left = rect.right + window.scrollX + 8; // to the right
      let top = rect.top + window.scrollY;
      // clamp inside viewport
      const maxTop = window.innerHeight - note.offsetHeight - 20;
      if (top > maxTop) top = maxTop;
      note.style.left = `${left}px`;
      note.style.top = `${top}px`;
    }

    // Attach click handlers to each flower
    const flowers = document.querySelectorAll('.flower');
    flowers.forEach((f, i) => {
      const idx = i + 1;
      f.style.cursor = 'pointer';
      f.addEventListener('click', (ev) => {
        ev.stopPropagation();
        openReadModal(f, idx);
      });

      // if there's an existing saved note, show it as floating summary
      const saved = localStorage.getItem(`flower-note-${idx}`);
      if (saved) showFloatingNote(f, idx, saved);
    });

    // modal actions
    noteSave.addEventListener('click', () => {
      if (!currentFlower) return closeModal();
      const key = `flower-note-${currentFlower.idx}`;
      const text = noteText.value.trim();
      if (text) localStorage.setItem(key, text);
      else localStorage.removeItem(key);
      showFloatingNote(currentFlower.el, currentFlower.idx, text);
      closeModal();
    });

    noteCancel.addEventListener('click', closeModal);
    noteClose.addEventListener('click', closeModal);
    // read-view close button
    const noteViewClose = document.getElementById('note-view-close');
    if (noteViewClose) noteViewClose.addEventListener('click', closeModal);

    // close modal when clicking the overlay
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // reposition notes on resize/scroll
    window.addEventListener('resize', () => {
      document.querySelectorAll('.flower-note').forEach(note => {
        const idx = note.getAttribute('data-flower');
        const flowerEl = document.querySelector(`.flower:nth-of-type(${idx})`);
        if (flowerEl) showFloatingNote(flowerEl, idx, localStorage.getItem(`flower-note-${idx}`));
      });
    });

    window.addEventListener('scroll', () => {
      document.querySelectorAll('.flower-note').forEach(note => {
        const idx = note.getAttribute('data-flower');
        const flowerEl = document.querySelector(`.flower:nth-of-type(${idx})`);
        if (flowerEl) showFloatingNote(flowerEl, idx, localStorage.getItem(`flower-note-${idx}`));
      });
    });

  }, 1000);
};