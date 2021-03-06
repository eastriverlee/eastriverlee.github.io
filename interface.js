var tabs = {'intro': 'https://eastriver.today', 'writings': 'https://eastriver.today/writings.html', 'works': 'https://eastriver.today/works.html'}

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
		case 1: loadWritings(); break
		case 2: loadWorks(); break
		default: break
	}
}

function loadIndex() {
	const intro = 
`<iframe class="ascii" src="https://eastriver.today/ascii.html" scrolling=no frameborder=no align="middle"></iframe>
<p>
there is not much to say, <span class="em">really</span>.<br>
<br>
i do code, art, write, design, box, invest, and all the other stuffs(...except for socializing).<br>
my favorite games are: exapunks, grim fandango, the curse of monkey island, timbleweed park, ftl, sonic adventure, i love katamari.<br>
my favorite bands/musicians are: the beatles, sunny day service, goonamgwayeoridingstella, sunset rollercoaster, amy winehouse, bitgwasoeum, wedance.<br>
my favorite writers are: solmoe park, romain gary, jerome salinger, david van.<br>
my favorite movies are: pulp fiction, face off, whiplash, burning, parasite, garden state.<br>
my favorite animations are: futurama, bob's bergers, the simpsons, rick and morty.<br>
my favorite sites are: khan academy, coursera, stack-overflow, kyobobooks.<br>
my favorite programming languages are: swift, c, go.<br>
i dream about: extinction of wars, people reading, conquer of death, water disalination, basic income.<br><br>
i was born twenty-six years after when there was a giant leap for mankind.<br><br><br>	
</p>
`
	document.getElementById('content').innerHTML= intro
}

function loadWritings() {
	fetch("writing")
		.then(response => response.text())
		.then(text => document.getElementById('content').innerHTML= `<p>${text}</p><p style="color: #eeeeee">(${text.length} ??????)</p>`)
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
