(()=> {
    if (window.rotting) return location.reload();
    window.rotting = true;

    let rot = 0; // 0 = page is fine, 100 =page is dead :(
    const lifetime = 90; // this is like the lifetime of the page until its fully dead
    const junk = "▓▒░█▀▄■□#%&@?!¿§^=";

    const rand = (min, max) => min + Math.random() * (max - min);
    const pick = list => list[Math.floor(Math.random()*list.length)];

    const stuff = () => [...document.body.querySelectorAll('*')]
        .filter(el => el.offsetWidth && el.id !== "rot-health");


    // this should hopefully extract all the bits on the page 
    function texts() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const found= [];
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.data.trim() && node.parentNode.id != 'rot-health') found.push(node);
        }
        return found;
    }

    // -- stuff to hurt the page (noo poor page) --
    // (p is how the dead the page is)

    function typos(el, p) { //this will mess up some letters
        const node = pick(texts());
        if (!node) return;
        const letters = [...node.data];

        for (let i = 0; i <1+p*15; i++) {
            letters[Math.floor(Math.random() * letters.length)] = pick(junk);
        }
        node.data = letters.join("");
    }

    function shove(el, p) { // function name describes the functionality pretty well imo
        el.style.translate = `${rand(-1, 1) * p *60}px ${rand(-1,1)*p*30}px`;
    }

    function tilt(el, p) { //  tilts it
        el.style.rotate = `${rand(-1,1)*p*25}deg`;
    }
    function drain(el, p) { //drains color and other stuff
        el.style.filter = `grayscale(${p}) blur(${p*1.5}px) contrast(${1 + p}) sepia(${p/2})`;
    }
    function crack(el, p) { // breaks off a chunk from it
        const x = rand(20, 80), y = rand(20, 80);
        el.style.clipPath = `polygon(0 0, ${x}% 0, ${x-10}% ${y}%, 100% ${y +10}%, 100% 100%, 0 100%)`;
    }

    function glitch(el, p) { // glitch effect
        const d = p*6;
        el.style.textShadow = `${d}px 0 red, ${-d}px 0 cyan`;
        el.style.transform = `skew(${rand(-1,1)*p*20}deg)`;
    }
    function curse(el, p) { //makes images look weird
        const img = pick(document.images);
        if (img) img.style.filter = `invert(1) hue-rotate(${rand(0, 360)}deg) saturate(${3 + p * 5})`
    }
    function drip(el, p) { // letter falls of the page
        const box = el.getBoundingClientRect();
        const drop = document.createElement('span');
        drop.textContent = pick(junk);
        drop.style.cssText = `position:fixed; left:${box.left + rand(0, box.width)}px; top:${box.top}px;
            color:#7a0; font:bold 18px monospace; pointer-events:none; z-index:999999;
            transition: transform 2s ease-in, opacity 2s;`;
        document.body.append(drop);
        requestAnimationFrame(() => {
            drop.style.transform = `translateY(${innerHeight}px) rotate(${rand(-200, 200)}deg)`;
            drop.style.opacity = 0;
        });
        setTimeout(() => drop.remove(), 2100);
    }
    function fall(el, p) { // jst let go of it completely
        el.style.transition = `translate 2.5s ease-in, rotate 2.5s ease-in`;
        el.style.translate = `${rand(-50, 50)}px ${innerHeight * 1.5}px`;
        el.style.rotate = `${rand(-120, 120)}deg`;
    }

    // depending on how rotted the page is, the more of these unlock
    const attacks = [
        {at:0, hurt: typos},
        {at:0, hurt: drip},
        {at:5, hurt: shove},
        {at:10, hurt: drain},
        {at:15, hurt: tilt},
        {at:20, hurt: glitch},
        {at:30, hurt: curse},
        {at:40, hurt: crack},
        {at:70, hurt: fall},
    ];

    // health indicator
    const health = document.createElement('div');
    health.id = 'rot-health';
    health.style.cssText = `position:fixed; right: 12px; bottom:12px; z-index:999999; background:#000; color:#760; font:13px monospace; padding:6px 10px; pointer-events:none;`;
    document.documentElement.append(health);

    //rot spreads wtv your mouse is
    let mouseX = innerWidth / 2, mouseY = innerHeight / 2;
    addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY;});
    addEventListener('keydown', e => {if (e.key == 'Escape') location.reload(); });

    let everything = stuff();
    const loop = setInterval(()=> {
        rot = Math.min(100, rot + 100 / (lifetime * 5));
        const p = rot / 100
        const unlocked = attacks.filter(a => rot >= a.at);
        for (let i = 0; i < 0 + rot / 4; i++) {
            pick(unlocked).hurt(pick(everything), p);
        }
        const underMouse = document.elementFromPoint(mouseX, mouseY);
        if (underMouse && underMouse != document.body) pick(unlocked).hurt(underMouse, p);

        if (rot > 60) document.body.style.rotate = `${Math.sin(Date.now() / 300) * (rot - 60) / 10}deg`

        health.textContent = `page health: ${Math.ceil(100- rot)}%`;
        health.style.color = rot < 50 ? '#760' : rot < 80 ? '#fb0' : '#f33';

        if (Math.random() < 0.05) everything = stuff();

        if (rot >= 100) die();
    }, 200);

    // the end

    function die() {
        clearInterval(loop);
        everything.forEach(el => fall(el, 1));

        setTimeout(() => {
            const grave = document.createElement('div');
            grave.style.cssText = `position:fixed; inset:0; z-index:99999999; background:#000; color:#888;
                display:flex; flex-direction:column; align-items:center; justify-content:center;
                font:20px monospace; cursor:pointer;`
            grave.innerText = "it was coderot... \n\n(click to bring it back)";
            grave.onclick = () => location.reload();
            document.documentElement.append(grave);
        }, 3000);
    }
})();