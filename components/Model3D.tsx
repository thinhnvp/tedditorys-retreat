"use client";

/* eslint-disable @typescript-eslint/no-explicit-any -- THREE is loaded from a CDN <script> as an
   untyped global (no @types/three dependency); this file ports the vanilla-JS model 1:1. */

import Script from "next/script";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    THREE: any;
  }
}

const FLOORS = [
  { name: "Rooftop Deck", type: "Shared · rooftop", desc: "An open-air rooftop deck above it all — lounge chairs, open sky, and a view over Delridge." },
  { name: "The Horizon Suite", type: "Private room · 3rd floor", desc: "The top-floor primary. En-suite rain shower and the brightest room in the house." },
  { name: "The Sunny Nest", type: "Private room · 2nd floor", desc: "A light-filled bedroom with its own private bath. Warm afternoon sun." },
  { name: "Shared Living", type: "Common space · main floor", desc: "The heart of the home: open kitchen, living room, and dining area — shared by all guests." },
  { name: "The Fern Nook", type: "Walk-out suite · lower floor", desc: "A walk-out lower-level suite with its own private entrance at the back of the house and an en-suite bath. Quiet and set apart." },
];

export default function Model3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const mount = mountRef.current;
    const fallbackEl = fallbackRef.current;
    const listEl = listRef.current;
    const capEl = capRef.current;
    if (!mount || !fallbackEl || !listEl || !capEl) return;

    let disposed = false;
    const cleanupFns: Array<() => void> = [];

    const btns: HTMLButtonElement[] = [];
    FLOORS.forEach((f, i) => {
      const b = document.createElement("button");
      b.className = "floor";
      b.type = "button";
      b.dataset.index = String(i);
      b.innerHTML = `<div class="fname">${f.name}</div><div class="ftype">${f.type}</div>`;
      listEl.insertBefore(b, capEl);
      btns.push(b);
    });
    cleanupFns.push(() => btns.forEach((b) => b.remove()));

    function buildModel() {
      const THREE = window.THREE;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      camera.position.set(9, 5.6, 11);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      mount!.appendChild(renderer.domElement);
      cleanupFns.push(() => {
        renderer.dispose();
        renderer.domElement.remove();
      });

      const building = new THREE.Group();
      building.scale.x = -1; // mirror to match the real facade: windows on the right, entrance on the left
      scene.add(building);

      const W = 4.2, D = 5, FH = 2, N = 5, TOTAL = FH * N;
      const COL_BASE = 0x9a9aa0, COL_DIM = 0xd0d0d6, COL_ACTIVE = 0x3A6B57, COL_SHARED = 0x7a9e8e;
      const floors: { mat: any; yc: number; pick: any }[] = [];

      function rectXZ(w: number, d: number) {
        const hw = w / 2, hd = d / 2;
        return new THREE.BufferGeometry().setFromPoints(
          [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd], [-hw, -hd]].map(
            (p) => new THREE.Vector3(p[0], 0, p[1])
          )
        );
      }
      function line(geo: any, mat: any, x: number, y: number, z: number) {
        const l = new THREE.Line(geo, mat);
        l.position.set(x, y, z);
        return l;
      }
      function seg(mat: any, a: any, b: any) {
        return new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), mat);
      }

      function boxEdges(w: number, h: number, d: number, mat: any, x: number, y: number, z: number) {
        const hw = w / 2, hh = h / 2, hd = d / 2;
        const c = [
          [-hw, -hh, -hd], [hw, -hh, -hd], [hw, -hh, hd], [-hw, -hh, hd],
          [-hw, hh, -hd], [hw, hh, -hd], [hw, hh, hd], [-hw, hh, hd],
        ];
        const g = new THREE.Group();
        [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]]
          .forEach(([a, b]) => g.add(seg(mat, new THREE.Vector3(...c[a]), new THREE.Vector3(...c[b]))));
        g.position.set(x, y, z);
        return g;
      }

      function addBed(grp: any, mat: any, fy: number, x: number, z: number) {
        grp.add(line(rectXZ(1.7, 2.0), mat, x, fy, z));
      }
      function addPillow(grp: any, mat: any, fy: number, x: number, z: number) {
        grp.add(line(rectXZ(1.3, 0.5), mat, x, fy, z));
      }
      function addLounge(grp: any, mat: any, fy: number, x: number, z: number) {
        grp.add(line(rectXZ(0.65, 1.8), mat, x, fy, z));
      }

      for (let i = 0; i < N; i++) {
        const yc = (N - 1 - i) * FH + FH / 2 - TOTAL / 2;
        const fy = yc - FH / 2 + 0.04;
        const mat = new THREE.LineBasicMaterial({ color: i === 3 ? COL_SHARED : COL_BASE });
        const grp = new THREE.Group();

        if (i === 0) {
          const PH = 1.0;
          grp.add(boxEdges(W, PH, D, mat, 0, fy + PH / 2, 0));
          addLounge(grp, mat, fy, -0.9, 0.4);
          addLounge(grp, mat, fy, 0.3, 0.4);
          grp.add(line(rectXZ(0.5, 0.5), mat, -0.3, fy, 0.4));
        } else {
          grp.add(boxEdges(W, FH, D, mat, 0, yc, 0));
          if (i === 1) {
            addBed(grp, mat, fy, -0.7, -0.4);
            addPillow(grp, mat, fy, -0.7, -1.1);
          } else if (i === 2) {
            addBed(grp, mat, fy, 0.7, 0.4);
            addPillow(grp, mat, fy, 0.7, 1.1);
          } else if (i === 3) {
            grp.add(line(rectXZ(2.4, 0.9), mat, -0.6, fy, 1.3));
            grp.add(line(rectXZ(2.8, 0.55), mat, 0.2, fy, -1.65));
            grp.add(line(rectXZ(1.2, 1.2), mat, 1.0, fy, 0.5));
          } else if (i === 4) {
            addBed(grp, mat, fy, 0.6, -0.3);
            addPillow(grp, mat, fy, 0.6, -1.0);
          }
        }

        const pick = new THREE.Mesh(
          new THREE.BoxGeometry(W, FH, D),
          new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide })
        );
        pick.position.y = yc;
        pick.userData.index = i;
        grp.add(pick);
        building.add(grp);
        floors.push({ mat, yc, pick });
      }

      let lookY = 0, targetLookY = 0;
      const BASE_COLORS = floors.map((_, idx) => (idx === 3 ? COL_SHARED : COL_BASE));
      function select(i: number | null) {
        floors.forEach((f, idx) => f.mat.color.setHex(i === null ? BASE_COLORS[idx] : idx === i ? COL_ACTIVE : COL_DIM));
        btns.forEach((b, idx) => b.classList.toggle("active", idx === i));
        capEl!.textContent = i === null ? "Tap a floor to look inside." : FLOORS[i].desc;
        targetLookY = i === null ? 0 : floors[i].yc * 0.6;
      }
      btns.forEach((b) => {
        const i = parseInt(b.dataset.index!, 10);
        b.addEventListener("mouseenter", () => select(i));
        b.addEventListener("click", () => select(i));
        b.addEventListener("focus", () => select(i));
      });

      const ray = new THREE.Raycaster(), v2 = new THREE.Vector2();
      let moved = false;
      const onCanvasClick = (e: MouseEvent) => {
        if (moved) return;
        const r = renderer.domElement.getBoundingClientRect();
        v2.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(v2, camera);
        const hit = ray.intersectObjects(floors.map((f) => f.pick));
        if (hit.length) select(hit[0].object.userData.index);
      };
      renderer.domElement.addEventListener("click", onCanvasClick);

      let rotY = 0.7, targetRotY = 0.7, down = false, lastX = 0;
      const auto = reduce ? 0 : 0.0024;
      const onPointerDown = (e: PointerEvent) => {
        down = true;
        lastX = e.clientX;
        moved = false;
      };
      const onPointerMove = (e: PointerEvent) => {
        if (!down) return;
        const dx = e.clientX - lastX;
        if (Math.abs(dx) > 2) moved = true;
        targetRotY += dx * 0.008;
        lastX = e.clientX;
      };
      const onPointerUp = () => {
        down = false;
      };
      renderer.domElement.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      cleanupFns.push(() => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      });

      function size() {
        const w = mount!.clientWidth, h = mount!.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      window.addEventListener("resize", size);
      cleanupFns.push(() => window.removeEventListener("resize", size));
      size();
      const sizeTimeout = setTimeout(size, 200);
      cleanupFns.push(() => clearTimeout(sizeTimeout));

      let visible = true;
      const visibilityObs = new IntersectionObserver((es) => es.forEach((e) => (visible = e.isIntersecting)), { threshold: 0.05 });
      visibilityObs.observe(mount!);
      cleanupFns.push(() => visibilityObs.disconnect());

      (function loop() {
        if (disposed) return;
        requestAnimationFrame(loop);
        if (!visible) return;
        if (!down) targetRotY += auto;
        rotY += (targetRotY - rotY) * 0.08;
        building.rotation.y = rotY;
        lookY += (targetLookY - lookY) * 0.08;
        camera.lookAt(0, lookY, 0);
        renderer.render(scene, camera);
      })();
    }

    function fallbackFloors() {
      fallbackEl!.style.display = "block";
      mount!.style.height = "auto";
      btns.forEach((b) => {
        const i = parseInt(b.dataset.index!, 10);
        const f = () => {
          btns.forEach((x, idx) => x.classList.toggle("active", idx === i));
          capEl!.textContent = FLOORS[i].desc;
        };
        b.addEventListener("mouseenter", f);
        b.addEventListener("click", f);
      });
    }

    function tryInit() {
      if (startedRef.current) return;
      startedRef.current = true;
      try {
        if (!window.THREE) throw new Error("three missing");
        buildModel();
      } catch {
        fallbackFloors();
      }
    }

    const modelObs = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            modelObs.disconnect();
            tryInit();
          }
        });
      },
      { rootMargin: "200px" }
    );
    modelObs.observe(mount);
    cleanupFns.push(() => modelObs.disconnect());

    return () => {
      disposed = true;
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" strategy="afterInteractive" />
      <div className="modelgrid reveal">
        <div id="model" ref={mountRef} aria-label="Interactive 3D model of the townhome">
          <div className="modelfallback" id="modelfallback" ref={fallbackRef}>
            A walk-out lower suite with its own entrance, shared kitchen and living on the main floor, and two
            bright bedrooms above — each room with its own bathroom.
          </div>
        </div>
        <div className="floorlist" id="floorlist" ref={listRef}>
          <div className="ttl">Top to bottom</div>
          <div className="floorcap" id="floorcap" ref={capRef}>
            Tap a floor to look inside.
          </div>
        </div>
      </div>
    </>
  );
}
