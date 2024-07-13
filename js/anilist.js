async function fetchAnilistActivity() {
    let t = {
            userIdQuery: `
            query {
                User(name: "elliottophellia") {
                    id
                    name
                }
            }
        `,
            activityQuery: t => `
            query {
                Page(page: 1, perPage: 5) {
                    activities(userId: ${t}, sort: ID_DESC) {
                        ... on ListActivity {
                            type
                            createdAt
                            progress
                            status
                            media {
                                title {
                                    romaji
                                    english
                                    native
                                }
                            }
                            siteUrl
                        }
                    }
                }
            }
        `
        },
        e = async t => {
            let e = await fetch("https://graphql.anilist.co", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    },
                    body: JSON.stringify({
                        query: t
                    })
                }),
                i = await e.json();
            return i.data
        }, i = t => t.charAt(0).toUpperCase() + t.slice(1), a = t => {
            let e = new Date(1e3 * t);
            return e.toLocaleString("en-US", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: !0
            })
        };
    let truncateTitle = (title) => title.length > 20 ? title.substring(0, 20) + '...' : title;
    try {
        let r = await e(t.userIdQuery),
            n = r.User.id,
            s = await e(t.activityQuery(n)),
            c = s.Page.activities,
            l = document.getElementById("anilist-activity");
        c.forEach(t => {
            let e = document.createElement("div");
            let title = truncateTitle(t.media.title.english || t.media.title.romaji);
            e.innerHTML = `<p>${i(t.status)} ${t.progress} of <a href="${t.siteUrl}" target="_blank" style="color: #7956a1 !important;"><b>${title}</b></a> (${a(t.createdAt)})</p>`;
            l.appendChild(e);
        });
    } catch (o) {
        console.error("Error fetching Anilist activity:", o);
    }
}
fetchAnilistActivity();