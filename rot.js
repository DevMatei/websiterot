(()=> {
    if (window.rotting) return location.reload();
    window.rotting = true;

    let rot = 0; // 0 = page is fine, 100 =page is dead :(
    const lifetime = 90; // this is like the lifetime of the page until its fully dead
    const junk = "▓▒░█▀▄■□#%&@?!¿§^=";

    const rand = (min, max) => min + Math.random() * (max - min);
    const pick = list => list[Math.floor(Math.random()*list.length)];

    const stuff = () => [...document.body.querySelectorAll('*')]
        .filter(el = el.offsetWidth && el.id != "rot-health");


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
        el.style.filter = `grayscale(${p}) blur(${p*2}) contrast(${1 + p}) sepia(${p/2})`;
    }
})