async function fetchFuwariRSS() {
    let e = async e => {
        let t = await fetch(e),
            r = await t.text(),
            n = new DOMParser,
            i = n.parseFromString(r, "application/xml");
        return i
    }, t = e => {
        let t = new Date(e);
        return t.toLocaleDateString("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: !0
        }).split("/").join("/")
    };

    let truncateTitle = (title) => title.length > 40 ? title.substring(0, 40) + '...' : title;

    try {
        let r = await e("https://blog.rei.my.id/rss.xml"),
            n = Array.from(r.querySelectorAll("item")).reverse().slice(0, 5),
            i = document.getElementById("blog-activity");
        if (!i) {
            console.error("RSS container element not found");
            return
        }
        n.forEach(e => {
            let r = e.querySelector("title").textContent,
                n = e.querySelector("link").textContent,
                a = e.querySelector("pubDate").textContent,
                o = document.createElement("div");
            r = truncateTitle(r);
            o.innerHTML = `<p>Write <a href="${n}" target="_blank" style="color: #7956a1 !important;"><b>${r}</b></a> (${t(a)})</p>`, i.appendChild(o)
        })
    } catch (a) {
        console.error("Error fetching Blog RSS feed:", a)
    }
}
fetchFuwariRSS();