const dhon_loader = ((dihn) => {
    const lines = dihn.split("\n");
    let mode = 0;
    let data = {
        env: {},
        charas: [],
        docs: []
    };
    let doc = null;
    const add_doc = ((title) => {
        doc = {
            title: title,
            chats: []
        };
        data.docs.push(doc);
    });
    let chat = null;
    for (let line of lines) {
        if (line === "") continue;
        if (line.match(/^\s*\/\/.*$/)) continue;
        if (line.match(/^\-{2,}$/) !== null) {
            mode ++;
            continue;
        }
        switch (mode) {
            case 0:
                const assign_line = line.match(/^(.+?)\s*=\s*(.*?)$/);
                if (assign_line !== null)
                    data.env[assign_line[1]] = assign_line[2]
                else 
                    throw new Error("「変数名=変数」という書式にしてください．")
                break;
            case 1:
                const character_line = line.match(/^.*?(\s*\/\s*.*?)*$/)
                if (character_line !== null) {
                    data.charas.push(line.split(/\s*\/\s*/))
                }
            case 2:
                const title_line = line.match(/^#\s*(.+)$/);
                if (title_line !== null) {
                    add_doc(title_line[1]);
                    break;
                }
                
                const chat_line = line.match(/^([^\s]*)\s*:\s*(.*)$/)
                if (chat_line !== null) {
                    if (chat_line[1] !== "" || chat === null) {
                        if (doc === null) add_doc("");
                        chat = {
                            speaker: chat_line[1].split("/"),
                            lines: []
                        };
                        doc.chats.push(chat);
                    }
                    chat.lines.push(chat_line[2])
                    break;
                }
        }
    }

    data.docs.forEach((doc) => {
        doc.chats.forEach((chat) => {
            chat.text = chat.lines.join("\n")

            let parts = []
            let image_embed = /\!\[(.*)\]\((.*?)(\s+=(\d*)x(\d*))?\)/g
            let match
            let start = 0

            while ((match = image_embed.exec(chat.text)) !== null) {
                if (match.index > 0)
                    parts.push({"type": "markdown", "data": chat.text.substring(start, match.index)})
                parts.push({"type": "img", "path": match[2], "alt": match[1], "width": match[4] != "" ? Number(match[4]) : null, "height": match[5] != "" ? Number(match[5]) : null})
                start = image_embed.lastIndex
            }
            console.log(start, chat.text.length)
            if (start < chat.text.length)
                parts.push({"type": "markdown", "data": chat.text.substring(start, chat.text.length)})
            console.log(JSON.stringify(parts))
            chat.parts = parts
        });
    });

    return data;
});

export default dhon_loader;
