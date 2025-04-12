document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM geladen, Skript wird ausgeführt.");

    // --- Globale Elemente ---
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const overlay = document.getElementById('overlay');
    const body = document.body;

    // --- Sidebar Logik (Öffnen/Schließen/Scrollen) ---
    if (menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            sidebar.classList.toggle('sidebar-open');
            body.classList.toggle('sidebar-active');
            overlay.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', sidebar.classList.contains('sidebar-open'));
        });

        overlay.addEventListener('click', function() {
            sidebar.classList.remove('sidebar-open');
            body.classList.remove('sidebar-active');
            overlay.classList.remove('active');
            if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
        });

        const sidebarLinks = sidebar.querySelectorAll('nav a');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        // Sanftes Scrollen zum Ziel
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

                        // Sidebar schließen
                        sidebar.classList.remove('sidebar-open');
                        body.classList.remove('sidebar-active');
                        overlay.classList.remove('active');
                        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');

                        // KEIN automatisches Aufklappen mehr nötig
                    }
                } else { // Normale externe Links
                    sidebar.classList.remove('sidebar-open');
                    body.classList.remove('sidebar-active');
                    overlay.classList.remove('active');
                    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    } else {
        console.warn("Sidebar, Toggle-Button oder Overlay nicht gefunden.");
    }


    // --- Funktionalität für ausklappbare Elemente (ENTFERNT) ---
    // Der Codeblock, der mit "Logik für ALLE ausklappbaren Elemente" begann,
    // und den EventListener für 'click' auf '.collapsible-header, .collapsible' enthielt,
    // wird hier komplett entfernt.


    // --- Plotly Plots Initialisieren (Helferfunktion - bleibt gleich) ---
    function plotIfExists(elementId, plotFunction) {
        const plotDiv = document.getElementById(elementId);
        if (plotDiv) {
            console.log(`Element ${elementId} gefunden. Versuche Plotly...`);
            if (typeof Plotly !== 'undefined') {
                try {
                    plotFunction(plotDiv);
                    console.log(`Plot ${elementId} erfolgreich erstellt.`);
                } catch (error) {
                    console.error(`Fehler beim Erstellen von Plot ${elementId}:`, error);
                    plotDiv.innerHTML = `<p style='color:red; font-size: small;'>Fehler beim Laden des Plots '${elementId}'. Details siehe Browser-Konsole (F12).</p>`;
                }
            } else {
                console.error("Plotly Objekt NICHT gefunden!");
                plotDiv.innerHTML = "<p style='color:red; font-size: small;'>Plotly-Bibliothek konnte nicht geladen werden. Internetverbindung? Netzwerkblockade?</p>";
            }
        } else {
            // Element nicht im HTML gefunden - das ist normal, wenn nicht alle Abschnitte eingefügt wurden.
            // console.warn(`Element mit ID '${elementId}' wurde NICHT im HTML gefunden!`);
        }
    }

    // --- Plot Definitionen (bleiben gleich, wie in der vorherigen Antwort) ---

    // Plot 1: Liegenprofil
    plotIfExists('plotLiegeProfil', (div) => {
        function f(x) { return -0.01 * Math.pow(x, 4) + 0.1 * Math.pow(x, 3) - 0.2 * Math.pow(x, 2) + 1.5; }
        const x = [], y = [];
        for (let i = 0; i <= 7.5; i += 0.1) { x.push(i); y.push(f(i)); }
        const trace1 = { x: x, y: y, mode: 'lines', name: 'f(x)', line: { color: 'var(--secondary-color)' } };
        const xH = 5, yH = f(xH);
        const traceH = { x: [xH], y: [yH], mode: 'markers', name: `P(5|${yH.toFixed(2)})`, marker: { color: 'red', size: 8 } };
        const layout = { title: 'Liegenprofil f(x)', xaxis: { title: 'x (dm)' }, yaxis: { title: 'f(x) (dm)', range: [0, 4], autorange: false }, margin: { l: 50, r: 20, t: 40, b: 40 } };
        Plotly.newPlot(div, [trace1, traceH], layout, { responsive: true, displaylogo: false });
    });

    // Plot 2: Besucherzahlen
    plotIfExists('plotBesucher', (div) => {
        function v(x) { return -0.1 * Math.pow(x, 3) + 1.5 * Math.pow(x, 2) + 0.5 * x + 2; }
        const x = [], y = [];
        for (let i = 0; i <= 10.5; i += 0.2) { x.push(i); y.push(v(i)); } // Etwas weiter für Maximum
        const trace1 = { x: x, y: y, mode: 'lines', name: 'V(x)', line: { color: 'green' } };
        const layout = { title: 'Besucher V(x) [Tsd.]', xaxis: { title: 'Tag x', range: [-0.5, 11] }, yaxis: { title: 'V(x) [Tsd.]' }, margin: { l: 50, r: 20, t: 40, b: 40 } };
        Plotly.newPlot(div, [trace1], layout, { responsive: true, displaylogo: false });
    });

     // Plot 3: Bodenleuchte Nullstellen
    plotIfExists('plotBodenleuchteNullstellen', (div) => {
        function k(x) { return Math.pow(x, 3) - 6 * Math.pow(x, 2) + 9 * x; }
        const x = [], y = [];
        for (let i = -0.5; i <= 4.5; i += 0.1) { x.push(i); y.push(k(i)); }
        const trace1 = { x: x, y: y, mode: 'lines', name: 'k(x)', line: { color: 'purple' } };
        const traceN = { x: [0, 3], y: [0, 0], mode: 'markers', name: 'Nullstellen', marker: { color: 'red', size: 8, symbol: 'x' } };
        const layout = { title: 'Bodenleuchte k(x)', xaxis: { title: 'x' }, yaxis: { title: 'k(x)' }, margin: { l: 50, r: 20, t: 40, b: 40 } };
        Plotly.newPlot(div, [trace1, traceN], layout, { responsive: true, displaylogo: false });
    });

    // Plot 4: Liege Höhe 2
    plotIfExists('plotLiegeHoehe2', (div) => {
        function f(x) { return -0.01 * Math.pow(x, 4) + 0.1 * Math.pow(x, 3) - 0.2 * Math.pow(x, 2) + 1.5; }
        const x = [], y = [];
        for (let i = 0; i <= 7.5; i += 0.1) { x.push(i); y.push(f(i)); }
        const trace1 = { x: x, y: y, mode: 'lines', name: 'f(x)', line: { color: 'var(--secondary-color)' } };
        const traceLine = { x: [-1, 8], y: [2, 2], mode: 'lines', name: 'y=2', line: { color: 'orange', dash: 'dash' } };
        const traceSchnitt = { x: [3.78, 6.99], y: [2, 2], mode: 'markers', name: 'Schnittpunkte (ca.)', marker: { color: 'red', size: 8 } };
        const layout = { title: 'f(x)=2: Schnittpunkte finden', xaxis: { title: 'x (dm)' }, yaxis: { title: 'f(x) (dm)', range: [0, 4], autorange: false }, margin: { l: 50, r: 20, t: 40, b: 40 } };
        Plotly.newPlot(div, [trace1, traceLine, traceSchnitt], layout, { responsive: true, displaylogo: false });
    });

     // Plot 5: Liege Tangente
    plotIfExists('plotLiegeTangente', (div) => {
        function f(x) { return -0.01 * Math.pow(x, 4) + 0.1 * Math.pow(x, 3) - 0.2 * Math.pow(x, 2) + 1.5; }
        function tangent(x) { return 0.08 * x + 1.18; } // y = 0.08(x-2) + f(2)
        const x = [], y = [], tanX = [0, 5], tanY = [tangent(0), tangent(5)];
        for (let i = 0; i <= 7.5; i += 0.1) { x.push(i); y.push(f(i)); }
        const trace1 = { x: x, y: y, mode: 'lines', name: 'f(x)', line: { color: 'var(--secondary-color)' } };
        const traceT = { x: tanX, y: tanY, mode: 'lines', name: 'Tangente bei x=2', line: { color: 'red' } };
        const xP = 2, yP = f(xP);
        const traceP = { x: [xP], y: [yP], mode: 'markers', name: `P(2|${yP.toFixed(2)})`, marker: { color: 'black', size: 8 } };
        const layout = { title: 'Tangente an f(x) bei x=2', xaxis: { title: 'x (dm)' }, yaxis: { title: 'f(x) (dm)', range: [0, 4], autorange: false }, margin: { l: 50, r: 20, t: 40, b: 40 } };
        Plotly.newPlot(div, [trace1, traceT, traceP], layout, { responsive: true, displaylogo: false });
    });

    // Plot 6: Liege Extrema
     plotIfExists('plotLiegeExtrema', (div) => {
        function f(x) { return -0.01 * Math.pow(x, 4) + 0.1 * Math.pow(x, 3) - 0.2 * Math.pow(x, 2) + 1.5; }
        const x = [], y = [];
        for (let i = 0; i <= 7.5; i += 0.1) { x.push(i); y.push(f(i)); }
        const trace1 = { x: x, y: y, mode: 'lines', name: 'f(x)', line: { color: 'var(--secondary-color)' } };
        const xExt = [0, 1.73, 5.77];
        const yExt = [f(0), f(1.73), f(5.77)];
        const textExt = [`HP1(0|${yExt[0].toFixed(2)})`,`TP(~1.73|${yExt[1].toFixed(2)})`,`HP2(~5.77|${yExt[2].toFixed(2)})`];
        const traceExt = { x: xExt, y: yExt, mode: 'markers', name: 'Extrempunkte', text: textExt, hoverinfo:'text', marker: { color: 'red', size: 8 } };
        const layout = { title: 'Lokale Extrema von f(x)', xaxis: { title: 'x (dm)' }, yaxis: { title: 'f(x) (dm)', range: [0, 4], autorange: false }, margin: { l: 50, r: 20, t: 40, b: 40 } };
        Plotly.newPlot(div, [trace1, traceExt], layout, { responsive: true, displaylogo: false });
    });

    // Plot 7: Liege Wendepunkte
     plotIfExists('plotLiegeWende', (div) => {
        function f(x) { return -0.01 * Math.pow(x, 4) + 0.1 * Math.pow(x, 3) - 0.2 * Math.pow(x, 2) + 1.5; }
        const x = [], y = [];
        for (let i = 0; i <= 7.5; i += 0.1) { x.push(i); y.push(f(i)); }
        const trace1 = { x: x, y: y, mode: 'lines', name: 'f(x)', line: { color: 'var(--secondary-color)' } };
        const xW = [0.79, 4.21];
        const yW = [f(0.79), f(4.21)];
        const textW = [`WP1(~0.79|${yW[0].toFixed(2)})`,`WP2(~4.21|${yW[1].toFixed(2)})`];
        const traceW = { x: xW, y: yW, mode: 'markers', name: 'Wendepunkte', text: textW, hoverinfo:'text', marker: { color: 'green', size: 8, symbol: 'diamond' } };
        const layout = { title: 'Wendepunkte von f(x)', xaxis: { title: 'x (dm)' }, yaxis: { title: 'f(x) (dm)', range: [0, 4], autorange: false }, margin: { l: 50, r: 20, t: 40, b: 40 } };
        Plotly.newPlot(div, [trace1, traceW], layout, { responsive: true, displaylogo: false });
    });

     // Plot 8: Besucher Wendepunkt
     plotIfExists('plotBesucherWende', (div) => {
        function v(x) { return -0.1 * Math.pow(x, 3) + 1.5 * Math.pow(x, 2) + 0.5 * x + 2; }
        function v_prime(x) { return -0.3 * Math.pow(x, 2) + 3 * x + 0.5; }
        const x = [], y = [], y_prime = [];
        for (let i = 0; i <= 10.5; i += 0.2) { x.push(i); y.push(v(i)); y_prime.push(v_prime(i)); }
        const traceV = { x: x, y: y, mode: 'lines', name: 'V(x) Besucher', yaxis: 'y1', line: { color: 'green' } };
        const traceVprime = { x: x, y: y_prime, mode: 'lines', name: "V'(x) Rate", yaxis: 'y2', line: { color: 'orange', dash: 'dash' } };
        const xW = 5, yW = v(xW), yPrimeW = v_prime(xW);
        const textWP = `WP bei x=5<br>V(5)=${yW.toFixed(1)}<br>V'(5)=${yPrimeW.toFixed(1)} (max. Rate)`;
        const traceWP = { x: [xW], y: [yW], mode: 'markers', name: 'Wendepunkt', yaxis: 'y1', marker: { color: 'purple', size: 8, symbol: 'diamond' }, hoverinfo:'text', text: textWP };
        const layout = {
             title: 'Besucher V(x) und Rate V\'(x) mit Wendepunkt',
             xaxis: { title: 'Tag x' },
             yaxis: { title: 'V(x) [Tsd.]', side: 'left', titlefont: { color: 'green' } },
             yaxis2: { title: "V'(x) [Tsd./Tag]", side: 'right', overlaying: 'y', titlefont: { color: 'orange'}, range: [0, Math.max(...y_prime)*1.1] },
             legend: { x: 0.05, y: 0.95 },
             margin: { l: 50, r: 50, t: 50, b: 40 }
        };
        Plotly.newPlot(div, [traceV, traceVprime, traceWP], layout, { responsive: true, displaylogo: false });
     });

     // Plot 9: Integral Fläche
     plotIfExists('plotIntegralFlaeche', (div) => {
        function k(x) { return -Math.pow(x, 4) + 2*Math.pow(x, 3) - Math.pow(x, 2) + 1; }
        const x = [], y = [];
        const x_fill = [], y_fill = [];
        for (let i = -0.1; i <= 1.7; i += 0.05) { x.push(i); y.push(k(i)); }
        for (let i = 0; i <= 1.5; i += 0.05) { x_fill.push(i); y_fill.push(k(i)); }

        const traceK = { x: x, y: y, mode: 'lines', name: 'k(x)', line: { color: 'purple' } };
        const traceFill = {
             x: [0, ...x_fill, 1.5], y: [0, ...y_fill, 0],
             fill: 'tozeroy', fillcolor: 'rgba(128, 0, 128, 0.3)',
             line: { color: 'transparent' }, type: 'scatter',
             name: 'Fläche A ≈ 1.39', hoverinfo: 'skip'
         };
        const layout = { title: 'Integral als Fläche unter k(x) von 0 bis 1.5', xaxis: { title: 'x', range: [-0.5, 2] }, yaxis: { title: 'k(x)', range: [0, 1.5], autorange: false }, showlegend: true, margin: { l: 50, r: 20, t: 40, b: 40 } };
        Plotly.newPlot(div, [traceFill, traceK], layout, { responsive: true, displaylogo: false });
     });

    // Plot 10: Steckbrief S-Form
     plotIfExists('plotSteckbriefSForm', (div) => {
        function f(x) { return -(1/16)*Math.pow(x, 3) + (3/8)*Math.pow(x, 2); }
        const x = [], y = [];
        for (let i = 0; i <= 4; i += 0.1) { x.push(i); y.push(f(i)); }
        const trace1 = { x: x, y: y, mode: 'lines', name: 'f(x)', line: { color: 'orange' } };
        const traceP = { x: [0, 4], y: [0, 2], mode: 'markers', name: 'Punkte P(0|0), Q(4|2)', marker: { color: 'black', size: 8 } };
        const layout = { title: 'S-förmige Kurve (Steckbrief)', xaxis: { title: 'x' }, yaxis: { title: 'f(x)', range: [-0.5, 2.5], autorange: false }, margin: { l: 50, r: 20, t: 40, b: 40 } };
        Plotly.newPlot(div, [trace1, traceP], layout, { responsive: true, displaylogo: false });
     });

    // --- 3D Plots ---
    function get3DLayout(title) { /* ... bleibt gleich ... */
        return {
            title: title,
            scene: {
                aspectratio: {x:1, y:1, z:0.8},
                xaxis:{title:'x', backgroundcolor: "rgb(230, 230,230)", gridcolor: "rgb(255, 255, 255)", zerolinecolor: "rgb(255, 255, 255)"},
                yaxis:{title:'y', backgroundcolor: "rgb(230, 230,230)", gridcolor: "rgb(255, 255, 255)", zerolinecolor: "rgb(255, 255, 255)"},
                zaxis:{title:'z', backgroundcolor: "rgb(230, 230,230)", gridcolor: "rgb(255, 255, 255)", zerolinecolor: "rgb(255, 255, 255)"},
                camera: { eye: {x: 1.5, y: 1.5, z: 0.8} }
            },
            margin: { l: 10, r: 10, t: 40, b: 10 }
        };
    }

    // Plot 11: Punkt 3D
    plotIfExists('plotPunkt3D', (div) => { /* ... bleibt gleich ... */
        const p = { x: 2, y: 1, z: 1.5 };
        const traceP = { x: [p.x], y: [p.y], z: [p.z], mode: 'markers', type: 'scatter3d', name: `P(${p.x},${p.y},${p.z})`, marker: { size: 5, color: 'blue' } };
        const traceLines = { x: [0, p.x, p.x, 0, p.x, p.x, p.x, 0, p.x, 0, 0, 0, 0, p.x], y: [0, 0, p.y, p.y, p.y, p.y, 0, 0, 0, p.y, p.y, 0, 0, 0], z: [0, 0, 0, 0, 0, p.z, p.z, p.z, p.z, p.z, 0, 0, 0, 0], mode: 'lines', type: 'scatter3d', name: 'Hilfslinien', line: { color: 'grey', dash: 'dash', width: 1 }, hoverinfo: 'skip' };
        const traceOrigin = { x: [0], y: [0], z: [0], mode: 'markers', type: 'scatter3d', name: 'O', marker: { size: 3, color: 'black' } };
        Plotly.newPlot(div, [traceLines, traceP, traceOrigin], get3DLayout('Punkt P im 3D-Raum'), { responsive: true, displaylogo: false });
    });

    // Plot 12: Vektor AB 3D
    plotIfExists('plotVektorAB', (div) => { /* ... bleibt gleich ... */
        const a = { x: 1, y: 0.5, z: 0.2 }; const b = { x: 2, y: 2.5, z: 1.5 };
        const traceA = { x: [a.x], y: [a.y], z: [a.z], mode: 'markers', type: 'scatter3d', name: 'A', marker: { size: 5, color: 'red' } };
        const traceB = { x: [b.x], y: [b.y], z: [b.z], mode: 'markers', type: 'scatter3d', name: 'B', marker: { size: 5, color: 'blue' } };
        const traceVecAB = { x: [a.x, b.x], y: [a.y, b.y], z: [a.z, b.z], mode: 'lines', type: 'scatter3d', name: 'Vektor AB', line: { color: 'orange', width: 4 } };
        const traceOA = { x: [0, a.x], y: [0, a.y], z: [0, a.z], mode: 'lines', type: 'scatter3d', name: 'Ortsvektor a', line: { color: 'grey', dash: 'dot', width: 2 } };
        const traceOB = { x: [0, b.x], y: [0, b.y], z: [0, b.z], mode: 'lines', type: 'scatter3d', name: 'Ortsvektor b', line: { color: 'grey', dash: 'dot', width: 2 } };
        Plotly.newPlot(div, [traceA, traceB, traceVecAB, traceOA, traceOB], get3DLayout('Vektor AB = B - A'), { responsive: true, displaylogo: false });
    });

    // Plot 13: Vektor Länge 3D
    plotIfExists('plotVektorLaenge', (div) => { /* ... bleibt gleich ... */
        const v = { x: 2, y: 1, z: 1 };
        const traceV = { x: [0, v.x], y: [0, v.y], z: [0, v.z], mode: 'lines', type: 'scatter3d', name: 'Vektor v', line: { color: 'blue', width: 4 } };
        const traceLines = { x: [0, v.x, v.x, 0, v.x, 0, v.x, v.x, v.x, v.x], y: [0, 0, v.y, v.y, v.y, 0, 0, v.y, v.y, 0], z: [0, 0, 0, 0, v.z, 0, 0, 0, v.z, v.z], mode: 'lines', type: 'scatter3d', name: 'Komponenten', line: { color: 'grey', dash: 'dash', width: 1 }, hoverinfo: 'skip' };
        const tracePythagoras = { x: [0, v.x, v.x], y: [0, v.y, v.y], z: [0, 0, v.z], mode: 'lines', type: 'scatter3d', name: 'Pythagoras', line: { color: 'red', dash: 'dot', width: 2 }, hoverinfo: 'skip' };
        Plotly.newPlot(div, [traceLines, tracePythagoras, traceV], get3DLayout('Vektorlänge (3D Pythagoras)'), { responsive: true, displaylogo: false });
    });

     // Plot 14: Gerade 3D
     plotIfExists('plotGerade3D', (div) => { /* ... bleibt gleich ... */
        const p = { x: 1, y: 0.5, z: 0.5 }; const u = { x: 1, y: 2, z: 1 };
        const x = [], y = [], z = [];
        for (let t = -1.5; t <= 1.5; t += 0.1) { x.push(p.x + t * u.x); y.push(p.y + t * u.y); z.push(p.z + t * u.z); }
        const traceGerade = { x: x, y: y, z: z, mode: 'lines', type: 'scatter3d', name: 'Gerade g', line: { color: 'green', width: 3 } };
        const traceP = { x: [p.x], y: [p.y], z: [p.z], mode: 'markers', type: 'scatter3d', name: 'Stützpunkt P', marker: { size: 5, color: 'red' } };
        const traceU = { x: [p.x, p.x + u.x], y: [p.y, p.y + u.y], z: [p.z, p.z + u.z], mode: 'lines', type: 'scatter3d', name: 'Richtung u', line: { color: 'blue', width: 2, dash:'dot' } };
        Plotly.newPlot(div, [traceGerade, traceP, traceU], get3DLayout('Gerade im 3D-Raum: x = p + t*u'), { responsive: true, displaylogo: false });
     });

    // Plot 15: Lage Geraden (Windschief)
     plotIfExists('plotLageGeraden', (div) => { /* ... bleibt gleich ... */
         const pg = { x: 1, y: 1, z: 0 }; const ug = { x: 1, y: 2, z: 1 };
         const xg = [], yg = [], zg = [];
         for (let t = -1.5; t <= 1.5; t += 0.2) { xg.push(pg.x + t * ug.x); yg.push(pg.y + t * ug.y); zg.push(pg.z + t * ug.z); }
         const traceG = { x: xg, y: yg, z: zg, mode: 'lines', type: 'scatter3d', name: 'Gerade g', line: { color: 'blue', width: 3 } };
         const qh = { x: 0, y: 1, z: 1 }; const vh = { x: 2, y: -1, z: 0 };
         const xh = [], yh = [], zh = [];
         for (let s = -1.5; s <= 1.5; s += 0.2) { xh.push(qh.x + s * vh.x); yh.push(qh.y + s * vh.y); zh.push(qh.z + s * vh.z); }
         const traceH = { x: xh, y: yh, z: zh, mode: 'lines', type: 'scatter3d', name: 'Gerade h', line: { color: 'red', width: 3 } };
         Plotly.newPlot(div, [traceG, traceH], get3DLayout('Lage zweier Geraden (windschief)'), { responsive: true, displaylogo: false });
     });

    // --- Stochastik Plots ---

    // Plot 16: Binomial PDF
     plotIfExists('plotBinomialPDF', (div) => { /* ... bleibt gleich ... */
        const n = 20; const p = 0.05;
        function combinations(n, k) { if (k < 0 || k > n) { return 0; } if (k === 0 || k === n) { return 1; } if (k > n / 2) { k = n - k; } let res = 1; for (let i = 1; i <= k; ++i) { res = res * (n - i + 1) / i; } return Math.round(res); }
        function binomialPmf(k, n, p) { if(k<0 || k>n) return 0; return combinations(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k); }
        const kValues = Array.from({length: n + 1}, (_, i) => i);
        const probValues = kValues.map(k => binomialPmf(k, n, p));
        const k_display_idx = probValues.findIndex(prob => prob < 0.001);
        const k_display = kValues.slice(0, k_display_idx > 5 ? k_display_idx + 1 : 6);
        const prob_display = probValues.slice(0, k_display.length);
        const trace = { x: k_display, y: prob_display, type: 'bar', name: `P(X=k)`, marker: { color: 'var(--secondary-color)' } };
        const layout = { title: `Binomialdichte B(${n}, ${p})`, xaxis: { title: 'Anzahl Erfolge k', dtick: 1 }, yaxis: { title: 'P(X=k)' }, margin: { l: 50, r: 20, t: 40, b: 40 } };
        Plotly.newPlot(div, [trace], layout, { responsive: true, displaylogo: false });
     });

    // Plot 17: Binomial CDF
     plotIfExists('plotBinomialCDF', (div) => { /* ... bleibt gleich ... */
        const n = 20; const p = 0.05;
        function combinations(n, k) { if (k < 0 || k > n) { return 0; } if (k === 0 || k === n) { return 1; } if (k > n / 2) { k = n - k; } let res = 1; for (let i = 1; i <= k; ++i) { res = res * (n - i + 1) / i; } return Math.round(res); }
        function binomialPmf(k, n, p) { if(k<0 || k>n) return 0; return combinations(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k); }
        function binomialCdf(k_max, n, p) { let cdf = 0; for (let k = 0; k <= k_max; k++) { cdf += binomialPmf(k, n, p); } return Math.min(cdf, 1.0); }
        const kValues = Array.from({length: n + 1}, (_, i) => i);
        const cumProbValues = kValues.map(k => binomialCdf(k, n, p));
        const k_display_idx = cumProbValues.findIndex(prob => prob > 0.999);
        const k_display = kValues.slice(0, k_display_idx > 5 ? k_display_idx + 1 : 6);
        const cumProb_display = cumProbValues.slice(0, k_display.length);
        const trace = { x: k_display, y: cumProb_display, type: 'scatter', mode: 'lines+markers', name: `P(X≤k)`, line: { shape: 'hv' }, marker: { color: 'var(--primary-color)' } };
        const layout = { title: `Kumulierte Binomialvert. B(${n}, ${p})`, xaxis: { title: 'Anzahl Erfolge k', dtick: 1 }, yaxis: { title: 'P(X≤k)', range:[0, 1.05] }, margin: { l: 50, r: 20, t: 40, b: 40 } };
        Plotly.newPlot(div, [trace], layout, { responsive: true, displaylogo: false });
     });

}); // Ende DOMContentLoaded