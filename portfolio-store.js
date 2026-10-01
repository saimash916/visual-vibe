(function () {
  const cursorStyle = document.createElement('style');
  cursorStyle.textContent = `
    .cursor-follower {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 9999;
      width: 28px;
      height: 28px;
      border: 1px solid rgba(184, 243, 107, 0.8);
      border-radius: 50%;
      background: rgba(184, 243, 107, 0.08);
      box-shadow: 0 0 12px rgba(184, 243, 107, 0.45), 0 0 30px rgba(184, 243, 107, 0.2);
      opacity: 0;
      pointer-events: none;
      transform: translate3d(var(--cursor-x, -50px), var(--cursor-y, -50px), 0) translate(-50%, -50%);
      transition: transform 100ms ease-out, opacity 150ms ease;
    }

    .cursor-follower::after {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #d5ff9e;
      box-shadow: 0 0 8px rgba(184, 243, 107, 0.9);
      content: '';
      transform: translate(-50%, -50%);
    }

    .cursor-follower.is-visible { opacity: 1; }

    @media (hover: hover) and (pointer: fine) {
      .cursor-follower { display: block; }
    }

    @media (prefers-reduced-motion: reduce) {
      .cursor-follower { transition: opacity 150ms ease; }
    }
  `;
  document.head.append(cursorStyle);

  const cursorFollower = document.createElement('div');
  cursorFollower.className = 'cursor-follower';
  cursorFollower.setAttribute('aria-hidden', 'true');
  document.body.append(cursorFollower);

  let cursorFrame = 0;
  let cursorX = 0;
  let cursorY = 0;
  document.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;

    cursorX = event.clientX;
    cursorY = event.clientY;
    cursorFollower.classList.add('is-visible');
    if (cursorFrame) return;

    cursorFrame = requestAnimationFrame(() => {
      cursorFollower.style.setProperty('--cursor-x', `${cursorX}px`);
      cursorFollower.style.setProperty('--cursor-y', `${cursorY}px`);
      cursorFrame = 0;
    });
  });

  const storageKey = 'visual-vibe-portfolio-v1';
  const contentStorageKey = 'visual-vibe-content-v1';
  const messagesStorageKey = 'visual-vibe-messages-v1';
  const analyticsStorageKey = 'visual-vibe-analytics-v1';
  const sessionStorageKey = 'visual-vibe-analytics-session-v1';
  const trackedProjectIds = new Set();
  const defaultContent = {
    backgroundImages: ['image_1000.jpg', 'image_1001.jpg', 'image_1002.jpg', 'image_1003.jpg'],
    services: [
      { icon: '🎨', title: 'Logo Design', description: 'Distinctive visual marks that represent your brand core.' },
      { icon: '🖼️', title: 'Poster Design', description: 'Eye-catching typography and striking art compositions.' },
      { icon: '📱', title: 'Social Media', description: 'High-impact visual campaigns tailored for digital growth.' },
      { icon: '✨', title: 'Brand Identity', description: 'Comprehensive visual language and system guidelines.' },
    ],
    featuredProjectIds: ['vv-1000', 'vv-1001', 'vv-1002', 'vv-1003'],
    aboutDescription: 'Visual Vibe is a creative studio founded by Saheem Ashraf. We specialize in transforming ideas into professional designs that communicate, inspire, and connect with audiences globally.',
    aboutSkills: ['Graphic Design', 'Branding', 'Visual Communication', 'Creative Direction'],
    aboutQuote: 'Design is not just about making things look good; it is about telling a story visually.',
    founderName: 'Saheem Ashraf',
  };
  const seedProjects = [
    { id: 'vv-1000', title: 'Expressive Sculpture Art', category: 'Poster Design', description: 'Creative typography and dramatic composition for a modern art-inspired campaign.', image: 'image_1000.jpg', status: 'Published', updated: 'Sep 28, 2026' },
    { id: 'vv-1001', title: 'Bold Quote Artwork', category: 'Branding', description: 'Minimal luxury direction with statement visuals for social and print media.', image: 'image_1001.jpg', status: 'Published', updated: 'Sep 26, 2026' },
    { id: 'vv-1002', title: 'Street Art Collage', category: 'Visual Identity', description: 'Urban energy meets creative storytelling through layered textures and motion.', image: 'image_1002.jpg', status: 'Published', updated: 'Sep 25, 2026' },
    { id: 'vv-1003', title: 'Conceptual Puzzle Design', category: 'Digital Illustration', description: 'Abstract visual language translating complex ideas into strong, memorable graphics.', image: 'image_1003.jpg', status: 'Published', updated: 'Sep 23, 2026' },
    { id: 'vv-1004', title: 'Modern Culture Drop', category: 'Campaign', description: 'Bold campaign styling built for visibility, engagement, and audience impact.', image: 'image_1000.jpg', status: 'Published', updated: 'Sep 20, 2026' },
    { id: 'vv-1005', title: 'Signature Design Story', category: 'Creative Direction', description: 'A full visual narrative that blends identity, emotion, and premium aesthetics.', image: 'image_1001.jpg', status: 'Published', updated: 'Sep 18, 2026' },
  ];

  function loadProjects() {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const projects = JSON.parse(saved);
        if (Array.isArray(projects)) return projects;
      }
    } catch (error) {
      console.warn('Portfolio storage is unavailable.', error);
    }
    return seedProjects.map((project) => ({ ...project }));
  }

  function saveProjects(projects) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(projects));
      return true;
    } catch (error) {
      console.error('Could not save portfolio projects.', error);
      alert('Could not save this project in browser storage. Try a smaller image or remove unused projects.');
      return false;
    }
  }

  function loadContent() {
    try {
      const saved = JSON.parse(localStorage.getItem(contentStorageKey) || 'null');
      if (saved && typeof saved === 'object') {
        return {
          ...defaultContent,
          ...saved,
          backgroundImages: Array.isArray(saved.backgroundImages) && saved.backgroundImages.length === 4 ? saved.backgroundImages : defaultContent.backgroundImages,
          services: Array.isArray(saved.services) ? saved.services : defaultContent.services,
          featuredProjectIds: Array.isArray(saved.featuredProjectIds) ? saved.featuredProjectIds : defaultContent.featuredProjectIds,
          aboutSkills: Array.isArray(saved.aboutSkills) ? saved.aboutSkills : defaultContent.aboutSkills,
        };
      }
    } catch (error) {
      console.warn('Portfolio content storage is unavailable.', error);
    }
    return JSON.parse(JSON.stringify(defaultContent));
  }

  function saveContent(content) {
    try {
      localStorage.setItem(contentStorageKey, JSON.stringify(content));
      return true;
    } catch (error) {
      console.error('Could not save portfolio content.', error);
      alert('Could not save site content in browser storage.');
      return false;
    }
  }

  function loadAnalytics() {
    try {
      const saved = JSON.parse(localStorage.getItem(analyticsStorageKey) || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      console.warn('Analytics storage is unavailable.', error);
      return [];
    }
  }

  function getAnalyticsSession() {
    try {
      let session = sessionStorage.getItem(sessionStorageKey);
      if (!session) {
        session = `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        sessionStorage.setItem(sessionStorageKey, session);
      }
      return session;
    } catch (error) {
      return `session-${Date.now()}`;
    }
  }

  function getTrafficSource() {
    try {
      const savedSource = sessionStorage.getItem(`${sessionStorageKey}-source`);
      if (savedSource) return savedSource;

      const taggedSource = new URLSearchParams(window.location.search).get('utm_source');
      const referrer = document.referrer ? new URL(document.referrer) : null;
      const host = (taggedSource || referrer?.hostname || '').toLowerCase();
      let source = 'Direct';
      if (/instagram/.test(host)) source = 'Instagram';
      else if (/behance/.test(host)) source = 'Behance';
      else if (/google|bing|yahoo|duckduckgo/.test(host)) source = 'Search';
      else if (taggedSource || (referrer && referrer.host !== window.location.host)) source = 'Other';
      sessionStorage.setItem(`${sessionStorageKey}-source`, source);
      return source;
    } catch (error) {
      return 'Direct';
    }
  }

  function trackAnalyticsEvent(type, details = {}) {
    const events = loadAnalytics();
    events.push({
      type,
      at: new Date().toISOString(),
      session: getAnalyticsSession(),
      ...(type === 'visit' ? { source: getTrafficSource() } : {}),
      ...details,
    });
    try {
      localStorage.setItem(analyticsStorageKey, JSON.stringify(events.slice(-5000)));
    } catch (error) {
      console.warn('Could not save analytics event.', error);
    }
  }

  function trackProjectView(project, element) {
    if (trackedProjectIds.has(project.id)) return;
    const recordView = () => {
      if (trackedProjectIds.has(project.id)) return;
      trackedProjectIds.add(project.id);
      trackAnalyticsEvent('project-view', { projectId: project.id });
    };
    if (!('IntersectionObserver' in window)) {
      recordView();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        recordView();
      }
    }, { threshold: 0.5 });
    observer.observe(element);
  }

  window.VisualVibeAnalytics = {
    trackInquiry() {
      trackAnalyticsEvent('inquiry');
    },
  };

  function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(date);
  }

  async function prepareImage(file, maxBytes = 500 * 1024) {
    if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.');

    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    let scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    let blob;

    for (let attempt = 0; attempt < 8; attempt += 1) {
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext('2d');
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', Math.max(0.5, 0.82 - attempt * 0.06)));
      if (!blob) {
        bitmap.close();
        throw new Error('This image could not be processed.');
      }
      if (blob.size <= maxBytes || scale <= 0.25) break;
      if (attempt >= 3) scale *= 0.8;
    }

    bitmap.close();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  function renderDashboard() {
    const rows = document.querySelector('#project-rows');
    if (!rows) return;

    const messageList = document.querySelector('#message-list');
    const messageCount = document.querySelector('#message-count');

    function paintAnalytics() {
      const events = loadAnalytics();
      const visits = events.filter((event) => event.type === 'visit');
      const now = new Date();
      const selectedDays = Number(document.querySelector('#analytics-range').value);
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const firstDay = new Date(today);
      firstDay.setDate(firstDay.getDate() - selectedDays + 1);
      const dates = Array.from({ length: selectedDays }, (_, index) => {
        const date = new Date(firstDay);
        date.setDate(firstDay.getDate() + index);
        return date;
      });
      const dateKey = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      const countsByDate = new Map(dates.map((date) => [dateKey(date), 0]));
      const rangeVisits = visits.filter((event) => {
        const date = new Date(event.at);
        if (Number.isNaN(date.getTime()) || date < firstDay || date >= new Date(today.getTime() + 86400000)) return false;
        const key = dateKey(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
        countsByDate.set(key, (countsByDate.get(key) || 0) + 1);
        return true;
      });

      document.querySelector('#portfolio-views').textContent = visits.length.toLocaleString();
      const currentMonth = visits.filter((event) => {
        const date = new Date(event.at);
        return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
      }).length;
      const previousMonth = visits.filter((event) => {
        const date = new Date(event.at);
        const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return date.getFullYear() === previous.getFullYear() && date.getMonth() === previous.getMonth();
      }).length;
      const viewsTrend = document.querySelector('#portfolio-views-trend');
      viewsTrend.textContent = previousMonth ? `${currentMonth >= previousMonth ? '+' : ''}${currentMonth - previousMonth} vs. last month` : 'No prior-month data';

      document.querySelector('#range-views').textContent = rangeVisits.length.toLocaleString();
      document.querySelector('#range-label').textContent = `visits in ${selectedDays} days`;
      const values = dates.map((date) => countsByDate.get(dateKey(date)) || 0);
      const maxValue = Math.max(1, ...values);
      const points = values.map((value, index) => ({
        x: values.length === 1 ? 320 : 10 + (620 * index) / (values.length - 1),
        y: 146 - (value / maxValue) * 126,
      }));
      const linePath = points.map((point, index) => `${index ? 'L' : 'M'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ');
      document.querySelector('#chart-line').setAttribute('d', linePath);
      document.querySelector('#chart-fill').setAttribute('d', `${linePath} L${points.at(-1).x.toFixed(1)} 150 L${points[0].x.toFixed(1)} 150 Z`);
      const chartPoints = document.querySelector('#chart-points');
      chartPoints.replaceChildren();
      points.forEach((point) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('class', 'chart-point');
        circle.setAttribute('cx', point.x);
        circle.setAttribute('cy', point.y);
        circle.setAttribute('r', '3.5');
        chartPoints.append(circle);
      });
      const labelCount = Math.min(7, dates.length);
      const labels = document.querySelector('#chart-labels');
      labels.replaceChildren();
      for (let index = 0; index < labelCount; index += 1) {
        const date = dates[Math.round(index * (dates.length - 1) / Math.max(1, labelCount - 1))];
        const label = document.createElement('span');
        label.textContent = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
        labels.append(label);
      }

      const sourceCounts = new Map();
      rangeVisits.forEach((event) => sourceCounts.set(event.source || 'Direct', (sourceCounts.get(event.source || 'Direct') || 0) + 1));
      const trafficList = document.querySelector('#traffic-sources');
      trafficList.replaceChildren();
      if (!sourceCounts.size) {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.textContent = 'No visits recorded in this date range.';
        trafficList.append(empty);
      } else {
        [...sourceCounts].sort((left, right) => right[1] - left[1]).forEach(([source, count]) => {
          const row = document.createElement('div');
          row.className = 'traffic-row';
          const label = document.createElement('div');
          label.className = 'traffic-label';
          const dot = document.createElement('span');
          dot.className = 'traffic-dot';
          label.append(dot, document.createTextNode(source));
          const total = document.createElement('span');
          total.className = 'traffic-count';
          total.textContent = count.toLocaleString();
          const percentage = document.createElement('span');
          percentage.className = 'traffic-change';
          percentage.textContent = `${Math.round((count / rangeVisits.length) * 100)}%`;
          row.append(label, total, percentage);
          trafficList.append(row);
        });
      }

      const sessionVisits = new Map();
      visits.forEach((event) => sessionVisits.set(event.session, (sessionVisits.get(event.session) || 0) + 1));
      const engagedSessions = new Set(events.filter((event) => event.type === 'inquiry').map((event) => event.session));
      sessionVisits.forEach((count, session) => { if (count > 1) engagedSessions.add(session); });
      const engagement = sessionVisits.size ? Math.round((engagedSessions.size / sessionVisits.size) * 100) : 0;
      document.querySelector('#engagement-rate').textContent = `${engagement}%`;
      document.querySelector('#engagement-foot').textContent = `${engagedSessions.size} engaged of ${sessionVisits.size} visits`;

      const messages = loadMessages();
      document.querySelector('#client-inquiries').textContent = messages.length.toLocaleString();
      const thisMonthMessages = messages.filter((message) => {
        const date = new Date(message.received);
        return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
      }).length;
      document.querySelector('#inquiries-trend').textContent = `${thisMonthMessages} this month`;
    }

    function loadMessages() {
      try {
        const messages = JSON.parse(localStorage.getItem(messagesStorageKey) || '[]');
        return Array.isArray(messages) ? messages : [];
      } catch (error) {
        return [];
      }
    }

    function paintMessages() {
      let messages = [];
      try {
        const saved = JSON.parse(localStorage.getItem(messagesStorageKey) || '[]');
        if (Array.isArray(saved)) messages = saved;
      } catch (error) {
        console.warn('Messages storage is unavailable.', error);
      }

      messageCount.textContent = String(messages.length);
      messageList.replaceChildren();
      if (!messages.length) {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.textContent = 'No messages yet.';
        messageList.append(empty);
        return;
      }

      messages.forEach((message) => {
        const item = document.createElement('article');
        item.className = 'traffic-row';
        item.style.gridTemplateColumns = 'minmax(0, 1fr) auto';
        item.style.padding = '13px 0';
        const details = document.createElement('div');
        const sender = document.createElement('strong');
        sender.textContent = `${message.name} - ${message.topic}`;
        const email = document.createElement('a');
        email.href = `mailto:${encodeURIComponent(message.email)}`;
        email.textContent = message.email;
        email.style.display = 'block';
        email.style.color = 'var(--green)';
        email.style.fontSize = '10px';
        const body = document.createElement('p');
        body.textContent = message.message;
        body.style.margin = '8px 0 0';
        body.style.color = 'var(--muted)';
        body.style.whiteSpace = 'pre-wrap';
        body.style.overflowWrap = 'anywhere';
        const reply = document.createElement('div');
        reply.className = 'message-reply';
        const replyBody = document.createElement('textarea');
        replyBody.placeholder = `Write a reply to ${message.name}...`;
        replyBody.setAttribute('aria-label', `Reply to ${message.name}`);
        const replyActions = document.createElement('div');
        replyActions.className = 'message-reply-actions';
        const gmailReply = document.createElement('a');
        gmailReply.className = 'message-reply-link';
        gmailReply.target = '_blank';
        gmailReply.rel = 'noopener noreferrer';
        gmailReply.textContent = 'Reply in Gmail';
        const mailAppReply = document.createElement('a');
        mailAppReply.className = 'message-reply-link message-reply-fallback';
        mailAppReply.textContent = 'Other email app';
        function updateReplyLinks() {
          const subject = `Re: ${message.topic}`;
          const quotedMessage = `\n\nOn ${new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(message.received))}, ${message.name} wrote:\n> ${message.message.replace(/\n/g, '\n> ')}`;
          const replyText = `${replyBody.value.trim()}${quotedMessage}`;
          const parameters = new URLSearchParams({ authuser: 'saheemashraf916@gmail.com', view: 'cm', fs: '1', to: message.email, su: subject, body: replyText });
          gmailReply.href = `https://mail.google.com/mail/?${parameters.toString()}`;
          mailAppReply.href = `mailto:${encodeURIComponent(message.email)}?${new URLSearchParams({ subject, body: replyText }).toString()}`;
        }
        replyBody.addEventListener('input', updateReplyLinks);
        updateReplyLinks();
        replyActions.append(gmailReply, mailAppReply);
        reply.append(replyBody, replyActions);
        const received = document.createElement('div');
        received.className = 'panel-subtitle';
        received.textContent = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(message.received));
        details.append(sender, email, body, reply, received);

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'publish-toggle is-published';
        remove.textContent = 'Delete';
        remove.setAttribute('aria-label', `Delete message from ${message.name}`);
        remove.addEventListener('click', () => {
          const remaining = messages.filter((item) => item.id !== message.id);
          try {
            localStorage.setItem(messagesStorageKey, JSON.stringify(remaining));
            paintMessages();
            paintAnalytics();
          } catch (error) {
            alert('Could not delete this message from browser storage.');
          }
        });
        item.append(details, remove);
        messageList.append(item);
      });
    }

    const searchInput = document.querySelector('#project-search');
    const resultCount = document.querySelector('#results-count');
    const activeProjects = document.querySelector('#active-projects');
    const projectCount = document.querySelector('#project-count');
    let projects = loadProjects();
    let content = loadContent();
    let backgroundFiles = Array(4).fill(null);
    let activeFilter = 'all';

    function paintContentProjectOptions() {
      const options = document.querySelector('#featured-projects');
      if (!options) return;
      options.replaceChildren();
      const publishedProjects = projects.filter((project) => project.status === 'Published');
      if (!publishedProjects.length) {
        const empty = document.createElement('p');
        empty.className = 'panel-subtitle';
        empty.textContent = 'Publish a project to feature it on the homepage.';
        options.append(empty);
        return;
      }

      publishedProjects.forEach((project) => {
        const label = document.createElement('label');
        label.className = 'feature-option';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = project.id;
        checkbox.checked = content.featuredProjectIds.includes(project.id);
        const details = document.createElement('span');
        details.textContent = `${project.title} · ${project.category}`;
        label.append(checkbox, details);
        options.append(label);
      });
    }

    function paintServiceEditor() {
      const editor = document.querySelector('#service-editor');
      if (!editor) return;
      editor.replaceChildren();
      content.services.forEach((service, index) => {
        const row = document.createElement('div');
        row.className = 'service-edit-row';
        [
          { key: 'icon', label: 'Icon', value: service.icon, maxLength: 8 },
          { key: 'title', label: 'Service name', value: service.title, maxLength: 50 },
          { key: 'description', label: 'Description', value: service.description, maxLength: 160 },
        ].forEach((field) => {
          const label = document.createElement('label');
          label.className = 'form-field';
          label.textContent = field.label;
          const input = document.createElement(field.key === 'description' ? 'textarea' : 'input');
          input.name = `service-${field.key}-${index}`;
          input.value = field.value;
          input.maxLength = field.maxLength;
          input.required = true;
          label.append(input);
          row.append(label);
        });
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'row-menu';
        remove.textContent = '×';
        remove.setAttribute('aria-label', `Remove ${service.title}`);
        remove.addEventListener('click', () => {
          content.services.splice(index, 1);
          paintServiceEditor();
        });
        row.append(remove);
        editor.append(row);
      });
    }

    function paintContentEditor() {
      paintServiceEditor();
      paintContentProjectOptions();
      const backgroundEditor = document.querySelector('#background-editor');
      backgroundEditor.replaceChildren();
      content.backgroundImages.forEach((imageSource, index) => {
        const label = document.createElement('label');
        label.className = 'background-option form-field';
        const title = document.createElement('span');
        title.textContent = `Background image ${index + 1}`;
        const preview = document.createElement('img');
        preview.src = imageSource;
        preview.alt = '';
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.setAttribute('aria-label', `Choose background image ${index + 1}`);
        input.addEventListener('change', () => {
          backgroundFiles[index] = input.files[0] || null;
          if (backgroundFiles[index]) preview.src = URL.createObjectURL(backgroundFiles[index]);
        });
        label.append(title, preview, input);
        backgroundEditor.append(label);
      });
      document.querySelector('#about-description').value = content.aboutDescription;
      document.querySelector('#about-skills').value = content.aboutSkills.join(', ');
      document.querySelector('#about-quote').value = content.aboutQuote;
      document.querySelector('#founder-name').value = content.founderName;
    }

    document.querySelector('#add-service').addEventListener('click', () => {
      content.services.push({ icon: '✦', title: '', description: '' });
      paintServiceEditor();
    });

    async function saveContentSection(section, event) {
      const saveButton = event.currentTarget;
      const status = saveButton.closest('.editor-section').querySelector('.section-save-status');
      const nextContent = loadContent();

      if (section === 'services') {
        nextContent.services = content.services.map((service, index) => ({
          icon: document.querySelector(`[name="service-icon-${index}"]`).value.trim(),
          title: document.querySelector(`[name="service-title-${index}"]`).value.trim(),
          description: document.querySelector(`[name="service-description-${index}"]`).value.trim(),
        }));
        if (nextContent.services.some((service) => !service.icon || !service.title || !service.description)) {
          alert('Complete each service or remove the empty row before saving.');
          return;
        }
      } else if (section === 'featured') {
        nextContent.featuredProjectIds = [...document.querySelectorAll('#featured-projects input:checked')].map((checkbox) => checkbox.value);
      } else if (section === 'about') {
        nextContent.aboutDescription = document.querySelector('#about-description').value.trim();
        nextContent.aboutSkills = document.querySelector('#about-skills').value.split(',').map((skill) => skill.trim()).filter(Boolean);
        nextContent.aboutQuote = document.querySelector('#about-quote').value.trim();
        nextContent.founderName = document.querySelector('#founder-name').value.trim();
        if (!nextContent.aboutDescription || !nextContent.aboutQuote || !nextContent.founderName) {
          alert('Complete the About text, quote, and founder name before saving.');
          return;
        }
      } else if (section === 'backgrounds') {
        nextContent.backgroundImages = [...content.backgroundImages];
        saveButton.disabled = true;
        try {
          nextContent.backgroundImages = await Promise.all(nextContent.backgroundImages.map(async (image, index) => (
            backgroundFiles[index] ? await prepareImage(backgroundFiles[index], 220 * 1024) : image
          )));
        } catch (error) {
          alert(error.message || 'A background image could not be processed.');
          saveButton.disabled = false;
          return;
        }
      }

      if (saveContent(nextContent)) {
        content = nextContent;
        if (section === 'backgrounds') {
          backgroundFiles = Array(4).fill(null);
          document.querySelectorAll('#background-editor img').forEach((preview, index) => {
            preview.src = content.backgroundImages[index];
          });
        }
        status.textContent = 'Changes saved';
        window.setTimeout(() => { status.textContent = ''; }, 3000);
      }
      saveButton.disabled = false;
    }

    document.querySelector('#save-services').addEventListener('click', (event) => saveContentSection('services', event));
    document.querySelector('#save-featured').addEventListener('click', (event) => saveContentSection('featured', event));
    document.querySelector('#save-backgrounds').addEventListener('click', (event) => saveContentSection('backgrounds', event));
    document.querySelector('#save-about').addEventListener('click', (event) => saveContentSection('about', event));

    function restoreContentSection(section, event) {
      const nextContent = loadContent();
      if (section === 'services') nextContent.services = JSON.parse(JSON.stringify(defaultContent.services));
      if (section === 'featured') nextContent.featuredProjectIds = [...defaultContent.featuredProjectIds];
      if (section === 'backgrounds') nextContent.backgroundImages = [...defaultContent.backgroundImages];
      if (section === 'about') {
        nextContent.aboutDescription = defaultContent.aboutDescription;
        nextContent.aboutSkills = [...defaultContent.aboutSkills];
        nextContent.aboutQuote = defaultContent.aboutQuote;
        nextContent.founderName = defaultContent.founderName;
      }
      if (!saveContent(nextContent)) return;

      content = nextContent;
      if (section === 'services') paintServiceEditor();
      if (section === 'featured') paintContentProjectOptions();
      if (section === 'backgrounds') {
        backgroundFiles = Array(4).fill(null);
        document.querySelectorAll('#background-editor input[type="file"]').forEach((input) => { input.value = ''; });
        document.querySelectorAll('#background-editor img').forEach((preview, index) => {
          preview.src = content.backgroundImages[index];
        });
      }
      if (section === 'about') {
        document.querySelector('#about-description').value = content.aboutDescription;
        document.querySelector('#about-skills').value = content.aboutSkills.join(', ');
        document.querySelector('#about-quote').value = content.aboutQuote;
        document.querySelector('#founder-name').value = content.founderName;
      }
      const status = event.currentTarget.closest('.editor-section').querySelector('.section-save-status');
      status.textContent = 'Defaults restored';
      window.setTimeout(() => { status.textContent = ''; }, 3000);
    }

    document.querySelector('#restore-services').addEventListener('click', (event) => restoreContentSection('services', event));
    document.querySelector('#restore-featured').addEventListener('click', (event) => restoreContentSection('featured', event));
    document.querySelector('#restore-backgrounds').addEventListener('click', (event) => restoreContentSection('backgrounds', event));
    document.querySelector('#restore-about').addEventListener('click', (event) => restoreContentSection('about', event));

    document.querySelector('#restore-projects').addEventListener('click', () => {
      if (!window.confirm('Restore the original sample projects? Current projects will be replaced.')) return;
      const defaults = seedProjects.map((project) => ({ ...project }));
      if (saveProjects(defaults)) {
        projects = defaults;
        paintRows();
      }
    });

    function paintRows() {
      const query = searchInput.value.trim().toLowerCase();
      const filtered = projects.filter((project) => {
        const statusMatches = activeFilter === 'all' || project.status === activeFilter;
        const queryMatches = !query || `${project.title} ${project.category}`.toLowerCase().includes(query);
        return statusMatches && queryMatches;
      });

      rows.replaceChildren();
      filtered.forEach((project) => {
        const row = document.createElement('tr');
        const imageCell = document.createElement('td');
        const projectCell = document.createElement('div');
        const image = document.createElement(project.image ? 'img' : 'span');
        image.className = 'project-thumb';
        if (project.image) {
          image.src = project.image;
          image.alt = '';
        } else {
          image.setAttribute('aria-hidden', 'true');
        }
        const details = document.createElement('span');
        const name = document.createElement('span');
        name.className = 'project-name';
        name.textContent = project.title;
        const category = document.createElement('span');
        category.className = 'project-type';
        category.textContent = project.category;
        details.append(name, category);
        projectCell.className = 'project-cell';
        projectCell.append(image, details);
        imageCell.append(projectCell);

        const statusCell = document.createElement('td');
        const status = document.createElement('span');
        status.className = `status${project.status === 'Draft' ? ' draft' : project.status === 'In review' ? ' review' : ''}`;
        status.textContent = project.status;
        statusCell.append(status);

        const updatedCell = document.createElement('td');
        updatedCell.textContent = project.updated;
          const viewsCell = document.createElement('td');
          const projectViews = loadAnalytics().filter((event) => event.type === 'project-view' && event.projectId === project.id).length;
          viewsCell.textContent = project.status === 'Published' ? projectViews.toLocaleString() : '—';
        const ownerCell = document.createElement('td');
        ownerCell.textContent = 'Saheem Ashraf';
        const actionCell = document.createElement('td');
        const action = document.createElement('button');
        action.type = 'button';
        action.className = `publish-toggle${project.status === 'Published' ? ' is-published' : ''}`;
        action.textContent = project.status === 'Published' ? 'Unpublish' : 'Publish';
        action.setAttribute('aria-label', `${action.textContent} ${project.title}`);
        action.addEventListener('click', () => {
          const nextStatus = project.status === 'Published' ? 'Draft' : 'Published';
          projects = projects.map((item) => item.id === project.id ? { ...item, status: nextStatus, updated: formatDate(new Date()) } : item);
          if (saveProjects(projects)) paintRows();
        });
        actionCell.append(action);
        row.append(imageCell, statusCell, updatedCell, viewsCell, ownerCell, actionCell);
        rows.append(row);
      });

      resultCount.textContent = `Showing ${filtered.length} ${filtered.length === 1 ? 'project' : 'projects'}`;
      const active = projects.filter((project) => project.status !== 'Draft');
      activeProjects.textContent = String(active.length).padStart(2, '0');
      document.querySelector('#active-projects-foot').textContent = `${active.filter((project) => project.status === 'Published').length} published`;
      document.querySelector('#project-categories').textContent = String(new Set(active.map((project) => project.category).filter(Boolean)).size);
      projectCount.textContent = String(projects.length).padStart(2, '0');
      document.querySelector('#dashboard-date').textContent = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date());
      paintAnalytics();
      paintContentProjectOptions();
      document.querySelector('.empty-state')?.remove();
      if (!filtered.length) {
        const empty = document.createElement('tr');
        empty.className = 'empty-state';
        empty.innerHTML = '<td colspan="6">No projects match this view.</td>';
        rows.append(empty);
      }
    }

    document.querySelector('#analytics-range').addEventListener('change', paintAnalytics);
    document.querySelectorAll('.filter-tab').forEach((tab) => tab.addEventListener('click', () => {
      document.querySelector('.filter-tab.active')?.classList.remove('active');
      tab.classList.add('active');
      activeFilter = tab.dataset.filter;
      paintRows();
    }));
    searchInput.addEventListener('input', paintRows);

    const dialog = document.querySelector('#project-dialog');
    const form = document.querySelector('#project-form');
    document.querySelector('#add-project').addEventListener('click', () => dialog.showModal());
    document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
    document.querySelector('#cancel-dialog').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const file = data.get('image');
      const website = data.get('website').trim();
      if (website) {
        try {
          const parsedWebsite = new URL(website);
          if (!['http:', 'https:'].includes(parsedWebsite.protocol)) throw new Error('Invalid protocol');
        } catch (error) {
          alert('Enter a website address that starts with http:// or https://.');
          return;
        }
      }
      let image = '';
      if (file instanceof File && file.size) {
        try {
          image = await prepareImage(file);
        } catch (error) {
          alert(error.message || 'This image could not be processed.');
          return;
        }
      }

      const project = {
        id: `vv-${Date.now()}`,
        title: data.get('name').trim(),
        category: data.get('category').trim(),
        description: data.get('description').trim(),
        website,
        image,
        status: data.get('status'),
        updated: formatDate(new Date()),
      };
      const nextProjects = [project, ...projects];
      if (!saveProjects(nextProjects)) return;
      projects = nextProjects;
      form.reset();
      dialog.close();
      document.querySelector('.filter-tab.active')?.classList.remove('active');
      document.querySelector('[data-filter="all"]').classList.add('active');
      activeFilter = 'all';
      searchInput.value = '';
      paintRows();
    });

    document.querySelector('#export-button').addEventListener('click', () => {
      const csvRows = [['Project', 'Category', 'Description', 'Status', 'Last updated', 'Views'], ...projects.map((project) => [project.title, project.category, project.description, project.status, project.updated, loadAnalytics().filter((event) => event.type === 'project-view' && event.projectId === project.id).length])];
      const csv = csvRows.map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
      const link = document.createElement('a');
      link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      link.download = 'visual-vibe-projects.csv';
      link.click();
      URL.revokeObjectURL(link.href);
    });

    window.addEventListener('storage', (event) => {
      if (event.key === storageKey) {
        projects = loadProjects();
        paintRows();
      }
      if (event.key === messagesStorageKey) {
        paintMessages();
        paintAnalytics();
      }
      if (event.key === analyticsStorageKey) {
        paintAnalytics();
        paintRows();
      }
      if (event.key === contentStorageKey) {
        content = loadContent();
        paintContentEditor();
      }
    });
    paintContentEditor();
    paintRows();
    paintMessages();
  }

  function renderPortfolio() {
    const grid = document.querySelector('.works-grid');
    if (!grid) return;

    function paintPortfolio() {
      const projects = loadProjects().filter((project) => project.status === 'Published');
      grid.replaceChildren();
      projects.forEach((project) => {
        const card = document.createElement('article');
        card.className = 'work-card';
        if (project.image) {
          const image = document.createElement('img');
          image.src = project.image;
          image.alt = project.title;
          card.append(image);
        }
        const info = document.createElement('div');
        info.className = 'work-info';
        const tag = document.createElement('div');
        tag.className = 'work-tag';
        tag.textContent = project.category;
        const title = document.createElement('h3');
        title.textContent = project.title;
        const description = document.createElement('p');
        description.textContent = project.description;
        info.append(tag, title, description);
        if (project.website) {
          try {
            const website = new URL(project.website);
            if (['http:', 'https:'].includes(website.protocol)) {
              const link = document.createElement('a');
              link.className = 'work-website-link';
              link.href = website.href;
              link.target = '_blank';
              link.rel = 'noopener noreferrer';
              link.textContent = 'View website';
              info.append(link);
            }
          } catch {}
        }
        card.append(info);
        grid.append(card);
        trackProjectView(project, card);
      });
      const projectTotal = document.querySelector('[data-portfolio-count]');
      if (projectTotal) projectTotal.textContent = String(projects.length).padStart(2, '0');
      const identityTotal = document.querySelector('[data-identity-count]');
      if (identityTotal) identityTotal.textContent = String(projects.filter((project) => /brand|identity/i.test(project.category)).length).padStart(2, '0');
      const posterTotal = document.querySelector('[data-poster-count]');
      if (posterTotal) posterTotal.textContent = String(projects.filter((project) => /poster/i.test(project.category)).length).padStart(2, '0');
    }

    window.addEventListener('storage', (event) => {
      if (event.key === storageKey) paintPortfolio();
    });
    paintPortfolio();
  }

  function renderHomepage() {
    const servicesGrid = document.querySelector('.services-grid');
    const featuredGrid = document.querySelector('.portfolio-grid');
    if (!servicesGrid || !featuredGrid) return;

    function paintHomepage() {
      const content = loadContent();
      const projects = loadProjects();
      servicesGrid.replaceChildren();
      content.services.forEach((service) => {
        const card = document.createElement('article');
        card.className = 'service-card';
        const title = document.createElement('h3');
        title.textContent = `${service.icon} ${service.title}`;
        const description = document.createElement('p');
        description.textContent = service.description;
        card.append(title, description);
        servicesGrid.append(card);
      });

      featuredGrid.replaceChildren();
      content.featuredProjectIds
        .map((id) => projects.find((project) => project.id === id && project.status === 'Published'))
        .filter(Boolean)
        .forEach((project, index) => {
          const card = document.createElement('article');
          card.className = 'portfolio-card';
          if (project.image) {
            const image = document.createElement('img');
            image.src = project.image;
            image.alt = project.title;
            image.className = 'portfolio-img';
            card.append(image);
          }
          const info = document.createElement('div');
          info.className = 'portfolio-info';
          const title = document.createElement('h4');
          title.textContent = `${String(index + 1).padStart(2, '0')} — ${project.title}`;
          const description = document.createElement('p');
          description.textContent = project.category;
          info.append(title, description);
          card.append(info);
          featuredGrid.append(card);
          trackProjectView(project, card);
        });

      const aboutDescription = document.querySelector('[data-about-description]');
      if (aboutDescription) aboutDescription.textContent = content.aboutDescription;
      const aboutQuote = document.querySelector('[data-about-quote]');
      if (aboutQuote) aboutQuote.textContent = `“${content.aboutQuote}”`;
      const founderName = document.querySelector('[data-founder-name]');
      if (founderName) founderName.textContent = `— ${content.founderName}, Founder`;
      const skills = document.querySelector('[data-about-skills]');
      if (skills) {
        skills.replaceChildren();
        content.aboutSkills.forEach((skill) => {
          const tag = document.createElement('span');
          tag.className = 'skill-tag';
          tag.textContent = skill;
          skills.append(tag);
        });
      }
    }

    window.addEventListener('storage', (event) => {
      if (event.key === storageKey || event.key === contentStorageKey) paintHomepage();
    });
    paintHomepage();
  }

  function renderBackground() {
    const tiles = [...document.querySelectorAll('.mosaic-tile')];
    if (!tiles.length) return;

    function paintBackground() {
      const images = loadContent().backgroundImages;
      tiles.forEach((tile, index) => {
        const image = images[index % images.length];
        tile.style.backgroundImage = `url("${image}")`;
      });
    }

    window.addEventListener('storage', (event) => {
      if (event.key === contentStorageKey) paintBackground();
    });
    paintBackground();
  }

  renderDashboard();
  renderPortfolio();
  renderHomepage();
  renderBackground();
  if (!document.querySelector('#project-rows')) trackAnalyticsEvent('visit', { page: document.title });
})();