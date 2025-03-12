document.addEventListener('DOMContentLoaded', main);

String.prototype.replaceSections = function() {
    return this.replace(/!!\s*(.+?)\s*!!(?:\s*\{([^}]*)\})?(?:\s*\.?(\w+))?\s*\n/gs, (match, content, parameters, tag) => {
        tag = tag || 'div';
        parameters = parameters ? ` ${parameters}` : '';
        return `<${tag}${parameters}>${content.trim()}</${tag}>`;
    });
};

function main() {
    const tags = document.querySelectorAll('mrkdn')
    var idnumber = 0

    if (tags.length > 0) {
        tags.forEach(function(mrkdn) {
            var input = mrkdn.textContent;
            var raw  = document.createElement('div')
            var html = document.createElement('div')

            raw.style.display = 'none';
            raw.innerHTML = input
            raw.className = 'raw-mrkdn raw-mrkdn'+idnumber
            html.className = 'from-mrkdn from-mrkdn'+idnumber

            //// HERES WHERE THE MAGIC HAPPENS:

            htmlText = input.trim()
                .replace(/---+/g,    '<hr>') // horizontal rules
                .replace(/\*\*\*+/g, '<hr>')
                .replace(/___+/g,    '<hr>')

                .replace(/\*\*(.+?)\*\*/gs,     '<b>$1</b>') // bold
                .replace(/ +\_\_(.+?)\_\_ +/gs, '<b>$1</b>')
                .replace(/\*(.+?)\*/gs,         '<i>$1</i>') // italics
                .replace(/ +\_(.+?)\_ +/gs,     '<i>$1</i>')

                .replace(/\~\~(.+?)\~\~/gs, '<s>$1</s>') // strikethrough
                .replace(/\~(.+?)\~/gs,     '<sub>$1</sub>') // subscript
                .replace(/\^(.+?)\^/gs,     '<sup>$1</sup>') // superscript
                .replace(/\=\=(.+?)\=\=/gs, '<mark>$1</mark>') // highlight

                .replace(/\!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1">') // images
                .replace(/\[(.+?)\]\((.+?)\)/g, '<a href=$2 >$1</a>') // links

                .replace(/###### (.+)\n/g, '<h6>$1</h6>') // headings
                .replace(/##### (.+)\n/g, '<h5>$1</h5>')
                .replace(/#### (.+)\n/g, '<h4>$1</h4>')
                .replace(/### (.+)\n/g, '<h3>$1</h3>')
                .replace(/## (.+)\n/g, '<h2>$1</h2>')
                .replace(/# (.+)\n/g, '<h1>$1</h1>')

                .replaceSections()
                // you can define any html tag (and its parameters), using the following syntax:
                //
                // !!
                // content 
                // !!{parameters}.tag 
                //
                // the tag and parameters are optional 
                // the tag defaults to div

                .replace(/\`\`\`script\s*(.+?)\s*\`\`\`/gs, '<script>$1</script>') 
                // define script tags like this:
                //
                // ```script
                // console.log('hello world')
                // ```
                //

                .replace(/\`\`\`style\s*(.+?)\s*\`\`\`/gs, '<style>$1</style>')  
                // define style tags like this:
                //
                // ```style
                // body {color:red}
                // ```
                // 

                .replace(/\`\`\`\s*(.+?)\s*\`\`\`/gs, '<pre><code>$1</code></pre>') // code blocks
                
                .replace(/\`(.+?)\`/g, '<pre><code>$1</code></pre>') // code
            
                .replace(/\n+/g, '<br>') // newlines
                
            html.innerHTML = htmlText;
            console.log(htmlText);
            mrkdn.innerHTML = ''
            mrkdn.appendChild(raw)
            mrkdn.appendChild(html)
            idnumber++
        })
    } else {
        console.warn('NO mrkdn TAGS FOUND')
    }
}