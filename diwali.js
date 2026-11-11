 // ---------- Fireworks ----------
      const canvas = document.getElementById("fireworks");
      const ctx = canvas.getContext("2d");
      const colors = ["#f7c548", "#ff7a1a", "#e0457b", "#fff3dc", "#3fb6a8", "#b388ff"];
      let rockets = [], particles = [];
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      function resize() {
        canvas.width = window.innerWidth * devicePixelRatio;
        canvas.height = window.innerHeight * devicePixelRatio;
        ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      }

      window.addEventListener("resize", resize);
      resize();

      function launch(targetX, targetY) {
        const w = window.innerWidth,
          h = window.innerHeight;
        const x = targetX ?? w * (0.15 + Math.random() * 0.7);
        const y = targetY ?? h * (0.1 + Math.random() * 0.35);

        rockets.push({
          x,
          y: h,
          tx: x,
          ty: y,
          speed: 8 + Math.random() * 4,
          color: colors[(Math.random() * colors.length) | 0],
        });
      }

      function explode(x, y, color) {
        const count = 70 + Math.random() * 40;
        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 * i) / count;
          const speed = 1.5 + Math.random() * 4;
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            decay: 0.012 + Math.random() * 0.012,
            color: Math.random() < 0.3 ? colors[(Math.random() * colors.length) | 0] : color,
            size: 1.5 + Math.random() * 1.5,
          });
        }
      }

      function animate() {
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0,0,0,0.22)";
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.globalCompositeOperation = "lighter";

        rockets = rockets.filter((r) => {
          r.y -= r.speed;
          ctx.beginPath();
          ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = r.color;
          ctx.fill();

          if (r.y <= r.ty) {
            explode(r.x, r.y, r.color);
            return false;
          }
          return true;
        });

        particles = particles.filter((p) => {
          p.vx *= 0.98;
          p.vy = p.vy * 0.98 + 0.05;
          p.x += p.vx;
          p.y += p.vy;
          p.life -= p.decay;
          ctx.globalAlpha = Math.max(p.life, 0);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.globalAlpha = 1;
          return p.life > 0;
        });

        requestAnimationFrame(animate);
      }

      if (!reduceMotion) {
        animate();
        setInterval(() => {
          if (!document.hidden && Math.random() < 0.7) launch();
        }, 1400);
      }

      document.addEventListener("click", (e) => {
        if (reduceMotion || e.target.closest("a, button, input, form")) return;
        launch(e.clientX, e.clientY);
      });

      document.getElementById("celebrateBtn").addEventListener("click", () => {
        for (let i = 0; i < 8; i++) setTimeout(() => launch(), i * 220);
      });

      // ---------- Countdown (Lakshmi Puja: 29 Oct 2027) ----------
      const target = new Date("2027-10-29T18:00:00+05:30").getTime();
      const pad = (n) => String(n).padStart(2, "0");

      function tick() {
        const diff = target - Date.now();

        if (diff <= 0) {
          document.getElementById("countLabel").textContent = "Diwali is here — celebrate!";
          ["days", "hours", "mins", "secs"].forEach((id) => {
            document.getElementById(id).textContent = "00";
          });
          return;
        }

        document.getElementById("days").textContent = pad(Math.floor(diff / 86400000));
        document.getElementById("hours").textContent = pad(Math.floor(diff / 3600000) % 24);
        document.getElementById("mins").textContent = pad(Math.floor(diff / 60000) % 60);
        document.getElementById("secs").textContent = pad(Math.floor(diff / 1000) % 60);
      }

      tick();
      setInterval(tick, 1000);

      // ---------- Diyas toggle ----------
      document.querySelectorAll(".diya").forEach((d) => {
        d.addEventListener("click", () => {
          const off = d.classList.toggle("off");
          d.setAttribute("aria-pressed", String(!off));
        });
      });

      // ---------- Mobile menu ----------
      const menuBtn = document.querySelector(".menu-btn");
      const menu = document.getElementById("menu");

      menuBtn.addEventListener("click", () => {
        const open = menu.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", String(open));
      });

      menu.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
          menu.classList.remove("open");
          menuBtn.setAttribute("aria-expanded", "false");
        });
      });

      // ---------- Scroll reveal ----------
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
              setTimeout(() => entry.target.classList.add("visible"), i * 120);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      document.querySelectorAll(".card").forEach((c) => observer.observe(c));

      // ---------- Wish generator ----------
      const wishes = [
        "Happy Diwali, {name}! May your life sparkle like a thousand diyas.",
        "{name}, may Goddess Lakshmi bless you with wealth, health and happiness!",
        "Wishing you a Diwali full of sweets, smiles and light, {name}!",
        "{name}, may this festival of lights brighten every path you walk.",
        "Shubh Deepavali, {name}! May joy and prosperity fill your home.",
      ];

      document.getElementById("wishForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("nameInput").value.trim();
        if (!name) return;

        const msg = wishes[(Math.random() * wishes.length) | 0].replace("{name}", name);
        document.getElementById("wishOutput").textContent = msg;
        const whatsappShare = document.getElementById("whatsappShare");
        whatsappShare.href = `https://wa.me/?text=${encodeURIComponent(msg)}`;
        whatsappShare.hidden = false;

        for (let i = 0; i < 5; i++) setTimeout(() => launch(), i * 250);
      });