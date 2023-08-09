var tabs = {'intro':'', 'articles':'', 'writings':'', 'works':''}

function select(selected) {
	var tabview = ''
	var i = 0

	for (var name in tabs) {
		tabview += `<li><a ${selected == i ? 'id="selected"' : ''} onclick='select(${i})'>${name}</a></li>`
		i++
	}
	tabview = `<ul id="tab">${tabview}</ul>`
	document.getElementById('tab').innerHTML = tabview
	switch (selected) {
		case 0: loadIndex(); break
		case 1: loadArticles(); break
		case 2: loadWritings(); break
		case 3: loadWorks(); break
		default: break
	}
}

function loadIndex() {
	const intro = 
`
<iframe class="ascii" src="https://eastriver.dev/ascii.html" scrolling=no frameborder=no align="middle"></iframe>
<p>
there is not much to say, <span class="em">really</span>.<br>
<br>
i do code, art, write, design, box, invest, and all the other stuffs(...except for socializing).<br>
my favorite games are: exapunks, grim fandango, the curse of monkey island, timbleweed park, ftl, sonic adventure, i love katamari.<br>
my favorite bands/musicians are: the beatles, sunny day service, goonamgwayeoridingstella, sunset rollercoaster, amy winehouse, bitgwasoeum, wedance.<br>
my favorite writers are: solmoe park, romain gary, jerome salinger, david van.<br>
my favorite movies are: pulp fiction, face off, whiplash, burning, parasite, garden state.<br>
my favorite animations are: futurama, bob's bergers, the simpsons, rick and morty, star trek: lower decks, arcane, evangelion.<br>
my favorite shows are: mr. robot, friends, the office, my mister.<br>
my favorite sites are: khan academy, coursera, stack-overflow, kyobobooks.<br>
my favorite programming languages are: swift, c, go, cweed(the one i'm making).<br>
my favorite brands are: apple, lego, zsa, mozilla, o'reilly, no starch press.<br>
i despise: conservatives, windows®, bloatness, bothsidesism, yellow journalism.<br><br>

i dream about: extinction of wars, people reading, conquer of death, water disalination, universial basic income, better media.<br><br>
i was born twenty-six years after when there was a giant leap for mankind.<br><br><br>	
</p>
`
	document.getElementById('content').innerHTML= intro
}

function loadArticles() {
	(async () => {
		const response = await fetch('https://api.github.com/repos/eastriverlee/eastriverlee.github.io/contents/articles')
		const files = await response.json()
		let html = '<ul>'
		for (let file of files) {
			html += `<li><a href="${file.path}">${file.name}</a></li>`
		}
		html += '</ul>'
		document.getElementById('content').innerHTML= html
	})()
}

function loadWritings() {
	fetch("writing")
		.then(response => response.text())
		.then(text => document.getElementById('content').innerHTML= `<p>${text}</p><p style="color: #eeeeee">(${text.length} 글자)</p>`)
}

function loadWorks() {
	const works = 
`
<div class="container"><iframe class="video" src="https://www.youtube.com/embed/deP_KRzFTsY?rel=0&amp;autoplay=1&amp;loop=1;&amp;controls=0&amp;showinfo=0;playlist=deP_KRzFTsY" frameborder="0" allowfullscreen=""></iframe></div>
<br>
<div class="container"><iframe class="video" src="https://www.youtube.com/embed/cqutxaAJRtE" frameborder="0" allowfullscreen=""></iframe></div>
<p id="footer">
document.getElementById('content').innerHTML= intro
`
	document.getElementById('content').innerHTML= works
}

select(0)
